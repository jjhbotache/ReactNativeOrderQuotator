import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { FlatList, Text, TextInput, View } from "react-native";
import Row from "../../components/Row/Row";
import OrderEditorStyleSheet from "./OrderEditorStyleSheet";
import Divider from "../../components/Divider/Divider";
import RNPickerSelect from "react-native-picker-select";
import AmountPicker from "../../components/AmountPicker/AmountPicker";
import { useDatabase } from "../../hooks/useDatabase";

export default function OrderEditor({ route }) {
  const { order: orderFromRoute } = route.params;

  const [order, setOrder] = useState(orderFromRoute);
  const [productsOrders, setProductsOrders] = useState([]);
  const [products, setProducts] = useState([]);
  
  const { getProductsOrders, getProducts } = useDatabase();

  useFocusEffect(
    useCallback(() => {
      console.log("OrderEditor focused", orderFromRoute);
      console.log("OrderEditor focused order", order);

      const fetchProductsOrders = async () => {
        try {
          const productsOrders = await getProductsOrders(orderFromRoute.id);
          setProductsOrders(productsOrders);
        } catch (error) {
          console.log("error loading products_orders", error);
        }
      };

      const fetchProducts = async () => {
        try {
          const products = await getProducts();
          setProducts(products);
        } catch (error) {
          console.log("error loading products", error);
        }
      };

      fetchProductsOrders();
      fetchProducts();
    }, [orderFromRoute.id])
  );

  useEffect(() => {
    setOrder(orderFromRoute);
  }, [orderFromRoute]);

  return (
    <View style={OrderEditorStyleSheet.container}>
      <TextInput
        style={OrderEditorStyleSheet.input}
        value={order.name}
        onChangeText={text => setOrder({ ...order, name: text })}
      />
      <Divider />
      <View style={OrderEditorStyleSheet.productsQuotationsContainer}>
        <FlatList
          data={productsOrders}
          renderItem={({ item }) => {
            const product = products.find(p => p.id == item.id_product);
            return (
              <>
                <Row>
                  <RNPickerSelect
                    style={OrderEditorStyleSheet.dropdown}
                    onValueChange={id => console.log(id)}
                    items={products.map(product => ({ label: product.name.toString(), value: product.id }))}
                    placeholder={{ label: product.name, value: item.id_product }}
                    darkTheme={true}
                  />
                  <AmountPicker initialAmount={item.amount} onAmountChange={amount => console.log(amount)} />
                </Row>
              </>
            );
          }}
          keyExtractor={item => item.id.toString()}
        />
      </View>
    </View>
  );
}
