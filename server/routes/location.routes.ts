
import { Router } from 'express';
import { locationController } from '../controllers';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, locationController.getLocations);
router.get('/:id', requireAuth, locationController.getLocation);
router.post('/', requireAuth, locationController.createLocation);
router.put('/:id', requireAuth, locationController.updateLocation);
router.delete('/:id', requireAuth, locationController.deleteLocation);

export default router;
