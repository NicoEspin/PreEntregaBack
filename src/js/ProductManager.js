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
      console.log("Error al leer el archivo:", error);
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

    const requiredFields = [
      "title",
      "description",
      "price",
      "code",
      "stock",
      "category",
    ];
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

  async updateProduct(id, updatedFields) {
    await this.readProducts();

    // Encuentra el índice del producto que coincide con el ID
    const productIndex = this.products.findIndex(
      (product) => product.id === id
    );

    if (productIndex === -1) {
      console.log("Producto no encontrado");
      return;
    }

    // Actualiza los campos del producto con los valores actualizados
    this.products[productIndex] = {
      ...this.products[productIndex],
      ...updatedFields,
    };

    await this.saveProducts();
  }

  async deleteProduct(id) {
    await this.readProducts();
  
    const productIndex = this.products.findIndex(
      (product) => product.id === id
    );
  
    if (productIndex === -1) {
      // El producto no existe, devuelve un código de respuesta 404
      console.log("Producto con el ID especificado no encontrado.");
      throw new Error("Producto no encontrado"); // Lanza un error para manejar en el controlador
    }
  
    this.products.splice(productIndex, 1);
    console.log("Producto eliminado");
  
    await this.saveProducts();
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
