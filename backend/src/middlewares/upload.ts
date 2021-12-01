import { Request } from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import util from 'util';

export const allowedMimeTypes = ['image/jpeg', 'image/png'];
export const maxUploadedFileSize = 5 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, callback: CallableFunction) => {
    const { destination } = req.params;

    if (!fs.existsSync(destination)) {
      return fs.mkdir(destination, (error) => callback(error, destination));
    }
    return callback(null, destination);
  },
  filename: (req, file, callback) => {
    callback(null, makeUniqueFileName(file.originalname));
  }
});

const makeUniqueFileName = (fileName: string) => {
  const uniqueSuffix = Date.now();
  const extension = path.extname(fileName);
  const basename = path.basename(fileName, path.extname(fileName));
  return path.join(path.dirname(fileName), `${basename}-${uniqueSuffix}${extension}`);
};

const fileFilter = (req: Request, file: Express.Multer.File, callback: CallableFunction) => {
  if (allowedMimeTypes.some((type) => file.mimetype.includes(type))) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

const uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxUploadedFileSize },
  fileFilter: fileFilter
}).single('file');

export default util.promisify(uploadFile);
