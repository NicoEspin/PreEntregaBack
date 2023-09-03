import express from "express";
import { ProductManager, Product } from "../js/ProductManager.js";

const productsRouter = express.Router();
const productManager = new ProductManager("./src/mocks/products.json");

productsRouter.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.json(products);
  } catch (error) {
    res.status(400).json({ error: "Error al obtener productos." });
  }
});

productsRouter.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    const product = await productManager.getProductById(parseInt(pid));
    if (!product) {
      res.status(404).json({ error: "Producto no encontrado." });
      return;
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: "Error al obtener el producto." });
  }
});

productsRouter.post("/", async (req, res) => {
  const productData = req.body;
  try {
    const newProduct = new Product(
      productData.title,
      productData.description,
      productData.price,
      productData.code,
      productData.stock
    );

    await productManager.addProduct(newProduct);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: "Error al agregar el producto." });
  }
});

productsRouter.put("/:pid", async (req, res) => {
  const { pid } = req.params;
  const updatedFields = req.body;
  try {
    await productManager.updateProduct(parseInt(pid), updatedFields);
    res.status(200).send();
  } catch (error) {
    res.status(400).json({ error: "Error al actualizar el producto." });
  }
});

productsRouter.delete("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    await productManager.deleteProduct(parseInt(pid));
    res.status(200).json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    if (error.message === "Producto no encontrado") {
      res.status(404).json({ error: "Producto no encontrado" });
    } else {
      res.status(500).json({ error: "Error al eliminar el producto." });
    }
  }
});


export default productsRouter;
