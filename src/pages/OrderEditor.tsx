import React, { useState, useCallback, useEffect } from 'react';
import { View, FlatList, Alert } from 'react-native';
import useDatabase from "../hooks/useDatabase";
import { Order, ProductOrder, Product } from '../interfaces/databaseInterfaces';
import { useRoute, useFocusEffect, useNavigation } from '@react-navigation/native';
import { Text, Input, Chip, Dialog, Icon, Divider, SpeedDial, makeStyles, ListItem } from '@rneui/themed';
import { toCurrency } from '../helpers/stringHelpers';
import Dropdown from '../components/global/Dropdown';
import createPDF, { Settings } from '../helpers/createPDF';
import { getSettingsFromStorage } from './Settings';

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
  const navigation = useNavigation();

  const [order, setOrder] = useState<Order>({
    id: null,
    name: "",
    companyName: "",
    companyNit: "",
    productOrders: []
  });
  const [lastSavedOrder, setLastSavedOrder] = useState<Order>({
    id: null,
    name: "",
    companyName: "",
    companyNit: "",
    productOrders: []
  });

  const [creatingProductOrder, setCreatingProductOrder] = useState<boolean>(orderId === null);
  const [currentProductOrder, setCurrentProductOrder] = useState<null | ProductOrder>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [productOrders, setProductOrders] = useState<ProductOrder[]>([]);
  const [speedDialOpen, setSpeedDialOpen] = useState(false);

  useFocusEffect(
    useCallback(() => {
      
      if (orderId !== null && order.id === null) {
        fetchOrder(orderId);
      }
      fetchProducts();

      const beforeRemoveListener = async (event: any) => {
        event.preventDefault();
        await onUnmount(event);
      };

      navigation.addListener('beforeRemove', beforeRemoveListener);

      return () => {
        navigation.removeListener('beforeRemove', beforeRemoveListener);
      };
    }, [order,orderId,lastSavedOrder])
  );
  const onUnmount = async (e:any) => {
    console.log("on unmount");
    console.log("order", order);
    console.log("lastSavedOrder", lastSavedOrder);
    const exit = () => { navigation.dispatch(e.data.action); };
    
    
    const unsavedChanges = JSON.stringify(order) !== JSON.stringify(lastSavedOrder);
    if (unsavedChanges) {
      Alert.alert(
        "Unsaved Changes",
        "Do you want to save your changes?",
        [
          {
            text: "Save",
            onPress: async () => {
              await saveOrder();
              exit();
            },
          },
          {
            text: "Discard",
            onPress: () => {
              exit();
            },
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ],
        { cancelable: false }
      );
    } else {
      exit();
    }

  }

  const fetchOrder = async (id: number) => {
    
    const [fetchedOrder] = await getOrders(id);
    
    setProductOrders(fetchedOrder.productOrders || []);
    setOrder(fetchedOrder);
    setLastSavedOrder(fetchedOrder);
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
    setSpeedDialOpen(false);
    setLastSavedOrder(order);
    console.log("order saved");
  };

  const saveCurrentProductOrder = async () => {
    if (!currentProductOrder) return; 
    
    if (currentProductOrder?.id_product === null) {
      alert("Please select a product");
      return;
    }
    console.log("currentProductOrder", currentProductOrder);
    
    if (currentProductOrder?.amount === 0 || currentProductOrder?.amount === "" || isNaN(parseFloat(currentProductOrder?.amount?.toString()))) {
      alert("Please enter a valid amount");
      return;
    }
    if (currentProductOrder?.id === null) {
      await manageProductOrder(currentProductOrder, "create");
    } 
    if (order.id === null) {
      const newOrder = await manageOrder(order, "create");
      await manageProductOrder({ ...currentProductOrder, id_order: newOrder.id  }, "create");
      setCurrentProductOrder(null);
      fetchOrder(newOrder.id);      
      setOrder(newOrder );
    } else {
      await manageProductOrder(currentProductOrder, "update");
    }
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
      amount: "",
    });
    setSpeedDialOpen(false);
  }

  const onCreatePDF = async () => {
    
    
    if (order.productOrders.length < 1) { 
      alert("Please add at least one product order");
      return;
    }
    const listOfSettings = await getSettingsFromStorage();
    
    const settings: Settings = {
      date: new Date().toLocaleDateString(),
      city: listOfSettings.city || "Unknown City",
      customerNit: order.companyNit || "Unknown NIT",
      customerName: order.companyName || "Unknown company name",
      billedBy: listOfSettings.billedBy || "Unknown Biller",
      billerId: listOfSettings.billerId || "Unknown ID",
      billerPhone: listOfSettings.billerPhone || "Unknown Phone",
      fileName: `${order.name} Order`,
    };
    
    await createPDF(
      order,
      products,
      settings
    )
    setSpeedDialOpen(false);
  };

  useEffect(() => {
    setCreatingProductOrder(order.id === null);
  }, [order]);

  const formattedAmount = (text:string)=>{
    let toReturn = text.replace(/,/g, ""); // Remove commas from the text

    if (toReturn.split(".").length > 2) {
      toReturn = toReturn.slice(0, -1);
    }

    return toReturn;
  }

  
  
  const formattedProductOrderTotal = ()=>{
    const isCurrentProductOrderAmountANumber = !isNaN(parseFloat(currentProductOrder?.amount?.toString()));
    const amount = isCurrentProductOrderAmountANumber ? parseFloat(currentProductOrder?.amount?.toString()) : 0;
    return(
      currentProductOrder?.id_product !== null ? toCurrency((amount) * products.find((product) => product.id === currentProductOrder?.id_product)?.price) : "$$"
    )
  }
  return (
    <View style={styles.container}>
      <Text h1>{!creatingProductOrder ? "Edit Order" : "Create Order"}</Text>
      <View style={styles.row}>
        <Input
          value={order?.name}
          onChangeText={(text) => setOrder({ ...order, name: text })}
          placeholder="Order Name"
          label="Order Name"
        />
      </View>
      <View style={styles.row}>
        <Input
          value={order?.companyName}
          onChangeText={(text) => setOrder({ ...order, companyName: text })}
          placeholder="Company Name"
          label="Company Name"
        />
      </View>
      <View style={styles.row}>
        <Input
          value={order?.companyNit}
          onChangeText={(text) => setOrder({ ...order, companyNit: text })}
          placeholder="Company NIT"
          label="Company NIT"
        />
      </View>
      <FlatList
        ListHeaderComponent={<Text h4>Product Orders</Text>}
        data={productOrders}
        style={styles.orderContainer}
        renderItem={({item:po})=>{
          const product:Product = products.find((product) => product.id === po?.id_product);
          if (!product) return null;
          return (
            <ListItem key={po.id} bottomDivider>
              <View style={styles.row}>
                <ListItem.Content>
                  <ListItem.Title>{product.name}</ListItem.Title>
                  <ListItem.Subtitle>{po.amount}/{product.unit}</ListItem.Subtitle>
                </ListItem.Content>
                <Chip>{toCurrency(parseFloat(po.amount.toString()) * product.price)}</Chip>
                <Icon name="delete" color="red" onPress={() => onDeleteProductOrder(po.id)} />
              </View>
            </ListItem>
          )
        }}
        keyExtractor={(po) => po.id.toString()}
      />

      <Text h2 style={{marginBottom:20}}>Total: {toCurrency(productOrders.reduce((acc, po) => {
        const product = products.find((product) => product.id === po?.id_product);
        if (!product) return acc;
        return acc + parseFloat(po.amount.toString()) * product.price;
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
        overlayStyle={{
          overflow: "hidden",
        }}
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
              currentProductOrder?.id_product !== null ? toCurrency(products.find((product) => product.id === currentProductOrder?.id_product)?.price || 0) : "$$"
              }/
              {currentProductOrder?.id_product !== null ? products.find((product) => product.id === currentProductOrder?.id_product)?.unit || "unit" : "unit"}
            </Text>
          </View>
          
          <Divider style={styles.divider} />

          <Input
            label="Amount"
            value={currentProductOrder?.amount?.toString() || ""}  
            onChangeText={(text) => setCurrentProductOrder({ ...currentProductOrder, amount: formattedAmount(text) })}
            keyboardType='numeric'
            placeholder='0'
          />

          <Divider style={styles.divider} />
          <View style={styles.row}>
            <Text h3>Total:</Text>
            <Text h3 >{formattedProductOrderTotal()}</Text>
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