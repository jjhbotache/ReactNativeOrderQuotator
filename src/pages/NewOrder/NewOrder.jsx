import { Button, Modal, Text, TextInput, TouchableNativeFeedback, View } from "react-native";
import NewOrderStyleSheet, { ProductQuotationModalStyles } from "./NewOrderStyleSheet";
import RNPickerSelect from "react-native-picker-select";
import { useCallback, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Divider from "../../components/Divider/Divider";
import Row from "../../components/Row/Row";
import AmountPicker from "../../components/AmountPicker/AmountPicker";
import addDots from "../../helpers/addDots";
import { Ionicons } from '@expo/vector-icons';

export default function NewOrder({ db }) {
  const [products, setProducts] = useState([]);
  const [productQuotationModalInfo, setProductQuotationModalInfo] = useState();
  const [orderInfo, setorderInfo] = useState({
    id: undefined,
    name: "Order",
    orderQuotations: [
      
    ],
  });

  const navigation = useNavigation();
  
  useFocusEffect(
    useCallback(() => {
      // reset the order info
      setorderInfo({
        id: undefined,
        name: "Order",
        orderQuotations: []
      });

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
                total: (productQuotationModalInfo?.info.price || 0) * quantity
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
          <TouchableNativeFeedback onPress={() => {
            setProductQuotationModalInfo(undefined);
          }}>
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


      // create a new product quotation by appending the product quotation to the order
      setorderInfo({
        ...orderInfo,
        orderQuotations: [
          ...orderInfo.orderQuotations,
          {
            productId: productQuotationModalInfo.productId,
            amount: productQuotationModalInfo.quantity,
          }
        ]
      });
      setProductQuotationModalInfo(undefined);
      
    }
    
  }
  }

  function onSaveOrder(){
    console.log(orderInfo);
    db.transaction(tx => {
      tx.executeSql("INSERT INTO orders (name) VALUES (?)", [orderInfo.name], (_, { insertId }) => {
        orderInfo.orderQuotations.forEach(productQuotation => {
          tx.executeSql("INSERT INTO products_orders (id_product, id_order, amount) VALUES (?, ?, ?)", [productQuotation.productId, insertId, productQuotation.amount],
          (_, { insertId }) => {
            console.log("Product order inserted", insertId);
          },
          (_, error) => {
            console.log("Error inserting product order", error);
          }
          );

        });
        navigation.goBack();
      });
    });
    
  }
  return (
    <View style={NewOrderStyleSheet.container}>
      <TextInput
        style={NewOrderStyleSheet.input}
        value={orderInfo.name}
        onChangeText={(text) => setorderInfo({ ...orderInfo, name: text })}
      />
      {productQuotationModalInfo && ProductQuotationModal}

      <View style={NewOrderStyleSheet.productsQuotationsContainer}>
        {orderInfo.orderQuotations.map((productQuotation,i) => {
          const product = products.find(product => product.id === productQuotation.productId);
          return (
            <View key={i} style={NewOrderStyleSheet.productQuotation}>
              <Row justifyContent="space-between">
                <Text>{product.name}</Text>
                <View>
                  <Text>{productQuotation.amount} {product.unit}</Text>
                  <Ionicons name="trash" size={24} color="red" onPress={() => {
                    setorderInfo({
                      ...orderInfo,
                      orderQuotations: orderInfo.orderQuotations.filter((_,index) => index !== i)
                    });
                  }} />
                </View>
              </Row>
              <Text>{addDots(product.price * productQuotation.amount)}</Text>
            </View>
          );
        })} 
      </View>
      
      <Divider/>
      
      <TouchableNativeFeedback onPress={onAddProductQuotation}>
        <View style={NewOrderStyleSheet.btn}>
          <Text style={NewOrderStyleSheet.btnText}>+</Text>
        </View>
      </TouchableNativeFeedback>
      <Row>
        <TouchableNativeFeedback onPress={onSaveOrder}>
          <View style={NewOrderStyleSheet.btn}>
            <Text style={NewOrderStyleSheet.btnText}>Save</Text>
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback onPress={() => navigation.goBack()}>
          <View style={NewOrderStyleSheet.btn}>
            <Text style={NewOrderStyleSheet.btnText}>cancel</Text>
          </View>
        </TouchableNativeFeedback>
      </Row>

      
    </View>
  );
}
