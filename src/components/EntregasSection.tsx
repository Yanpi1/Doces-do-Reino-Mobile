import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';

export default function EntregasSection() {
  const { colors } = useAppTheme();
  return (
    <View style={styles.section}>
      <View style={styles.headCentered}>
        <Text style={[styles.eyebrow, { color: colors.ouroDark }]}>Onde atendemos</Text>
        <Text style={[styles.titulo, { color: colors.marromDark }]}>Entregas em Brasília</Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.branco, borderColor: colors.borda }]}>
        <View style={[styles.badge, { backgroundColor: colors.ouroLight }]}>
          <Text style={[styles.badgeTxt, { color: colors.ouroDark }]}>Atendimento local</Text>
        </View>
        <Text style={[styles.destaque, { color: colors.marromDark }]}>
          Faço entregas somente em Brasília, com foco total em Samambaia.
        </Text>
        <Text style={[styles.texto, { color: colors.textoSuave }]}>
          Se você está em Samambaia, o atendimento recebe prioridade especial para facilitar a
          combinação do pedido e da entrega.
        </Text>

        <View style={styles.grid}>
          <View style={[styles.item, { borderColor: colors.borda }]}>
            <Text style={[styles.itemStrong, { color: colors.marromDark }]}>Região atendida</Text>
            <Text style={[styles.itemSpan, { color: colors.textoSuave }]}>Brasília - DF</Text>
          </View>
          <View style={[styles.item, styles.itemFoco, { backgroundColor: colors.ouroLight, borderColor: colors.ouro }]}>
            <Text style={[styles.itemStrong, { color: colors.marromDark }]}>Foco principal</Text>
            <Text style={[styles.itemSpan, { color: colors.ouroDark, fontWeight: '700' }]}>Samambaia</Text>
          </View>
          <View style={[styles.item, { borderColor: colors.borda }]}>
            <Text style={[styles.itemStrong, { color: colors.marromDark }]}>Combinação</Text>
            <Text style={[styles.itemSpan, { color: colors.textoSuave }]}>Pedido e entrega alinhados pelo contato</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { paddingHorizontal: 16, paddingVertical: 24 },
  headCentered: { alignItems: 'center', marginBottom: 16 },
  eyebrow: { fontSize: 12.5, fontWeight: '700', marginBottom: 2 },
  titulo: { fontSize: 21, fontWeight: '800' },
  card: { borderRadius: 18, borderWidth: 1, padding: 18 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, marginBottom: 10 },
  badgeTxt: { fontSize: 11, fontWeight: '700' },
  destaque: { fontSize: 15.5, fontWeight: '700', lineHeight: 22, marginBottom: 8 },
  texto: { fontSize: 13, lineHeight: 19, marginBottom: 16 },
  grid: { gap: 10 },
  item: { borderWidth: 1, borderRadius: 12, padding: 12 },
  itemFoco: { borderWidth: 1.5 },
  itemStrong: { fontSize: 12, fontWeight: '700', marginBottom: 2 },
  itemSpan: { fontSize: 12.5 },
});
