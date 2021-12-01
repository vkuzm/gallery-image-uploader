import sharp, { OutputInfo } from 'sharp';
import { getCroppedImageName } from '../image-utils';

interface ImageCropParams {
  path: string,
  file: any,
  size: string,
  height: number,
  width: number
}

interface ImageCropOutputInfo extends OutputInfo {
  filename: string;
}

class ImageCropService {
  public async crop(params: ImageCropParams): Promise<ImageCropOutputInfo> {
    const croppedFileName = getCroppedImageName(params.file.filename, params.size);

    return sharp(params.file.path)
      .resize(params.height, params.width)
      .toFile(params.path + croppedFileName)
      .then((data) => {
        return { ...data, filename: croppedFileName };
      })
      .catch((error) => {
        throw new Error(error);
      });
  }
}

export default new ImageCropService();