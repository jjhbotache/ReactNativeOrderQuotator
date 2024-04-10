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
      
      CREATE TABLE IF NOT EXISTS products_orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        FOREIGN KEY(id_product) REFERENCES product(id),
        amount INTEGER
      );

      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        name TEXT
      );
        
      CREATE TABLE IF NOT EXISTS orders_products_orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        FOREIGN KEY(id_order) REFERENCES order(id)),
        FOREIGN KEY(id_product) REFERENCES product(id))
      );
      `
    );}
  );

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
        </Tabs.Navigator>
      </NavigationContainer>
    </View>
  );
}