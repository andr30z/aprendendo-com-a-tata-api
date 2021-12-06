import { SchemaOptions } from '@nestjs/mongoose';
import { classToPlain } from 'class-transformer';

export const DEFAULT_MONGOOSE_SCHEMA_OPTIONS: SchemaOptions = {
  timestamps: true,
  toJSON: {
    transform: (_doc: any, ret: any) => {
      console.log(ret);
      // THIS IS BEIGN USED BECAUSE NESTJS/MONGOOSE/CLASS-VALIDATOR SERIALIZATION SUCKS, E.G: SOME TIMES THE _id FIELD WOULD NEVER SERIALIZE
      // THEN ON THE RESPONSE IT WOULD COME IN SHAPE OF AN EMPTY OBJECT.
      return classToPlain({ ...ret, _id: ret._id.toString() });
    },
  },
};

export const getDefaultSchemaOption = (
  customSchemaOptions: SchemaOptions = {},
) => ({ ...DEFAULT_MONGOOSE_SCHEMA_OPTIONS, ...customSchemaOptions });

//REGULAR toJSON ENJOYER:
//  ⣿⣿⣿⣿⣿⣿⣿⣿⡿⠿⠛⠛⠛⠋⠉⠈⠉⠉⠉⠉⠛⠻⢿⣿⣿⣿⣿⣿⣿⣿
//  ⣿⣿⣿⣿⣿⡿⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠛⢿⣿⣿⣿⣿
//  ⣿⣿⣿⣿⡏⣀⠀⠀⠀⠀⠀⠀⠀⣀⣤⣤⣤⣄⡀⠀⠀⠀⠀⠀⠀⠀⠙⢿⣿⣿
//  ⣿⣿⣿⢏⣴⣿⣷⠀⠀⠀⠀⠀⢾⣿⣿⣿⣿⣿⣿⡆⠀⠀⠀⠀⠀⠀⠀⠈⣿⣿
//  ⣿⣿⣟⣾⣿⡟⠁⠀⠀⠀⠀⠀⢀⣾⣿⣿⣿⣿⣿⣷⢢⠀⠀⠀⠀⠀⠀⠀⢸⣿
//  ⣿⣿⣿⣿⣟⠀⡴⠄⠀⠀⠀⠀⠀⠀⠙⠻⣿⣿⣿⣿⣷⣄⠀⠀⠀⠀⠀⠀⠀⣿
//  ⣿⣿⣿⠟⠻⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠶⢴⣿⣿⣿⣿⣿⣧⠀⠀⠀⠀⠀⠀⣿
//  ⣿⣁⡀⠀⠀⢰⢠⣦⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⣿⣿⣿⣿⣿⡄⠀⣴⣶⣿⡄⣿
//  ⣿⡋⠀⠀⠀⠎⢸⣿⡆⠀⠀⠀⠀⠀⠀⣴⣿⣿⣿⣿⣿⣿⣿⠗⢘⣿⣟⠛⠿⣼
//  ⣿⣿⠋⢀⡌⢰⣿⡿⢿⡀⠀⠀⠀⠀⠀⠙⠿⣿⣿⣿⣿⣿⡇⠀⢸⣿⣿⣧⢀⣼
//  ⣿⣿⣷⢻⠄⠘⠛⠋⠛⠃⠀⠀⠀⠀⠀⢿⣧⠈⠉⠙⠛⠋⠀⠀⠀⣿⣿⣿⣿⣿
//  ⣿⣿⣧⠀⠈⢸⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠟⠀⠀⠀⠀⢀⢃⠀⠀⢸⣿⣿⣿⣿
//  ⣿⣿⡿⠀⠴⢗⣠⣤⣴⡶⠶⠖⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⡸⠀⣿⣿⣿⣿
//  ⣿⣿⣿⡀⢠⣾⣿⠏⠀⠠⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠛⠉⠀⣿⣿⣿⣿
//  ⣿⣿⣿⣧⠈⢹⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⣿⣿⣿⣿
//  ⣿⣿⣿⣿⡄⠈⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣴⣾⣿⣿⣿⣿⣿
//  ⣿⣿⣿⣿⣧⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿
//  ⣿⣿⣿⣿⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
//  ⣿⣿⣿⣿⣿⣦⣄⣀⣀⣀⣀⠀⠀⠀⠀⠘⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
//  ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡄⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
//  ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⠀⠀⠀⠙⣿⣿⡟⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿
//  ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇⠀⠁⠀⠀⠹⣿⠃⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿

//AVERAGE ClassSerializerInterceptor FAN
// ⣿⣿⠟⠁⠄⢤⣰⣶⣕⡝⠷⠙⠻⢨⡁⣨⣙⠳⢈⣉⡛⠿⡟⠸⠸⡟⣇⢻⣿
// ⣿⠏⠄⠄⢴⣿⣿⠮⢫⣴⣾⣿⣿⣿⣿⣿⣿⣷⣾⣿⠿⢶⣴⣷⣆⡁⠇⢸⣿
// ⠇⠄⢘⣻⣿⣛⠊⣰⣿⣿⣿⣿⣿⣿⡿⢟⠯⠭⠿⣛⡻⢶⡿⣿⣿⣧⠄⣼⣿
// ⠄⠄⠠⣿⣿⣂⠐⣿⣿⣿⣿⣿⣟⡁⢀⣐⣒⠂⠄⠢⣬⡜⠡⣿⡈⠝⠆⠻⣿
// ⠄⡜⠢⠙⣟⡮⢐⣿⣿⣿⣿⣿⣿⣷⣌⠩⠋⠒⠂⠒⣸⡇⢰⣿⡌⠁⣀⠄⢹
// ⢰⠄⠻⠂⣻⣍⠠⣿⣿⠻⣿⣿⣿⣿⣿⣿⣷⣶⣶⡿⠟⠁⢸⣿⣧⠄⠈⠁⣺
// ⠘⣄⣀⠡⣾⣯⡄⢺⣿⡄⠙⢿⣿⣿⣿⣿⣿⣿⣟⡰⡋⠐⠲⠿⣿⡷⢸⣷⡌
// ⣦⠈⠄⣼⣿⣫⣤⡽⢙⢳⡀⠄⠉⠛⢛⣿⡿⠟⣻⣿⠶⠾⣿⣷⣶⣤⡼⣿⠃
// ⣿⠄⠄⢸⣿⣿⣿⣷⣿⡀⣡⠄⢀⣾⣿⠋⠄⠈⣁⣒⠒⠲⠦⢭⣛⣛⡁⠁⣼
// ⣿⠄⠄⠘⣿⣿⣿⣿⣿⣾⣿⣶⡀⢻⣿⣆⠄⡀⠊⢝⣛⠷⢶⢶⣶⣬⠙⢸⣿
// ⡟⠄⠄⠄⠹⣿⣿⣿⣿⣿⣿⣿⣿⡌⢿⣿⡆⣿⣦⣀⠉⠉⠓⠒⠲⠶⠖⢀⣿
// ⠁⠄⠄⠄⠄⠙⢿⣿⣿⣿⣿⣿⣿⡇⢸⣿⣿⣿⣿⣿⣿⣿⣿⣶⣶⣤⣤⠈⣿
// ⠄⠄⠄⠄⠄⠄⠄⠙⠻⠿⠿⠿⠟⠁⠄⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡆⢹
// ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⢀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢸⠀
