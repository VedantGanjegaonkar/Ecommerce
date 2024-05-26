import { Document, Schema, model } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    category: Schema.Types.ObjectId[];
    stock: number;
    images?: string[];
    vendor: Schema.Types.ObjectId;
   
}

const productSchema = new Schema<IProduct>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: [{ type: Schema.Types.ObjectId, ref: 'Category', required: true }],
    stock: { type: Number, required: true },
    images: { type: [String], required: false },
    vendor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
   
},
{
    timestamps:true
});

export const Product = model<IProduct>('Product', productSchema);
