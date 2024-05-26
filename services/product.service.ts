import { promises } from "fs";
import { Product } from "../models";
import { Document, Schema, model } from 'mongoose';
import { IProduct } from "../models/product.model";
import { AppError, NotFoundError, ValidationError, UnauthorizedError } from '../utils/errors';


 interface createProductParams {

    name: string;
    description: string;
    price: number;
    category: Schema.Types.ObjectId[];
    stock: number;
    images?: string[];
    vendor: Schema.Types.ObjectId;
   
}

export class ProductService{

    public async createproduct(params:createProductParams):Promise<IProduct>{

    const {name,description,price,category,stock,vendor}=params

        const newProduct = await Product.create({name,description,price,category,stock,vendor})
        return newProduct

    }
    public async deleteProduct(productID: string):Promise<void> {

        const product = await Product.findById(productID);

        if (!product) {
            throw new NotFoundError("product not found to delete")
        }
    await Product.deleteOne({ _id: productID });
}


}