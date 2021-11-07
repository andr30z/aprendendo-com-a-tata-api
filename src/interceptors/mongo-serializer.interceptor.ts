import {
  ClassSerializerInterceptor,
  PlainLiteralObject,
  Type,
} from '@nestjs/common';
import { ClassTransformOptions, plainToClass } from 'class-transformer';
import { Document } from 'mongoose';

export function MongoSerializerInterceptor<T>(
  classToIntercept: Type<T>,
): typeof ClassSerializerInterceptor {
  return class Interceptor extends ClassSerializerInterceptor {
    private changePlainObjectToClass(
      document: PlainLiteralObject,
      currentKey?: string,
    ) {
      // console.log(document, typeof document, Object.keys(document));
      // console.log(currentKey === '_id' && document.toString());
      let serializedObject: any = {};
      if (document instanceof Document) {
        return plainToClass(classToIntercept, document.toJSON());
      }
      if (typeof document === 'object' && document !== null)
        for (const key in document) {
          if (document[key] instanceof Document) {
            serializedObject[key] = plainToClass(
              classToIntercept,
              document[key].toJSON(),
            );
          } else if (Array.isArray(document[key])) {
            serializedObject[key] = document[key].map((x: any) =>
              this.changePlainObjectToClass(x),
            );
          } else if (typeof document[key]?.getMonth === 'function') {
            serializedObject[key] = document[key].toISOString();
          } else {
            serializedObject[key] = this.changePlainObjectToClass(
              document[key],
              key,
            );
          }
        }
      else serializedObject = document;
      //  console.log(serializedObject, +"asdasd")
      return serializedObject;
    }

    private prepareResponse(
      response: PlainLiteralObject | PlainLiteralObject[],
    ) {
      if (Array.isArray(response)) {
        return response.map((x) => this.changePlainObjectToClass(x));
      }

      return this.changePlainObjectToClass(response);
    }

    serialize(
      response: PlainLiteralObject | PlainLiteralObject[],
      options: ClassTransformOptions,
    ) {
      this.changePlainObjectToClass = this.changePlainObjectToClass.bind(this);
      return super.serialize(this.prepareResponse(response), options);
    }
  };
}
