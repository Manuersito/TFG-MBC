import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Switch,
} from 'react-native';

export default function EditarSocioScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [socio, setSocio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSocio = async () => {
      try {
        const res = await fetch(`https://tfg-mbc.onrender.com/api/socios/${id}`);
        if (!res.ok) throw new Error('Error al obtener los datos');
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

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`https://tfg-mbc.onrender.com/api/socios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(socio),
      });

      if (res.ok) {
        Alert.alert('Éxito', 'Socio actualizado correctamente');
        router.replace(`/socios/${id}`);
      } else {
        const errorText = await res.text();
        Alert.alert('Error', `No se pudo actualizar el socio: ${errorText}`);
      }
    } catch {
      Alert.alert('Error', 'Error al guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} />;
  if (!socio) return <Text style={styles.errorText}>No se encontró el socio</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Editar Socio</Text>

        <TextField label="Nombre" value={socio.nombre} onChangeText={(text) => setSocio({ ...socio, nombre: text })} />
        <TextField label="Apellidos" value={socio.apellidos} onChangeText={(text) => setSocio({ ...socio, apellidos: text })} />
        <TextField label="Email" value={socio.email} onChangeText={(text) => setSocio({ ...socio, email: text })} keyboardType="email-address" />
        <TextField label="Teléfono" value={socio.telefono || ''} onChangeText={(text) => setSocio({ ...socio, telefono: text })} keyboardType="phone-pad" />
        <TextField label="Fecha de Nacimiento (YYYY-MM-DD)" value={socio.fechaNacimiento || ''} onChangeText={(text) => setSocio({ ...socio, fechaNacimiento: text })} />
        <TextField label="Fecha de Alta (YYYY-MM-DD)" value={socio.fechaAlta || ''} onChangeText={(text) => setSocio({ ...socio, fechaAlta: text })} />
        <TextField label="Password" value={socio.password || ''} onChangeText={(text) => setSocio({ ...socio, password: text })} secureTextEntry />

        <ToggleSwitch label="Activo" value={socio.activo} onValueChange={(value) => setSocio({ ...socio, activo: value })} />
        <ToggleSwitch label="Administrador" value={socio.admin} onValueChange={(value) => setSocio({ ...socio, admin: value })} />
        <ToggleSwitch label="Cuota pagada" value={socio.pagado} onValueChange={(value) => setSocio({ ...socio, pagado: value })} />

        <View style={styles.buttonContainer}>
          <Button
            title={saving ? 'Guardando...' : 'Guardar Cambios'}
            onPress={handleSave}
            disabled={saving}
          />
        </View>
      </View>
    </ScrollView>
  );
}

// Componente reutilizable para campos de texto
function TextField({ label, ...props }) {
  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} {...props} />
    </>
  );
}

// Componente reutilizable para switches
function ToggleSwitch({ label, value, onValueChange }) {
  return (
    <View style={styles.switchContainer}>
      <Text style={styles.label}>{label}:</Text>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
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
    color: '#333',
  },
  label: {
    fontWeight: '600',
    marginTop: 10,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  switchContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: 30,
  },
  errorText: {
    marginTop: 20,
    textAlign: 'center',
    color: 'red',
  },
});
