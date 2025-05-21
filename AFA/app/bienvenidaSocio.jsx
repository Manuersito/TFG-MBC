import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { MapPin, Bell, User, Users } from "lucide-react-native";

export default function BienvenidaSocio() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Bienvenido/a Socio!</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/mapa")}>
        <MapPin color="#fff" size={20} style={styles.icon} />
        <Text style={styles.buttonText}>Ver Localizaciones</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/notificaciones")}>
        <Bell color="#fff" size={20} style={styles.icon} />
        <Text style={styles.buttonText}>Notificaciones</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/perfil")}>
        <User color="#fff" size={20} style={styles.icon} />
        <Text style={styles.buttonText}>Mi Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/socios")}>
        <Users color="#fff" size={20} style={styles.icon} />
        <Text style={styles.buttonText}>Lista de Socios</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 40,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#FF8000',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
