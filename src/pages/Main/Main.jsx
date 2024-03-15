import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import OrderComponent from '../../components/OrderComponent/OrderComponent';
import MainStyleSheet from './MainStyleSheet';
import data from '../../mocks/ordersData.json';
import NewButton from '../../components/OrderComponent/NewButton/NewButton';
import BottomNavBar from '../../components/BottomNavBar/BottomNavBar';

export default function Main() {
  const [orders, setOrders] = useState(data);

  function onAddPressed() {
    console.log('Add button pressed');
    // delete last order
    setOrders(
      orders.slice(0, -1)
    )
  }

  return (
    <View style={MainStyleSheet.container}>
      <View style={MainStyleSheet.infoContainer}>
        <Text style={MainStyleSheet.title}>Orders</Text>
        <View style={MainStyleSheet.separator} />
        <FlatList
          data={orders}
          renderItem={({ item }) => <OrderComponent title={item.title} price={item.price} products={item.products} />}
          keyExtractor={(_,i) => i}
        />
      </View>
      <BottomNavBar />
      <NewButton onPress={onAddPressed} />
    </View>
  );
};





