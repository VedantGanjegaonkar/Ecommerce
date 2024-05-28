import { ProductService } from "../services/product.service";
import { Request, Response,NextFunction } from 'express';
import{errorHandler} from "../middleware/errorHandler"


export class ProduController{

    private productservice:ProductService;

    constructor(){
        this.productservice=new ProductService()

        this.createProduct=this.createProduct.bind(this)
        this.getAllBooks=this.getAllBooks.bind(this)
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

    public async getAllBooks(req: Request, res: Response,next:NextFunction): Promise<void>{
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const searchQuery: string = req.query.search as string;
            const category: any = req.query.category as string;
            

            const params:any={ page, limit, searchQuery, category }

            const result = await this.productservice.getAllBooksService(params);
            // console.log(result);

            res.status(200).json({ result });
            
        } catch (err:any) {
            errorHandler(err,req,res,next)
        }
    }
}