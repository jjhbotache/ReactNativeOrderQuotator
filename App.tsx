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
import Products from './src/pages/Products';



declare module '@rneui/themed' {
  export interface Colors {
    tertiary: string;
  }
}

export default function App() {
  const { db } = useDatabase();
  const theme = createTheme({ 
    darkColors:{
      primary: styleConstants.colors.primary,
      secondary: styleConstants.colors.secondary,
      tertiary: styleConstants.colors.tertiary,
      background: styleConstants.colors.background,
      white: styleConstants.colors.text,
    },
    mode:"dark"

  })

  const BottomTabsNavigator = createBottomTabNavigator(); 

  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <SafeAreaView style={styles.main}>
          <StatusBar style='auto' />
          
          <BottomTabsNavigator.Navigator
            initialRouteName='Main'
            screenOptions={{
              headerShown:false,
            }}
            backBehavior='initialRoute'
            
          >
            <BottomTabsNavigator.Screen 
              name="Main"
              component={Main}
              options={{
                tabBarStyle:styles.tabsStyle,
                tabBarIcon:()=><Icon name="house"></Icon>,
                tabBarLabelStyle:styles.tabBarLabelStyle,
                tabBarActiveTintColor:theme.darkColors.tertiary,
              }} />

            <BottomTabsNavigator.Screen 
              name="Products"
              component={Products}
              options={{
                tabBarStyle:styles.tabsStyle,
                tabBarIcon:()=><Icon name="cube" type='font-awesome'></Icon>,
                tabBarLabelStyle:styles.tabBarLabelStyle,
                tabBarActiveTintColor:theme.darkColors.tertiary,
              }} />

          </BottomTabsNavigator.Navigator>
          
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
