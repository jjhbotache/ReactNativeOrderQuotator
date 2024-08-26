import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View, Modal } from "react-native";
import { Text, useTheme, Button, ListItem, Input } from "@rneui/themed";
import FloatingBtn from "../components/global/FloatingBtn";
import useDatabase from "../hooks/useDatabase";

interface Product {
  id?: number;
  name: string;
  unit: string;
  price: number;
}

export default function Products() {
  const { theme } = useTheme();
  const { getProducts, manageProduct } = useDatabase();
  const [products, setProducts] = useState<Product[]>([]);
  const [currentProduct, setCurrentProduct] = useState<Product>({ name: "", unit: "", price: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const fetchedProducts = await getProducts();
    setProducts(fetchedProducts);
  };

  const handleAddProduct = async () => {
    await manageProduct(currentProduct, "create");
    fetchProducts();
    setCurrentProduct({ name: "", unit: "", price: 0 });
    setModalVisible(false);
  };

  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product);
    setIsEditing(true);
    setModalVisible(true);
  };

  const handleUpdateProduct = async () => {
    await manageProduct(currentProduct, "update");
    fetchProducts();
    setCurrentProduct({ name: "", unit: "", price: 0 });
    setIsEditing(false);
    setModalVisible(false);
  };

  const handleDeleteProduct = async (id: number) => {
    await manageProduct({ id } as Product, "delete");
    fetchProducts();
  };

  const openModalForNewProduct = () => {
    setCurrentProduct({ name: "", unit: "", price: 0 });
    setIsEditing(false);
    setModalVisible(true);
  };

  const handlePriceChange = (text: string) => {
    const numericValue = parseFloat(text);
    setCurrentProduct({ ...currentProduct, price: isNaN(numericValue) ? 0 : numericValue });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text h1>Products</Text>

      <ScrollView style={styles.productsContainerView}>
        <View style={styles.listContainer}>
          {products.map((product) => (
            <ListItem.Swipeable
              key={product.id}
              containerStyle={styles.listItem}
              leftContent={() => (
                <Button
                  title="Delete"
                  onPress={() => product.id && handleDeleteProduct(product.id)}
                  icon={{ name: 'delete', color: 'white' }}
                  buttonStyle={{ minHeight: '100%', backgroundColor: 'red' }}
                />
              )}
              rightContent={() => (
                <Button
                  title="Edit"
                  onPress={() => handleEditProduct(product)}
                  icon={{ name: 'edit', color: 'white' }}
                  buttonStyle={{ minHeight: '100%', backgroundColor: 'blue' }}
                />
              )}
            >
              <ListItem.Content>
                <ListItem.Title>{product.name}</ListItem.Title>
                <ListItem.Subtitle>{product.unit}</ListItem.Subtitle>
                <ListItem.Subtitle>{product.price}</ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem.Swipeable>
          ))}
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text h4>{isEditing ? "Edit Product" : "Add Product"}</Text>
          <Input
            placeholder="Name"
            value={currentProduct.name}
            onChangeText={(text) => setCurrentProduct({ ...currentProduct, name: text })}
          />
          <Input
            placeholder="Unit"
            value={currentProduct.unit}
            onChangeText={(text) => setCurrentProduct({ ...currentProduct, unit: text })}
          />
          <Input
            placeholder="Price"
            value={currentProduct.price.toString()}
            onChangeText={handlePriceChange}
            keyboardType="numeric"
          />
          <Button
            title={isEditing ? "Update Product" : "Add Product"}
            onPress={isEditing ? handleUpdateProduct : handleAddProduct}
          />
          <Button title="Cancel" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>

      <FloatingBtn onPress={openModalForNewProduct} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    alignItems: "center",
    justifyContent: "space-evenly"
  },
  productsContainerView: {
    width: "100%",
    flex: 0.9
  },
  listContainer: {
    gap: 5, // Separate list items vertically by 5 units
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
  listItem: {
    backgroundColor: "#31063c", // Custom background color for list items
  },
});