import { BadRequestException, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { COMMON_URLS } from 'src/constants';
import * as fs from 'fs';
import * as path from 'path';
@Injectable()
export class FilesService {
  constructor() { }


  async locateAndUpdateTmpFileLocation(path: string) {
    
  }

  async uploadFile(file: Express.Multer.File) {
    if (!file) throw new BadRequestException("Algo deu errado ao salvar o arquivo, verifique o envio!")
    return {
      path: file?.filename,
      filePreview: "http://localhost:8080/api/" + COMMON_URLS.BASE_GET_FILE_URL + "/" + file?.filename
    }
  }

  getFile(path: string, res: Response) {
    res.sendFile(path, { root: './uploads' });
  }
}
