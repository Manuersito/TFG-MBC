import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, ActivityIndicator } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";

const TIPOS = ["GENERAL", "PAGO", "EVENTO", "NOVEDAD"];

export default function CrearNotificacionScreen() {
  const router = useRouter();

  const [titulo, setTitulo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipo, setTipo] = useState("GENERAL");
  const [usuarioIdDestino, setUsuarioIdDestino] = useState("");
  const [socios, setSocios] = useState([]);
  const [loadingSocios, setLoadingSocios] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSocios = async () => {
      try {
        const res = await fetch("https://tfg-mbc.onrender.com/api/socios");
        if (!res.ok) throw new Error("Error cargando socios");
        const data = await res.json();
        setSocios(data);
      } catch (e) {
        Alert.alert("Error", e.message);
      } finally {
        setLoadingSocios(false);
      }
    };

    fetchSocios();
  }, []);

  const handleCrear = async () => {
    if (!titulo.trim()) {
      Alert.alert("Validación", "El título es obligatorio");
      return;
    }
    if (!mensaje.trim()) {
      Alert.alert("Validación", "El mensaje es obligatorio");
      return;
    }

    setSaving(true);
    try {
      const body = {
        
        titulo,
        mensaje,
        tipo,
        usuarioIdDestino: usuarioIdDestino || "",
        fechaCreacion: new Date().toISOString(),
      };

      const res = await fetch("https://tfg-mbc.onrender.com/api/notificaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        Alert.alert("Éxito", "Notificación creada correctamente", [
          { text: "OK", onPress: () => router.push("/notificaciones") },
        ]);
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al crear la notificación");
      }
    } catch (e) {
      Alert.alert("Error", e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loadingSocios) return <ActivityIndicator style={{ marginTop: 20 }} size="large" />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Título:</Text>
      <TextInput
        style={styles.input}
        placeholder="Título de la notificación"
        value={titulo}
        onChangeText={setTitulo}
      />

      <Text style={styles.label}>Mensaje:</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Mensaje de la notificación"
        multiline
        value={mensaje}
        onChangeText={setMensaje}
      />

      <Text style={styles.label}>Tipo:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={tipo}
          onValueChange={setTipo}
          style={styles.picker}
          dropdownIconColor="black"
        >
          {TIPOS.map((tipoItem) => (
            <Picker.Item key={tipoItem} label={tipoItem} value={tipoItem} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Usuario destino:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={usuarioIdDestino}
          onValueChange={setUsuarioIdDestino}
          style={styles.picker}
          dropdownIconColor="black"
        >
          <Picker.Item label="Todos (sin destinatario)" value={null} />
          {socios.map((socio) => (
            <Picker.Item
              key={socio.id}
              label={`${socio.nombre || ""} ${socio.apellido || ""}`.trim() || socio.id}
              value={socio.id}
            />
          ))}
        </Picker>
      </View>

      <View style={{ marginTop: 20 }}>
        <Button title={saving ? "Creando..." : "Crear notificación"} onPress={handleCrear} disabled={saving} />
      </View>

      <View style={{ marginTop: 10 }}>
        <Button title="Cancelar" color="gray" onPress={() => router.back()} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: "white",
  },
  label: {
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 6,
    fontSize: 16,
    color: "#444",
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 6,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  picker: {
    color: "black",
  },
});
