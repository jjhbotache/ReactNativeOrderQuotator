import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import OrderComponent from '../../components/OrderComponent/OrderComponent';
import MainStyleSheet from './MainStyleSheet';
import data from '../../mocks/ordersData.json';
import NewButton from '../../components/NewButton/NewButton';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

export default function Main({db}) {
  const [orders, setOrders] = useState(data);
  const {navigate} = useNavigation();
  
  function onCreateOrder() {
   navigate('NewOrder');
  }

  function sync_db_and_state() {
    db.transaction(tx => {
      tx.executeSql("SELECT * FROM orders",[], 
        (_, { rows: { _array } }) => {
          console.log(_array);
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


  return (
    <View style={MainStyleSheet.container}>
      <View style={MainStyleSheet.infoContainer}>
        <Text style={MainStyleSheet.title}>Orders</Text>
        <View style={MainStyleSheet.separator} />
        <FlatList
          data={orders}
          renderItem={({ item }) => <OrderComponent title={item.name} price={0} products={0} />}
          keyExtractor={(_,i) => i}
        />
      </View>
      <NewButton onPress={onCreateOrder} />
    </View>
  );
};





