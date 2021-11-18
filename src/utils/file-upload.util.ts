import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as CryptoJS from 'crypto-js';
import { COMMON_URLS } from 'src/constants';
export const imageFileFilter = (
  req: any,
  file: {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    destination: string;
    filename: string;
    path: string;
    buffer: Buffer;
  },
  callback: (error: Error, acceptFile: boolean) => void,
) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    return callback(
      new BadRequestException('Apenas imagens são aceitas!'),
      false,
    );
  }
  callback(null, true);
};

export const editFileName = (
  req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, filename: string) => void,
) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${randomName}${fileExtName}`);
};

export const getFileStorageConfigs = (destinationPath = './uploads') => ({
  storage: diskStorage({
    filename: editFileName,
    destination: destinationPath,
  }),
  fileFilter: imageFileFilter,
});

export function formatFileUploadResponse(path: string) {
  return {
    path: path,
    filePreview:
      'http://localhost:8080/api/' + COMMON_URLS.BASE_GET_FILE_URL + '?path=' + path,
  };
}

export function encryptFilePath(path: string) {
  return process.env.FILE_PATH_HASH_ID + CryptoJS.enc.Base64.parse(CryptoJS.AES.encrypt(path, process.env.FILE_PATH_KEY)
    .toString())
    .toString(CryptoJS.enc.Hex);
}

export function decryptFilePath(hashedText: string) {
  let path = hashedText;
  const prefix = process.env.FILE_PATH_HASH_ID;
  if (!path.startsWith(prefix))
    throw new BadRequestException(hashedText + " não é uma string de localização de arquivo!");
  path = path.slice(prefix.length);
  const reb64 = CryptoJS.enc.Hex.parse(path);
  const bytes = reb64.toString(CryptoJS.enc.Base64);
  return CryptoJS.AES.decrypt(bytes, process.env.FILE_PATH_KEY).toString(CryptoJS.enc.Utf8);
}
