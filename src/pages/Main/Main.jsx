import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import OrderComponent from '../../components/OrderComponent/OrderComponent';
import MainStyleSheet from './MainStyleSheet';
import data from '../../mocks/ordersData.json';
import NewButton from '../../components/NewButton/NewButton';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Divider from '../../components/Divider/Divider';
import { useDatabase } from '../../hooks/useDatabase';

export default function Main() {
  const [orders, setOrders] = useState([]);
  const { navigate } = useNavigation();
  const { getAllOrders, deleteOrder } = useDatabase();

  const syncDbAndState = useCallback(async () => {
    try {
      const fetchedOrders = await getAllOrders();
      setOrders(fetchedOrders);
    } catch (error) {
      console.log("Error fetching orders:", error);
    }
  }, [getAllOrders]);

  useFocusEffect(
    useCallback(() => {
      syncDbAndState();
    }, [syncDbAndState])
  );

  const onCreateOrder = () => {
    navigate('NewOrder');
  };

  const onDeleteOrder = async (order) => {
    try {
      await deleteOrder(order.id);
      await syncDbAndState();
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const onEditOrder = (order) => {
    navigate('OrderEditor', { order });
  };

  return (
    <View style={MainStyleSheet.container}>
      <View style={MainStyleSheet.infoContainer}>
        <Text style={MainStyleSheet.title}>Orders</Text>
        <Divider />
        <FlatList
          data={orders}
          renderItem={({ item: order }) => (
            <OrderComponent 
              order={order} 
              onDelete={onDeleteOrder} 
              onEdit={onEditOrder} 
            />
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
      <Divider />
      <NewButton onPress={onCreateOrder} />
    </View>
  );
}




