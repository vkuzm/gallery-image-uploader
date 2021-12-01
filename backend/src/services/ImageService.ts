import fs from 'fs';
import path from 'path';
import ErrorMessage from '../enums/ErrorMessage';
import ImageSize from '../enums/ImageSize';
import { getCroppedImageName } from '../image-utils';
import ImageCropService from './ImageCropService';

export const imageSizes = [
  {
    size: ImageSize.THUMBNAIL,
    width: 200,
    height: 200
  },
  {
    size: ImageSize.MEDIUM,
    width: 600,
    height: 600
  }
];

class ImageService {
  public async upload(path: string, file: Express.Multer.File) {
    if (!file) {
      throw new Error(ErrorMessage.NO_FILE);
    }

    const croppedImages = imageSizes.map(async image => {
      return await ImageCropService.crop({
        path: path,
        file: file,
        size: image.size,
        height: image.height,
        width: image.width
      })
    });

    return await Promise.all(croppedImages);
  }

  public async deleteAllRelated(imageName: string, path: string): Promise<void> {
    // Delete original image
    fs.unlinkSync(path + imageName);

    // Delete all cropped images
    imageSizes.forEach(imageSize => {
      const croppedImageName = getCroppedImageName(imageName, imageSize.size);
      fs.unlinkSync(path + croppedImageName);
    })
  }

  public deleteFolderAndFiles(directoryPath: string): void {
    if (fs.existsSync(directoryPath)) {
      fs.readdirSync(directoryPath).forEach((file, index) => {
        const currentPath = path.join(directoryPath, file);

        if (fs.lstatSync(currentPath).isDirectory()) {
          this.deleteFolderAndFiles(currentPath);
        } else {
          fs.unlinkSync(currentPath);
        }
      });

      fs.rmdirSync(directoryPath);
    }
  }

  public deleteFolder(directoryPath: string): void {
    if (fs.existsSync(directoryPath)) {
      fs.rmdirSync(directoryPath);
    }
  }
}

export default new ImageService();