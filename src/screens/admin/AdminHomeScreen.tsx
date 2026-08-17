import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '../../theme/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import ThemeToggleButton from '../../components/ThemeToggleButton';
import ProdutosTab from './ProdutosTab';
import CarrosselTab from './CarrosselTab';
import PedidosTab from './PedidosTab';
import ConfigTab from './ConfigTab';

type TabKey = 'produtos' | 'carrossel' | 'pedidos' | 'config';

const TABS: { key: TabKey; label: string; icon: keyof typeof Feather.glyphMap }[] = [
  { key: 'produtos', label: 'Produtos', icon: 'grid' },
  { key: 'carrossel', label: 'Carrossel', icon: 'image' },
  { key: 'pedidos', label: 'Pedidos', icon: 'shopping-bag' },
  { key: 'config', label: 'Config', icon: 'settings' },
];

export default function AdminHomeScreen({ onVoltarSite }: { onVoltarSite: () => void }) {
  const { colors, theme } = useAppTheme();
  const { logout } = useAuth();
  const [tab, setTab] = useState<TabKey>('produtos');

  return (
    <View style={[styles.root, { backgroundColor: colors.adminBg }]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />

      <View style={[styles.topBar, { backgroundColor: colors.marromDark }]}>
        <View>
          <Text style={styles.topTitle}>👑 Painel Admin</Text>
          <Text style={styles.topSub}>Doces do Reino</Text>
        </View>
        <View style={styles.topActions}>
          <ThemeToggleButton />
          <TouchableOpacity style={styles.iconBtnDark} onPress={onVoltarSite}>
            <Feather name="home" size={17} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtnDark} onPress={logout}>
            <Feather name="log-out" size={17} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.tabBar, { backgroundColor: colors.adminCardBg, borderColor: colors.borda }]}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      >
        {TABS.map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tabBtn, tab === t.key && { borderBottomColor: colors.ouroDark, borderBottomWidth: 2 }]}
            onPress={() => setTab(t.key)}
          >
            <Feather name={t.icon} size={15} color={tab === t.key ? colors.ouroDark : colors.textoSuave} />
            <Text style={[styles.tabTxt, { color: tab === t.key ? colors.ouroDark : colors.textoSuave }]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={{ flex: 1 }}>
        {tab === 'produtos' && <ProdutosTab />}
        {tab === 'carrossel' && <CarrosselTab />}
        {tab === 'pedidos' && <PedidosTab />}
        {tab === 'config' && <ConfigTab />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 14 },
  topTitle: { color: '#fff', fontSize: 15.5, fontWeight: '800' },
  topSub: { color: 'rgba(255,255,255,0.7)', fontSize: 11, marginTop: 2 },
  topActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconBtnDark: { width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  tabBar: { flexGrow: 0, borderBottomWidth: 1 },
  tabBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 12, paddingHorizontal: 14 },
  tabTxt: { fontSize: 12.5, fontWeight: '700' },
});
