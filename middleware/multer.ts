import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { Request } from 'express';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // cb(null, path.join(__dirname,'../','/public/uploads')); 
        cb(null, 'public/uploads'); 
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Error: Images Only!'));
    }
};

export const upload = multer({
    storage: storage,
    // limits: { fileSize: 1000000 }
});
