import { Text, View } from "react-native";
import styles from "./OrderComponentStyleSheet";


export default function OrderComponent({ title, price, products }) {
  return (
    <View style={styles.orderContainer}>
      <Text style={styles.orderTitle}>{title}</Text>
      <View style={styles.row}>
        <Text style={styles.orderDetails}>${price}</Text>
        <Text style={styles.orderDetails}>#{products} products</Text>
      </View>
    </View>
  );
};
