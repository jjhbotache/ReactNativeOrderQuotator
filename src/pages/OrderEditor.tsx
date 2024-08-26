import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import {  Button, Overlay, ListItem } from 'react-native-elements';
import useDatabase from "../hooks/useDatabase";
import FloatingBtn from '../components/global/FloatingBtn';
import { Order, ProductOrder, Product } from '../interfaces/databaseInterfaces';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import { useTheme, Text, Input } from '@rneui/themed';

const SingleOrderEditor = () => {
  const route = useRoute();
  const { orderId } = route.params as { orderId: number | null };
  const [order, setOrder] = useState<Order | null>(null);
  const [productOrders, setProductOrders] = useState<ProductOrder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [productOrderModalVisible, setProductOrderModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductOrder, setCurrentProductOrder] = useState<ProductOrder | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [isProductSelectVisible, setIsProductSelectVisible] = useState(false);
  const { getOrders, manageOrder, getProductOrders, manageProductOrder, getProducts } = useDatabase();
  const { theme } = useTheme();

  useFocusEffect(
    useCallback(() => {
      if (orderId) {
        fetchOrder(orderId);
        setIsEditing(true);
      } else {
        setOrder({ name: "" }); // Initialize a new order
        setIsEditing(false);
      }
      fetchProducts();
    }, [orderId])
  );

  const fetchOrder = async (id: number) => {
    const fetchedOrders = await getOrders();
    const selectedOrder = fetchedOrders.find(order => order.id === id);
    if (selectedOrder) {
      setOrder(selectedOrder);
      fetchProductOrders(selectedOrder.id!);
    }
  };

  const fetchProductOrders = async (orderId: number) => {
    const fetchedProductOrders = await getProductOrders(orderId);
    setProductOrders(fetchedProductOrders);
  };

  const fetchProducts = async () => {
    const fetchedProducts = await getProducts();
    setProducts(fetchedProducts);
  };

  const handleSaveOrder = async () => {
    if (order) {
      await manageOrder(order, isEditing ? "update" : "create");
      fetchOrder(order.id!);
      setModalVisible(false);
    }
  };

  const handleDeleteOrder = async () => {
    if (order) {
      await manageOrder(order, "delete");
      setOrder(null);
      setProductOrders([]);
      setModalVisible(false);
    }
  };

  const handleAddProductOrder = () => {
    setCurrentProductOrder({ id: Date.now(), id_product: 0, id_order: order!.id!, amount: 0 });
    setProductOrderModalVisible(true);
  };

  const handleSaveProductOrder = async () => {
    if (currentProductOrder && selectedProduct) {
      await manageProductOrder({ ...currentProductOrder, id_product: selectedProduct.id, amount }, "create");
      fetchProductOrders(order!.id!);
      setProductOrderModalVisible(false);
    }
  };

  const toggleProductSelectOverlay = () => {
    setIsProductSelectVisible(!isProductSelectVisible);
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    toggleProductSelectOverlay();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text h1>{isEditing ? "Edit Order" : "Create Order"}</Text>
      <ScrollView>
        {order && (
          <View style={styles.orderContainer}>
            <Text h1>{order.name}</Text>
            <Button title="Edit" onPress={() => { setIsEditing(true); setModalVisible(true); }} />
            <Button title="Delete" onPress={handleDeleteOrder} />
          </View>
        )}
        <Text h4>Product Orders</Text>
        {productOrders.map((po) => (
          <View key={po.id} style={styles.productOrderContainer}>
            <Text>Product ID: {po.id_product}</Text>
            <Text>Amount: {po.amount}</Text>
          </View>
        ))}
      </ScrollView>
      <FloatingBtn onPress={handleAddProductOrder} />
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
              value={order?.name || ''}
              onChangeText={(text) => setOrder({ ...order, name: text })}
            />
            <Button title={isEditing ? "Update Order" : "Add Order"} onPress={handleSaveOrder} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </ScrollView>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={productOrderModalVisible}
        onRequestClose={() => setProductOrderModalVisible(false)}
      >
        <View style={styles.modalView}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text h4>{currentProductOrder?.id ? "Edit Product Order" : "Add Product Order"}</Text>
            <Button
              title={selectedProduct ? `Selected: ${selectedProduct.name}` : 'Select a product'}
              onPress={toggleProductSelectOverlay}
            />
            <Overlay isVisible={isProductSelectVisible} onBackdropPress={toggleProductSelectOverlay} >
              <View  style={{backgroundColor:theme.colors.black, gap:20}}>
                {products.map((product, index) => (
                  <TouchableOpacity key={index} onPress={() => handleProductSelect(product)} style={{
                    paddingHorizontal: 15,
                    paddingVertical: 3,
                    backgroundColor: theme.colors.background,
                    borderBottomColor: theme.colors.white,
                    borderBottomWidth: 1,
                  }}>
                    <Text>{product.name}</Text>
                  </TouchableOpacity>
                ))}
              </View> 
            </Overlay>
            <Input
              placeholder="Amount"
              value={amount.toString()}
              onChangeText={(text) => setAmount(parseInt(text))}
              keyboardType="numeric"
            />
            <Button title="Save Product Order" onPress={handleSaveProductOrder} />
            <Button title="Cancel" onPress={() => setProductOrderModalVisible(false)} />
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  orderContainer: {
    marginBottom: 20,
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

export default SingleOrderEditor;