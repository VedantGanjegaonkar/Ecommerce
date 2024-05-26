
import express from "express"
import mongoose from 'mongoose';
import roleRoutes from "./routes/role.routes"
import categoryRoutes from "./routes/category.routes"
import userRoutes from "./routes/user.routes"
import productRoutes from "./routes/product.route"

const app = express()
const port = 3000



// Middlewares
app.use(express.json());

//routes

app.use("/role",roleRoutes)
app.use("/category",categoryRoutes)
app.use("/user",userRoutes)
app.use("/product",productRoutes)



app.get('/', (req, res) => {
  res.send('Welcom to amazon.com lite')
})

mongoose.connect('mongodb://localhost:27017/Ecommerce')
  .then(() => {
    console.log('connected to DB');
  });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})