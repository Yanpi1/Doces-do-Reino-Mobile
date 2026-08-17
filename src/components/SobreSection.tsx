import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '../theme/ThemeContext';

interface Props {
  logoSobreUrl?: string;
  onAbrirMapa: () => void;
}

export default function SobreSection({ logoSobreUrl, onAbrirMapa }: Props) {
  const { colors } = useAppTheme();
  return (
    <View style={styles.section}>
      <View style={[styles.imgWrap, { backgroundColor: colors.ouroLight, borderColor: colors.borda }]}>
        {logoSobreUrl ? (
          <Image source={{ uri: logoSobreUrl }} style={styles.img} resizeMode="cover" />
        ) : (
          <Text style={[styles.placeholderTxt, { color: colors.ouroDark }]}>Doces do Reino</Text>
        )}
      </View>

      <Text style={[styles.eyebrow, { color: colors.ouroDark }]}>Nossa história</Text>
      <Text style={[styles.titulo, { color: colors.marromDark }]}>Sobre o Projeto</Text>
      <Text style={[styles.paragrafo, { color: colors.texto }]}>
        Este projeto foi criado pela <Text style={{ fontWeight: '700' }}>Igreja do Reino</Text> com o
        objetivo de arrecadar um determinado valor para um propósito maior. Encontramos neste formato uma
        maneira prática e acessível de mobilizar pessoas e tornar possível a realização desse objetivo.
      </Text>
      <Text style={[styles.paragrafo, { color: colors.texto, marginTop: 10 }]}>
        A iniciativa une organização, dedicação e colaboração, permitindo que cada contribuição faça parte
        de algo significativo. Mais do que um sistema de encomendas, este projeto representa um esforço
        coletivo em prol de uma causa maior.
      </Text>

      <View style={styles.cultosGrid}>
        <View style={[styles.cultoCard, { backgroundColor: colors.branco, borderColor: colors.borda }]}>
          <Feather name="repeat" size={20} color={colors.ouroDark} />
          <Text style={[styles.cultoStrong, { color: colors.marromDark }]}>Domingo</Text>
          <Text style={[styles.cultoSpan, { color: colors.textoSuave }]}>às 19h</Text>
        </View>
        <View style={[styles.cultoCard, { backgroundColor: colors.branco, borderColor: colors.borda }]}>
          <Feather name="calendar" size={20} color={colors.ouroDark} />
          <Text style={[styles.cultoStrong, { color: colors.marromDark }]}>Quinta-feira</Text>
          <Text style={[styles.cultoSpan, { color: colors.textoSuave }]}>às 19h30</Text>
        </View>
        <TouchableOpacity
          style={[styles.cultoCard, { backgroundColor: colors.branco, borderColor: colors.borda }]}
          onPress={onAbrirMapa}
          activeOpacity={0.8}
        >
          <Feather name="map-pin" size={20} color={colors.ouroDark} />
          <Text style={[styles.cultoStrong, { color: colors.marromDark }]}>Endereço</Text>
          <Text style={[styles.cultoSpan, { color: colors.textoSuave }]}>Qr 415 Cj 3 lote 26</Text>
          <Text style={[styles.tapHint, { color: colors.ouroDark }]}>Toque para ver no mapa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { paddingHorizontal: 16, paddingVertical: 24 },
  imgWrap: {
    height: 180,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    overflow: 'hidden',
  },
  img: { width: '100%', height: '100%' },
  placeholderTxt: { fontSize: 16, fontWeight: '700' },
  eyebrow: { fontSize: 12.5, fontWeight: '700', marginBottom: 2 },
  titulo: { fontSize: 21, fontWeight: '800', marginBottom: 10 },
  paragrafo: { fontSize: 13.5, lineHeight: 21 },
  cultosGrid: { flexDirection: 'row', gap: 10, marginTop: 24, flexWrap: 'wrap' },
  cultoCard: { flex: 1, minWidth: 100, borderRadius: 14, borderWidth: 1, padding: 14, alignItems: 'flex-start', gap: 4 },
  cultoStrong: { fontSize: 13, fontWeight: '700', marginTop: 4 },
  cultoSpan: { fontSize: 11.5 },
  tapHint: { fontSize: 9.5, marginTop: 4, fontWeight: '600' },
});
