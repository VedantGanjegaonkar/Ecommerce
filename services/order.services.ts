import { Cart,Order,Product } from '../models/index';
import { IOrder } from '../models/order.model';
import { AppError, NotFoundError } from '../utils/errors';
import {ProductService} from "../services/product.service"


export class OrderServices{

    private productService:ProductService

    constructor(){
        this.productService=new ProductService()

        this.createOrderFromUserId=this.createOrderFromUserId.bind(this)
    }

    
public async createOrderFromUserId(userId: string): Promise<IOrder>{
    try {


        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            throw new NotFoundError('Cart not found');
        }
        // console.log("this is cart to process for order:", cart );
        

        // Calculate total amount
        let totalAmount = 0;    
        const orderItems = cart.items.map(item => {

            const quantity = item.quantity
            const pId : any =item.product
            // const id = pId._id;
            
            console.log("................................this is fetched pID  ",pId);
            console.log(quantity);
            
            
           
            // const itemTotal = product.price * item.quantity;
            // totalAmount += itemTotal;
            return {
                product: item.product,
                quantity: item.quantity,
                price:100
                // price: product.price
            };
        });

        // console.log("this is return from map :",orderItems);
        

        // Create order
        const newOrder = new Order({
            user: cart.user,
            items: orderItems,
            totalAmount,
            status: 'pending' // Initial status
            
        });

        if(!newOrder){
            throw new NotFoundError("order not created")
        }

        // Save the order
        await newOrder.save();


        return newOrder;


    } catch (error) {
        console.error('Failed to create order:', error);
        throw new AppError('Failed to create order',404);
    }
};

}
