import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { db } from "../../../App";
import Constants from 'expo-constants';

export default function Products() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    console.log("fetching products");
    db.transaction(tx => {
      tx.executeSql("SELECT * FROM products",[], 
        (_, { rows: { _array } }) => {
          console.log(_array);
          setOrders(_array);
        }
      )
    }
    );

  }, []);

  return(
    <View style={{
      flex:1,
      marginTop: Constants.statusBarHeight,
      }}>
      <Text>Products</Text>
      <FlatList
        data={orders}
        renderItem={({ item }) => <Text>{item.name}</Text>}
        keyExtractor={(_,i) => i}
      />
    </View>
  )
};
