import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as fs from 'fs';
import * as path from 'path';
@Injectable()
export class DeleteTmpFilesTask {
  private readonly logger = new Logger(DeleteTmpFilesTask.name);

  // @Cron(CronExpression.EVERY_HOUR)
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  handleCron() {
    const resolvedPath = path.resolve("./uploads/tmp");
    fs.readdir(resolvedPath, (e, files) => {
      console.log(e, files)
      if (files) files.forEach(file => {
        const filePath = resolvedPath + "/" + file
        const stat = fs.statSync(filePath);
        const now = new Date().getTime();
        const endTime = new Date(stat.mtime).getTime() + 3600000; // 1hour in miliseconds

        if (now > endTime) {
          //console.log('DEL:', filePath);
          return fs.unlink(filePath, function (err) {
            if (err) return console.error(err);
          });
        }
      })
    });
    this.logger.debug('RUNNING DELETE TMP FILES TASK...');
  }
}