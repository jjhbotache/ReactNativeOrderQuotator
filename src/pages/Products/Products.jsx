import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import Constants from 'expo-constants';
import NewButton from "../../components/NewButton/NewButton";
import { useNavigation } from "@react-navigation/native";

export default function Products({db}) {
  const [orders, setOrders] = useState([]);

  const {navigate} = useNavigation();

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

  function onCreateProduct() {
    navigate("NewProduct")
  }

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
      <NewButton onPress={onCreateProduct} />
    </View>
  )
};
