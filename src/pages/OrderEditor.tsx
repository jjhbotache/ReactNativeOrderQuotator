import React, { useState, useCallback, useEffect } from 'react';
import { View, ScrollView, StyleSheet} from 'react-native';
import {  ListItem } from 'react-native-elements';
import useDatabase from "../hooks/useDatabase";
import { Order, ProductOrder, Product } from '../interfaces/databaseInterfaces';
import { useRoute, useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTheme, Text, Input, Button, Chip, Dialog, Icon} from '@rneui/themed';
import { toCurrency } from '../helpers/stringHelpers';
import Dropdown from '../components/global/Dropdown';

const SingleOrderEditor = () => {
  

  const { getOrders, manageOrder, manageProductOrder, getProducts } = useDatabase();
  const { theme } = useTheme();
  const route = useRoute();
  const { orderId } = route.params as { orderId: number | null };

  const [order, setOrder] = useState<Order>({
    id: orderId || null,
    name: "",
  });

  const [creatingProductOrder, setCreatingProductOrder] = useState<boolean>(orderId === null);
  const {navigate} = useNavigation();
  
  
  const [currentProductOrder, setCurrentProductOrder] = useState<null | ProductOrder>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [productOrders, setProductOrders] = useState<ProductOrder[]>([]);

  

  

  useFocusEffect(
    
    useCallback(() => {
      if (!creatingProductOrder) {
        fetchOrder(orderId);
      }
      fetchProducts();
    }, [orderId])
  );

  const fetchOrder = async (id: number) => {
    const [order] = await getOrders(id);
    setOrder(order);
    setProductOrders(order.productOrders || []);
  };
  const fetchProducts = async () => {
    const fetchedProducts = await getProducts();
    
    setProducts(fetchedProducts);
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

  const saveCurrentProductOrder = async () => {
    if (currentProductOrder?.id_product === null) {
      alert("Please select a product");
      return;
    }
    if (currentProductOrder?.amount === 0) {
      alert("Please enter an amount");
      return;
    }
    if (currentProductOrder?.id === null) {
      await manageProductOrder(currentProductOrder, "create");
    } 
    if (order.id === null) {
      // set the orderPRoduct in the order, and create it
      const newOrder = await manageOrder(order, "create");
      await manageProductOrder({ ...currentProductOrder, id_order: newOrder.id  }, "create");
      setCurrentProductOrder(null);
      fetchOrder(newOrder.id);      
      setOrder(newOrder);
    }else {
      await manageProductOrder(currentProductOrder, "update");
    }
    // update the product orders
    setCurrentProductOrder(null);
    fetchOrder(order.id);
  }
  const onDeleteProductOrder = async (id: number) => {
    await manageProductOrder({ id, id_order: order.id, id_product: null, amount: 0 }, "delete");
    fetchOrder(order.id);
  }

  useEffect(() => {
    setCreatingProductOrder(order.id === null);
  }, [order]);



  console.log("productOrders", productOrders);
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text h1>{!creatingProductOrder ? "Edit Order" : "Create Order"}</Text>
      <ScrollView style={styles.orderContainer}>
        <View >
          <Input label="Name" value={order?.name} onChangeText={(text) => setOrder({ ...order, name: text })} />
        </View>
        <Text h4>Product Orders</Text>
        {productOrders.map((po:ProductOrder) => {
          const product:Product = products.find((product) => product.id === po.id_product);
          if (!product) return null;
          return (
            <ListItem key={po.id}>
            <ListItem.Title>{product.name}</ListItem.Title>
            <ListItem.Subtitle>{po.amount}/{product.unit}</ListItem.Subtitle>
            <Chip>{toCurrency(po.amount * product.price)}</Chip>
              <Button
                icon={<Icon name="delete" color="#ffffff" />}
                buttonStyle={{ backgroundColor: 'red' }}
                onPress={() => onDeleteProductOrder(po.id)}
              />
            </ListItem>
          );
        })}
      </ScrollView>
      <View style={styles.bottomButtonsView}>
        <Button title="Add Product Order" onPress={() => setCurrentProductOrder({
          id: null,
          id_order: order.id,
          id_product: null,
          amount: 0,
        })} />
        <Button title="Save Order" onPress={saveOrder}  />
      </View>



      <Dialog
        isVisible={currentProductOrder !== null}
        onDismiss={() => setCurrentProductOrder(null)}
        onBackdropPress={() => setCurrentProductOrder(null)}
      >
        <Dialog.Title title={currentProductOrder?.id === null ? "Add Product Order" : "Edit Product Order"}/>
        <Text>Product</Text>
        <Dropdown
          rows={products.map((product) => ({ value: product.id.toString(), label: product.name }))}
          onChange={(value) => setCurrentProductOrder({ ...currentProductOrder, id_product: parseInt(value) })}
        />
        <Input
          label="Amount"
          value={currentProductOrder?.amount.toString()}
          onChangeText={(text) => setCurrentProductOrder({ ...currentProductOrder, amount: parseInt(text)||0 })}
          keyboardType='numeric'
          placeholder='0'
        />
        <Dialog.Actions>
          <Dialog.Button title="Cancel" onPress={() => setCurrentProductOrder(null)} />
            {/* todo */}
          <Dialog.Button title="Save" onPress={saveCurrentProductOrder} />
        </Dialog.Actions>
      </Dialog>
      
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