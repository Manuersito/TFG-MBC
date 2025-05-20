import React, { useEffect, useState } from "react";
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, Image} from "react-native";
import { useRouter } from 'expo-router';


const API_BASE_URL = 'https://tfg-mbc.onrender.com';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [socios, setSocios] = useState([]);
  const [loadingSocios, setLoadingSocios] = useState(false); // Nuevo estado para indicar la carga de socios
  const router = useRouter();


    // Función para obtener todos los socios de la API
    const fetchSocios = async () => {
        setLoadingSocios(true); // Establecer loading a true antes de la petición
        try {
            const url = `${API_BASE_URL}/api/socios`; // Endpoint para obtener todos los socios
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error al obtener socios: ${response.status}`);
            }
            const responseData = await response.json();
            console.log('Socios obtenidos:', responseData);
             // Verificar si responseData es un array antes de asignarlo
            if (Array.isArray(responseData)) {
                setSocios(responseData);
            } else {
                console.error('La respuesta de /api/socios no es un array:', responseData);
                Alert.alert(
                    "Error",
                    "La respuesta del servidor tiene un formato incorrecto.",
                    [{ text: "OK" }],
                    { cancelable: false }
                );
                return false;
            }
            setSocios(responseData); // Almacenar los socios en el estado
        } catch (error: any) {
            console.error('Error al obtener la lista de socios:', error);
            Alert.alert(
                "Error",
                "No se pudo obtener la lista de socios: " + error.message,
                [{ text: "OK" }],
                { cancelable: false }
            );
            return false;
        } finally {
            setLoadingSocios(false); // Establecer loading a false después de la petición
        }
    };

    // Llamar a fetchSocios al montar el componente
    useEffect(() => {
        fetchSocios();
    }, []);


  const handleLogin = async () => {
    console.log('handleLogin se ha llamado');
    const loginData = { email, password };
    console.log('Datos de inicio de sesión:', loginData);

    try {
      const url = `${API_BASE_URL}/auth/login`;
      console.log('URL de la petición:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      console.log('Respuesta de la API:', response);
      console.log('Estado de la respuesta:', response.status);

      const responseText = await response.text();
      console.log('Texto de la respuesta:', responseText);

      if (response.ok) {
        let responseData;
        try {
          responseData = JSON.parse(responseText);
          console.log('Datos parseados:', responseData);
        } catch (error) {
          console.warn('La respuesta no es JSON, tratándola como texto:', responseText);
          responseData = { message: responseText };
        }

        // Buscar el socio que coincide con el email y la contraseña
        const socioCoincidente = socios.find(socio =>
          socio.email === email && socio.password === password // ¡¡¡NUNCA guardes contraseñas en texto plano!!!
        );

        if (socioCoincidente) {
          console.log('Socio encontrado, navegando...');
          if (socioCoincidente.admin === true) {
            router.replace('/bienvenidaAdmin');
          } else {
            router.replace('/bienvenidaSocio');
          }
        }
        else{
          Alert.alert(
              "Login Fallido",
              "Credenciales incorrectas",
              [
                { text: "OK", onPress: () => console.log("OK Pressed") }
              ],
              { cancelable: false }
            );
        }
      } else {
        let errorMessage = `Error del servidor: ${response.status}. Respuesta: ${responseText}`;
         try {
          const errorJson = JSON.parse(responseText);
          if (errorJson && errorJson.message) {
            errorMessage = errorJson.message;
          }
        } catch (parseError) {
          console.error('Error parsing JSON error response', parseError);
          errorMessage = `${errorMessage}. Respuesta del servidor: ${responseText}`;
        }
        Alert.alert(
          "Error de Login",
          errorMessage,
          [
            { text: "OK", onPress: () => console.log("OK Pressed") }
          ],
          { cancelable: false }
        );
      }

    } catch (error: any) {
      console.error('Error en el login:', error);
      Alert.alert(
        "Error de Login",
        error.message,
        [
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ],
        { cancelable: false }
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>
          {"LOGIN"}
        </Text>

        {/* Imagen insertada aquí */}
        <Image
          source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBAJa9Fl6lMBq4QawFmQnpP4drQlY5AjQ9eA&s' }} // Cambia esta URL por la que quieras
          style={styles.image}
          resizeMode="contain"
        />

        <TextInput
          placeholder={"Usuario"}
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            console.log('Email actualizado:', text);
          }}
          style={styles.input}
        />
        <TextInput
          placeholder={"Contraseña"}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            console.log('Contraseña actualizada:', text);
          }}
          secureTextEntry={true}
          style={styles.input}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            handleLogin();
            console.log('Botón Entrar pulsado');
          }}
        >
          <Text style={styles.buttonText}>
            {"Entrar"}
          </Text>
        </TouchableOpacity>
        {loadingSocios && <Text style={styles.loadingText}>Cargando socios...</Text>}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#000000",
    paddingHorizontal: 41,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 64,
    textAlign: "center",
    marginTop: 59,
    marginBottom: 92,
    width: 225,
  },
  image: {
    width: 200,
    height: 150,
    alignSelf: 'center',
    marginBottom: 30,
  },
  input: {
    color: "#000000",
    fontSize: 16,
    marginBottom: 27,
    alignSelf: "stretch",
    backgroundColor: "#D9D9D9",
    paddingTop: 20,
    paddingBottom: 10,
    borderRadius: 8,
  },
  button: {
    backgroundColor: "#FF8000",
    borderRadius: 100,
    paddingTop: 29,
    paddingHorizontal: 38,
    marginBottom: 194,
    alignItems: 'center',
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 24,
    textAlign: "center",
    width: 185,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default LoginScreen;