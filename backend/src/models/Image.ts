import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../sequelizeConnection';

export interface ImageAddModel {
}

export interface ImageModel extends Model<ImageModel, ImageAddModel> {
  id: number,
  name: string,
  thumbnail: string,
  medium: string,
  full: string,
  sorting: number,
  gallery_id: number
}

export const Image = sequelize().define<ImageModel, ImageAddModel>('image', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
  },
  thumbnail: {
    type: DataTypes.STRING,
  },
  medium: {
    type: DataTypes.STRING,
  },
  full: {
    type: DataTypes.STRING,
  },
  sorting: {
    type: DataTypes.INTEGER
  },
  gallery_id: {
    type: DataTypes.INTEGER,
    references: 'galleries',
    referencesKey: 'id'
  }
}, {
  timestamps: false,
  createdAt: false,
  updatedAt: false
});