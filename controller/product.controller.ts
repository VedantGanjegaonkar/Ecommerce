import { ProductService } from "../services/product.service";
import { Request, Response,NextFunction } from 'express';
import{errorHandler} from "../middleware/errorHandler"
import { ApiHandler } from "../utils/apiHandler";
import { UserService } from '../services/user.service';

export class ProduController{

    private productservice:ProductService;
    private userService:UserService
    
    constructor(){
        this.productservice=new ProductService()
        this.userService = new UserService()

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
           
            let { name, description, price, category, stock, vendor } = req.body;
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            const profilePicLocalPath = files?.images?.[0]?.path;
            const images = profilePicLocalPath;
            category = JSON.parse(category);
            const params = { name, description, price, category, stock, images, vendor };
            const newProduct = await this.productservice.createProduct(params);
      
            res.status(200).json(new ApiHandler(newProduct,"product created succsesfully"));
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
            const pdfss :string=req.query.pdf as string
            

            const params:any={ page, limit, searchQuery, category,pdfss }

            const result :any = await this.productservice.getAllBooksService(params);
       

                res.status(200).json({ result });

                   
        } catch (err:any) {
            errorHandler(err,req,res,next)
        }
    }
}