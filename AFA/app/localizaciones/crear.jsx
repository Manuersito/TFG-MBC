import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  Text,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';

const TIPOS_LOCALIZACION = ['Evento', 'Fotogenia'];

export default function CrearLocalizacionScreen() {
  const router = useRouter();

  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tipoLocalizacion, setTipoLocalizacion] = useState('Fotogenia');
  const [x, setX] = useState('');
  const [y, setY] = useState('');

  const crearLocalizacion = async () => {
    if (!nombre || !direccion || !tipoLocalizacion || !x || !y) {
      Alert.alert(
        'Error',
        'Por favor, rellena los campos obligatorios (nombre, dirección, tipo, coordenadas)'
      );
      return;
    }

    const longitud = parseFloat(x);
    const latitud = parseFloat(y);

    if (isNaN(longitud) || isNaN(latitud)) {
      Alert.alert('Error', 'Las coordenadas deben ser números válidos');
      return;
    }

    try {
      const response = await fetch('https://tfg-mbc.onrender.com/api/localizaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          direccion,
          descripcion,
          tipoLocalizacion,
          ubicacion: {
            type: 'Point',
            coordinates: [longitud, latitud],
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear la localización');
      }

      Alert.alert('Éxito', 'Localización creada correctamente');
      router.push('/localizaciones');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <TextInput
        placeholder="Nombre *"
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        placeholder="Dirección *"
        style={styles.input}
        value={direccion}
        onChangeText={setDireccion}
      />
      <TextInput
        placeholder="Descripción"
        style={[styles.input, { height: 80 }]}
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
      />

      <Text style={styles.label}>Tipo de localización *</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={tipoLocalizacion}
          onValueChange={(itemValue) => setTipoLocalizacion(itemValue)}
          style={styles.picker}
          dropdownIconColor="black"
        >
          {TIPOS_LOCALIZACION.map((tipo) => (
            <Picker.Item key={tipo} label={tipo} value={tipo} />
          ))}
        </Picker>
      </View>

      <TextInput
        placeholder="Longitud (x) *"
        style={styles.input}
        keyboardType="decimal-pad"
        value={x}
        onChangeText={setX}
      />
      <TextInput
        placeholder="Latitud (y) *"
        style={styles.input}
        keyboardType="decimal-pad"
        value={y}
        onChangeText={setY}
      />

      <Button title="Crear Localización" onPress={crearLocalizacion} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  label: {
    marginBottom: 5,
    fontWeight: '600',
    color: '#333',
  },
  pickerWrapper: {
    backgroundColor: '#fff',
    borderRadius: 6,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  picker: {
    height: 200,
    width: '100%',
  },
});
