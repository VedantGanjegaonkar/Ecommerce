import { ProductService } from "../services/product.service";
import { Request, Response,NextFunction } from 'express';
import{errorHandler} from "../middleware/errorHandler"


export class ProduController{

    private productservice:ProductService;

    constructor(){
        this.productservice=new ProductService()

        this.createProduct=this.createProduct.bind(this)
    }
    // name: string;
    // description: string;
    // price: number;
    // category: Schema.Types.ObjectId[];
    // stock: number;
    // images?: string[];
    // stock: Schema.Types.ObjectId;

    // {
    //     "name":"pocoM2",
    //    "description":"poco desc",
    //    "price":250,
    //    "category":["6653389d91a9bb0c799bd799","6653391191a9bb0c799bd7a9"],
    //    "stock":200,
    //    "vendor":"66537e8fd371d094b8b9214a"
    //   }

    public async createProduct(req:Request,res:Response,next:NextFunction){

        try {

            const {name,description,price,category,stock,images,vendor} = req.body

            const params = {name,description,price,category,stock,images,vendor}

            const newProduct= await this.productservice.createproduct(params)

            res.status(200).json({message:"Product created success", product:newProduct})
            
        } catch (error:any) {
            errorHandler(error,req,res,next)

            
        }


    }
}