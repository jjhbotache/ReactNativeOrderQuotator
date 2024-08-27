import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, StyleSheet, useWindowDimensions} from 'react-native';
import {  Overlay, ListItem } from 'react-native-elements';
import useDatabase from "../hooks/useDatabase";
import FloatingBtn from '../components/global/FloatingBtn';
import { Order, ProductOrder, Product } from '../interfaces/databaseInterfaces';
import { useRoute, useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTheme, Text, Input, Button } from '@rneui/themed';

const SingleOrderEditor = () => {
  
  const [order, setOrder] = useState<Order>({
    id: null,
    name: "",
  });


  const [products, setProducts] = useState<Product[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [productOrderModalVisible, setProductOrderModalVisible] = useState(false);

  const [productOrders, setProductOrders] = useState<ProductOrder[]>([]);

  const { getOrders, manageOrder, manageProductOrder, getProducts } = useDatabase();
  const { theme } = useTheme();
  const route = useRoute();
  const { orderId } = route.params as { orderId: number | null };
  const {navigate} = useNavigation();

  const creatingProductOrder = order?.id === null;
  

  useFocusEffect(
    useCallback(() => {
      if (creatingProductOrder) {
        fetchOrder(orderId);
      }
      fetchProducts();
    }, [orderId])
  );

  const fetchOrder = async (id: number) => {
    const [order] = await getOrders(id);
    console.log(order);
    
    setOrder(order);
  };
  const fetchProducts = async () => {
    const fetchedProducts = await getProducts();
    setProducts(fetchedProducts);
  };

  const handleDeleteOrder = async () => {
    if (creatingProductOrder !== true) {
      await manageOrder(order, "delete");
      setOrder(null);
      setProductOrders([]);
      setModalVisible(false);
    }
    navigate('Main'as never);
  };

  const saveOrder = async () => {
    
    if (order?.name === "") {
      alert("Please enter a name for the order");
      return;
    }
    if (creatingProductOrder) {
      await manageOrder(order, "create");
    } else {
      await manageOrder(order, "update");
    }
    navigate('Main' as never);
  }





  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text h1>{!creatingProductOrder ? "Edit Order" : "Create Order"}</Text>
      <ScrollView style={styles.orderContainer}>
        <View >
          <Input label="Name" value={order?.name} onChangeText={(text) => setOrder({ ...order, name: text })} />
        </View>
        <Text h4>Product Orders</Text>
        {productOrders.map((po) => (
          <View key={po.id} style={styles.productOrderContainer}>
            <Text>Product ID: {po.id_product}</Text>
            <Text>Amount: {po.amount}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.bottomButtonsView}>
        <Button title="Add Product Order" onPress={() => setProductOrderModalVisible(true)} />
        <Button title="Save Order" onPress={saveOrder}  />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    padding: 5,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  orderContainer: {
    marginBottom: 20,
    width: "80%",
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
  bottomButtonsView:{
    position: "absolute",
    bottom: 30,
    right: 30,
    flexDirection: "row",
    gap: 10,

  }
});

export default SingleOrderEditor;