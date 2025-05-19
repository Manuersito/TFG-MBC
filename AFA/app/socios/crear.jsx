import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  Text,
  Platform,
  TouchableOpacity,
  Switch,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';

function formatDate(date) {
  return date.toISOString().slice(0, 10); // YYYY-MM-DD
}

export default function CrearSocioScreen() {
  const router = useRouter();

  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');

  const [fechaNacimiento, setFechaNacimiento] = useState(null);
  const [fechaAlta, setFechaAlta] = useState(null);

  const [showFechaNacimientoPicker, setShowFechaNacimientoPicker] = useState(false);
  const [showFechaAltaPicker, setShowFechaAltaPicker] = useState(false);

  const [activo, setActivo] = useState(true);
  const [admin, setAdmin] = useState(false);
  const [pagado, setPagado] = useState(false);

  const [password, setPassword] = useState('');

  const crearSocio = async () => {
    if (!nombre || !apellidos || !email || !password) {
      Alert.alert(
        'Error',
        'Por favor, rellena los campos obligatorios (nombre, apellidos, email, contraseña)'
      );
      return;
    }

    try {
      const response = await fetch('https://tfg-mbc.onrender.com/api/socios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          apellidos,
          email,
          telefono,
          fechaNacimiento: fechaNacimiento ? formatDate(fechaNacimiento) : null,
          fechaAlta: fechaAlta ? formatDate(fechaAlta) : null,
          activo,
          admin,
          password,
          pagado,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear socio');
      }

      Alert.alert('Éxito', 'Socio creado correctamente');
      router.push('/socios');
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
        placeholder="Apellidos *"
        style={styles.input}
        value={apellidos}
        onChangeText={setApellidos}
      />
      <TextInput
        placeholder="Email *"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Teléfono"
        style={styles.input}
        value={telefono}
        onChangeText={setTelefono}
        keyboardType="phone-pad"
      />

      {/* Fecha de nacimiento */}
      <TouchableOpacity
        style={styles.datePickerButton}
        onPress={() => setShowFechaNacimientoPicker(true)}
      >
        <Text style={styles.datePickerText}>
          Fecha de nacimiento: {fechaNacimiento ? formatDate(fechaNacimiento) : 'Seleccionar'}
        </Text>
      </TouchableOpacity>
      {showFechaNacimientoPicker && (
        <DateTimePicker
          value={fechaNacimiento || new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            if (event.type === 'dismissed') {
              setShowFechaNacimientoPicker(false);
              return;
            }
            setShowFechaNacimientoPicker(Platform.OS === 'ios');
            if (selectedDate) setFechaNacimiento(selectedDate);
          }}
          maximumDate={new Date()}
        />
      )}

      {/* Fecha de alta */}
      <TouchableOpacity
        style={styles.datePickerButton}
        onPress={() => setShowFechaAltaPicker(true)}
      >
        <Text style={styles.datePickerText}>
          Fecha de alta: {fechaAlta ? formatDate(fechaAlta) : 'Seleccionar'}
        </Text>
      </TouchableOpacity>
      {showFechaAltaPicker && (
        <DateTimePicker
          value={fechaAlta || new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            if (event.type === 'dismissed') {
              setShowFechaAltaPicker(false);
              return;
            }
            setShowFechaAltaPicker(Platform.OS === 'ios');
            if (selectedDate) setFechaAlta(selectedDate);
          }}
          maximumDate={new Date()}
        />
      )}

      <TextInput
        placeholder="Contraseña *"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Switch para booleanos */}
      <View style={styles.switchContainer}>
        <Text>Activo:</Text>
        <Switch
          value={activo}
          onValueChange={setActivo}
          trackColor={{ false: '#767577', true: '#1e90ff' }}
          thumbColor={activo ? '#fff' : '#f4f3f4'}
        />
      </View>

      <View style={styles.switchContainer}>
        <Text>Administrador:</Text>
        <Switch
          value={admin}
          onValueChange={setAdmin}
          trackColor={{ false: '#767577', true: '#1e90ff' }}
          thumbColor={admin ? '#fff' : '#f4f3f4'}
        />
      </View>

      <View style={styles.switchContainer}>
        <Text>Pagado:</Text>
        <Switch
          value={pagado}
          onValueChange={setPagado}
          trackColor={{ false: '#767577', true: '#1e90ff' }}
          thumbColor={pagado ? '#fff' : '#f4f3f4'}
        />
      </View>

      <Button title="Crear Socio" onPress={crearSocio} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    padding: 8,
    borderRadius: 4,
  },
  datePickerButton: {
    padding: 12,
    backgroundColor: '#eee',
    borderRadius: 4,
    marginBottom: 12,
  },
  datePickerText: {
    color: '#333',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
});
