import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { router } from './AppRouter';
import './controllers/GalleryController';
import properties from './properties';

const app = express();
const corsOptions = {
  origin: '*'
};
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/api', router);

app.listen(properties.serverPort, () => {
  console.log(`Listening on port ${properties.serverPort}`);
});
