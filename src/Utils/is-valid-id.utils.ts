import { BadRequestException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

/**
 * This function validate if a given _id is formated like a mongo UUID.
 * @returns true if the id is valid
 * @author andr3z0
 **/
export function isValidMongoId(
  id: string,
  errorMsg = 'ID informado é inválido!',
) {
  if (!isValidObjectId(id)) throw new BadRequestException(errorMsg);
  return true; //useless
  
}
