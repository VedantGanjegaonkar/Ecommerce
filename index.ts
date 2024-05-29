
import express from "express"
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import roleRoutes from "./routes/role.routes"
import categoryRoutes from "./routes/category.routes"
import userRoutes from "./routes/user.routes"
import productRoutes from "./routes/product.route"
import cartRoutes from "./routes/cart.routes"
import orderRoutes from "./routes/order.routes"
import pdfRoutes from "./routes/pdf.routes"

import{adminOnly,anyLogedIn} from "./middleware/auth.middleware"

const app = express()

const port = process.env.PORT || 3000;
const dbUrl = process.env.DATABASE_URL as string;

// Middlewares
app.use(express.json());

//routes

app.use("/role",adminOnly,roleRoutes)
app.use("/category",adminOnly,categoryRoutes)
app.use("/user",userRoutes)
app.use("/product",productRoutes)
app.use("/cart",anyLogedIn,cartRoutes)

app.use("/order",orderRoutes)
app.use("/pdf",pdfRoutes)



app.get('/', (req, res) => {
  res.send('Welcom to amazon.com lite')
})

mongoose.connect('mongodb+srv://vedantsg112233:MzUFmOl5GA6oCL77@cluster0.rfaqwkb.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => {
    console.log('connected to DB');
  });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})