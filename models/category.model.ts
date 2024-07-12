import { Document, Schema, model } from 'mongoose';

export interface ICategory extends Document {
    _id: Schema.Types.ObjectId;
    name: string;
    
}

const categorySchema = new Schema<ICategory>({
    name: { type: String, required: true },
    
},
{
    timestamps:true
});

export const Category = model<ICategory>('Category', categorySchema);
