import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import useDatabase from "../hooks/useDatabase";
import { Text, useTheme, Input, Button, ListItem } from "@rneui/themed";
import FloatingBtn from "../components/global/floatingBtn";


export default function Main() {
  const { theme } = useTheme();
  const { manageOrder, getOrders } = useDatabase();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const fetchedOrders = await getOrders();
      setOrders(fetchedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const createOrder = async () => {
    try {
      const newOrder: Order = { name: `Order ${Date.now()}` };
      await manageOrder("create", newOrder);
      fetchOrders();
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  const deleteOrder = async (id: number) => {
    try {
      await manageOrder("delete", { id, name: '' });
      fetchOrders();
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const editOrder = async (id: number, newName: string) => {
    try {
      const updatedOrder: Order = { id, name: newName };
      await manageOrder("update", updatedOrder);
      fetchOrders();
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text h1>Orders</Text>

      <ScrollView style={styles.ordersContainerView}>
        {orders.map((order) => (
          <ListItem.Swipeable
            key={order.id}
            leftContent={() => (
              <Button
                title="Delete"
                onPress={() => order.id && deleteOrder(order.id)}
                icon={{ name: 'delete', color: 'white' }}
                buttonStyle={{ minHeight: '100%', backgroundColor: 'red' }}
              />
            )}
            rightContent={() => (
              <Button
                title="Edit"
                onPress={() => {
                  // You might want to implement a modal or in-place editing here
                  const newName = prompt("Enter new name for the order", order.name);
                  if (newName && order.id) {
                    editOrder(order.id, newName);
                  }
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
    flex: 0.9
  },
});