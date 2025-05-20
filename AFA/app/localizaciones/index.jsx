// app/localizaciones/index.tsx
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, Pressable, Button } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";

const TIPOS_LOCALIZACION = ["Evento", "Fotogenia"];

export default function Localizaciones() {
  const router = useRouter();
  const [localizaciones, setLocalizaciones] = useState([]);
  const [tipoFiltro, setTipoFiltro] = useState("Fotogenia");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarLocalizaciones = async () => {
      setLoading(true);
      try {
        if (tipoFiltro === "TODAS") {
          const respuestas = await Promise.all(
            TIPOS_LOCALIZACION.map((tipo) =>
              fetch(`https://tfg-mbc.onrender.com/api/localizaciones/tipo/${tipo}`).then((res) =>
                res.json()
              )
            )
          );
          const todas = respuestas.flat();
          setLocalizaciones(todas);
        } else {
          const res = await fetch(
            `https://tfg-mbc.onrender.com/api/localizaciones/tipo/${tipoFiltro}`
          );
          const data = await res.json();
          setLocalizaciones(data);
        }
      } catch (e) {
        setLocalizaciones([]);
      } finally {
        setLoading(false);
      }
    };

    cargarLocalizaciones();
  }, [tipoFiltro]);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button title="Crear localización" onPress={() => router.push("/localizaciones/crear")} />

      <Text style={{ marginTop: 15 }}>Filtrar por tipo de localización:</Text>
      <View style={{ backgroundColor: "white", borderRadius: 5, marginVertical: 5 }}>
        <Picker
          selectedValue={tipoFiltro}
          onValueChange={(itemValue) => setTipoFiltro(itemValue)}
          style={{ color: "black" }}
          dropdownIconColor="black"
        >
          <Picker.Item label="Todas" value="TODAS" />
          {TIPOS_LOCALIZACION.map((tipo) => (
            <Picker.Item key={tipo} label={tipo} value={tipo} />
          ))}
        </Picker>
      </View>

      <Text style={{ marginVertical: 10 }}>Localizaciones filtradas:</Text>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : localizaciones.length === 0 ? (
        <Text>No hay localizaciones disponibles.</Text>
      ) : (
        <FlatList
          data={localizaciones}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable onPress={() => router.push("/localizaciones/" + item.id)}>
              <View
                style={{
                  marginBottom: 10,
                  borderBottomWidth: 1,
                  paddingBottom: 5,
                  backgroundColor: "#f9f9f9",
                  borderRadius: 5,
                  padding: 10,
                }}
              >
                <Text>
                  <Text style={{ fontWeight: "bold" }}>Nombre:</Text> {item.nombre}
                </Text>
                <Text>
                  <Text style={{ fontWeight: "bold" }}>Dirección:</Text> {item.direccion}
                </Text>
                <Text>
                  <Text style={{ fontWeight: "bold" }}>Tipo:</Text> {item.tipoLocalizacion}
                </Text>
                <Text>
                  <Text style={{ fontWeight: "bold" }}>Descripción:</Text> {item.descripcion}
                </Text>
              </View>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}
