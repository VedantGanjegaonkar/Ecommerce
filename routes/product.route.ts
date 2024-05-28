import { Router } from 'express';

import {ProduController} from '../controller/product.controller';
import{adminOnly} from "../middleware/auth.middleware"

const userController = new ProduController();

const router = Router();

router.post('/create',adminOnly, userController.createProduct);
router.get('/all', userController.getAllBooks);

export default router
