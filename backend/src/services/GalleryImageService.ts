import ErrorMessage from '../enums/ErrorMessage';
import { getGalleryImagePath, getGalleryImageUrl } from '../image-utils';
import { Image, ImageModel } from '../models/Image';
import ImageService from './ImageService';

interface GalleryImage {
  thumbnail: string,
  full: string,
  name: string
}

class GalleryImageService {
  public async findAllByGalleryId(galleryId: string): Promise<GalleryImage[]> {
    const images = await Image.findAll({
      where: {
        gallery_id: galleryId
      },
      order: [
        ['sorting', 'ASC']
      ]
    });

    return images.map(image => {
      return {
        thumbnail: image.thumbnail,
        full: image.full,
        name: image.name
      }
    });
  }

  public async save(galleryId: string, file: Express.Multer.File): Promise<ImageModel> {
    const destination = getGalleryImagePath(galleryId);

    const croppedImages = await ImageService.upload(destination, file);
    const createdGalleryImage = await Image.create({
      gallery_id: galleryId,
      name: file.filename,
      thumbnail: getGalleryImageUrl(galleryId, croppedImages[0].filename),
      medium: getGalleryImageUrl(galleryId, croppedImages[1].filename),
      full: getGalleryImageUrl(galleryId, file.filename)
    });

    return createdGalleryImage;
  }

  public async delete(galleryId: string, imageId: string): Promise<void> {
    const existedImage = await Image.findOne({
      where: {
        gallery_id: galleryId,
        id: imageId
      }
    });

    if (!existedImage) {
      throw new Error(ErrorMessage.IMAGE_NOT_EXISTED);
    }

    await existedImage.destroy();
    ImageService.deleteAllRelated(existedImage.name, getGalleryImagePath(galleryId));

    // Delete the folder if there are no images existed
    const imageCounter = await Image.count({
      where: {
        gallery_id: galleryId
      }
    });

    if (imageCounter === 0) {
      ImageService.deleteFolder(getGalleryImagePath(galleryId));
    }
  }
}

export default new GalleryImageService();
