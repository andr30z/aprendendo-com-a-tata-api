import { BadRequestException } from "@nestjs/common";
import e, { Request } from "express";
import { extname } from "path/posix";

export const imageFileFilter = (req: any, file: {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    destination: string;
    filename: string;
    path: string;
    buffer: Buffer;
}, callback: (error: Error, acceptFile: boolean) => void) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return callback(new BadRequestException('Apenas imagens são aceitas!'), false);
    }
    callback(null, true);
};


export const editFileName = (req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, filename: string) => void) => {
    const name = file.originalname.split('.')[0];
    const fileExtName = extname(file.originalname);
    const randomName = Array(4)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
    callback(null, `${name}-${randomName}${fileExtName}`);
};