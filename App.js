import { Text, View } from 'react-native';
import { Route, Switch, Redirect, Router, } from 'react-router-native';
import Main from './src/pages/Main/Main';
import * as SQLite from 'expo-sqlite';
import Products from './src/pages/Products/Products';
import BottomNavBar from './src/components/BottomNavBar/BottomNavBar';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Tabs = createBottomTabNavigator();

export default function App() {
  return (
    <View style={{flex:1}}>
      <NavigationContainer>
        <Tabs.Navigator
          initialRouteName='Main'
          tabBar={props => <BottomNavBar {...props}/>}
        >
          <Tabs.Screen name="Main" component={Main} options={{headerShown: false}} />
          <Tabs.Screen name="Products" component={Products} options={{headerShown: false}} />
        </Tabs.Navigator>
      </NavigationContainer>
    </View>
  );
}

export const db = SQLite.openDatabase("ordersQuotator.db")

db.transaction(tx => {
  // creates product table
  tx.executeSql(
    `
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      name TEXT,
      unit TEXT,
      price REAL,
      );
    `
  );
  // creates a product_order table
  tx.executeSql(
    `
    CREATE TABLE IF NOT EXISTS products_orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      FOREIGN KEY(id_product) REFERENCES product(id),
      amount INTEGER,
      );
    `
  );
  // creates order table
  tx.executeSql(
    `
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      name TEXT);
    `
  );
  // creates a order_products_orders table
  tx.executeSql(
    `
    CREATE TABLE IF NOT EXISTS orders_products_orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      FOREIGN KEY(id_order) REFERENCES order(id));
      FOREIGN KEY(id_product) REFERENCES product(id));
      );
    `
  );}
);

