import { Text, View } from 'react-native';
import { Route, Switch, Redirect, Router, } from 'react-router-native';
import Main from './src/pages/Main/Main';
import NewProduct from './src/pages/NewProduct/NewProduct';
import * as SQLite from 'expo-sqlite';
import Products from './src/pages/Products/Products';
import BottomNavBar from './src/components/BottomNavBar/BottomNavBar';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Constants from 'expo-constants';
import ProductsEditor from './src/pages/ProductsEditor/ProductsEditor';
import NewOrder from './src/pages/NewOrder/NewOrder';
import OrderEditor from './src/pages/OrderEditor/OrderEditor';


const Tabs = createBottomTabNavigator();





export default function App() {

  const db = SQLite.openDatabase("ordersQuotator.db")
  db.transaction(tx => {
    // creates product table
    tx.executeSql(
      `
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
            
      `
    )},
    (err) => console.log(err),
    (result) => console.log("Tables created")
  )
  db.transaction(tx => {
    tx.executeSql(`

     CREATE TABLE IF NOT EXISTS products_orders (
       id INTEGER PRIMARY KEY AUTOINCREMENT, 
       id_product INTEGER,
       id_order INTEGER,
       amount INTEGER,
       FOREIGN KEY(id_product) REFERENCES products(id) ON DELETE CASCADE,
       FOREIGN KEY(id_order) REFERENCES orders(id) ON DELETE CASCADE
     );
    `,[],
    (_, { rows }) => {
      console.log(" Tables created")
    },
    (_, error) => {
      console.log("Error creating tables", error)
    }
  )
  })
  // for all the tables, print the name and it's rows
  db.transaction(tx => {
    tx.executeSql("SELECT name FROM sqlite_master WHERE type='table';", [],
    (_, { rows }) => {
      for (let i = 0; i < rows.length; i++) {
        const table = rows.item(i).name;
        tx.executeSql(`SELECT * FROM ${table};`, [],
        (_, { rows }) => {
          console.log(`Table ${table}`, rows._array);
        },
        (_, error) => {
          console.log(`Error loading table ${table}`, error);
        }
        )
      }
    },
    (_, error) => {
      console.log("Error loading tables", error);
    }
    )
  })
  console.log("-------------------------------------------------------------------");

  

  return (
    <View style={{flex:1,marginTop: Constants.statusBarHeight}}>
      <NavigationContainer>
        <Tabs.Navigator
          initialRouteName='Main'
          tabBar={props => <BottomNavBar {...props}/>}
        >
          <Tabs.Screen name="Main" options={{headerShown: false}}>
            {props => <Main {...props} db={db} />}
          </Tabs.Screen>
          <Tabs.Screen name="Products" options={{headerShown: false}} >
            {props => <Products {...props} db={db} />}
          </Tabs.Screen>
          <Tabs.Screen name="NewProduct" options={{headerShown: false}} >
            {props => <NewProduct {...props} db={db} />}
          </Tabs.Screen>
          <Tabs.Screen name="ProductsEditor" options={{headerShown: false}} >
            {props => <ProductsEditor {...props} db={db} />}
          </Tabs.Screen>
          <Tabs.Screen name="NewOrder" options={{headerShown: false}} >
            {props => <NewOrder {...props} db={db} />}
          </Tabs.Screen>
          <Tabs.Screen name="OrderEditor" options={{headerShown: false}} >
            {props => <OrderEditor {...props} db={db} />}
          </Tabs.Screen>
        </Tabs.Navigator>
      </NavigationContainer>
    </View>
  );
}