import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';

export default function TopBar() {
  const { colors } = useAppTheme();
  return (
    <View style={[styles.wrap, { backgroundColor: colors.marromDark }]}>
      <Text style={styles.txt} numberOfLines={1}>
        🎁 Projeto solidário — cada pedido faz a diferença!
      </Text>
      <Text style={styles.sep}>|</Text>
      <Text style={styles.txt} numberOfLines={1}>
        📍 Qr 415 Cj 3 lote 26
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  txt: { color: '#FDFAF6', fontSize: 11.5, fontWeight: '600' },
  sep: { color: 'rgba(253,250,246,0.4)', marginHorizontal: 8 },
});
