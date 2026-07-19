import { diskStorage } from 'multer';
import { extname } from 'node:path';
import { UnsupportedMediaTypeException } from '@nestjs/common';
import { getPathInFileType } from './generators';

export const courseFileFields = [
  { name: 'banner', maxCount: 1 },
  { name: 'introVideo', maxCount: 1 },
];

export const fileStorages = (allowedMimes: string[]) => ({
  storage: diskStorage({
    destination: (req, file, cb) => {
      const filePath = getPathInFileType(file.originalname);
      cb(null, filePath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
    },
  }),
  fileFilter: fileFilters(allowedMimes),
});

function fileFilters(allowedMimes: string[]) {
  return (req, file, cb) => {
    const mime = file.mimetype.split('/')[0];
    if (file.fieldname && file.fieldname === 'banner') {
      if (mime !== 'image') {
        cb(
          new UnsupportedMediaTypeException("banner type image bo'lishi kerak"),
          false,
        );
      }
    }
    if (file.fieldname && file.fieldname === 'introVideo') {
      if (mime !== 'video') {
        cb(
          new UnsupportedMediaTypeException(
            "introVideo type video bo'lishi kerak",
          ),
          false,
        );
      }
    }
    if (!allowedMimes.includes(mime)) {
      cb(
        new UnsupportedMediaTypeException(
          `Fayl turi [${allowedMimes.join(', ')}] bo'lishi kerak`,
        ),
        false,
      );
    } else {
      cb(null, true);
    }
  };
}
