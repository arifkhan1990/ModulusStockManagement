// invoice-template.routes.ts (Example implementation assuming a file structure)
import { Router } from 'express'; //Example import
import { hasPermission } from '../middleware/rbac'; //Corrected import

const router = Router();

router.get('/', hasPermission('read:invoices'), (req, res) => { //Corrected function call
  // ... your route handler logic ...
});

router.post('/', hasPermission('create:invoices'), (req, res) => { //Corrected function call
  // ... your route handler logic ...
});

// ... other routes ...


export default router;


// rbac.ts (Example implementation of rbac middleware)
// This file needs to exist for the above code to work correctly

export function hasPermission(permission: string) {
  return (req: any, res: any, next: any) => { //Example function signature
      //Implementation to check if user has permission
      const userHasPermission = /* your permission check logic here */;
      if(userHasPermission){
        next();
      } else {
        res.status(403).send('Forbidden');
      }
  };
}