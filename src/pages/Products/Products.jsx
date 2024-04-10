import { useCallback, useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import NewButton from "../../components/NewButton/NewButton";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from '@react-navigation/native';

export default function Products({db}) {
  const [orders, setOrders] = useState([]);

  const {navigate} = useNavigation();

  useFocusEffect(
    useCallback(() => {
    console.log("fetching products");
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
  }));

  function onCreateProduct() {
    navigate("NewProduct")
  }

  return(
    <View style={{flex:1,backgroundColor:"grey"}}>
      <Text>Products</Text>
      <FlatList
        data={orders}
        renderItem={({ item }) => <Text>{item.name}</Text>}
        keyExtractor={(_,i) => i}
      />
      <NewButton onPress={onCreateProduct} />
    </View>
  )
};
