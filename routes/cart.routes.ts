import { Router } from 'express';

import {CartController} from '../controller/cart.controller';


const userController = new CartController();

const router = Router();

router.post('/add', userController.addProduct);
router.delete('/delete', userController.deleteProduct);
router.delete('/clearCart',userController.clearCart)
export default router
