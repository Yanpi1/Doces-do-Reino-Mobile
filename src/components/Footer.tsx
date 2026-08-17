import React from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';

export default function Footer({ onAbrirAdmin }: { onAbrirAdmin: () => void }) {
  const { colors } = useAppTheme();
  return (
    <View style={[styles.footer, { backgroundColor: colors.marromDark }]}>
      <Text style={styles.brand}>⛪ Doces do Reino</Text>
      <Text style={styles.desc}>Um projeto solidário da Doces do Reino para arrecadar e realizar.</Text>

      <View style={styles.infoBlock}>
        <Text style={styles.h4}>Contato</Text>
        <Text style={styles.p}>📍 Qr 415 Cj 3 lote 26</Text>
        <TouchableOpacity onPress={() => Linking.openURL('tel:6192796430')}>
          <Text style={styles.link}>📞 (61) 99279-6430</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('mailto:yanpietro0101@gmail.com')}>
          <Text style={styles.link}>✉️ yanpietro0101@gmail.com</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoBlock}>
        <Text style={styles.h4}>Cultos</Text>
        <Text style={styles.p}>Domingo — 19h</Text>
        <Text style={styles.p}>Quinta-feira — 19h30</Text>
      </View>

      <View style={styles.bottom}>
        <Text style={styles.copy}>© 2026 Doces do Reino. Todos os direitos reservados.</Text>
        <TouchableOpacity onPress={onAbrirAdmin}>
          <Text style={[styles.adminLink, { color: colors.ouro }]}>Área Admin</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: { paddingHorizontal: 20, paddingVertical: 28 },
  brand: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 6 },
  desc: { color: 'rgba(255,255,255,0.65)', fontSize: 12, marginBottom: 20, lineHeight: 17 },
  infoBlock: { marginBottom: 16 },
  h4: { color: '#fff', fontSize: 13, fontWeight: '700', marginBottom: 6 },
  p: { color: 'rgba(255,255,255,0.7)', fontSize: 12.5, marginBottom: 3 },
  link: { color: 'rgba(255,255,255,0.7)', fontSize: 12.5, marginBottom: 3, textDecorationLine: 'underline' },
  bottom: { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.15)', marginTop: 8, paddingTop: 16, alignItems: 'center', gap: 8 },
  copy: { color: 'rgba(255,255,255,0.5)', fontSize: 11 },
  adminLink: { fontSize: 12, fontWeight: '700' },
});
