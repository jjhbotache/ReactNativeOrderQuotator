import { StatusBar } from 'expo-status-bar';
import React, { useContext, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Icon, ThemeProvider, useTheme } from '@rneui/themed';
import Constants from "expo-constants";
import Main from './src/pages/Main';
import useDatabase from './src/hooks/useDatabase';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Products from './src/pages/Products';
import SingleOrderEditor from './src/pages/OrderEditor';
import theme from './src/theme';
import Settings from './src/pages/Settings';
import { languageContext } from './src/contexts/languageContext';
import { texts } from './src/constants';

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

export type RootStackParamList = {
  MainTabs: undefined;
  OrderEditor: { orderId: number | null };
};


const StackNavigator = createStackNavigator<RootStackParamList>();
const BottomTabsNavigator = createBottomTabNavigator(); 

function MainTabs () {
  const {theme} = useTheme();
  const {language}= useContext(languageContext);
  return (
    <BottomTabsNavigator.Navigator
      initialRouteName='Main'
      screenOptions={{headerShown: false}}
      backBehavior='initialRoute'
    >
      <BottomTabsNavigator.Screen 
        name="Main"
        component={Main}
        options={{
          tabBarStyle: styles.tabsStyle,
          tabBarIcon: () => <Icon name="house" color='white' />,
          tabBarLabelStyle: styles.tabBarLabelStyle,
          tabBarActiveTintColor: theme.colors.tertiary,
          tabBarLabel: texts.tabs.main[language],
        }} 
      />

      <BottomTabsNavigator.Screen 
        name="Products"
        component={Products}
        options={{
          tabBarStyle: styles.tabsStyle,
          tabBarIcon: () => <Icon name="cube" type='font-awesome' color='white' />,
          tabBarLabelStyle: styles.tabBarLabelStyle,
          tabBarActiveTintColor: theme.colors.tertiary,
          tabBarLabel: texts.tabs.products[language],
        }} 
      />

      <BottomTabsNavigator.Screen 
        name="Settings"
        component={Settings}
        options={{
          tabBarStyle: styles.tabsStyle,
          tabBarIcon: () => <Icon name="tools" type='font-awesome-5' color='white' />,
          tabBarLabelStyle: styles.tabBarLabelStyle,
          tabBarActiveTintColor: theme.colors.tertiary,
          tabBarLabel: texts.tabs.settings[language],
        }} 
      />
    </BottomTabsNavigator.Navigator>
  );
};

export default function App() {
  const { clearDatabase } = useDatabase();
  const [language, setLanguage] = useState<"es" | "en">("es");
  // clearDatabase();

  return (
    <languageContext.Provider value={{language, setLanguage}}>
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
    </languageContext.Provider>
  );
}



