import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

interface Socio {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  fechaAlta: string;
  activo: boolean;
  pagado: boolean;
}

export default function Perfil() {
  const { idSocio } = useLocalSearchParams();
  const [socio, setSocio] = useState<Socio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const res = await fetch(`https://tfg-mbc.onrender.com/api/socios/${idSocio}`);

        if (!res.ok) {
          throw new Error(`Error HTTP: ${res.status}`);
        }

        const text = await res.text();

        if (!text) {
          throw new Error('Respuesta vacía del servidor');
        }

        const data: Socio = JSON.parse(text);
        setSocio(data);
      } catch (err) {
        console.error('Error al obtener el perfil:', err);
        setSocio(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPerfil();
  }, [idSocio]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!socio) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red', fontSize: 16 }}>
          ⚠️ Error al cargar el perfil.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>👤 Nombre:</Text>
      <Text style={styles.value}>{socio.nombre}</Text>

      <Text style={styles.label}>👥 Apellidos:</Text>
      <Text style={styles.value}>{socio.apellidos}</Text>

      <Text style={styles.label}>📧 Email:</Text>
      <Text style={styles.value}>{socio.email}</Text>

      <Text style={styles.label}>📞 Teléfono:</Text>
      <Text style={styles.value}>{socio.telefono}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
    margin: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
    color: '#555',
  },
  value: {
    fontSize: 16,
    color: '#111',
    marginBottom: 5,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
