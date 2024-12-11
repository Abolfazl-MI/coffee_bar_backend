import { diskStorage } from 'multer';
import { Error } from 'mongoose';
import * as path from 'path';
import * as fs from 'fs';

export const fileSizeLimitation: number = 4 * 1024 * 1024;
export const appStorage = diskStorage({
  destination: (req, file, callback) => {
    const fieldName: string = file.fieldname;
    const allowdedFieldNames: string[] = ['avatar'];
    if (!allowdedFieldNames.includes(fieldName)) {
      const error: Error = new Error(
        'could not upload file with expected field name',
      );
      return callback(error, null);
    }
    const uploadPath: string = path.join('./uploads', fieldName);

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    return callback(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const fileUniqueName: string =
      Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extName: string = path.extname(file.originalname);
    const fileName: string = `${fileUniqueName}${extName}`;
    cb(null, fileName);
  },
});
