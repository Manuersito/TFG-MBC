import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function BienvenidaScreen() {
  const { esAdmin } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {esAdmin === 'true' ? '¡Bienvenido Administrador!' : '¡Bienvenido Socio!'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  text: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: 'bold',
  },
});
