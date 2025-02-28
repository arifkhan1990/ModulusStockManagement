
import { Router } from 'express';
import { demoRequestController } from '../controllers';

const router = Router();

router.post('/demo-request', demoRequestController.createDemoRequest);

export default router;
