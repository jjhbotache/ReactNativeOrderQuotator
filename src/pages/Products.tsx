import React, { useState, useEffect, useContext } from "react";
import { ScrollView,  View, Modal } from "react-native";
import { Text,  Button, ListItem, Input, makeStyles } from "@rneui/themed";
import FloatingBtn from "../components/global/FloatingBtn";
import useDatabase from "../hooks/useDatabase";
import { toCurrency } from "../helpers/stringHelpers";
import { languageContext } from "../contexts/languageContext";
import { texts } from "../constants";

interface Product {
  id?: number;
  name: string;
  unit: string;
  price: number;
}

const useStyles = makeStyles((theme)=>({
  container: {
    flex: 1,
    padding: 5,
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: theme.colors.background,
  },
  productsContainerView: {
    width: "100%",
    flex: 0.9
  },
  listContainer: {
    gap: 5, 
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
    shadowOffset: { width: 0,height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  listItem: {
    backgroundColor: "#31063c", // Custom background color for list items
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 5,
  },
}));

export default function Products() {
  const { getProducts, manageProduct } = useDatabase();
  const [products, setProducts] = useState<Product[]>([]);
  const [currentProduct, setCurrentProduct] = useState<Product>({ name: "", unit: "", price: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const styles = useStyles();
  const {language}= useContext(languageContext);

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
    <View style={styles.container}>
      <Text h1 >{texts.products.products[language]}</Text>

      <ScrollView style={styles.productsContainerView}>
        <View style={styles.listContainer}>
          {products.map((product) => (
            <ListItem.Swipeable
              key={product.id}
              containerStyle={styles.listItem}
              leftContent={(reset) => (
                <Button
                  title={texts.delete[language]}
                  onPress={() => {
                    reset();
                    product.id && handleDeleteProduct(product.id)
                  }}
                  icon={{ name: 'delete', color: 'white' }}
                  buttonStyle={{ minHeight: '100%', backgroundColor: 'red' }}
                />
              )}
              rightContent={(reset) => (
                <Button
                  title={texts.edit[language]}
                  onPress={() => {
                    reset();
                    product.id && handleEditProduct(product)
                  }}
                  icon={{ name: 'edit', color: 'white' }}
                  buttonStyle={{ minHeight: '100%', backgroundColor: 'blue' }}
                />
              )}
            >
              <ListItem.Content>
                <ListItem.Title><Text h2>{product.name}</Text></ListItem.Title>
                <ListItem.Subtitle>{toCurrency(product.price)}/{product.unit}</ListItem.Subtitle>
                <ListItem.Subtitle></ListItem.Subtitle>
              </ListItem.Content>
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
          <Text h2 style={{marginBottom:20}}>{isEditing ? texts.products.editProduct[language] : texts.products.addProduct[language]}</Text>
          <Input
            label={texts.products.productName[language]}
            placeholder="Cortina sheer"
            value={currentProduct.name}
            onChangeText={(text) => setCurrentProduct({ ...currentProduct, name: text })}
          />
          <Input
            label={texts.products.productUnit[language]}
            placeholder="m2"
            value={currentProduct.unit}
            onChangeText={(text) => setCurrentProduct({ ...currentProduct, unit: text })}
          />
          <Input
            label={texts.products.productPrice[language]}
            placeholder="Price"
            value={currentProduct.price.toString()}
            onChangeText={handlePriceChange}
            keyboardType="numeric"
          />
          <View style={styles.row}>
            <Button  type="outline" title={texts.cancel[language]} onPress={() => setModalVisible(false)} />
            <Button  title={isEditing ? texts.update[language] : texts.create[language]} onPress={isEditing ? handleUpdateProduct : handleAddProduct} />
          </View>
        </View>
      </Modal>

      <FloatingBtn onPress={openModalForNewProduct} />
    </View>
  );
}

