import { useEffect, useRef } from "react";
import * as SQLite from "expo-sqlite";
import { Order, Product, ProductOrder, Setting } from "../interfaces/databaseInterfaces";

export default function useDatabase() {
  const dbRef = useRef<SQLite.SQLiteDatabase>(SQLite.openDatabaseSync("orders.db"));

  useEffect(() => {
    const initializeDatabase = async () => {
      const db = dbRef.current;

      await db.execAsync(`
        PRAGMA journal_mode = WAL;
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
        CREATE TABLE IF NOT EXISTS settings (
          setting TEXT PRIMARY KEY,
          value TEXT
        );
      `);
    };

    initializeDatabase();
  }, []);

  const manageOrder = async (order: Order, action: string = "create") => {
    const db = dbRef.current;
    if (!db) throw new Error("Database not initialized");

    if (action === "create") {
     const result  = await db.runAsync("INSERT INTO orders (name) VALUES (?)", [order.name]);
     return {
      id: result.lastInsertRowId,
      name: order.name,
      productOrders: [],
     };
    } else if (action === "update") {
      await db.runAsync("UPDATE orders SET name = ? WHERE id = ?", [order.name, order.id]);
    } else if (action === "delete") {
      await db.runAsync("DELETE FROM orders WHERE id = ?", [order.id]);
    }
  };

  const manageProduct = async (product: Product, action: string = "create") => {
    const db = dbRef.current;
    if (!db) throw new Error("Database not initialized");

    if (action === "create") {
      await db.runAsync("INSERT INTO products (name, unit, price) VALUES (?, ?, ?)", [product.name, product.unit, product.price]);
    } else if (action === "update") {
      await db.runAsync("UPDATE products SET name = ?, unit = ?, price = ? WHERE id = ?", [product.name, product.unit, product.price, product.id]);
    } else if (action === "delete") {
      await db.runAsync("DELETE FROM products WHERE id = ?", [product.id]);
    }
  };

  const getOrders = async (id?: number) => {
    const db = dbRef.current;
    if (!db) throw new Error("Database not initialized");

    if (id) {
      const rows = await db.getAllAsync(`
      SELECT *
      FROM orders
      WHERE orders.id = ?
      `, [id]);

      const row = rows[0] as any;
      const order: Order = {
        id: row.id,
        name: row.name,
        productOrders: await getProductOrders(row.id),
      };
      return [order];
      
    } else {
      const rows = await db.getAllAsync("SELECT * FROM orders");
      return rows as Order[];
    }
  };

  const manageProductOrder = async (productOrder: ProductOrder, action: string = "create") => {
    const db = dbRef.current;
    if (!db) throw new Error("Database not initialized");

    if (action === "create") {
      await db.runAsync(
        "INSERT INTO products_orders (id_product, id_order, amount) VALUES (?, ?, ?)",
        [productOrder.id_product, productOrder.id_order, productOrder.amount]
      );
    } else if (action === "update") {
      await db.runAsync(
        "UPDATE products_orders SET id_product = ?, amount = ? WHERE id = ?",
        [productOrder.id_product, productOrder.amount, productOrder.id]
      );
    } else if (action === "delete") {
      await db.runAsync("DELETE FROM products_orders WHERE id = ?", [productOrder.id]);
    }
  };

  const getProductOrders = async (orderId: number) => {
    const db = dbRef.current;
    if (!db) throw new Error("Database not initialized");

    const rows = await db.getAllAsync("SELECT * FROM products_orders WHERE id_order = ?", [orderId]);
    return rows as ProductOrder[];
  };

  const getProducts = async () => {
    const db = dbRef.current;
    if (!db) throw new Error("Database not initialized");
    const rows = await db.getAllAsync("SELECT * FROM products");
    return rows as Product[];
  };

  const getSettings = async () => {
    const db = dbRef.current;
    if (!db) throw new Error("Database not initialized");

    const rows = await db.getAllAsync("SELECT * FROM settings");
    return rows as Setting[];
  }

  const manageSetting = async (setting: Setting, action: string = "create") => {
    const db = dbRef.current;
    if (!db) throw new Error("Database not initialized");

    if (action === "create") {
      await db.runAsync("INSERT INTO settings (setting, value) VALUES (?, ?)", [setting.setting, setting.value]);
    } else if (action === "update") {
      await db.runAsync("UPDATE settings SET value = ? WHERE setting = ?", [setting.value, setting.setting]);
    } else if (action === "delete") {
      await db.runAsync("DELETE FROM settings WHERE setting = ?", [setting.setting]);
    }
  };

  // clear the database
  const clearDatabase = async () => {
    const db = dbRef.current;
    if (!db) throw new Error("Database not initialized");

    await db.execAsync(`
      DELETE FROM products_orders;
      DELETE FROM products;
      DELETE FROM orders;
      DELETE FROM settings;
    `);
  };

  return { manageOrder, getOrders, manageProductOrder, getProductOrders, getProducts, manageProduct, manageSetting, getSettings, clearDatabase };
}