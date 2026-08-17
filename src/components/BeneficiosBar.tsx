import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '../theme/ThemeContext';

const ITEMS = [
  { icon: 'shield' as const, title: 'Feito Artesanalmente', sub: 'Com ingredientes selecionados' },
  { icon: 'clock' as const, title: 'Pedido Rápido', sub: 'Sem cadastro, só seu nome' },
  { icon: 'heart' as const, title: 'Causa Solidária', sub: 'Seu pedido apoia a Doces do Reino' },
  { icon: 'credit-card' as const, title: 'Pague via Pix', sub: 'Rápido, seguro e sem taxas' },
];

export default function BeneficiosBar() {
  const { colors } = useAppTheme();
  return (
    <View style={[styles.wrap, { backgroundColor: colors.marromLight, borderColor: colors.borda }]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.inner}>
        {ITEMS.map((item) => (
          <View key={item.title} style={styles.item}>
            <Feather name={item.icon} size={22} color={colors.ouroDark} />
            <View style={{ marginLeft: 10 }}>
              <Text style={[styles.title, { color: colors.marromDark }]}>{item.title}</Text>
              <Text style={[styles.sub, { color: colors.textoSuave }]}>{item.sub}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { borderTopWidth: 1, borderBottomWidth: 1 },
  inner: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 14, gap: 26 },
  item: { flexDirection: 'row', alignItems: 'center', minWidth: 190 },
  title: { fontSize: 12.5, fontWeight: '700' },
  sub: { fontSize: 11, marginTop: 1 },
});
