import { Schema } from "mongoose";
import { Cart, Product,User } from "../models";
import { NotFoundError, ValidationError } from "../utils/errors";


export class CartService{

    public async addProductToCart(userID:string,productID:Schema.Types.ObjectId,quantity:number){
        // Find the user's cart
        let cart = await Cart.findOne({ user: userID });

        const product = await Product.findById(productID);
        if (!product) {
            throw new NotFoundError("Product not found");
        }
        console.log(product.stock)

        if (product.stock==0) {
            throw new NotFoundError("Out of stock");
        }

    
        // If the cart doesn't exist, create a new one
        if (!cart) {
            cart = new Cart({ user: userID, items: [] });
        }

        // Find the product in the cart
        const itemIndex = cart.items.findIndex(item => item.product.toString() === productID.toString());
        console.log(itemIndex);
        

        if (itemIndex > -1) {
            // If the product exists in the cart, update the quantity
            cart.items[itemIndex].quantity += quantity;
            
            
        } else {
            // If the product doesn't exist in the cart, add it
            cart.items.push({ product: productID, quantity });
            console.log("this product not exist in cart:");
            
        }

        // Save the cart
        await cart.save();
        return cart;

    }


    public async deleteProductFromCart(userID:Schema.Types.ObjectId,productID:Schema.Types.ObjectId){

        const user = await User.findById(userID);
        if (!user) {
            throw new Error("User not found");
        }
        // Find the user's cart
        let cart = await Cart.findOne({ user: userID });
    
        if (!cart) {
           throw new NotFoundError("cart not found ")
        }

        
        const product = await Product.findById(productID);
        if (!product) {
            throw new NotFoundError("Product not found");
        }
       


        // Find the product in the cart
        const itemIndex = cart.items.findIndex(item => item.product.toString() === productID.toString());
        console.log(itemIndex);

        if(itemIndex==-1){
            throw new NotFoundError("product not found to delete in cart")
        }
        
        cart.items.splice(itemIndex,1)
        
        await cart.save();
    }

    public async deleteAllitemsFromCart(userID:Schema.Types.ObjectId){

        const user = await User.findById(userID);
        if (!user) {
            throw new Error("User not found");
        }
        // Find the user's cart
        let cart = await Cart.findOne({ user: userID });
    
        if (!cart) {
           throw new NotFoundError("cart not found ")
        }

        cart.items=[]
        
        await cart.save();
    }
}