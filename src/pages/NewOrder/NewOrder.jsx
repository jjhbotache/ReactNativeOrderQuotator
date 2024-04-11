import { Button, Modal, Text, TouchableNativeFeedback, View } from "react-native";
import NewOrderStyleSheet, { ProductQuotationModalStyles } from "./NewOrderStyleSheet";
import RNPickerSelect from "react-native-picker-select";
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import Divider from "../../components/Divider/Divider";
import Row from "../../components/Row/Row";
import AmountPicker from "../../components/AmountPicker/AmountPicker";
import addDots from "../../helpers/addDots";

export default function NewOrder({ db }) {
  const [products, setProducts] = useState([]);
  const [productQuotationModalInfo, setProductQuotationModalInfo] = useState();
  const [orderInfo, setorderInfo] = useState();
  
  useFocusEffect(
    useCallback(() => {
      db.transaction(tx => {
        tx.executeSql("SELECT * FROM products",[], 
          (_, { rows: { _array } }) => {
            console.log(_array);
            setProducts(_array);
          }
        )
      });
    }, [])
  );


  const ProductQuotationModal = <Modal
    animationType="fade"
    visible={!!productQuotationModalInfo}
    onRequestClose={() => setProductQuotationModalInfo(undefined)}
    transparent={true}
    >
      <View style={ProductQuotationModalStyles.container}>
        <Text style={ProductQuotationModalStyles.title} >Add a product</Text>
        <Divider />

        <RNPickerSelect
          style={NewOrderStyleSheet.dropdown}
          onValueChange={(id) => {
            const product = products.find(product => product.id === id);
            setProductQuotationModalInfo({
              ...productQuotationModalInfo,
              productId: id,
              info: {
                unit: product.unit,
                price: product.price,
              },
              total: product.price * productQuotationModalInfo.quantity,
            });            
          }}
          items={products.map(product => ({ label: product.name.toString(), value: product.id }))} 
          placeholder={{ label: "Select a product", value: null }}
          darkTheme={true}
        />

        {
          productQuotationModalInfo && <>
          {Object.keys(productQuotationModalInfo.info).map(info=>(
              <Row key={info} widthPercentage={40} justifyContent="space-between">
                <Text style={ProductQuotationModalStyles.description}>{info}: </Text>
                 <Text style={ProductQuotationModalStyles.value}>{productQuotationModalInfo.info[info]}</Text>
              </Row>
            )
          )}
          <AmountPicker minAmount={1} initialAmount={productQuotationModalInfo.quantity} onAmountChange={(quantity) => {
            setProductQuotationModalInfo({
                ...productQuotationModalInfo,
                quantity: quantity,
                total: productQuotationModalInfo.info.price * quantity
            })
            }} />
            <Divider />
            <Text style={ProductQuotationModalStyles.description}>Total: </Text>
            <Text style={ProductQuotationModalStyles.total}>{addDots(productQuotationModalInfo.total)}</Text>
          </>
        }
        

        


        
        <Divider />

        <Row>
          <TouchableNativeFeedback onPress={onAddProductQuotation}>
            <View style={ProductQuotationModalStyles.btn}>
              <Text style={ProductQuotationModalStyles.btnText}>Add product</Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback onPress={() => setProductQuotationModalInfo(undefined)}>
            <View style={ProductQuotationModalStyles.btn}>
              <Text style={ProductQuotationModalStyles.btnText}>Cancel</Text>
            </View>
          </TouchableNativeFeedback>
        </Row>

      </View>
  </Modal>

  function onAddProductQuotation (){
    if(!productQuotationModalInfo){
      setProductQuotationModalInfo({
        productId: undefined,
        orderId: undefined,
        info:{
          unit: "-",
          pricePerUnit: 0,
        },
        quantity: 1,
        total: 0,
      });
  }else{
    // if all the fields are filled, create a new product quotation
    if(
      productQuotationModalInfo.productId &&
      productQuotationModalInfo.quantity > 0
    ){

      // get all the tables of the db and print them
      db.transaction(tx => {
        tx.executeSql("SELECT name FROM sqlite_master WHERE type='table';", [], (_, { rows: { _array } }) => {
          console.log(_array);
        });
      });

      // create a new product quotation
      // CREATE TABLE IF NOT EXISTS products_orders (
      //   id INTEGER PRIMARY KEY AUTOINCREMENT, 
      //   FOREIGN KEY(id_product) REFERENCES product(id),
      //   amount INTEGER
      // );
      db.transaction(tx => {
        tx.executeSql("INSERT INTO products_orders (id_product, amount) VALUES (?, ?)",
          [productQuotationModalInfo.productId, productQuotationModalInfo.quantity],
          (_, { insertId }) => {
            console.log("Product quotation added with id: ", insertId);
          },
          (_, error) => {
            console.log("Error adding product quotation: ", error);
          }
        );
      });
    }
    
  }
  }
  return (
    <View style={NewOrderStyleSheet.container}>
      <Text style={NewOrderStyleSheet.title}>New Order</Text>
      {productQuotationModalInfo && ProductQuotationModal}
      
      
      <Button title="+" onPress={onAddProductQuotation} />

      
    </View>
  );
}
