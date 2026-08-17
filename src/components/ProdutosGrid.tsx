import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';
import { Produto } from '../types';
import ProdutoCard from './ProdutoCard';

export default function ProdutosGrid({ produtos }: { produtos: Produto[] }) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.section}>
      <Text style={[styles.eyebrow, { color: colors.ouroDark }]}>O que temos</Text>
      <Text style={[styles.titulo, { color: colors.marromDark }]}>Nosso Cardápio</Text>

      {produtos.length === 0 ? (
        <Text style={[styles.empty, { color: colors.textoSuave }]}>Nenhum produto cadastrado ainda.</Text>
      ) : (
        <View style={styles.grid}>
          {produtos.map((p) => (
            <View key={p.id} style={styles.col}>
              <ProdutoCard produto={p} />
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { paddingHorizontal: 16, paddingVertical: 20 },
  eyebrow: { fontSize: 12.5, fontWeight: '700', marginBottom: 2 },
  titulo: { fontSize: 21, fontWeight: '800', marginBottom: 14 },
  empty: { textAlign: 'center', paddingVertical: 30, fontSize: 13 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  col: { width: '48.5%' },
});
