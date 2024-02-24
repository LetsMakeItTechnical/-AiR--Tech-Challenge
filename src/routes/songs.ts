import { Router } from 'express';
import multer from 'multer';
import { SongController } from '../controllers/song';
import UploadController from '../middleware/upload';

const songRouter: Router = Router();
const controller = new SongController();
const uploadController = new UploadController();
const upload = multer({ storage: multer.memoryStorage() });

// Define the route for fetching random songs first
songRouter.get('/songs/random', controller.getRandomSongs);

songRouter.get('/', controller.getAllSongs).post('/', upload.array('files'), uploadController.processSongsUploads, controller.createSong);
songRouter.get('/:id', controller.getSongById);
songRouter.put('/:id', controller.updateSong);
songRouter.delete('/:id', controller.deleteSong);

export default songRouter;