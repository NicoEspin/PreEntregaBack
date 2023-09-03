import express from "express";
import { CartManager, Cart } from "../js/cartManager.js";

const cartsRouter = express.Router();
const cartManager = new CartManager("./src/mocks/carts.json");

cartsRouter.post("/", async (req, res) => {
  try {
    const newCart = new Cart();
    await cartManager.addCart(newCart);
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el carrito." });
  }
});
cartsRouter.get("/", async (req, res) => {
  try {
    const carts = await cartManager.getCarts(); 
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los carritos." });
  }
});

cartsRouter.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cartManager.getCartById(parseInt(cid));

    const cartProducts = cart.products;
    res.json(cartProducts);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el carrito." });
  }
});

cartsRouter.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  try {
    const cart = await cartManager.getCartById(parseInt(cid));

    const existingProductIndex = cart.products.findIndex(
      (item) => item.id === pid
    );

    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      cart.products.push({ id: pid, quantity });
    }

    await cartManager.updateCart(cid, cart);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error al agregar el producto al carrito." });
  }
});

export default cartsRouter;
