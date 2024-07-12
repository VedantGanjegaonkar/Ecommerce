import { Request, Response,NextFunction } from 'express';
import { Category, ICategory } from '../models/category.model';
import { AppError, NotFoundError, ValidationError, UnauthorizedError } from '../utils/errors';
export class CategoryController {
    public async createCategory(req: Request, res: Response): Promise<void> {
        try {
            const { name } = req.body;

            // Check if category with the same name already exists
            const existingCategory = await Category.findOne({ name });
            if (existingCategory) {
                res.status(400).json({ message: 'Category with this name already exists' });
                return;
            }

            // Create a new category
            const newCategory: ICategory = await Category.create({ name });

            res.status(201).json({ message: 'Category created successfully', category: newCategory });
        } catch (err : any) {
            res.status(500).json({ message: 'Failed to create category', error: err.message });
        }
    }

    public async getAllCategories(req: Request, res: Response):Promise<any>{

        try {
            const categories=await Category.find({})
        if (!categories || categories.length === 0) {
            throw new NotFoundError('No categories found');
        }

        res.status(201).json(categories);
        
            
        } catch (err:any) {
            res.status(500).json({ message: 'Failed to create category', error: err.message });
        }

        
    }
}