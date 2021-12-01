import http from '../http-common';

class UploadImagesService {
  upload(file, galleryId, onUploadProgress) {
    const formData = new FormData();

    formData.append('file', file);

    return http.post(`/galleries/${galleryId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
  }

  delete(galleryId, imageId) {
    return http.delete(`/galleries/${galleryId}/images/${imageId}`);
  }

  getImages(galleryId) {
    return http.get(`/galleries/${galleryId}/images`);
  }
}

export default new UploadImagesService();
