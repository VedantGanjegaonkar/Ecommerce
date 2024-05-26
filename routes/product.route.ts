import { Router } from 'express';

import {ProduController} from '../controller/product.controller';


const userController = new ProduController();

const router = Router();

router.post('/create', userController.createProduct);

export default router
