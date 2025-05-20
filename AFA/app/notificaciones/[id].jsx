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

export default function DetalleNotificacionScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [notificacion, setNotificacion] = useState(null);
  const [socioDestino, setSocioDestino] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotificacion = async () => {
      try {
        const res = await fetch(`https://tfg-mbc.onrender.com/api/notificaciones/${id}`);
        const data = await res.json();
        setNotificacion(data);

        if (data.usuarioIdDestino) {
          const socioRes = await fetch(`https://tfg-mbc.onrender.com/api/socios/${data.usuarioIdDestino}`);
          if (socioRes.ok) {
            const socioData = await socioRes.json();
            setSocioDestino(`${socioData.nombre} ${socioData.apellidos}`);
          } else {
            setSocioDestino('Socio no encontrado');
          }
        }
      } catch (error) {
        Alert.alert('Error', 'No se pudo cargar la notificación o el socio');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchNotificacion();
  }, [id]);

  const handleDelete = () => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que deseas borrar esta notificación?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Borrar',
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await fetch(`https://tfg-mbc.onrender.com/api/notificaciones/${id}`, {
                method: 'DELETE',
              });
              if (res.ok) {
                Alert.alert('Eliminado', 'Notificación eliminada correctamente');
                router.replace('/notificaciones');
              } else {
                Alert.alert('Error', 'No se pudo eliminar la notificación');
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
  if (!notificacion) return <Text>No se encontró la notificación</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{notificacion.titulo}</Text>

        <Text style={styles.label}>Mensaje:</Text>
        <Text style={styles.value}>{notificacion.mensaje}</Text>

        <Text style={styles.label}>Tipo:</Text>
        <Text style={styles.value}>{notificacion.tipo}</Text>

        <Text style={styles.label}>Socio destino:</Text>
        <Text style={styles.value}>
          {socioDestino || 'No especificado'}
        </Text>

        <View style={styles.buttonGroup}>
          <View style={styles.button}>
            <Button title="Editar Notificación" onPress={() => router.replace(`/notificaciones/${id}/editar`)} />
          </View>
          <View style={styles.button}>
            <Button title="Borrar Notificación" color="red" onPress={handleDelete} />
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    fontWeight: '600',
    marginTop: 10,
    color: '#555',
  },
  value: {
    fontSize: 16,
    marginTop: 4,
    marginBottom: 4,
  },
  buttonGroup: {
    marginTop: 30,
    gap: 10,
  },
  button: {
    marginBottom: 10,
  },
});
