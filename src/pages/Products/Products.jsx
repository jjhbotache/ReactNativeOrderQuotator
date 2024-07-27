import { useCallback, useEffect, useState } from "react";
import { FlatList, Text, TouchableNativeFeedback, View } from "react-native";
import NewButton from "../../components/NewButton/NewButton";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from '@react-navigation/native';
import { productsStyleSheet, productStyleSheet } from "./ProductsStyleSheet";
import { useDatabase } from "../../hooks/useDatabase";

export default function Products() {
  const [products, setProducts] = useState([]);
  const { navigate } = useNavigation();
  const { getAllProducts } = useDatabase();

  useFocusEffect(
    useCallback(() => {
      const fetchProducts = async () => {
        try {
          const fetchedProducts = await getAllProducts();
          setProducts(fetchedProducts);
        } catch (error) {
          console.log("error fetching products", error);
        }
      };

      fetchProducts();
    }, [getAllProducts])
  );

  const onCreateProduct = () => {
    navigate("NewProduct");
  };

  return (
    <View style={productsStyleSheet.container}>
      <Text style={productsStyleSheet.title}>Products</Text>
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <TouchableNativeFeedback onPress={() => navigate("ProductsEditor", { id: item.id })}>
            <View style={productStyleSheet.container}>
              <Text style={productStyleSheet.name}>{item.name}</Text>
              <Text style={productStyleSheet.name}>$ {item.price}</Text>
            </View>
          </TouchableNativeFeedback>
        )}
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={() => <View style={productsStyleSheet.separator} />}
      />
      <NewButton onPress={onCreateProduct} />
    </View>
  );
}