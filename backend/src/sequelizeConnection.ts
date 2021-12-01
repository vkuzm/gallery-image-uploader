import { Sequelize } from 'sequelize';
import properties from './properties';

export const sequelize = (): Sequelize => {
  const connection = new Sequelize(properties.dbName, properties.dbUser, properties.dbPassword, {
    host: properties.dbHost,
    dialect: properties.dbDriver
  });
  
  try {
    connection.authenticate();
    console.log('Connection to the database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
  return connection;
};
