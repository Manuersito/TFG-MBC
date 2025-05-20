import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';

export default function DetalleLocalizacionScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [localizacion, setLocalizacion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocalizacion = async () => {
      try {
        const res = await fetch(`https://tfg-mbc.onrender.com/api/localizaciones/${id}`);
        const data = await res.json();
        setLocalizacion(data);
      } catch (error) {
        Alert.alert('Error', 'No se pudo cargar la localización');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchLocalizacion();
  }, [id]);

  const handleDelete = () => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que deseas borrar esta localización?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Borrar',
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await fetch(`https://tfg-mbc.onrender.com/api/localizaciones/${id}`, {
                method: 'DELETE',
              });
              if (res.ok) {
                Alert.alert('Eliminado', 'Localización eliminada correctamente');
                router.replace('/localizaciones');
              } else {
                Alert.alert('Error', 'No se pudo eliminar la localización');
              }
            } catch (error) {
              Alert.alert('Error', 'Ocurrió un error al eliminar');
            }
          },
        },
      ]
    );
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} />;
  if (!localizacion) return <Text style={styles.errorText}>No se encontró la localización</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.name}>{localizacion.nombre}</Text>

        <Text style={styles.label}>Tipo de localización:</Text>
        <Text style={styles.value}>{localizacion.tipoLocalizacion || 'No especificado'}</Text>

        <Text style={styles.label}>Dirección:</Text>
        <Text style={styles.value}>{localizacion.direccion || 'No especificada'}</Text>

        {localizacion.descripcion ? (
          <>
            <Text style={styles.label}>Descripción:</Text>
            <Text style={styles.value}>{localizacion.descripcion}</Text>
          </>
        ) : null}

        <View style={styles.buttonGroup}>
          <View style={styles.button}>
            <Button
              title="Editar Localización"
              onPress={() => router.replace(`/localizaciones/${id}/editar`)}
            />
          </View>
          <View style={styles.button}>
            <Button
              title="Borrar Localización"
              color="red"
              onPress={handleDelete}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    fontWeight: '600',
    marginTop: 12,
    color: '#555',
  },
  value: {
    fontSize: 16,
    marginTop: 4,
    marginBottom: 4,
    color: '#222',
  },
  buttonGroup: {
    marginTop: 30,
    gap: 10,
  },
  button: {
    marginBottom: 10,
  },
  errorText: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
    color: 'red',
  },
});
