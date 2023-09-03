import { promises as fs } from 'fs';

class CartManager {
  constructor(path) {
    this.path = path;
    this.carts = [];
  }

  async readCarts() {
    try {
      const fileContents = await fs.readFile(this.path, 'utf-8');
      this.carts = JSON.parse(fileContents);
    } catch (error) {
      this.carts = [];
    }
  }

  async saveCarts() {
    await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2), 'utf-8');
  }

  async addCart(cart) {
    await this.readCarts();
    cart.id = CartManager.idGenerate();
    this.carts.push(cart);
    await this.saveCarts();
  }

  async getCartById(id) {
    await this.readCarts();
    return this.carts.find((cart) => cart.id === id);
  }

  async updateCart(id, updatedCart) {
    await this.readCarts();
    const cartIndex = this.carts.findIndex((cart) => cart.id === id);
    if (cartIndex !== -1) {
      this.carts[cartIndex] = updatedCart;
      await this.saveCarts();
    }
  }

  async deleteCart(id) {
    await this.readCarts();
    this.carts = this.carts.filter((cart) => cart.id !== id);
    await this.saveCarts();
  }
}

class Cart {
  constructor() {
    this.products = [];
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

export { CartManager, Cart };