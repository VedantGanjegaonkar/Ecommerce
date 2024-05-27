import { Router } from 'express';


import {CartController} from '../controller/cart.controller';


const userController = new CartController();

const router = Router();

router.post('/add', userController.addProduct);
router.delete('/delete', userController.deleteProduct);

export default router
