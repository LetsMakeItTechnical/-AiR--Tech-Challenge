import { Router } from 'express';
import { ArtistController } from '../controllers/artist';

const artistRouter: Router = Router();
const controller = new ArtistController();

artistRouter.get('/', controller.getAllArtists);
artistRouter.get('/:id', controller.getArtistById);
artistRouter.post('', controller.createArtist);
artistRouter.put('/:id', controller.updateArtist);
artistRouter.delete('/:id', controller.deleteArtist);

export default artistRouter;