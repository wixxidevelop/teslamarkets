import { promises as fs } from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'database', 'products.json');

// Ensure database directory exists
async function ensureDbDirectory() {
  const dbDir = path.dirname(DB_PATH);
  try {
    await fs.access(dbDir);
  } catch {
    await fs.mkdir(dbDir, { recursive: true });
  }
}

// Read database
async function readDatabase() {
  try {
    await ensureDbDirectory();
    const data = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, create initial structure
    const initialDb = {
      products: [],
      metadata: {
        version: '1.0.0',
        created: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        totalProducts: 0
      }
    };
    await writeDatabase(initialDb);
    return initialDb;
  }
}

// Write database
async function writeDatabase(data) {
  await ensureDbDirectory();
  data.metadata.lastModified = new Date().toISOString();
  data.metadata.totalProducts = data.products.length;
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

// Generate unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Product operations
class ProductDatabase {
  // Get all products
  static async getAllProducts() {
    const db = await readDatabase();
    return db.products;
  }

  // Get product by ID
  static async getProductById(id) {
    const db = await readDatabase();
    return db.products.find(product => product.id === id);
  }

  // Add new product
  static async addProduct(productData) {
    const db = await readDatabase();
    const newProduct = {
      id: generateId(),
      ...productData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.products.push(newProduct);
    await writeDatabase(db);
    return newProduct;
  }

  // Update product
  static async updateProduct(id, updates) {
    const db = await readDatabase();
    const productIndex = db.products.findIndex(product => product.id === id);
    
    if (productIndex === -1) {
      throw new Error('Product not found');
    }

    db.products[productIndex] = {
      ...db.products[productIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    await writeDatabase(db);
    return db.products[productIndex];
  }

  // Delete product
  static async deleteProduct(id) {
    const db = await readDatabase();
    const productIndex = db.products.findIndex(product => product.id === id);
    
    if (productIndex === -1) {
      throw new Error('Product not found');
    }

    const deletedProduct = db.products.splice(productIndex, 1)[0];
    await writeDatabase(db);
    return deletedProduct;
  }

  // Search products
  static async searchProducts(query) {
    const db = await readDatabase();
    const searchTerm = query.toLowerCase();
    
    return db.products.filter(product => 
      product.name?.toLowerCase().includes(searchTerm) ||
      product.description?.toLowerCase().includes(searchTerm) ||
      product.type?.toLowerCase().includes(searchTerm)
    );
  }

  // Get products by type
  static async getProductsByType(type) {
    const db = await readDatabase();
    return db.products.filter(product => product.type === type);
  }
}

export default ProductDatabase;