import { useEffect, useRef } from "react";
import * as SQLite from "expo-sqlite";


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
      `);
    };

    initializeDatabase();
  }, []);

  const manageOrder = async (order: Order, action: string = "create") => {
    const db = dbRef.current;
    if (!db) throw new Error("Database not initialized");

    if (action === "create") {
      await db.runAsync("INSERT INTO orders (name) VALUES (?)", [order.name]);
    } else if (action === "update") {
      await db.runAsync("UPDATE orders SET name = ? WHERE id = ?", [order.name, order.id]);
    } else if (action === "delete") {
      await db.runAsync("DELETE FROM orders WHERE id = ?", [order.id]);
    }
  };

  const getOrders = async () => {
    const db = dbRef.current;
    if (!db) throw new Error("Database not initialized");

    const rows = await db.getAllAsync("SELECT * FROM orders");
    return rows as Order[];
  };

  const manageProductOrder = async (productOrder: ProductOrder,action: string = "create") => {
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
    // wait for the database to be initialized



    if (!db) throw new Error("Database not initialized");

    const rows = await db.getAllAsync("SELECT * FROM products");
    return rows as Product[];
  };

  return { manageOrder, getOrders, manageProductOrder, getProductOrders, getProducts };
}