import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";

const MapViewWithRoute = ({ route }) => {
  const [location, setLocation] = useState(null);

  const path = route.params.route.get("path");
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation.coords);
      }
    })();
  }, []);

  console.log(path[path.length - 1].latitude);
  console.log(path[0].longitude);
  return (
    <View style={{ flex: 1 }}>
      {location ? (
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: path[0].latitude,
            longitude: path[0].longitude,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
        >
          <Marker
            coordinate={{
              latitude: path[0].latitude,
              longitude: path[0].longitude,
            }}
            title="Inicio"
          />
          <Marker
            coordinate={{
              latitude: path[path.length - 1].latitude,
              longitude: path[path.length - 1].latitude,
            }}
            title="Fim"
          />
          <Polyline coordinates={path} strokeColor="#FF0000" strokeWidth={2} />
        </MapView>
      ) : (
        <Text>Obtendo localização...</Text>
      )}
    </View>
  );
};

export default MapViewWithRoute;
