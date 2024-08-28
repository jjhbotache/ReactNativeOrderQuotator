import React, { useCallback, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import useDatabase from "../hooks/useDatabase";
import { Text, useTheme, Button, ListItem } from "@rneui/themed";
import FloatingBtn from "../components/global/FloatingBtn";
import { ScreenWidth } from "react-native-elements/dist/helpers";
import { Order, Product, ProductOrder } from "../interfaces/databaseInterfaces";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from "../../App";
import { StackNavigationProp } from "@react-navigation/stack";

export default function Main() {
  const { theme } = useTheme();
  const { manageOrder, getOrders, getProducts, clearDatabase } = useDatabase();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  type OrderEditorProps = StackNavigationProp<RootStackParamList, 'OrderEditor'>;
  const navigation = useNavigation<OrderEditorProps>();

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
      fetchProducts();
    }, [])
  );

  const fetchOrders = async () => {
    try {
      console.log("Fetching orders...");
      
      const fetchedOrders = await getOrders();
      console.log("Orders fetched:", fetchedOrders);
      setOrders(fetchedOrders);
      
    } catch (error) {
      console.log("Error fetching orders:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      console.log("Error fetching products:", error);
    }
  };

  const createOrder = async () => {
    try {
      const newOrder: Order = { name: "" }; // Define the new order
      await manageOrder(newOrder, "create");
      fetchOrders();
      navigation.navigate('OrderEditor', { orderId: null });
    } catch (error) {
      console.log("Error saving order:", error);
    }
  };

  const handleDeleteOrder = async (order: Order) => {
    try {
      await manageOrder(order, "delete");
      fetchOrders(); // Refresh the orders list after deletion
    } catch (error) {
      console.log("Error deleting order:", error);
    }
  };

  const openModalForEditOrder = (order: Order) => {
    navigation.navigate('OrderEditor', { orderId: order.id });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text h1>Orders</Text>

      <ScrollView style={styles.ordersContainerView}>
        <View style={styles.listContainer}>
          {orders.map((order) => (
            <ListItem.Swipeable
              key={order.id}
              containerStyle={styles.listItem}

              leftWidth={ScreenWidth / 5}
              rightWidth={ScreenWidth / 5}
              leftContent={(reset) => (
                <Button
                  title="Delete"
                  onPress={() => {
                    handleDeleteOrder(order);
                    reset(); // Close the swipeable list item after deletion
                  }}
                  icon={{ name: 'delete', color: 'white' }}
                  buttonStyle={{ minHeight: '100%', backgroundColor: 'red' }}
                />
              )}
              rightContent={(reset) => (
                <Button
                  title="Edit"
                  onPress={() => {
                    openModalForEditOrder(order);
                    reset(); // Close the swipeable list item after pressing the edit button
                  }}
                  icon={{ name: 'edit', color: 'white' }}
                  buttonStyle={{ minHeight: '100%', backgroundColor: 'blue' }}
                />
              )}
            >
              <ListItem.Content>
                <ListItem.Title>{order.name}</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem.Swipeable>
          ))}
        </View>
      </ScrollView>

      <FloatingBtn onPress={createOrder} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    alignItems: "center",
    justifyContent: "space-evenly"
  },
  ordersContainerView: {
    width: "100%",
    flex: 0.9,
  },
  listContainer: {
    gap: 5, // Separate list items vertically by 5 units
  },
  listItem: {
    backgroundColor: "#31063c", // Custom background color for list items
  },
});