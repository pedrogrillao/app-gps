import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Animated, Easing } from "react-native";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Parse from "parse/react-native";
import { FontAwesome } from '@expo/vector-icons';

Parse.setAsyncStorage(AsyncStorage);
Parse.initialize(
  "ae3WdThoz2VFdvOG8GrCjDiustCziVXSprvgCVLP",
  "bIhiVamxOx64CTSD87XRmgixvu1lDKzEBrmKmPqX"
);
Parse.serverURL = "https://parseapi.back4app.com/";

export default function HomeScreen({ navigation }) {
  const [name, setName] = useState("");
  const [path, setPath] = useState([]);
  const [distance, setDistance] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [animationValue] = useState(new Animated.Value(0));

  useEffect(() => {
    const watchPosition = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      const subscription = Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          distanceInterval: 1,
        },
        (loc) => {
          if (isRecording) {
            setDistance((prevD) => prevD + 1);
            setPath((prevPath) => [
              ...prevPath,
              {
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
              },
            ]);
          }
        }
      );

      return () => subscription.remove();
    };
    watchPosition();
  }, [isRecording]);

  const startRecording = () => {
    setIsRecording(true);
    startAnimation();
  };

  const stopRecording = async () => {
    setIsRecording(false);
    setDistance(0);
    const Route = Parse.Object.extend("Route");
    const route = new Route();
    route.set("name", name);
    route.set("distancia", distance);
    route.set("date", new Date());
    route.set("path", path);
    await route.save();
    setName("");
    setPath([]);
  };

  const startAnimation = () => {
    animationValue.setValue(0);
    Animated.loop(
      Animated.timing(animationValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  const animatedStyle = {
    transform: [
      {
        scale: animationValue.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.1],
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>App GPS</Text>
      </View>

      <View style={styles.mainContent}>
        {isRecording ? (
          <>
            <Text style={styles.distanceText}>
             Gravando rota
            </Text>
          </>
        ) : (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Digite o nome da rota"
              placeholderTextColor="#888"
            />
          </View>
        )}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, isRecording ? styles.buttonStop : styles.buttonStart]}
            onPress={isRecording ? stopRecording : startRecording}
          >
            <Text style={styles.buttonText}>{isRecording ? "Parar" : "Gravar"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonMap}
            onPress={() => {
              if (path) {
                navigation.navigate("Localização Atual", {
                  pathA: path,
                  m: "as",
                });
              }
            }}
          >
            <Text style={styles.buttonMapText}>Mapa</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F9',
  },
  header: {
    backgroundColor: "#a7f6f6",
    width: "100%",
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: '#fff',
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#a7f6f6",
    alignItems: "center",
    padding: 20,
  },
  distanceText: {
    fontSize: 24,
    fontWeight: "bold",
    color: '#333',
    marginTop: 20,
  },
  inputContainer: {
    width: "100%",
    maxWidth: 400,
    marginBottom: 40,
    alignItems: "center",
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    color: '#333',
    marginBottom: 10,
  },
  input: {
    width: "100%",
    height: 45,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  button: {
    width: "100%",
    paddingVertical: 15,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: "center",
    elevation: 4,
  },
  buttonStart: {
    backgroundColor: "#008000",
  },
  buttonStop: {
    backgroundColor: "#900020",
  },
  buttonMap: {
    width: "100%",
    maxWidth: 400,
    paddingVertical: 15,
    borderRadius: 8,
    backgroundColor: "#bc8f8f",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  buttonMapText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: "700",
    marginLeft: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: "700",
  },
});
