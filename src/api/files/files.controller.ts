import {
  Controller,
  Get,
  Param,
  Post, Req, Res,
  UploadedFile, UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { COMMON_URLS } from 'src/constants';
import { getFileStorageConfigs } from 'src/utils';
import { FilesService } from './files.service';
@ApiTags('Files')
@Controller(COMMON_URLS.BASE_GET_FILE_URL)
export class FilesController {
  constructor(private readonly filesService: FilesService) { }
  @UseInterceptors(
    FileInterceptor('files', getFileStorageConfigs("./uploads/tmp")))
  @Post('upload')
  register(@UploadedFile() file: Express.Multer.File) {
    return this.filesService.uploadFile(file)
  }

  @Get("/:path")
  getUploadedFile(@Param('path') path: string, @Res() res: Response) {
    return this.filesService.getFile(path, res);
  }


}
