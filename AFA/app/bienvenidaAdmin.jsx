import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Users, Bell, MapPin } from 'lucide-react-native';

export default function BienvenidaAdmin() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Bienvenido Administrador!</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/socios')}
      >
        <Users color="#fff" size={20} style={styles.icon} />
        <Text style={styles.buttonText}>Gestión de Socios</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/notificaciones')}
      >
        <Bell color="#fff" size={20} style={styles.icon} />
        <Text style={styles.buttonText}>Gestión de Notificaciones</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/localizaciones')}
      >
        <MapPin color="#fff" size={20} style={styles.icon} />
        <Text style={styles.buttonText}>Gestión de Localizaciones</Text>
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
