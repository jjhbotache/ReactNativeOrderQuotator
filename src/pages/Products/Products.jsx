import { useCallback, useEffect, useState } from "react";
import { FlatList, Text, TouchableNativeFeedback, View } from "react-native";
import NewButton from "../../components/NewButton/NewButton";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from '@react-navigation/native';
import { productsStyleSheet, productStyleSheet } from "./ProductsStyleSheet";

export default function Products({db}) {
  const [orders, setOrders] = useState([]);

  const {navigate} = useNavigation();

  useFocusEffect(
    useCallback(() => {
    db.transaction(tx => {
      tx.executeSql("SELECT * FROM products",[], 
        (_, { rows: { _array } }) => {
          console.log("products");
          console.log(_array);
          setOrders(_array);
        },
        (_, error) => {
          console.log("error fetching products", error);
        }
      )
    }
    )
  }, []	)
  );

  function onCreateProduct() {
    navigate("NewProduct")
  }

  return(
    <View style={productsStyleSheet.container}>
      <Text style={productsStyleSheet.title}>Products</Text>
      <FlatList
        data={orders}
        renderItem={({ item }) => (
          <TouchableNativeFeedback onPress={() => navigate("ProductsEditor", {id: item.id})}>
          <View style={productStyleSheet.container} >
            <Text style={productStyleSheet.name}>{item.name}</Text>
            <Text style={productStyleSheet.name}>$ {item.price}</Text>
          </View>
          </TouchableNativeFeedback>
        )}
        keyExtractor={(_,i) => i}
        ItemSeparatorComponent={() => <View style={productsStyleSheet.separator} /> }
      />
      <NewButton onPress={onCreateProduct} />
    </View>
  )
};
