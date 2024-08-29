import React, { useState, useCallback, useEffect } from 'react';
import { View, ScrollView, StyleSheet, FlatList} from 'react-native';
import useDatabase from "../hooks/useDatabase";
import { Order, ProductOrder, Product } from '../interfaces/databaseInterfaces';
import { useRoute, useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTheme, Text, Input, Button, Chip, Dialog, Icon, Divider, SpeedDial, makeStyles, ListItem} from '@rneui/themed';
import { toCurrency } from '../helpers/stringHelpers';
import Dropdown from '../components/global/Dropdown';
import createPDF from '../helpers/createPDF';

const useStyles = makeStyles((theme, props) => ({
  container: {
    flex: 1,
    height: "100%",
    padding: 5,
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: theme.colors.background,
  },
  orderContainer: {
    marginBottom: 20,
    width: "90%",
    backgroundColor: theme.colors.grey4,
    height: "50%",
  },
  inputStyle: {
    fontSize: 40,
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
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  productOrderContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    width: "95%",
  },
  divider: {
    marginVertical: 10,
    width: "100%",
  },
  speedDialStyle:{
    backgroundColor: 'transparent',
    bottom: 10,
    right:10,
    position: 'absolute'
  },

}));


const SingleOrderEditor = () => {
  

  const { getOrders, manageOrder, manageProductOrder, getProducts } = useDatabase();
  const styles = useStyles();
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
  const [speedDialOpen, setSpeedDialOpen] = useState(false);

  

  

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
    setSpeedDialOpen(false);
  };
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
  };
  const onDeleteProductOrder = async (id: number) => {
    await manageProductOrder({ id, id_order: order.id, id_product: null, amount: 0 }, "delete");
    fetchOrder(order.id);
  };
  const onAddProductOrder = () => {
    setCurrentProductOrder({
      id: null,
      id_order: order.id,
      id_product: null,
      amount: 0,
    });
    setSpeedDialOpen(false);
  }
  const onCreatePDF = async () => {
    if (order.productOrders.length === 0) {
      alert("Please save the order before generating the PDF");
      return;
    }
    await createPDF(order, products)
    setSpeedDialOpen(false);
  }


  useEffect(() => {
    setCreatingProductOrder(order.id === null);
  }, [order]);



  
  return (
    <View style={styles.container}>
      <Text h1>{!creatingProductOrder ? "Edit Order" : "Create Order"}</Text>
      <View style={styles.row}>
        <Input style={styles.inputStyle} value={order?.name} onChangeText={(text) => setOrder({ ...order, name: text })} />
      </View>
      <FlatList
      ListHeaderComponent={<Text h4>Product Orders</Text>}
      data={productOrders}
      style={styles.orderContainer}
      renderItem={({item:po})=>{
        const product:Product = products.find((product) => product.id === po.id_product);
          if (!product) return null;
          return (
            <ListItem key={po.id} bottomDivider>
              <View style={styles.row}>
                <ListItem.Content>
                  <ListItem.Title>{product.name}</ListItem.Title>
                  <ListItem.Subtitle>{po.amount}/{product.unit}</ListItem.Subtitle>
                </ListItem.Content>
                <Chip>{toCurrency(po.amount * product.price)}</Chip>
                <Icon name="delete" color="red" onPress={() => onDeleteProductOrder(po.id)} />
              </View>
            </ListItem>
          )
      }}
      keyExtractor={(po) => po.id.toString()}
      />

      <Text h2 style={{marginBottom:20}}>Total: {toCurrency(productOrders.reduce((acc, po) => {
        const product = products.find((product) => product.id === po.id_product);
        if (!product) return acc;
        return acc + po.amount * product.price;
      }, 0))}</Text>

      <SpeedDial
        isOpen={speedDialOpen}
        icon={{ name: 'menu', color: '#fff' }}
        openIcon={{ name: 'close', color: '#fff' }}
        overlayColor='rgba(0,0,0,0.3)'
        onOpen={() => setSpeedDialOpen(true)}
        onClose={() => setSpeedDialOpen(false)}
        style={styles.speedDialStyle}
      >
        <SpeedDial.Action
          icon={{ name: 'file-pdf', color: '#fff', type: 'font-awesome-5' }}
          title="Generate PDF"
          onPress={onCreatePDF}
        />
        <SpeedDial.Action
          icon={{ name: 'add', color: '#fff' }}
          title="Add product order"
          onPress={onAddProductOrder}
        />
        <SpeedDial.Action
          icon={{ name: 'check', color: '#fff' }}
          title="save"
          onPress={saveOrder}
        />
      </SpeedDial>
        



      <Dialog
        isVisible={currentProductOrder !== null}
        onDismiss={() => setCurrentProductOrder(null)}
        onBackdropPress={() => setCurrentProductOrder(null)}
        animationType='slide'
      >
        <View style={styles.modalContent}>
          <Dialog.Title title={currentProductOrder?.id === null ? "Add Product Order" : "Edit Product Order"}/>

          <View style={styles.row}>
            <View>
              <Text >Product</Text>
              <Dropdown
                rows={products.map((product) => ({ value: product.id.toString(), label: product.name }))}
                onChange={(value) => setCurrentProductOrder({ ...currentProductOrder, id_product: parseInt(value) })}
              />
            </View>
            <Text h4>{
              currentProductOrder?.id_product !== null ? toCurrency(products.find((product) => product.id === currentProductOrder?.id_product)?.price) : "$$"
              }/
              {currentProductOrder?.id_product !== null ? products.find((product) => product.id === currentProductOrder?.id_product)?.unit : "unit"}
            </Text>
          </View>
          
          <Divider style={styles.divider} />

          <Input
            label="Amount"
            value={currentProductOrder?.amount.toString()}
            onChangeText={(text) => setCurrentProductOrder({ ...currentProductOrder, amount: parseInt(text)||0 })}
            keyboardType='numeric'
            placeholder='0'
          />

          <Divider style={styles.divider} />
          <View style={styles.row}>
            <Text h3>Total:</Text>
            <Text h3>{currentProductOrder?.id_product !== null ? toCurrency(currentProductOrder?.amount * products.find((product) => product.id === currentProductOrder?.id_product)?.price) : "$$"}</Text>
          </View>

          <Dialog.Actions>
            <Dialog.Button type='solid' title="Save" onPress={saveCurrentProductOrder} />
            <Dialog.Button type='outline' title="Cancel" onPress={() => setCurrentProductOrder(null)} />
          </Dialog.Actions>
        </View>
      </Dialog>
      
    </View>
  );
};



export default SingleOrderEditor;