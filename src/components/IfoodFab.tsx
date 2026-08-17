import React from 'react';
import { TouchableOpacity, Linking, StyleSheet, View, Text } from 'react-native';

export default function IfoodFab() {
  return (
    <TouchableOpacity
      style={styles.fab}
      onPress={() => Linking.openURL('https://www.ifood.com.br')}
      activeOpacity={0.85}
    >
      <View style={styles.icon}>
        <Text style={{ fontSize: 18 }}>🍔</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 28,
    left: 20,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#EA1D2C',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#EA1D2C',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
  },
  icon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
