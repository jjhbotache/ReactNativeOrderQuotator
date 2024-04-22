import { Text, View } from "react-native";
import styles from "./OrderComponentStyleSheet";
import Row from "../Row/Row";
import { Ionicons } from '@expo/vector-icons';

export default function OrderComponent({ order,onDelete, onEdit}) {
  return (
    <Row justifyContent="space-between">
      <View style={styles.orderContainer}>
        <Text style={styles.orderTitle}>{order.name}</Text>
        <Row justifyContent="space-between">
          <Text style={styles.orderDetails}>${order?.price||0}</Text>
          <Text style={styles.orderDetails}>#{order?.products||0} products</Text>
          <Ionicons name="trash" size={24} color="white" onPress={e=>onDelete(order)} />
          <Ionicons name="pencil" size={24} color="white" onPress={e=>onEdit(order)} />
        </Row>
      </View>
    </Row>
  )
};
