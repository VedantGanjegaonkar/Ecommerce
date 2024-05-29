import { promises } from "fs";
import { Product } from "../models";
import { Document, Schema, model } from 'mongoose';
import { IProduct } from "../models/product.model";
import { AppError, NotFoundError, ValidationError, UnauthorizedError } from '../utils/errors';

import fs from 'fs';
import { join } from 'path';
import convertHTMLToPDF from "pdf-puppeteer";


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
  sort?: number;
  sortField?: string;
  pdfss ?:string

}


export class ProductService {

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
          name: 1,
          price: 1,
          description: 1,
          "categoryName": "$categoryDetails.name",
          "venderName": "$venderDetails.username"
        }
      },
    )

    const searchFields = [
      "name",
      "categoryName",
      "description",
      "venderName"
    ]

    let searchFilter: any = [];



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

    const filterQuery = {
      $match: {
        ...(searchFilter.length > 0 && { $or: searchFilter })

      }
    }
    console.log("this is filter query :", filterQuery);
    // { '$match': { '$or': [ [Object], [Object], [Object], [Object] ] } }

    pipeline.push(filterQuery)

    if (params.category) {

      // let categoryArray: any[] = [];
      // categoryArray.push(params.category)
      // console.log(categoryArray);
      // let flag = Array.isArray(params.category);
      // console.log(flag);

      if (Array.isArray(params.category)) {

        pipeline.push({
          $match: {
            categoryName: { $all: params.category }

          }
        });

      } else {
        pipeline.push({
          $match: {
            categoryName: params.category

          }
        });

      }



    }

    const p1 = await Product.aggregate(pipeline).exec();
    // console.log(p1);
    

    if(params.pdfss){

      console.log("entered into this stsge");
      

      const html = `
      <!doctype html>
      <html lang="en">
        <head>
          <title>Title</title>
          <!-- Required meta tags -->
          <meta charset="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <!-- Bootstrap CSS v5.2.1 -->
          <link
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
            rel="stylesheet"
            integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
            crossorigin="anonymous"
          />
        </head>
        <body>
          <header>
            <!-- place navbar here -->
          </header>
          <main>
            <h1 class="text-center mt-3">Product Pdf</h1>
            <div class="container">
              <h3 class="mt-5">Product Details</h3>
              <div class="container mt-5">
                
               
               
              </div>
            </div>
            <div class="table-responsive mt-5 container">
              <table class="table table-black table-striped">
                <thead>
                  <tr>
                    
                    <th scope="col">ProductName</th>
                   
                    <th scope="col">category1</th>
                    <th scope="col">category2</th>
                    <th scope="col">category3</th>

                    <th scope="col">Price</th>
                    <th scope="col">venderName</th>
                  </tr>
                </thead>
                <tbody>
                  ${p1.map(product => `
                    <tr>
                     
                    
                      <td>${product.name}</td>
                      <td>${product.categoryName[0]}</td>
                      <td>${product.categoryName[1]}</td>
                      <td>${product.categoryName[2]}</td>
                      <td>${product.price}</td>
                      <td>${product.venderName}</td>
                    </tr>
                  `).join('')}
                </tbody>
          
              </table>
            </div>
          </main>
          <footer>
            <!-- place footer here -->
          </footer>
          <!-- Bootstrap JavaScript Libraries -->
          <script
            src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js"
            integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r"
            crossorigin="anonymous"
          ></script>
          <script
            src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.min.js"
            integrity="sha384-BBtl+eGJRgqQAUMxJ7pMwbEyER4l1g+O15P+16Ep7Q9Q+zqX6gSbd85u4mG4QzX+"
            crossorigin="anonymous"
          ></script>
        </body>
      </html>`;

      
      

      await convertHTMLToPDF(html, async (pdf) => {
        // Save PDF to a file
        const filePath = join(__dirname, `productDetails.pdf`);
        await fs.promises.writeFile(filePath, pdf);
        console.log("pdf is genrtated  at ",filePath);
        
  
        // // Send PDF as a response
        // res.setHeader("Content-Type", "application/pdf");
        // res.send(pdf);
        return pdf;

      });
     

    }


    pipeline.push(
      { $skip: skip },
      { $limit: params.limit }
    );

    // console.log(pipeline);

    const products = await Product.aggregate(pipeline).exec();

    const totalBooks = p1.length
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


  public async findProductByid(productID: string): Promise<IProduct> {
    const product = await Product.findById(productID);

    if (!product) {
      throw new NotFoundError("product not found ")
    }

    return product

  }

  public async createproduct(params: createProductParams): Promise<IProduct> {

    const { name, description, price, category, stock, images, vendor } = params

    const newProduct = await Product.create({ name, description, price, category, stock, images, vendor })
    return newProduct

  }
  public async deleteProduct(productID: string): Promise<void> {

    const product = await Product.findById(productID);

    if (!product) {
      throw new NotFoundError("product not found to delete")
    }
    await Product.deleteOne({ _id: productID });
  }


}