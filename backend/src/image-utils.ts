import appRoot from 'app-root-path';

export const uploadDir = `${appRoot.path}/public/uploads/`;
export const getGalleryImagePath = (galleryId: string) => `${uploadDir}/gallery_${galleryId}/`;
export const getGalleryImageUrl = (galleryId: string, fileName: string) => `http://localhost:7000/uploads/gallery_${galleryId}/${fileName}`;
export const getCroppedImageName = (filename: string, sizePrefix: string) => sizePrefix + '-' + filename;