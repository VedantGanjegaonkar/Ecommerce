import { Router } from 'express';

import { RoleController} from '../controller/role.controller';
import { CategoryController} from '../controller/category.controller';


const userController = new CategoryController();

const router = Router();

router.post('/create', userController.createCategory);
router.get('/get', userController.getAllCategories);
export default router
