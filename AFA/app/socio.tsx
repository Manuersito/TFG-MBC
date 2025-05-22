import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';

interface Socio {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
}

export default function ListaSocios() {
  const [socios, setSocios] = useState<Socio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://tfg-mbc.onrender.com/api/socios?activo=true')
      .then((res) => res.json())
      .then((data) => {
        setSocios(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error al obtener socios:', err);
        setLoading(false);
      });
  }, []);

  const renderItem = ({ item }: { item: Socio }) => (
    <View style={styles.card}>
      <Text style={styles.nombre}>
        {item.nombre} {item.apellidos}
      </Text>
      <Text style={styles.text}>📧 {item.email}</Text>
      <Text style={styles.text}>📱 {item.telefono}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={socios}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 10 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2' },
  card: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
  },
  text: {
    fontSize: 15,
    color: '#555',
    marginVertical: 1,
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
