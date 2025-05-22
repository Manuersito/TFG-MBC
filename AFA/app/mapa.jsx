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

        // Calcular la región que abarque todos los puntos
        if (data.length > 0) {
          let minLat = data[0].ubicacion.coordinates[1];
          let maxLat = data[0].ubicacion.coordinates[1];
          let minLon = data[0].ubicacion.coordinates[0];
          let maxLon = data[0].ubicacion.coordinates[0];

          data.forEach(loc => {
            const [longitude, latitude] = loc.ubicacion.coordinates;
            // DEBUG: Log para verificar las coordenadas extraídas para cada marcador
            console.log(`DEBUG: Procesando localización ${loc.nombre} - Coords API: [${loc.ubicacion.coordinates[0]}, ${loc.ubicacion.coordinates[1]}] -> Latitud extraída: ${latitude}, Longitud extraída: ${longitude}`);
            minLat = Math.min(minLat, latitude);
            maxLat = Math.max(maxLat, latitude);
            minLon = Math.min(minLon, longitude);
            maxLon = Math.max(maxLon, longitude);
          });

          const centerLat = (minLat + maxLat) / 2;
          const centerLon = (minLon + maxLon) / 2;

          // Calcular deltas iniciales
          let latitudeDelta = (maxLat - minLat) * 1.2;
          let longitudeDelta = (maxLon - minLon) * 1.2;

          // Asegurar un delta mínimo para evitar zoom excesivo si todos los puntos están muy cerca
          // Asegurar un delta mínimo si solo hay un punto
          if (latitudeDelta <= 0) latitudeDelta = 0.05;
          if (longitudeDelta <= 0) longitudeDelta = 0.05;

          // Clamp deltas para evitar valores excesivamente grandes que causen problemas de renderizado
          // El delta de latitud no puede ser mayor que 180 (altura del mundo)
          // El delta de longitud no puede ser mayor que 360 (ancho del mundo)
          const clampedLatitudeDelta = Math.min(latitudeDelta, 170); // Usamos 170 para dar un pequeño margen
          const clampedLongitudeDelta = Math.min(longitudeDelta, 350); // Usamos 350 para dar un pequeño margen

          const calculatedRegion = {
            latitude: centerLat,
            longitude: centerLon,
            latitudeDelta: clampedLatitudeDelta,
            longitudeDelta: clampedLongitudeDelta,
          };
          setMapRegion(calculatedRegion);
          console.log("Región del mapa calculada (después de clamping):", calculatedRegion); // Log para ver la región final
        } else {
          // Si no hay localizaciones, establecer una región por defecto (Madrid)
          const defaultRegion = {
            latitude: 40.4168,
            longitude: -3.7038,
            latitudeDelta: 0.3,
            longitudeDelta: 0.3,
          };
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
    bottom: 20, // Posiciona el overlay en la parte inferior
    left: 20,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
    // Opcional: un fondo semitransparente para el contenedor del overlay
    // backgroundColor: 'rgba(0,0,0,0.5)',
  },
  overlayContent: {
    width: '90%', // Ocupa la mayor parte del ancho disponible
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
