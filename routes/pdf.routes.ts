import { Router } from 'express';


import { PdfController} from '../controller/pdf.controller';


const userController = new PdfController();

const router = Router();

router.get('/', userController.genPdf);

export default router
