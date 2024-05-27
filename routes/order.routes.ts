import { Router } from 'express';


import { orderController} from '../controller/order.controller';


const userController = new orderController();

const router = Router();

router.post('/create', userController.createOrder);

export default router
