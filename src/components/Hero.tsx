import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';

interface Props {
  onVerCardapio: () => void;
  onSaibaMais: () => void;
}

export default function Hero({ onVerCardapio, onSaibaMais }: Props) {
  const { colors } = useAppTheme();
  return (
    <View style={[styles.wrap, { backgroundColor: colors.ouroLight }]}>
      <View style={styles.floats}>
        <Text style={[styles.float, { top: 8, right: 40 }]}>🍫</Text>
        <Text style={[styles.float, { top: 60, right: 10 }]}>🍓</Text>
        <Text style={[styles.float, { top: 30, right: 90 }]}>🧁</Text>
      </View>
      <Text style={[styles.eyebrow, { color: colors.ouroDark }]}>✨ Feitos com amor</Text>
      <Text style={[styles.title, { color: colors.marromDark }]}>
        Sabor que transforma{'\n'}
        <Text style={{ color: colors.ouroDark }}>e une pessoas</Text>
      </Text>
      <Text style={[styles.desc, { color: colors.texto }]}>
        DinDins gourmet e Bolos de Pote artesanais.{'\n'}Cada pedido contribui com uma causa especial.
      </Text>
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.btnPrimary, { backgroundColor: colors.ouroDark }]} onPress={onVerCardapio}>
          <Text style={styles.btnPrimaryTxt}>Ver Cardápio</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btnOutline, { borderColor: colors.ouroDark }]}
          onPress={onSaibaMais}
        >
          <Text style={[styles.btnOutlineTxt, { color: colors.ouroDark }]}>Saiba Mais</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 20, paddingVertical: 34, position: 'relative', overflow: 'hidden' },
  floats: { position: 'absolute', width: '100%', height: '100%' },
  float: { position: 'absolute', fontSize: 26, opacity: 0.55 },
  eyebrow: { fontSize: 13, fontWeight: '700', marginBottom: 6 },
  title: { fontSize: 30, fontWeight: '800', lineHeight: 36, marginBottom: 10 },
  desc: { fontSize: 14.5, lineHeight: 21, marginBottom: 20, opacity: 0.9 },
  actions: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  btnPrimary: { paddingVertical: 12, paddingHorizontal: 22, borderRadius: 14 },
  btnPrimaryTxt: { color: '#fff', fontWeight: '700', fontSize: 14 },
  btnOutline: { paddingVertical: 12, paddingHorizontal: 22, borderRadius: 14, borderWidth: 1.5 },
  btnOutlineTxt: { fontWeight: '700', fontSize: 14 },
});
