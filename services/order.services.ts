// import { Request, Response } from 'express';
// import { Cart } from './models/cart.model';
// import { Order } from './models/order.model';
// import { Product } from './models/product.model';
// import { IOrder, ICart } from './models/interfaces'; // Ensure these interfaces are properly defined and exported

// export const createOrderFromCart = async (cartId: string): Promise<IOrder | null> => {
//     try {
//         // Fetch the cart by ID
//         const cart = await Cart.findById(cartId).populate('items.product');
//         if (!cart) {
//             throw new Error('Cart not found');
//         }

//         // Calculate total amount
//         let totalAmount = 0;
//         const orderItems = cart.items.map(item => {
//             const product = item.product as unknown as { price: number };
//             const itemTotal = product.price * item.quantity;
//             totalAmount += itemTotal;
//             return {
//                 product: item.product,
//                 quantity: item.quantity,
//                 price: product.price
//             };
//         });

//         // Create order
//         const newOrder = new Order({
//             user: cart.user,
//             items: orderItems,
//             totalAmount,
//             status: 'pending', // Initial status
//             createdAt: new Date(),
//             updatedAt: new Date()
//         });

//         // Save the order
//         await newOrder.save();

//         // Optionally, clear the cart or delete it
//         await Cart.findByIdAndDelete(cartId);

//         return newOrder;
//     } catch (error) {
//         console.error('Failed to create order:', error);
//         throw new Error('Failed to create order');
//     }
// };
