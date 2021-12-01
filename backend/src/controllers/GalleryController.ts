import { Request, Response } from 'express';
import isNumber from 'is-number';
import { router } from '../AppRouter';
import ErrorMessage from '../enums/ErrorMessage';
import { getGalleryImagePath } from '../image-utils';
import uploadFile from '../middlewares/upload';
import { GalleryModel } from '../models/Gallery';
import GalleryImageService from '../services/GalleryImageService';
import GalleryService from '../services/GalleryService';

router.get('/galleries', async (req: Request, res: Response) => {
  const galleries = await GalleryService.findAll();
  return res.send(galleries);
});

router.get('/galleries/:galleryId', async (req: Request, res: Response) => {
  const { galleryId } = req.params;

  if (isNumber(galleryId)) {
    const gallery = await GalleryService.findOneById(galleryId);
    return res.send(gallery);
  }
  return res.status(400).send();
});

router.post('/galleries', async (req: Request, res: Response) => {
  const body = req.body as GalleryModel;

  //TODO validator
  const createdGallery = await GalleryService.save(body);
  return res.status(201).send(createdGallery);
});

router.put('/galleries/:galleryId', async (req: Request, res: Response) => {
  const { galleryId } = req.params;
  const body = req.body as GalleryModel;

  if (isNumber(galleryId)) {
    //TODO validator
    const gallery = await GalleryService.update(body);
    return res.send(gallery);
  }

  return res.status(400).send();
});

router.delete('/galleries/:galleryId', async (req: Request, res: Response) => {
  const { galleryId } = req.params;

  if (isNumber(galleryId)) {
    await GalleryService.delete(galleryId);
    return res.send();
  }
  return res.status(400).send();
});

router.get('/galleries/:galleryId/images', async (req: Request, res: Response) => {
  const { galleryId } = req.params;

  if (isNumber(galleryId)) {
    const images = await GalleryImageService.findAllByGalleryId(galleryId);
    return res.send(images);
  }
  return res.status(400).send();
});

router.post('/galleries/:galleryId/images', async (req: Request, res: Response) => {
  const { galleryId } = req.params;
  const isGalleryExisted = await GalleryService.isGalleryExisted(galleryId);

  if (isNumber(galleryId) && isGalleryExisted) {
    try {
      req.params.destination = getGalleryImagePath(galleryId);
      await uploadFile(req, res);

      const image = req.file as Express.Multer.File;
      const createdImage = await GalleryImageService.save(galleryId, image);
      return res.status(201).send(createdImage);

    } catch (error: any) {
      return res.status(400).send({
        code: error.code,
        message: error.message
      });
    }
  }

  return res.status(400).send();
});

router.delete('/galleries/:galleryId/images/:imageId', async (req: Request, res: Response) => {
  const { galleryId, imageId } = req.params;

  if (isNumber(galleryId) && isNumber(imageId)) {
    try {
      await GalleryImageService.delete(galleryId, imageId);
      return res.send();

    } catch (error: any) {
      return res.status(400).send({
        message: error.message
      });
    }
  }

  return res.status(400).send({
    message: ErrorMessage.INVALID_PARAM_GALLERY_IMAGE
  });
});
