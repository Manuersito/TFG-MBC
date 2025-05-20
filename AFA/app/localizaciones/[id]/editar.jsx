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
} from 'react-native';
import { Picker } from '@react-native-picker/picker';


export default function EditarLocalizacionScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [localizacion, setLocalizacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [coordX, setCoordX] = useState('');
  const [coordY, setCoordY] = useState('');

  useEffect(() => {
    const fetchLocalizacion = async () => {
      try {
        const res = await fetch(`https://tfg-mbc.onrender.com/api/localizaciones/${id}`);
        if (!res.ok) throw new Error('Error al obtener los datos');
        const data = await res.json();

        setLocalizacion(data);
        if (data.ubicacion?.coordinates) {
          setCoordX(data.ubicacion.coordinates[0].toString());
          setCoordY(data.ubicacion.coordinates[1].toString());
        }
      } catch (error) {
        Alert.alert('Error', 'No se pudo cargar la localización');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchLocalizacion();
  }, [id]);

  const handleSave = async () => {
    if (isNaN(coordX) || isNaN(coordY)) {
      Alert.alert('Error', 'Las coordenadas deben ser números válidos');
      return;
    }

    setSaving(true);
    try {
      const updatedLocalizacion = {
        ...localizacion,
        ubicacion: {
          type: 'Point',
          coordinates: [parseFloat(coordX), parseFloat(coordY)],
        },
      };

      const res = await fetch(`https://tfg-mbc.onrender.com/api/localizaciones/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedLocalizacion),
      });

      if (res.ok) {
        Alert.alert('Éxito', 'Localización actualizada correctamente');
        router.replace(`/localizaciones/${id}`);
      } else {
        const errorText = await res.text();
        Alert.alert('Error', `No se pudo actualizar: ${errorText}`);
      }
    } catch {
      Alert.alert('Error', 'Error al guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} />;
  if (!localizacion) return <Text style={styles.errorText}>No se encontró la localización</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Editar Localización</Text>

        <TextField
          label="Nombre"
          value={localizacion.nombre}
          onChangeText={(text) => setLocalizacion({ ...localizacion, nombre: text })}
        />
        <TextField
          label="Dirección"
          value={localizacion.direccion}
          onChangeText={(text) => setLocalizacion({ ...localizacion, direccion: text })}
        />
        <TextField
          label="Descripción"
          value={localizacion.descripcion}
          onChangeText={(text) => setLocalizacion({ ...localizacion, descripcion: text })}
        />
        <Text style={styles.label}>Tipo de Localización</Text>
<View style={styles.pickerWrapper}>
  <Picker
    selectedValue={localizacion.tipoLocalizacion}
    onValueChange={(itemValue) =>
      setLocalizacion({ ...localizacion, tipoLocalizacion: itemValue })
    }>
    <Picker.Item label="Evento" value="Evento" />
    <Picker.Item label="Fotogenia" value="Fotogenia" />
  </Picker>
</View>

        <TextField
          label="Coordenada X (Longitud)"
          value={coordX}
          onChangeText={setCoordX}
          keyboardType="decimal-pad"
        />
        <TextField
          label="Coordenada Y (Latitud)"
          value={coordY}
          onChangeText={setCoordY}
          keyboardType="decimal-pad"
        />

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

function TextField({ label, ...props }) {
  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} {...props} />
    </>
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
  buttonContainer: {
    marginTop: 30,
  },
  errorText: {
    marginTop: 20,
    textAlign: 'center',
    color: 'red',
  },
  pickerWrapper: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  marginTop: 4,
  backgroundColor: '#f9f9f9',
},

});
