import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";

const TIPOS = ["GENERAL", "PAGO", "EVENTO", "NOVEDAD"];

export default function EditarNotificacionScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [notificacion, setNotificacion] = useState(null);
  const [socios, setSocios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [notRes, sociosRes] = await Promise.all([
          fetch(`https://tfg-mbc.onrender.com/api/notificaciones/${id}`),
          fetch("https://tfg-mbc.onrender.com/api/socios"),
        ]);
        if (!notRes.ok) throw new Error("No se pudo cargar la notificación");
        if (!sociosRes.ok) throw new Error("No se pudieron cargar los socios");

        const notData = await notRes.json();
        const sociosData = await sociosRes.json();

        setNotificacion(notData);
        setSocios(sociosData);
      } catch (error) {
        Alert.alert("Error", error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleSave = async () => {
    if (!notificacion.titulo.trim()) {
      Alert.alert("Validación", "El título es obligatorio");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`https://tfg-mbc.onrender.com/api/notificaciones/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notificacion),
      });

      if (res.ok) {
        Alert.alert("Éxito", "Notificación actualizada correctamente", [
          { text: "OK", onPress: () => router.replace(`/notificaciones/${id}`) },
        ]);
      } else {
        throw new Error("Error al guardar la notificación");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} size="large" />;
  if (!notificacion) return <Text>No se encontró la notificación</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Título:</Text>
      <TextInput
        style={styles.input}
        value={notificacion.titulo}
        onChangeText={(text) => setNotificacion({ ...notificacion, titulo: text })}
        placeholder="Título de la notificación"
      />

      <Text style={styles.label}>Mensaje:</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        multiline
        value={notificacion.mensaje}
        onChangeText={(text) => setNotificacion({ ...notificacion, mensaje: text })}
        placeholder="Mensaje de la notificación"
      />

      <Text style={styles.label}>Tipo:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={notificacion.tipo}
          onValueChange={(itemValue) => setNotificacion({ ...notificacion, tipo: itemValue })}
          style={styles.picker}
          dropdownIconColor="black"
        >
          {TIPOS.map((tipo) => (
            <Picker.Item key={tipo} label={tipo} value={tipo} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Usuario destino:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={notificacion.usuarioIdDestino || ""}
          onValueChange={(itemValue) => setNotificacion({ ...notificacion, usuarioIdDestino: itemValue })}
          style={styles.picker}
          dropdownIconColor="black"
        >
          <Picker.Item label="Sin destinatario (General)" value={""} />
          {socios.map((socio) => (
            <Picker.Item
              key={socio.id}
              label={`${socio.nombre || ""} ${socio.apellidos || ""}`.trim() || socio.id}
              value={socio.id}
            />
          ))}
        </Picker>
      </View>

      <View style={{ marginTop: 20 }}>
        <Button title={saving ? "Guardando..." : "Guardar cambios"} onPress={handleSave} disabled={saving} />
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
