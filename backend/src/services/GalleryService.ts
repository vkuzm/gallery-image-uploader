import { getGalleryImagePath } from '../image-utils';
import { Gallery, GalleryModel } from '../models/Gallery';
import { Image } from '../models/Image';
import ImageService from './ImageService';

class GalleryService {
  public async findAll(): Promise<GalleryModel[]> {
    return await Gallery.findAll({
      include: {
        model: Image,
        as: 'images'
      },
      order: [
        ['sorting', 'ASC'],
        ['created_at', 'DESC'],
        [{ model: Image, as: 'images' }, 'sorting', 'ASC']
      ]
    });
  }

  public async findOneById(galleryId: string): Promise<GalleryModel | null> {
    return await Gallery.findOne({
      where: {
        id: galleryId
      },
      include: {
        model: Image,
        as: 'images'
      },
      order: [
        ['sorting', 'ASC'],
        ['created_at', 'DESC'],
        [{ model: Image, as: 'images' }, 'sorting', 'ASC']
      ]
    });
  }

  public async save(gallery: GalleryModel): Promise<GalleryModel | null> {
    return await Gallery.create({ title: gallery.title });
  }

  public async update(gallery: GalleryModel): Promise<GalleryModel | null> {
    const existedGallery = await this.findOneById(gallery.id.toString());

    if (existedGallery) {
      existedGallery.update({ title: gallery.title });
    }
    return existedGallery;
  }

  public async delete(galleryId: string): Promise<void> {
    const existedGallery = await this.findOneById(galleryId);

    if (existedGallery) {
      await existedGallery.destroy();
      ImageService.deleteFolderAndFiles(getGalleryImagePath(galleryId));
    }
  }

  public async isGalleryExisted(galelryId: string): Promise<boolean> {
    return await Gallery.count({
      where: { id: galelryId }
    }) > 0;
  }
}

export default new GalleryService();
