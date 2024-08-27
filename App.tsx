import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { createTheme, Icon, ThemeProvider } from '@rneui/themed';
import Constants from "expo-constants";
import Main from './src/pages/Main';
import useDatabase from './src/hooks/useDatabase';
import { styleConstants } from './src/constants';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Products from './src/pages/Products';
import SingleOrderEditor from './src/pages/OrderEditor'; // Import SingleOrderEditor

declare module '@rneui/themed' {
  export interface Colors {
    tertiary: string;
  }
}

export type RootStackParamList = {
  MainTabs: undefined;
  OrderEditor: { orderId: number | null };
};

const StackNavigator = createStackNavigator<RootStackParamList>();
const BottomTabsNavigator = createBottomTabNavigator(); 
const theme = createTheme({ 
  darkColors:{
    primary: styleConstants.colors.primary,
    secondary: styleConstants.colors.secondary,
    tertiary: styleConstants.colors.tertiary,
    background: styleConstants.colors.background,
    white: styleConstants.colors.text,
  },
  mode:"dark",
  components: {
    Text: {
      style: {
        color: styleConstants.colors.text,
      },
    },
    Input: {
      inputStyle: {
        color: styleConstants.colors.text,
      },
      labelStyle: {
        color: styleConstants.colors.text,
      },
      
    },
    Button:{
      buttonStyle:{
        backgroundColor: styleConstants.colors.primary,
      },
    },
  }
});

function MainTabs () {
  
  return (
    <BottomTabsNavigator.Navigator
      initialRouteName='Main'
      screenOptions={{
        headerShown: false,
      }}
      backBehavior='initialRoute'
    >
      <BottomTabsNavigator.Screen 
        name="Main"
        component={Main}
        options={{
          tabBarStyle: styles.tabsStyle,
          tabBarIcon: () => <Icon name="house" />,
          tabBarLabelStyle: styles.tabBarLabelStyle,
          tabBarActiveTintColor: theme.darkColors.tertiary,
        }} 
      />

      <BottomTabsNavigator.Screen 
        name="Products"
        component={Products}
        options={{
          tabBarStyle: styles.tabsStyle,
          tabBarIcon: () => <Icon name="cube" type='font-awesome' />,
          tabBarLabelStyle: styles.tabBarLabelStyle,
          tabBarActiveTintColor: theme.darkColors.tertiary,
        }} 
      />
    </BottomTabsNavigator.Navigator>
  );
};

export default function App() {
  const { clearDatabase } = useDatabase();
  // clearDatabase();

  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <SafeAreaView style={styles.main}>
          <StatusBar style='auto' />
          
          <StackNavigator.Navigator
            initialRouteName='MainTabs'
            screenOptions={{
              headerShown: false,
            }}
          >
            <StackNavigator.Screen name="MainTabs" component={MainTabs} />
            <StackNavigator.Screen name="OrderEditor" component={SingleOrderEditor}/>
          </StackNavigator.Navigator>
          
        </SafeAreaView>
      </NavigationContainer>
    </ThemeProvider>
  );
}



const styles = StyleSheet.create({
  main: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
  tabsStyle:{
    backgroundColor:"rgb(0, 38, 90)",
    minHeight: 65,
    paddingBottom: 8,
  },
  tabBarLabelStyle:{
    fontSize: 14,
    fontWeight: 'bold',
  }
});