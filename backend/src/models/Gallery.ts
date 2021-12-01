import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../sequelizeConnection';
import { Image, ImageModel } from './Image';

export interface WorkAddModel {
  id?: number,
  title: string,
  sorting?: number
}

export interface GalleryModel extends Model<GalleryModel, WorkAddModel> {
  id: number,
  title: string,
  images: ImageModel[],
  sorting: number
}

export const Gallery = sequelize().define<GalleryModel, WorkAddModel>('gallery', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  sorting: {
    type: DataTypes.INTEGER
  }
}, {
  timestamps: false,
  createdAt: false,
  updatedAt: false
});

Gallery.hasMany(Image, { as: 'images', foreignKey: 'gallery_id' });
