import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions, Text, ActivityIndicator, Platform, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'; // Eliminamos Callout de aquí

export default function App() {
  const [localizaciones, setLocalizaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null); // Estado para la ubicación seleccionada
  const [showOverlay, setShowOverlay] = useState(false); // Estado para controlar la visibilidad del overlay
  const [mapRegion, setMapRegion] = useState(null); // Nuevo estado para la región del mapa

  useEffect(() => {
    // Realiza la llamada a la API para obtener los datos de localizaciones
    fetch('https://tfg-mbc.onrender.com/api/localizaciones')
      .then((res) => res.json())
      .then((data) => {
        console.log("Datos de localizaciones recibidos:", data); // Log para ver los datos
        setLocalizaciones(data);
        setLoading(false);
        const defaultRegion = {
          latitude: 40.4168,
          longitude: -3.7038,
          latitudeDelta: 0.3,
          longitudeDelta: 0.3,
        };
        if (data.length > 0) {
         
          setMapRegion(defaultRegion);
          console.log("Región del mapa calculada (después de clamping):", defaultRegion); // Log para ver la región final
        } else {
          // Si no hay datos, establecer una región por defecto         
          setMapRegion(defaultRegion);
          console.log("No hay localizaciones, usando región por defecto:", defaultRegion); // Log si no hay datos
        }
      })
      .catch((error) => {
        console.error("Error al obtener localizaciones:", error);
        setLoading(false);
        // En caso de error, también establecer una región por defecto
        const defaultRegion = {
          latitude: 40.4168,
          longitude: -3.7038,
          latitudeDelta: 0.3,
          longitudeDelta: 0.3,
        };
        setMapRegion(defaultRegion);
        console.log("Error en la API, usando región por defecto:", defaultRegion); // Log en caso de error
      });
  }, []); // El array vacío asegura que este efecto se ejecute solo una vez al montar el componente

  // Muestra un indicador de carga mientras los datos se están obteniendo
  // También espera a que la región del mapa se calcule antes de renderizar el MapView
  if (loading || !mapRegion) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando localizaciones...</Text>
      </View>
    );
  }

  const handleMarkerPress = (loc) => {
    setSelectedLocation(loc);
    setShowOverlay(true);
    console.log(`Marker presionado: ${loc.nombre}`);
  };

  const closeOverlay = () => {
    setShowOverlay(false);
    setSelectedLocation(null);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        // Configura el proveedor del mapa a Google Maps
        provider={PROVIDER_GOOGLE}
        // Usar la región calculada dinámicamente para abarcar todos los marcadores
        initialRegion={mapRegion}
      >
        {/* Itera sobre las localizaciones para crear un Marker para cada una */}
        {localizaciones.map((loc) => {
          // Extrae latitud y longitud de las coordenadas (GeoJSON usa [longitud, latitud])
          const [longitude, latitude] = loc.ubicacion.coordinates;
          // Este log ya estaba, pero es útil para confirmar las coordenadas usadas por el Marker
          console.log(`Renderizando marcador para: ${loc.nombre} en Lat: ${latitude}, Lon: ${longitude}`);
          return (
            <Marker
              key={loc.id} // Clave única para cada Marker
              coordinate={{ latitude, longitude }} // Coordenadas del Marker
              // Se ha eliminado la propiedad 'title' para que no aparezca el nombre por defecto
              onPress={() => handleMarkerPress(loc)} // Llama a nuestra función para mostrar el overlay
            />
          );
        })}
      </MapView>

      {/* Overlay personalizado para mostrar la información de la ubicación seleccionada */}
      {showOverlay && selectedLocation && (
        <View style={styles.overlayContainer}>
          <View style={styles.overlayContent}>
            <Text style={styles.overlayTitle}>{selectedLocation.nombre}</Text>
            <Text style={styles.overlayText}>{selectedLocation.descripcion}</Text>
            <Text style={styles.overlayAddress}>{selectedLocation.direccion}</Text>
            <Text style={styles.overlayType}>Tipo: {selectedLocation.tipoLocalizacion}</Text>
            <TouchableOpacity onPress={closeOverlay} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Estilos para el overlay personalizado
  overlayContainer: {
    position: 'absolute',
    bottom: 20, 
    left: 20,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  overlayContent: {
    width: '90%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 8, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  overlayTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  overlayText: {
    fontSize: 16,
    marginBottom: 4,
  },
  overlayAddress: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  overlayType: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center', // Centra el botón
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
