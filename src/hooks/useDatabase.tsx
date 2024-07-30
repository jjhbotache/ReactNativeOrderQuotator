import { useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';

export default function useDatabase() {
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);

  useEffect(() => {
    const initializeDatabase = async () => {
      const database = await SQLite.openDatabaseAsync('quotations.db');
      setDb(database);
      // await resetDatabase();   only for debugging
      await database.execAsync(`
        
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT, 
          name TEXT,
          unit TEXT,
          price REAL
        );
        CREATE TABLE IF NOT EXISTS orders (
          id INTEGER PRIMARY KEY AUTOINCREMENT, 
          name TEXT
        );
        CREATE TABLE IF NOT EXISTS products_orders (
          id INTEGER PRIMARY KEY AUTOINCREMENT, 
          id_product INTEGER,
          id_order INTEGER,
          amount INTEGER,
          FOREIGN KEY(id_product) REFERENCES products(id) ON DELETE CASCADE,
          FOREIGN KEY(id_order) REFERENCES orders(id) ON DELETE CASCADE
        );
      `);
      console.log("Database created");
      
    };
    initializeDatabase();
  }, []);

  async function resetDatabase() {
    if (db) {
      await db.execAsync(`DROP TABLE IF EXISTS products`);
      await db.execAsync(`DROP TABLE IF EXISTS orders`);
      await db.execAsync(`DROP TABLE IF EXISTS products_orders`);
      console.log("Database reset");
    }
  }



  
  
  type Action = "create" | "update" | "delete" | "read";

  async function manageProduct(action: Action, product: Product) {
    if (db) {
      switch (action) {
        case "create":
          return await db.runAsync(
            'INSERT INTO products (name, unit, price) VALUES (?, ?, ?)',
            [product.name, product.unit, product.price]
          );
  
        case "update":
          if (!product.id) throw new Error("Product ID is required for update action");
          return await db.runAsync(
            'UPDATE products SET name = ?, unit = ?, price = ? WHERE id = ?',
            [product.name, product.unit, product.price, product.id]
          );
  
        case "delete":
          if (!product.id) throw new Error("Product ID is required for delete action");
          return await db.runAsync(
            'DELETE FROM products WHERE id = ?',
            [product.id]
          );
  
        case "read":
          if (!product.id) throw new Error("Product ID is required for read action");
          const result = await db.getFirstAsync<Product>(
            'SELECT * FROM products WHERE id = ?',
            [product.id]
          );
          return result;
  
        default:
          throw new Error("Invalid action");
      }
    } else {
      throw new Error("Database not initialized");
    }
  }
  async function getProducts(): Promise<Product[]> {
    if (db) {
      return await db.getAllAsync<Product>('SELECT * FROM products');
    } else {
      throw new Error("Database not initialized");
    }
  }



  async function manageOrder(action: Action, order: Order) {
    if (db) {
      switch (action) {
        case "create":
          return await db.runAsync(
            'INSERT INTO orders (name) VALUES (?)',
            [order.name]
          );

        case "read":
          if (order.id) {
            return await db.getFirstAsync<Order>(
              'SELECT * FROM orders WHERE id = ?',
              [order.id]
            );
          } else {
            return await db.getAllAsync<Order>('SELECT * FROM orders');
          }

        case "update":
          if (!order.id) throw new Error("Order ID is required for update action");
          return await db.runAsync(
            'UPDATE orders SET name = ? WHERE id = ?',
            [order.name, order.id]
          );

        case "delete":
          if (!order.id) throw new Error("Order ID is required for delete action");
          return await db.runAsync(
            'DELETE FROM orders WHERE id = ?',
            [order.id]
          );

        default:
          throw new Error("Invalid action");
      }
    } else {
      throw new Error("Database not initialized");
    }
  }
  async function getOrders(): Promise<Order[]> {
    if (db) {
      return await db.getAllAsync<Order>('SELECT * FROM orders');
    } else {
      throw new Error("Database not initialized");
    }
  }

  async function manageProductOrder(action: Action, productOrder: ProductOrder) {
    if (db) {
      switch (action) {
        case "create":
          return await db.runAsync(
            'INSERT INTO products_orders (id_product, id_order, amount) VALUES (?, ?, ?)',
            [productOrder.id_product, productOrder.id_order, productOrder.amount]
          );

        case "read":
          if (productOrder.id) {
            return await db.getFirstAsync<ProductOrder>(
              'SELECT * FROM products_orders WHERE id = ?',
              [productOrder.id]
            );
          } else if (productOrder.id_order) {
            return await db.getAllAsync<ProductOrder>(
              'SELECT * FROM products_orders WHERE id_order = ?',
              [productOrder.id_order]
            );
          } else {
            throw new Error("Either id or id_order is required for read action");
          }

        case "update":
          if (!productOrder.id) throw new Error("ProductOrder ID is required for update action");
          return await db.runAsync(
            'UPDATE products_orders SET id_product = ?, id_order = ?, amount = ? WHERE id = ?',
            [productOrder.id_product, productOrder.id_order, productOrder.amount, productOrder.id]
          );

        case "delete":
          if (!productOrder.id) throw new Error("ProductOrder ID is required for delete action");
          return await db.runAsync(
            'DELETE FROM products_orders WHERE id = ?',
            [productOrder.id]
          );

        default:
          throw new Error("Invalid action");
      }
    } else {
      throw new Error("Database not initialized");
    }
  }
  async function getProductOrders(): Promise<ProductOrder[]> {
    if (db) {
      return await db.getAllAsync<ProductOrder>('SELECT * FROM products_orders');
    } else {
      throw new Error("Database not initialized");
    }
  }
  

  return {
    db,
    manageProduct,
    manageOrder,
    manageProductOrder,
    getProducts,
    getOrders,
    getProductOrders,
    resetDatabase,
  };
}
