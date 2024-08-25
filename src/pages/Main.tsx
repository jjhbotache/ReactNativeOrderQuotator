import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View, Modal } from "react-native";
import useDatabase from "../hooks/useDatabase";
import { Text, useTheme, Button, ListItem, Input } from "@rneui/themed";
import FloatingBtn from "../components/global/FloatingBtn";
import { ScreenWidth } from "react-native-elements/dist/helpers";
import { Order, Product, ProductOrder } from "../interfaces/databaseInterfaces";
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from "../../App";
import { StackNavigationProp } from "@react-navigation/stack";

export default function Main() {
  const { theme } = useTheme();
  const { manageOrder, getOrders, manageProductOrder, getProductOrders, getProducts } = useDatabase();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order>({ name: "" });
  const [productOrders, setProductOrders] = useState<ProductOrder[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  type OrderEditorProps = StackNavigationProp<RootStackParamList, 'OrderEditor'>;
  const navigation = useNavigation<OrderEditorProps>();

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const fetchOrders = async () => {
    try {
      const fetchedOrders = await getOrders();
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

  const fetchProductOrders = async (orderId: number) => {
    try {
      const fetchedProductOrders = await getProductOrders(orderId);
      setProductOrders(fetchedProductOrders);
    } catch (error) {
      console.log("Error fetching product orders:", error);
    }
  };

  const handleAddProductOrder = () => {
    setProductOrders([...productOrders, { id: Date.now(), id_product: 0, id_order: currentOrder.id!, amount: 0 }]);
  };

  const handleRemoveProductOrder = (id: number) => {
    setProductOrders(productOrders.filter(po => po.id !== id));
  };

  const handleSaveOrder = async () => {
    try {
      if (isEditing) {
        await manageOrder(currentOrder, "update");
      } else {
        await manageOrder(currentOrder, "create");
      }
      for (const po of productOrders) {
        await manageProductOrder(po, "create");
      }
      fetchOrders();
      setModalVisible(false);
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

  const openModalForNewOrder = () => {
    setCurrentOrder({ name: "" });
    setProductOrders([]);
    setIsEditing(false);
    setModalVisible(true);
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
              leftWidth={ScreenWidth / 4}
              rightWidth={ScreenWidth / 4}
              leftContent={() => (
                <Button
                  title="Delete"
                  onPress={() => handleDeleteOrder(order)}
                  icon={{ name: 'delete', color: 'white' }}
                  buttonStyle={{ minHeight: '100%', backgroundColor: 'red' }}
                />
              )}
              rightContent={() => (
                <Button
                  title="Edit"
                  onPress={() => openModalForEditOrder(order)}
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text h4>{isEditing ? "Edit Order" : "Add Order"}</Text>
            <Input
              placeholder="Order Name"
              value={currentOrder.name}
              onChangeText={(text) => setCurrentOrder({ ...currentOrder, name: text })}
            />
            <Text h4>Product Orders</Text>
            {productOrders.map((po, index) => (
              <View key={po.id} style={styles.productOrderContainer}>
                <Input
                  placeholder="Product ID"
                  value={po.id_product.toString()}
                  onChangeText={(text) => {
                    const updatedProductOrders = [...productOrders];
                    updatedProductOrders[index].id_product = parseInt(text);
                    setProductOrders(updatedProductOrders);
                  }}
                  keyboardType="numeric"
                />
                <Input
                  placeholder="Amount"
                  value={po.amount.toString()}
                  onChangeText={(text) => {
                    const updatedProductOrders = [...productOrders];
                    updatedProductOrders[index].amount = parseInt(text);
                    setProductOrders(updatedProductOrders);
                  }}
                  keyboardType="numeric"
                />
                <Button title="Remove" onPress={() => handleRemoveProductOrder(po.id)} />
              </View>
            ))}
            <Button title="Add Product Order" onPress={handleAddProductOrder} />
            <Button title={isEditing ? "Update Order" : "Add Order"} onPress={handleSaveOrder} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </ScrollView>
        </View>
      </Modal>

      <FloatingBtn onPress={openModalForNewOrder} />
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
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)", // Darker background with some transparency
    padding: 20,
    margin: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
  productOrderContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 5,
  },
});