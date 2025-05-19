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

export default function DetalleSocioScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [socio, setSocio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSocio = async () => {
      try {
        const res = await fetch(`https://tfg-mbc.onrender.com/api/socios/${id}`);
        const data = await res.json();
        setSocio(data);
      } catch (error) {
        Alert.alert('Error', 'No se pudo cargar el socio');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchSocio();
  }, [id]);

  const handleDelete = () => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que deseas borrar este socio?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Borrar',
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await fetch(`https://tfg-mbc.onrender.com/api/socios/${id}`, {
                method: 'DELETE',
              });
              if (res.ok) {
                Alert.alert('Eliminado', 'Socio eliminado correctamente');
                router.replace('/socios');
              } else {
                Alert.alert('Error', 'No se pudo eliminar el socio');
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
  if (!socio) return <Text>No se encontró el socio</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.name}>{socio.nombre} {socio.apellidos}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{socio.email}</Text>

        <Text style={styles.label}>Teléfono:</Text>
        <Text style={styles.value}>{socio.telefono || 'No proporcionado'}</Text>

        <Text style={styles.label}>Fecha de nacimiento:</Text>
        <Text style={styles.value}>{socio.fechaNacimiento || 'No especificada'}</Text>

        <Text style={styles.label}>Fecha de alta:</Text>
        <Text style={styles.value}>{socio.fechaAlta || 'No especificada'}</Text>

        <Text style={styles.label}>Estado:</Text>
        <Text style={styles.value}>{socio.activo ? '🟢 Activo' : '🔴 Inactivo'}</Text>

        <Text style={styles.label}>Rol:</Text>
        <Text style={styles.value}>{socio.admin ? '👑 Administrador' : '👤 Usuario'}</Text>

        <Text style={styles.label}>Cuota pagada:</Text>
        <Text style={styles.value}>{socio.pagado ? '✅ Sí' : '❌ No'}</Text>

        <View style={styles.buttonGroup}>
          <View style={styles.button}>
            <Button title="Editar Socio" onPress={() => router.replace(`/socios/${id}/editar`)} />
          </View>
          <View style={styles.button}>
            <Button title="Borrar Socio" color="red" onPress={handleDelete} />
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
