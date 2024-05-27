import { errorHandler } from "../middleware/errorHandler";
import { CartService } from "../services/cart.service"
import { Request, Response,NextFunction } from 'express';


export class CartController{

    private cartService:CartService

    constructor(){
        this.cartService=new CartService()

        this.addProduct=this.addProduct.bind(this)
        this.deleteProduct=this.deleteProduct.bind(this)

       
    }
    

    public async addProduct(req:Request,res:Response,next:NextFunction){

        try {

            const {userID,productID,qnt} = req.body
    
            
            const newCart = await this.cartService.addProductToCart(userID,productID,qnt)

            res.status(200).json({message:"Product added to cart success", cart:newCart })
            
        } catch (err:any) {
            errorHandler(err,req,res,next)
        }

    }
    public async deleteProduct(req:Request,res:Response,next:NextFunction){

        try {

            const {userID,productID} = req.body
    
            
            const newCart = await this.cartService.deleteProductFromCart(userID,productID)

            res.status(200).json({message:"Product deleted from cart success", cart:newCart })
            
        } catch (err:any) {
            errorHandler(err,req,res,next)
        }

    }

    
}