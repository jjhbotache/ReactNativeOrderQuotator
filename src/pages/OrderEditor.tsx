import React, { useState, useEffect } from 'react';
import { View, ScrollView, Modal, StyleSheet } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import useDatabase from "../hooks/useDatabase";
import FloatingBtn from '../components/global/FloatingBtn';
import { Order, ProductOrder } from '../interfaces/databaseInterfaces';
import { useRoute } from '@react-navigation/native';

const SingleOrderEditor = () => {
  const route = useRoute();
  const { orderId } = route.params as { orderId: number };
  const [order, setOrder] = useState<Order | null>(null);
  const [productOrders, setProductOrders] = useState<ProductOrder[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { getOrders, manageOrder, getProductOrders, manageProductOrder } = useDatabase();

  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId);
    }
  }, [orderId]);

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
    // Add your implementation here
    console.log('Add product order');
    
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {order && (
          <View style={styles.orderContainer}>
            <Text>{order.name}</Text>
            <Button title="Edit" onPress={() => { setIsEditing(true); setModalVisible(true); }} />
            <Button title="Delete" onPress={handleDeleteOrder} />
          </View>
        )}
      </ScrollView>
      <FloatingBtn onPress={() => { setOrder({ id: Date.now(), name: '' }); setProductOrders([]); setIsEditing(false); setModalVisible(true); }} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text h4>{isEditing ? "Edit Order" : "Add Order"}</Text>
          <Input
            placeholder="Order Name"
            value={order?.name || ''}
            onChangeText={(text) => setOrder({ ...order, name: text })}
          />
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
              <Button title="Remove" onPress={handleDeleteOrder} />
            </View>
          ))}
          <Button title="Add Product Order" onPress={handleAddProductOrder} />
          <Button title={isEditing ? "Update Order" : "Add Order"} onPress={handleSaveOrder} />
          <Button title="Cancel" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  orderContainer: {
    marginBottom: 20,
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  productOrderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
});

export default SingleOrderEditor;