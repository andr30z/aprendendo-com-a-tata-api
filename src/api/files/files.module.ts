import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { DeleteTmpFilesTask } from './delete-tmp-files.task';
import { FilesController } from './files.controller';

@Module({
  controllers: [FilesController],
  providers: [
    FilesService,
    DeleteTmpFilesTask
  ],
  exports: [FilesService, DeleteTmpFilesTask],
})
export class FilesModule { }
