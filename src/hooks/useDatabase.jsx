// useDatabase.js

import { useState, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';

export const useDatabase = () => {
  const [db, setDb] = useState(null);

  useEffect(() => {
    initDatabase();
  }, []);

  const initDatabase = async () => {
    try {
      const database = await SQLite.openDatabaseAsync("ordersQuotator.db");
      await createTables(database);
      setDb(database);
    } catch (error) {
      console.error("Error initializing database:", error);
    }
  };

  const createTables = async (database) => {
    try {
      await database.execAsync(`
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
      console.log("Tables created successfully");
    } catch (error) {
      console.error("Error creating tables:", error);
      throw error;
    }
  };

  const getAllProducts = async () => {
    if (!db) throw new Error("Database not initialized");
    return await db.getAllAsync("SELECT * FROM products");
  };

  const addProduct = async (name, unit, price) => {
    if (!db) throw new Error("Database not initialized");
    const result = await db.runAsync(
      "INSERT INTO products (name, unit, price) VALUES (?, ?, ?)",
      [name, unit, price]
    );
    return result.lastInsertRowId;
  };

  const getAllOrders = async () => {
    if (!db) throw new Error("Database not initialized");
    return await db.getAllAsync("SELECT * FROM orders");
  };

  const addOrder = async (name) => {
    if (!db) throw new Error("Database not initialized");
    const result = await db.runAsync(
      "INSERT INTO orders (name) VALUES (?)",
      [name]
    );
    return result.lastInsertRowId;
  };

  const addProductToOrder = async (productId, orderId, amount) => {
    if (!db) throw new Error("Database not initialized");
    const result = await db.runAsync(
      "INSERT INTO products_orders (id_product, id_order, amount) VALUES (?, ?, ?)",
      [productId, orderId, amount]
    );
    return result.lastInsertRowId;
  };

  const deleteOrder = async (orderId) => {
    if (!db) throw new Error("Database not initialized");
    await db.runAsync("DELETE FROM orders WHERE id = ?", [orderId]);
  };

  const updateProduct = async (id, name, unit, price) => {
    if (!db) throw new Error("Database not initialized");
    await db.runAsync(
      "UPDATE products SET name = ?, unit = ?, price = ? WHERE id = ?",
      [name, unit, price, id]
    );
  };

  const getProductById = async (id) => {
    if (!db) throw new Error("Database not initialized");
    return await db.getFirstAsync("SELECT * FROM products WHERE id = ?", [id]);
  };

  const getProductsOrders = async (orderId) => {
    const result = await executeSql(`SELECT * FROM products_orders WHERE id_order = ?;`, [orderId]);
    return result.rows._array;
  };

  const getProducts = async () => {
    const result = await executeSql(`SELECT * FROM products;`);
    return result.rows._array;
  };

  return {
    db,
    getAllProducts,
    addProduct,
    getAllOrders,
    addOrder,
    addProductToOrder,
    deleteOrder,
    updateProduct,
    getProductById,
    getProductsOrders,
    getProducts,
  };
};