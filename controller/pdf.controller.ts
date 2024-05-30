import { Request, Response, NextFunction } from 'express';
import { OrderServices } from "../services/order.services";
import { errorHandler } from "../middleware/errorHandler";
import { UserService } from '../services/user.service';

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

import convertHTMLToPDF from "pdf-puppeteer";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

export class PdfController {
    private orderService: OrderServices;
    private userService: UserService;

    constructor() {
        this.orderService = new OrderServices();
        this.userService = new UserService();

        this.genPdf = this.genPdf.bind(this);
    }

    private async loadTemplate(templatePath: string): Promise<string> {
        return await fs.readFile(templatePath, 'utf-8');
    }

    public async genPdf(req: Request, res: Response, next: NextFunction) {
        try {
            const authHeader = req.headers['authorization'];
            const userID = await this.userService.getUserId(authHeader);

            const userDetails = await this.userService.getUserById(userID);
            const order = await this.orderService.getOrderdetailById(userID);

            const userObj = {
                name: userDetails.username,
                email: userDetails.email,
            };

            const templatePath = join(__dirname, 'templates/invoiceTemplate.html');
            let html = await this.loadTemplate(templatePath);

            const orderItemsHtml = order.items.map(item => `
                <tr>
                    <td>${item.product}</td>
                    <td>${item.quantity}</td>
                    <td>${item.price}</td>
                </tr>
            `).join('');

            html = html.replace('{{name}}', userObj.name)
                       .replace('{{email}}', userObj.email)
                       .replace('{{orderItems}}', orderItemsHtml)
                       .replace('${{totalAmount}}', `${order.totalAmount}`);

            await convertHTMLToPDF(html, async (pdf) => {
                const filePath = join(__dirname, `pdfs/invoice-${userObj.name}.pdf`);
                await fs.writeFile(filePath, pdf);
                console.log("pdf is generated at", filePath);

                res.setHeader("Content-Type", "application/pdf");
                res.send(pdf);
            });
        } catch (err: any) {
            console.error('Error generating or writing PDF:', err);
            errorHandler(err, req, res, next);
        }
    }
}
