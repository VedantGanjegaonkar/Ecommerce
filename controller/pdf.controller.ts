import { Request, Response,NextFunction } from 'express';
import {OrderServices} from "../services/order.services"
import {errorHandler} from "../middleware/errorHandler"
import { UserService } from '../services/user.service';


import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import { join } from 'path';

import convertHTMLToPDF from "pdf-puppeteer";


// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

export class PdfController{
    private orderService:OrderServices
    private userService:UserService

    constructor(){
        this.orderService=new OrderServices()
        this.userService = new UserService()

        this.genPdf=this.genPdf.bind(this)
       
    }

   



    public async genPdf(req:Request,res:Response,next:NextFunction){

        try {
            const authHeader = req.headers['authorization'];
           const userID = await this.userService.getUserId(authHeader)

           const userDetails = await this.userService.getUserById(userID)
           const order = await this.orderService.getOrderdetailById(userID)

          const userObj ={
            name:userDetails.username,
            email:userDetails.email,
          }

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
                    <h1 class="text-center mt-3">Invoice Pdf</h1>
                    <div class="container">
                    <h3 class="mt-5">Customer Details</h3>
                    <div class="container mt-5">
                        <p><strong>CustomerName</strong>: ${userObj.name}</p>
                    
                        <p><strong>CustomerEmail</strong>: ${userObj.email}</p>
                    </div>
                    </div>
                    <div class="table-responsive mt-5 container">
                    <table class="table table-black table-striped">
                        <thead>
                        <tr>
                            <th scope="col">Product</th>
                        
                            <th scope="col">Quantity</th>
                            <th scope="col">Price</th>
                        </tr>
                        </thead>
                        <tbody>
                        ${order.items.map(order => `
                            <tr>
                            <td>${order.product}</td>
                            
                            <td>${order.quantity}</td>
                            <td>${order.price}</td>
                            </tr>
                        `).join('')}
                        </tbody>
                        <tfoot>
                        <tr>
                            <th>Total:</th>
                            <th></th>
                            <th></th>
                            <th>$${order.totalAmount}</th>
                        </tr>
                        </tfoot>
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
            const filePath = join(`${__dirname}/pdf`, `invoice-${userObj.name}.pdf`);
            await fs.promises.writeFile(filePath, pdf);
            console.log("pdf is genrtated  at ",filePath);
            
      
            // Send PDF as a response
            res.setHeader("Content-Type", "application/pdf");
            res.send(pdf);


          });
         


        
        } catch (err:any) {
            console.error('Error generating or writing PDF:', err);
            errorHandler(err,req,res,next)
        }

    }
}