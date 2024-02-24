import { Router } from 'express';

import songs from './songs';
import artists from './artists';

const router: Router = Router();

router.use('/songs', songs);
router.use('/artists', artists);


export default router;
