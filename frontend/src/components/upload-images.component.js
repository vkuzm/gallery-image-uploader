import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import UploadImagesService from '../services/UploadImagesService';

export default class UploadImages extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uploadedImages: [],
      selectedImages: [],
      galleryId: 1
    };
  }

  onDrop = (files) => {
    if (files.length) {
      this.uploadFiles(files);
    }
  };

  uploadFiles = (selectedFiles) => {
    const selectedImages = selectedFiles.map((file) => {
      return {
        thumbnail: '',
        full: null,
        name: file.name,
        progress: 0,
        message: null,
      };
    });

    this.setState({ selectedImages: selectedImages }, () => {
      selectedFiles.forEach((image, index) => this.upload(index, image));
    });
  };

  upload = (index, file) => {
    const selectedImages = [...this.state.selectedImages];
    const currentImage = selectedImages[index];

    UploadImagesService.upload(file, this.state.galleryId, (event) => {
      currentImage.progress = Math.round((100 * event.loaded) / event.total);
      this.setState({ selectedImages });
    })
      .then((response) => response.data)
      .then(({ name, thumbnail, full }) => {
        currentImage.name = name;
        currentImage.thumbnail = thumbnail;
        currentImage.full = full;

        this.setState({ selectedImages: selectedImages });
      })
      .catch((error) => {
        if (error.response) {
          currentImage.progress = 0;
          currentImage.message = error.response.data.message;

          this.setState({ selectedImages });
        }
      });
  };

  componentDidMount() {
    UploadImagesService.getImages(this.state.galleryId).then((response) => {
      this.setState({ uploadedImages: response.data });
    });
  }

  render() {
    const { uploadedImages, selectedImages } = this.state;

    return (
      <div>
        {uploadedImages &&
          uploadedImages.map((image, index) => (
            <div className="mb-2" key={index + '-uploaded'}>
              <span>
                <img style={{ maxWidth: '50px' }} src={image.thumbnail} />
              </span>
              <span>{image.name}</span>
            </div>
          ))}

        {selectedImages &&
          selectedImages.map((image, index) => (
            <div className="mb-2" key={index + '-selected'}>
              <span>
                <img style={{ maxWidth: '50px' }} src={image.thumbnail} />
              </span>
              <span>{image.name}</span>

              {image.progress !== 100 && (
                <div className="progress">
                  <div
                    className="progress-bar progress-bar-info"
                    role="progressbar"
                    aria-valuenow={image.progress}
                    aria-valuemin="0"
                    aria-valuemax="100"
                    style={{ width: image.progress + '%' }}
                  >
                    {image.progress}%
                  </div>
                </div>
              )}

              {image.message && <div className="error">{image.message}</div>}
            </div>
          ))}

        <div className="my-3">
          <Dropzone onDrop={this.onDrop}>
            {({ getRootProps, getInputProps }) => (
              <section>
                <div {...getRootProps({ className: 'dropzone' })}>
                  <input {...getInputProps()} />
                  <span>
                    Drag and drop files here, or click to select files
                  </span>
                </div>
              </section>
            )}
          </Dropzone>
        </div>
      </div>
    );
  }
}
