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
import { useEffect } from 'react';
import { useDatabase } from './src/hooks/useDatabase';


const Tabs = createBottomTabNavigator();





export default function App() {
  const {db} = useDatabase();

  useEffect(() => {
  }, []);

  return (
    <View style={{flex:1, marginTop: Constants.statusBarHeight}}>
      <NavigationContainer>
        <Tabs.Navigator
          initialRouteName='Main'
          tabBar={props => <BottomNavBar {...props}/>}
        >
          <Tabs.Screen name="Main" options={{headerShown: false}}>
            {props => <Main {...props} />}
          </Tabs.Screen>
          <Tabs.Screen name="Products" options={{headerShown: false}} >
            {props => <Products {...props} />}
          </Tabs.Screen>
          <Tabs.Screen name="NewProduct" options={{headerShown: false}} >
            {props => <NewProduct {...props} />}
          </Tabs.Screen>
          <Tabs.Screen name="ProductsEditor" options={{headerShown: false}} >
            {props => <ProductsEditor {...props} />}
          </Tabs.Screen>
          <Tabs.Screen name="NewOrder" options={{headerShown: false}} >
            {props => <NewOrder {...props} />}
          </Tabs.Screen>
          <Tabs.Screen name="OrderEditor" options={{headerShown: false}} >
            {props => <OrderEditor {...props} />}
          </Tabs.Screen>
        </Tabs.Navigator>
      </NavigationContainer>
    </View>
  );
}