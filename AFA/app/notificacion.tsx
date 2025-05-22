import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

interface Notificacion {
  id: string;
  titulo: string;
  mensaje: string;
  fechaCreacion: string;
  tipo: string;
  usuarioIdDestino: string | null;
}

export default function Notificaciones() {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(true);

  const { idSocio } = useLocalSearchParams(); // ID del socio que ha iniciado sesión

  useEffect(() => {
    fetch('https://tfg-mbc.onrender.com/api/notificaciones')
      .then(res => res.json())
      .then((data: Notificacion[]) => {
        const idActual = idSocio as string;

        const filtradas = data.filter(n =>
          n.usuarioIdDestino === null || n.usuarioIdDestino === idActual
        );

        // Ordenar por fecha descendente (opcional)
        const ordenadas = filtradas.sort(
          (a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
        );

        setNotificaciones(ordenadas);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [idSocio]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (notificaciones.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No hay notificaciones disponibles.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={notificaciones}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.title}>{item.titulo}</Text>
          <Text>{item.mensaje}</Text>
          <Text style={styles.fecha}>
            {new Date(item.fechaCreacion).toLocaleDateString()} {new Date(item.fechaCreacion).toLocaleTimeString()}
          </Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16 },
  card: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  fecha: { marginTop: 6, fontSize: 12, fontStyle: 'italic', color: '#666' },
});
