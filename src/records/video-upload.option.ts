import { diskStorage } from 'multer';
import short from 'short-unique-id';
import * as fs from 'fs';
import * as path from 'path';
import { BadRequestException } from '@nestjs/common';
import { getVideoDurationInSeconds } from 'get-video-duration';
import { Readable } from 'stream';
const validMime = [
  'video/mp4',
  'video/ogg',
  'video/mpeg',
  'video/webm',
  'video/x-m4v',
  'audio/mpeg',
  'audio/mp4',
  'audio/mp3',
];

export const videoUploadOption = () => ({
  storage: diskStorage({
    destination: (req: Express.Request, file: Express.Multer.File, cb: any) => {
      cb(null, './upload/video/');
    },
    filename: (req: Express.Request, file: Express.Multer.File, cb: any) => {
      let uniqueSuffix = new short({ length: 32 })();
      const fileExt = file.originalname.split('.').pop();
      while (
        fs.existsSync(path.join('./upload/video', uniqueSuffix + '.' + fileExt))
      ) {
        console.log('file exist, generating new file name');
        uniqueSuffix = new short({ length: 32 })();
      }
      cb(null, uniqueSuffix + '.' + fileExt);
    },
  }),
  fileFilter: async (
    req: Express.Request,
    file: Express.Multer.File,
    cb: any,
  ) => {
    if (!validMime.includes(file.mimetype)) {
      return cb(new BadRequestException('File type is not video'));
    }
    return cb(null, true);
  },
});
