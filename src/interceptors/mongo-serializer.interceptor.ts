import {
  ClassSerializerInterceptor,
  PlainLiteralObject,
  Type,
} from '@nestjs/common';
import { ClassTransformOptions, plainToClass } from 'class-transformer';
import { Document } from 'mongoose';

export function MongoSerializerInterceptor(
  classToIntercept: Type,
): typeof ClassSerializerInterceptor {
  return class Interceptor extends ClassSerializerInterceptor {
    private changePlainObjectToClass(document: PlainLiteralObject) {
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
            serializedObject[key] = document[key].map(
              this.changePlainObjectToClass,
            );
          } else {
            serializedObject[key] = this.changePlainObjectToClass(
              document[key],
            );
          }
        }
      else serializedObject = document;

      return serializedObject;
    }

    private prepareResponse(
      response: PlainLiteralObject | PlainLiteralObject[],
    ) {
      if (Array.isArray(response)) {
        return response.map(this.changePlainObjectToClass);
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
