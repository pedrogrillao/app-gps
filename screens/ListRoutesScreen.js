import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Parse from "parse/react-native";
import { useFocusEffect } from "@react-navigation/native";

export default function ListRoutesScreen({ navigation }) {
  const [routes, setRoutes] = useState([]);

  const fetchRoutes = async () => {
    const Route = Parse.Object.extend("Route");
    const query = new Parse.Query(Route);
    const results = await query.find();
    setRoutes(results);
  };

  useFocusEffect(
    useCallback(() => {
      fetchRoutes();
    }, [])
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={routes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.name}>{item.get("name")}</Text>
              <Text style={styles.date}>
                {item.get("date").toLocaleDateString()}
              </Text>
              <Text style={styles.distance}>
                Distância percorrida: {item.get("dist")} metros
              </Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("Rota", { route: item })}
              >
                <Text style={styles.buttonText}>Ver Rota</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonDelete}
                onPress={async () => {
                  await item.destroy();
                  fetchRoutes(); // Atualiza a lista após exclusão
                }}
              >
                <Text style={styles.buttonText}>Excluir Rota</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#a7f6f6', // Fundo ciano
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  card: {
    backgroundColor: "#fff", // Fundo branco
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  cardContent: {
    alignItems: "flex-start",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: '#333',
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    color: "#777",
    marginBottom: 10,
  },
  distance: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#008000", // Verde
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonDelete: {
    backgroundColor: "#900020", // Vermelho
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "700",
  },
});
