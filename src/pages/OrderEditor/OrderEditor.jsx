import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { FlatList, Text, TextInput, View } from "react-native";
import Row from "../../components/Row/Row";
import OrderEditorStyleSheet from "./OrderEditorStyleSheet";
import Divider from "../../components/Divider/Divider";
import RNPickerSelect from "react-native-picker-select";
import AmountPicker from "../../components/AmountPicker/AmountPicker";

export default function OrderEditor({db,route}) {
  // load the data from the order object
  const {order: orderFromRoute} = route.params;

  const [order, setOrder] = useState(orderFromRoute);
  const [productsOrders, setProductsOrders] = useState(undefined);
  const [products, setProducts] = useState([]);
  const firstProductsOrders = []

  // from the paramas, get the order


  useFocusEffect(useCallback(()=>{
    console.log("OrderEditor focused", orderFromRoute);
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM products_orders WHERE id_order = ${orderFromRoute.id};`,
        // `SELECT * FROM products_orders;`,
        [],
        (_, result) => {
          // console.log("products_orders loaded", result.rows._array);
          setProductsOrders(result.rows._array);
        },
        (_, error) => {
          console.log("error loading products_orders", error);
        }
      )
    })
    // get the products
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM products;`,
        [],
        (_, result) => {
          // console.log("products loaded", result.rows._array);
          setProducts(result.rows._array);
        },
        (_, error) => {
          console.log("error loading products", error);
        }
      )
    })
  },[orderFromRoute.id]))


  return(
    <View style={OrderEditorStyleSheet.container}>
      <TextInput style={OrderEditorStyleSheet.input} value={order.name} onChangeText={text=>setOrder({...order, name: text})}/>
      <Divider/>  
      <View style={OrderEditorStyleSheet.productsQuotationsContainer}>
        <FlatList
          data={productsOrders}
          renderItem={({item}) => (<>
            <Row>
              <RNPickerSelect
                style={OrderEditorStyleSheet.dropdown}
                onValueChange={id=>console.log(id)}
                items={products.map(product => ({ label: product.name.toString(), value: product.id }))} 
                placeholder={{ label: products.find(p=>p.id==item.id_product).name, value: item.id_product }}
                darkTheme={true}
              />
              <AmountPicker initialAmount={item.amount} onAmountChange={amount=>console.log(amount)}/>
            </Row>
          </>)}
          keyExtractor={item => item.id}
        />
      </View>
    </View>
  )
};
