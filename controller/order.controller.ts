import { Request, Response,NextFunction } from 'express';
import {OrderServices} from "../services/order.services"
import {errorHandler} from "../middleware/errorHandler"

import { UserService } from '../services/user.service';

export class orderController{
    private orderService:OrderServices
    private userService:UserService

    constructor(){
        this.orderService=new OrderServices()
        this.userService = new UserService()

        this.createOrder=this.createOrder.bind(this)
       
    }


    public async createOrder(req:Request,res:Response,next:NextFunction){

        try {
            const authHeader = req.headers['authorization'];
            // const { userID } = req.body

            const userID= await this.userService.getUserId(authHeader)

            const newOrder= await this.orderService.createOrderFromUserId(userID)
            if (newOrder) {
                res.status(201).json({ message: 'order placed success', orderDetails: newOrder });
            } else {
                res.status(400).json({ message: 'Failed to create order' });
            }
    
            
        } catch (err:any) {
            errorHandler(err,req,res,next)
            
        }

    }

    public async genPdf(req:Request,res:Response,next:NextFunction){
        
    }
}