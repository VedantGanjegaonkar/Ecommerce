import { Document, Schema, model } from 'mongoose';

interface IOrderItem {
    product: Schema.Types.ObjectId;
    quantity: number;
    price: number;
}

export interface IOrder extends Document {
    user: Schema.Types.ObjectId;
    items: IOrderItem[];
    totalAmount: number;
    status: string;
    
}

const orderSchema = new Schema<IOrder>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true }
        }
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, required: true },
    
},
{
    timestamps:true
});

export const Order = model<IOrder>('Order', orderSchema);
