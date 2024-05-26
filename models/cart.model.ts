import { Document, Schema, model } from 'mongoose';

interface ICartItem {
    product: Schema.Types.ObjectId;
    quantity: number;
}

export interface ICart extends Document {
    user: Schema.Types.ObjectId;
    items: ICartItem[];
   
}

const cartSchema = new Schema<ICart>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true }
        }
    ],
   
},
{
    timestamps:true
});

export const Cart = model<ICart>('Cart', cartSchema);
