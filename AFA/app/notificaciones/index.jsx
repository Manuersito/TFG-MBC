import React, { useState, useEffect } from "react";
import { View, Text, FlatList, ActivityIndicator, Pressable, Button } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";

const TIPOS = ["GENERAL", "PAGO", "EVENTO", "NOVEDAD"];

export default function Notificaciones() {
  const router = useRouter();
  const [notificaciones, setNotificaciones] = useState([]);
  const [socios, setSocios] = useState([]);
  const [tipoFiltro, setTipoFiltro] = useState("GENERAL");
  const [usuarioFiltro, setUsuarioFiltro] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://tfg-mbc.onrender.com/api/socios")
      .then((res) => res.json())
      .then((data) => setSocios(data))
      .catch(() => setSocios([]));
  }, []);

  useEffect(() => {
    setLoading(true);

    const cargarNotificaciones = async () => {
      try {
        if (tipoFiltro === "TODOS") {
          const respuestas = await Promise.all(
            TIPOS.map((tipo) =>
              fetch(`https://tfg-mbc.onrender.com/api/notificaciones/tipo/${tipo}`).then((res) =>
                res.json()
              )
            )
          );
          const todas = respuestas.flat();
          setNotificaciones(todas);
        } else {
          const res = await fetch(
            `https://tfg-mbc.onrender.com/api/notificaciones/tipo/${tipoFiltro}`
          );
          const data = await res.json();
          setNotificaciones(data);
        }
      } catch (e) {
        setNotificaciones([]);
      } finally {
        setLoading(false);
      }
    };

    cargarNotificaciones();
  }, [tipoFiltro]);

  const notificacionesFiltradas = notificaciones.filter((notif) => {
    return usuarioFiltro === "" || notif.usuarioIdDestino === usuarioFiltro;
  });

  const getNombreSocio = (id) => {
    const socio = socios.find((s) => s.id === id);
    return socio ? `${socio.nombre || ""} ${socio.apellido || ""}`.trim() || socio.id : "Sin nombre";
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button title="Crear notificación" onPress={() => router.push("/notificaciones/crear")} />

      <Text style={{ marginTop: 15 }}>Filtrar por tipo:</Text>
      <View style={{ backgroundColor: "white", borderRadius: 5, marginVertical: 5 }}>
        <Picker
          selectedValue={tipoFiltro}
          onValueChange={(itemValue) => setTipoFiltro(itemValue)}
          style={{ color: "black" }}
          dropdownIconColor="black"
        >
          <Picker.Item label="Todos" value="TODOS" />
          {TIPOS.map((tipo) => (
            <Picker.Item key={tipo} label={tipo} value={tipo} />
          ))}
        </Picker>
      </View>

      <Text>Filtrar por socio (usuarioIdDestino):</Text>
      <View style={{ backgroundColor: "white", borderRadius: 5, marginVertical: 5 }}>
        <Picker
          selectedValue={usuarioFiltro}
          onValueChange={(itemValue) => setUsuarioFiltro(itemValue)}
          style={{ color: "black" }}
          dropdownIconColor="black"
        >
          <Picker.Item label="Todos los socios" value="" />
          {socios.map((socio) => (
            <Picker.Item
              key={socio.id}
              label={`${socio.nombre || ""} ${socio.apellido || ""}`.trim() || socio.id}
              value={socio.id}
            />
          ))}
        </Picker>
      </View>

      <Text style={{ marginVertical: 10 }}>Notificaciones filtradas:</Text>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : notificacionesFiltradas.length === 0 ? (
        <Text>No hay notificaciones disponibles.</Text>
      ) : (
        <FlatList
          data={notificacionesFiltradas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable onPress={() => router.push("/notificaciones/" + item.id)}>
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
                  <Text style={{ fontWeight: "bold" }}>Título:</Text> {item.titulo}
                </Text>
                <Text>
                  <Text style={{ fontWeight: "bold" }}>Mensaje:</Text> {item.mensaje}
                </Text>
                <Text>
                  <Text style={{ fontWeight: "bold" }}>Tipo:</Text> {item.tipo}
                </Text>
                <Text>
                  <Text style={{ fontWeight: "bold" }}>Usuario destino:</Text>{" "}
                  {getNombreSocio(item.usuarioIdDestino)}
                </Text>
              </View>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}
