import { Router } from 'express';

import { RoleController} from '../controller/role.controller';


const userController = new RoleController();

const router = Router();

router.post('/create', userController.createRole);

export default router
