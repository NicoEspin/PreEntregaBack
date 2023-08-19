import express from 'express';
import productsRouter from './routes/products.routes.js'; 
import cartsRouter from './routes/cart.routes.js'; 
const app = express();
const PORT = 8080;

// Agrega las rutas de productos y carritos como middlewares
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});