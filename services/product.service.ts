import { promises } from "fs";
import { Product } from "../models";
import { Document, Schema, model } from 'mongoose';
import { IProduct } from "../models/product.model";
import { AppError, NotFoundError, ValidationError, UnauthorizedError } from '../utils/errors';


 interface createProductParams {

    name: string;
    description: string;
    price: number;
    category: Schema.Types.ObjectId[];
    stock: number;
    images?: string[];
    vendor: Schema.Types.ObjectId;
   
}

interface ProductQueryParams {
    page: number;
    limit: number;
    searchQuery?: string;
    category?: string; 
}


export class ProductService{

    
public async getAllBooksService(params: ProductQueryParams) {
    const skip = (params.page - 1) * params.limit;

    const pipeline: any[] = [];
    pipeline.push({
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryDetails"
        }
      },
      
       {
         $lookup: {
           from: "users",
           localField: "vendor",
           foreignField: "_id",
           as: "venderDetails"
         }
       },
       {
        $unwind: {
          path: "$venderDetails",
          preserveNullAndEmptyArrays: true
        }
      },
       {
         $project: {
           name:1,
           price:1,
           description:1,
           "categoryName":"$categoryDetails.name",
           "venderName":"$venderDetails.username"
         }
       },
    )

    const searchFields=[
        "name",
        "categoryName",
        "description",
        "venderName"
    ]

    let searchFilter: any = [];
    let categoryArray: any[] = [];
    

    if (params.searchQuery) {
        searchFilter = searchFields.map((field) => ({
            [field]: {
              $regex: params.searchQuery,
              $options: 'i',
            },
          }));

        //   console.log("this is search array : ",searchFilter);
          
        // pipeline.push({
        //     $match: {
        //         "$or":searchFilter               
        //     }
        // });
    }
//trying to make filter query

    const filterQuery={
        $match:{
            ...(searchFilter.length>0 && { $or: searchFilter })
           
        }
    }
    console.log("this is filter query :",filterQuery);
    // { '$match': { '$or': [ [Object], [Object], [Object], [Object] ] } }
    
   pipeline.push(filterQuery)

    if (params.category) {

        categoryArray.push(params.category)
        console.log(categoryArray[0]);

       
       pipeline.push({
        $match: {
            categoryName: {$all: categoryArray[0]}
            // category: new ObjectId(category)
        }
    });
      
    }
  
    const p1 =await Product.aggregate(pipeline).exec();

    pipeline.push(
        { $skip: skip },
        { $limit: params.limit }
    );

    // console.log(pipeline);
    
    const products =await Product.aggregate(pipeline).exec();

    const totalBooks= p1.length
    const totalPages = Math.ceil(totalBooks / params.limit);
    const currentPage = params.page

    // console.log("total books :", totalBooks);
    // console.log("total pages :", totalPages);
    // console.log("currentPage :", currentPage);
    
    return {
        products,
      totalPages,
      currentPage

    }

   
};


    public async findProductByid(productID: string):Promise<IProduct>{
        const product = await Product.findById(productID);

        if(!product){
            throw new NotFoundError("product not found ")
        }

        return product

    }

    public async createproduct(params:createProductParams):Promise<IProduct>{

    const {name,description,price,category,stock,images,vendor}=params

        const newProduct = await Product.create({name,description,price,category,stock,images,vendor})
        return newProduct

    }
    public async deleteProduct(productID: string):Promise<void> {

        const product = await Product.findById(productID);

        if (!product) {
            throw new NotFoundError("product not found to delete")
        }
    await Product.deleteOne({ _id: productID });
}


}