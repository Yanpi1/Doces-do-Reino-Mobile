import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '../theme/ThemeContext';
import { useCart } from '../context/CartContext';
import ThemeToggleButton from './ThemeToggleButton';

interface Props {
  logoUrl?: string;
  onNavigate: (section: 'produtos' | 'sobre' | 'entregas' | 'contato') => void;
}

export default function Header({ logoUrl, onNavigate }: Props) {
  const { colors } = useAppTheme();
  const { cartCount, openCart } = useCart();

  return (
    <View style={[styles.header, { backgroundColor: colors.creme, borderBottomColor: colors.borda }]}>
      <View style={styles.row}>
        <View style={styles.logoWrap}>
          <View style={[styles.logoIconWrap, { backgroundColor: colors.ouroLight }]}>
            {logoUrl ? (
              <Image source={{ uri: logoUrl }} style={styles.logoImg} resizeMode="contain" />
            ) : (
              <Text style={{ fontSize: 20 }}>⛪</Text>
            )}
          </View>
          <View>
            <Text style={[styles.logoName, { color: colors.marromDark }]}>Doces do Reino</Text>
            <Text style={[styles.logoSub, { color: colors.textoSuave }]}>dindin &amp; bolo de pote</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <ThemeToggleButton />
          <TouchableOpacity
            style={[styles.cartBtn, { backgroundColor: colors.ouro }]}
            onPress={openCart}
            activeOpacity={0.85}
          >
            <Feather name="shopping-bag" size={16} color="#fff" />
            {cartCount > 0 && (
              <View style={[styles.badge, { backgroundColor: colors.vermelho }]}>
                <Text style={styles.badgeTxt}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.nav}>
        {[
          { key: 'produtos', label: 'Cardápio' },
          { key: 'sobre', label: 'Sobre' },
          { key: 'entregas', label: 'Entregas' },
          { key: 'contato', label: 'Contato' },
        ].map((item) => (
          <TouchableOpacity key={item.key} onPress={() => onNavigate(item.key as any)}>
            <Text style={[styles.navLink, { color: colors.marrom }]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: 8, paddingBottom: 10, paddingHorizontal: 16, borderBottomWidth: 1 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  logoWrap: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoIconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  logoImg: { width: 40, height: 40 },
  logoName: { fontSize: 15.5, fontWeight: '700' },
  logoSub: { fontSize: 10.5, marginTop: 1 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cartBtn: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeTxt: { color: '#fff', fontSize: 10, fontWeight: '700' },
  nav: { flexDirection: 'row', gap: 18, marginTop: 12, flexWrap: 'wrap' },
  navLink: { fontSize: 13, fontWeight: '600' },
});
