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
        const orderItems = await Promise.all(cart.items.map(async (item) => {

            const quantity = item.quantity
            const pId : any =item.product.toString()

            const product= await this.productService.findProductByid(pId)

            
            const price= product.price
            console.log("this is product price :",price);
           
            const itemTotal = price * quantity;
            totalAmount += itemTotal;

            console.log("this is totL :",totalAmount);
            
            return {
                product: item.product,
                quantity: quantity,    
                price: price
            };
        }));

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

public async getOrderdetailById(userID:string):Promise<IOrder> {

    const order = await Order.findOne({user:userID})

    if(!order){
        throw new NotFoundError("order not found")
    }
    return order

}

  

}
