import { promises as fs } from "fs";

class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
  }

  async readProducts() {
    try {
      const fileContents = await fs.readFile(this.path, "utf-8");
      this.products = JSON.parse(fileContents);
    } catch (error) {
      this.products = [];
    }
  }

  async saveProducts() {
    await fs.writeFile(
      this.path,
      JSON.stringify(this.products, null, 2),
      "utf-8"
    );
  }

  async addProduct(product) {
    await this.readProducts();

    const requiredFields = ["title", "description", "price", "code", "stock"];
    const missingFields = requiredFields.filter((field) => !(field in product));

    if (missingFields.length > 0) {
      console.log(
        `Campos requeridos faltantes en el producto: ${missingFields.join(
          ", "
        )}`
      );
      return;
    }

    const isCodeRepeated = this.products.some(
      (existingProduct) => existingProduct.code === product.code
    );
    if (isCodeRepeated) {
      console.log("Ya existe un producto con este código");
      return;
    }

    const newProduct = {
      ...product,
      id: Product.idGenerate(),
    };
    this.products.push(newProduct);
    await this.saveProducts();
  }

  async getProducts() {
    await this.readProducts();
    return this.products;
  }

  async getProductById(id) {
    await this.readProducts();
    return this.products.find((product) => product.id === id);
  }

  async getProductByCode(code) {
    await this.readProducts();
    return this.products.find((product) => product.code === code);
  }
}

export class Product {
  constructor(title, description, price, code, stock) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.code = code;
    this.stock = stock;
  }

  static idGenerate() {
    if (!this.idIncrement) {
      this.idIncrement = 1;
    } else {
      this.idIncrement++;
    }
    return this.idIncrement;
  }
}

export { ProductManager };
