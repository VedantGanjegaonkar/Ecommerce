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

        this.genPdf=this.genPdf.bind(this)
       
    }



    public async genPdf(req:Request,res:Response,next:NextFunction){
        
    }
}