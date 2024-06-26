import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import OrderComponent from '../../components/OrderComponent/OrderComponent';
import MainStyleSheet from './MainStyleSheet';
import data from '../../mocks/ordersData.json';
import NewButton from '../../components/NewButton/NewButton';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Divider from '../../components/Divider/Divider';

export default function Main({db}) {
  const [orders, setOrders] = useState(data);
  const {navigate} = useNavigation();
  
  function onCreateOrder() {
   navigate('NewOrder');
  }

  function sync_db_and_state() {
    console.log("sync_db_and_state");
    db.transaction(tx => {
      tx.executeSql("SELECT * FROM orders",[], 
        (_, { rows: { _array } }) => {
          setOrders(_array);
        }
      )
    });
  
  }

  useFocusEffect(
    useCallback(() => {
      sync_db_and_state();
    }, [])
  );
  function onDeleteOrder(order) {
    db.transaction(tx => {
      tx.executeSql("DELETE FROM orders WHERE id = ?",[order.id], 
        (_, { rows: { _array } }) => {
          sync_db_and_state();
        },
      )
    });
  }

  function onEditOrder(order) {
    navigate('OrderEditor', {order});
    // console.log("Edit order", order);
  }


  return (
    <View style={MainStyleSheet.container}>
      <View style={MainStyleSheet.infoContainer}>
        <Text style={MainStyleSheet.title}>Orders</Text>
        <Divider />
        <FlatList
          data={orders}
          renderItem={({ item:order }) => <OrderComponent order={order} onDelete={onDeleteOrder} onEdit={onEditOrder} />}
          keyExtractor={(_,i) => i}
        />
      </View>
      <Divider />
      <NewButton onPress={onCreateOrder} />
    </View>
  );
};





