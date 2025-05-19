// app/socios/index.tsx
import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, Button, FlatList, StyleSheet, Switch, TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function ListaSocios() {
  const [socios, setSocios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroPagado, setFiltroPagado] = useState(false);
  const [filtroActivo, setFiltroActivo] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchSocios();
  }, []);

  const fetchSocios = async () => {
    try {
      const response = await fetch('https://tfg-mbc.onrender.com/api/socios');
      const data = await response.json();
      setSocios(data);
    } catch (error) {
      console.error('Error al obtener socios:', error);
    }
  };

  const sociosFiltrados = socios.filter((socio) => {
    const coincideBusqueda =
      socio.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      socio.apellidos.toLowerCase().includes(busqueda.toLowerCase()) ||
      socio.email.toLowerCase().includes(busqueda.toLowerCase());

    const coincidePagado = !filtroPagado || socio.pagado;
    const coincideActivo = !filtroActivo || socio.activo;

    return coincideBusqueda && coincidePagado && coincideActivo;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Lista de Socios</Text>

      <TextInput
        placeholder="Buscar por nombre, apellidos o email"
        style={styles.input}
        value={busqueda}
        onChangeText={setBusqueda}
      />

      <View style={styles.filtros}>
        <View style={styles.filtro}>
          <Text>Pagado</Text>
          <Switch value={filtroPagado} onValueChange={setFiltroPagado} />
        </View>
        <View style={styles.filtro}>
          <Text>Activo</Text>
          <Switch value={filtroActivo} onValueChange={setFiltroActivo} />
        </View>
      </View>

      <Button title="Añadir Socio" onPress={() => router.push('/socios/crear')} />

      <FlatList
        data={sociosFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/socios/${item.id}`)}>
            <View style={styles.item}>
              <Text style={styles.nombre}>{item.nombre} {item.apellidos}</Text>
              <Text style={styles.info}>{item.email} - {item.telefono}</Text>
              <Text style={styles.estado}>
                {item.pagado ? '✔ Pagado' : '✖ No pagado'} | {item.activo ? 'Activo' : 'Inactivo'}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  input: { borderWidth: 1, padding: 8, borderRadius: 6, marginBottom: 10 },
  filtros: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  filtro: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  item: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  nombre: { fontWeight: 'bold', fontSize: 16 },
  info: { color: '#666' },
  estado: { marginTop: 4, fontStyle: 'italic' },
});
