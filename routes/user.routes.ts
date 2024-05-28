import { Router } from 'express';

import { UserController} from '../controller/user.controller';


const userController = new UserController();

const router = Router();

router.post('/signup', userController.createUser);
router.post('/login', userController.login);

router.post('/createCart', userController.createCart); //optional 


export default router