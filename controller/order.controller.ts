import { Request, Response,NextFunction } from 'express';
import {OrderServices} from "../services/order.services"
import {errorHandler} from "../middleware/errorHandler"


export class orderController{
    private orderService:OrderServices

    constructor(){
        this.orderService=new OrderServices()

        this.createOrder=this.createOrder.bind(this)
    }


    public async createOrder(req:Request,res:Response,next:NextFunction){

        try {

            const { userID } = req.body

            const newOrder= await this.orderService.createOrderFromUserId(userID)
            if (newOrder) {
                res.status(201).json(newOrder);
            } else {
                res.status(400).json({ message: 'Failed to create order' });
            }
    
            
        } catch (err:any) {
            errorHandler(err,req,res,next)
            
        }

       



    }
}