import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { FILE_UPLOAD } from 'src/constants';
import {
  decryptFilePath,
  encryptFilePath,
  formatFileUploadResponse,
} from 'src/utils';
@Injectable()
export class FilesService {
  constructor() { }

  locateAndUpdateTmpFileLocation(pathFile: string, returnFormatedPath = true) {
    if (!pathFile)
      throw new BadRequestException('O caminho do arquivo é inválido.');
    const decryptedHash = decryptFilePath(pathFile);
    console.log(decryptedHash + ' end hjasasdfasd');
    const resolvedTmpPath = path.resolve(FILE_UPLOAD.TMP_UPLOADS);
    const resolvedLinkedPath = path.resolve(FILE_UPLOAD.LINKED_UPLOADS);
    const oldPath = resolvedTmpPath + '/' + decryptedHash;
    const newPath = resolvedLinkedPath + '/' + decryptedHash;
    try {
      fs.renameSync(oldPath, newPath);
    } catch (e) {
      console.log(e);
      if (e.code === 'ENOENT')
        throw new NotFoundException(
          `Arquivo de caminho: ${pathFile} não encontrado!`,
        );
      else throw e;
    }

    return returnFormatedPath ? formatFileUploadResponse(pathFile) : undefined;
  }

  async uploadFile(file: Express.Multer.File) {
    if (!file)
      throw new BadRequestException(
        'Algo deu errado ao salvar o arquivo, verifique o envio!',
      );
    return formatFileUploadResponse(encryptFilePath(file.filename));
  }

  getFile(path: string, res: Response) {
    console.log(path+"unhased")
    const decrypted = decryptFilePath(path);
    console.log(decrypted + " decrypted")
    res.sendFile(decrypted, { root: './uploads' });
  }
}
