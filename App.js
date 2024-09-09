import "react-native-gesture-handler";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/HomeScreen";
import ListRoutesScreen from "./screens/ListRoutesScreen";
import RouteDetailScreen from "./screens/DisplayRouteScreen";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import Icon from "react-native-vector-icons/Ionicons";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import LocationNow from "./screens/LocationNow";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const BottomTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = "home";
            return <Icon name={iconName} size={size} color={color} />;
          } else if (route.name === "Lista de Rotas") {
            iconName = "clipboard-list";
            return <FontAwesome6 name={iconName} size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: "#8a4af3",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Lista de Rotas" component={ListRoutesScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="BottomTabs"
          component={BottomTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Rota" component={RouteDetailScreen} />
        <Stack.Screen name="Localização Atual" component={LocationNow} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
