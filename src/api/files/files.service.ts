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

  verifyErrorAndThrow(e: any, pathFile: string) {
    if (e.code === 'ENOENT')
      throw new NotFoundException(
        `Arquivo de caminho: ${pathFile} não encontrado!`,
      );
    else throw e;
  }

  locateAndUpdateTmpFileLocation(pathFile: string, returnFormatedPath = true) {
    if (!pathFile)
      throw new BadRequestException('O caminho do arquivo é inválido.');
    const decryptedHash = decryptFilePath(pathFile);
    const resolvedTmpPath = path.resolve(FILE_UPLOAD.TMP_UPLOADS);
    const resolvedLinkedPath = path.resolve(FILE_UPLOAD.LINKED_UPLOADS);
    const oldPath = resolvedTmpPath + '/' + decryptedHash;
    const newPath = resolvedLinkedPath + '/' + decryptedHash;
    try {
      fs.renameSync(oldPath, newPath);
    } catch (e) {
      this.verifyErrorAndThrow(e, pathFile);
    }

    return returnFormatedPath ? formatFileUploadResponse(pathFile) : undefined;
  }

  /** 
   * This function will delete whatever is located at ```oldPath```. 
   * @author andr3z0 
   */
  verifyAndUpdatePathFile(newPath?: string, oldPath?: string) {
    if (oldPath === newPath || oldPath === undefined || newPath === undefined)
      return;

    this.locateAndUpdateTmpFileLocation(newPath);
    this.deleteFile(oldPath)
  }
  deleteFile(pathFile?: string) {
    if (!pathFile) return;
    const decryptedHash = decryptFilePath(pathFile);
    const resolvedLinkedPath = path.resolve(FILE_UPLOAD.LINKED_UPLOADS);
    try {
      fs.unlinkSync(resolvedLinkedPath + "/" + decryptedHash);
    } catch (error) {
      this.verifyErrorAndThrow(error, pathFile)
    }
  }

  async uploadFile(file: Express.Multer.File) {
    if (!file)
      throw new BadRequestException(
        'Algo deu errado ao salvar o arquivo, verifique o envio!',
      );
    return { path: encryptFilePath(file.filename) }
  }

  getFile(path: string, res: Response) {
    const decrypted = decryptFilePath(path);
    res.sendFile(decrypted, { root: FILE_UPLOAD.LINKED_UPLOADS });
  }
}
