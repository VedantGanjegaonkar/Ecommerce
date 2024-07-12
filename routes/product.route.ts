import { Router } from 'express';

import {ProduController} from '../controller/product.controller';
import{adminOnly} from "../middleware/auth.middleware"
import { upload } from '../middleware/multer';

const userController = new ProduController();

const router = Router();

router.post('/create',upload.fields([{
    name: "images",
    maxCount: 1,
}]) , userController.createProduct);
router.get('/all', userController.getAllBooks);

export default router
