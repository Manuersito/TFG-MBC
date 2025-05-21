import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MapView, Marker } from '@maplibre/maplibre-react-native';
import { MapPin, Camera } from 'lucide-react-native';

export default function MapaScreen() {
  const [localizaciones, setLocalizaciones] = useState([]);
  const [filtro, setFiltro] = useState('todos');
  const [popup, setPopup] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchLocalizaciones = async () => {
    try {
      const response = await fetch('https://tfg-mbc.onrender.com/api/localizaciones');
      const data = await response.json();
      setLocalizaciones(data);
    } catch (error) {
      console.error('Error cargando localizaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocalizaciones();
  }, []);

  const filtradas = filtro === 'todos'
    ? localizaciones
    : localizaciones.filter(loc => loc.tipoLocalizacion?.toLowerCase() === filtro);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        styleURL="https://demotiles.maplibre.org/style.json"
        zoomEnabled
        centerCoordinate={[-3.7038, 40.4168]}
        zoomLevel={12}
      >
        {!loading && filtradas.map(loc => {
          const coords = loc.ubicacion?.coordinates;
          if (!coords || coords.length < 2) return null;

          const [longitud, latitud] = coords;

          return (
            <Marker
              key={loc.id}
              coordinate={[longitud, latitud]}
              onSelected={() => setPopup(loc)}
            >
              <View style={styles.marker}>
                {loc.tipoLocalizacion?.toLowerCase() === 'evento' ? (
                  <MapPin color="#FF8000" size={26} />
                ) : (
                  <Camera color="#007bff" size={26} />
                )}
              </View>
            </Marker>
          );
        })}
      </MapView>

      {popup && (
        <View style={styles.popup}>
          <Text style={styles.popupTitle}>{popup.nombre}</Text>
          <Text style={styles.popupDesc}>{popup.descripcion}</Text>
          <TouchableOpacity onPress={() => setPopup(null)} style={styles.popupCerrar}>
            <Text style={{ color: '#fff' }}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.filtros}>
        <TouchableOpacity onPress={() => setFiltro('todos')} style={styles.filtroBtn}>
          <Text style={styles.filtroTexto}>Todos</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFiltro('evento')} style={styles.filtroBtn}>
          <Text style={styles.filtroTexto}>Eventos</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFiltro('fotogenia')} style={styles.filtroBtn}>
          <Text style={styles.filtroTexto}>Fotogenia</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#FF8000" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  marker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  popup: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    elevation: 5,
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  popupDesc: {
    fontSize: 14,
    color: '#444',
    marginBottom: 10,
  },
  popupCerrar: {
    backgroundColor: '#FF8000',
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  filtros: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  filtroBtn: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  filtroTexto: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF8000',
  },
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
});
