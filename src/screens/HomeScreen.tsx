import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet, StatusBar } from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';
import { useCart } from '../context/CartContext';
import * as api from '../services/api';
import { Produto, PixConfig, ContatoConfig, CarrosselConfig } from '../types';

import TopBar from '../components/TopBar';
import Header from '../components/Header';
import Hero from '../components/Hero';
import BeneficiosBar from '../components/BeneficiosBar';
import Carrossel from '../components/Carrossel';
import ProdutosGrid from '../components/ProdutosGrid';
import SobreSection from '../components/SobreSection';
import EntregasSection from '../components/EntregasSection';
import ContatoSection from '../components/ContatoSection';
import Footer from '../components/Footer';
import CartPanel from '../components/CartPanel';
import CheckoutModal from '../components/CheckoutModal';
import MapaModal from '../components/MapaModal';
import ChatWidget from '../components/ChatWidget';
import IfoodFab from '../components/IfoodFab';

interface Props {
  onAbrirAdmin: () => void;
}

export default function HomeScreen({ onAbrirAdmin }: Props) {
  const { colors, theme } = useAppTheme();
  const { setProdutos, isCartOpen, closeCart, openCart } = useCart();

  const [produtos, setLocalProdutos] = useState<Produto[]>([]);
  const [pix, setPix] = useState<PixConfig | null>(null);
  const [contato, setContato] = useState<ContatoConfig | null>(null);
  const [carrossel, setCarrossel] = useState<CarrosselConfig | null>(null);
  const [logoHeader, setLogoHeader] = useState('');
  const [logoSobre, setLogoSobre] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [mapaOpen, setMapaOpen] = useState(false);

  const scrollRef = useRef<ScrollView>(null);
  const sectionY = useRef<Record<string, number>>({});

  const loadAll = useCallback(async () => {
    const [prods, pixData, contatoData, carrosselData, logoH, logoS] = await Promise.all([
      api.getProdutos(),
      api.getPix(),
      api.getContato(),
      api.getCarrossel(),
      api.getLogoHeader(),
      api.getLogoSobre(),
    ]);
    setLocalProdutos(prods);
    setProdutos(prods);
    setPix(pixData);
    setContato(contatoData);
    setCarrossel(carrosselData);
    setLogoHeader(logoH);
    setLogoSobre(logoS);
  }, [setProdutos]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAll();
    setRefreshing(false);
  };

  const scrollToSection = (key: string) => {
    const y = sectionY.current[key];
    if (y !== undefined) {
      scrollRef.current?.scrollTo({ y: y - 10, animated: true });
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.fundo }]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.ouroDark} />}
      >
        <TopBar />
        <Header
          logoUrl={logoHeader}
          onNavigate={(section) => scrollToSection(section)}
        />
        <Hero onVerCardapio={() => scrollToSection('produtos')} onSaibaMais={() => scrollToSection('sobre')} />
        <BeneficiosBar />

        {carrossel && <Carrossel config={carrossel} />}

        <View onLayout={(e) => (sectionY.current['produtos'] = e.nativeEvent.layout.y)}>
          <ProdutosGrid produtos={produtos} />
        </View>

        <View
          style={{ backgroundColor: colors.branco }}
          onLayout={(e) => (sectionY.current['sobre'] = e.nativeEvent.layout.y)}
        >
          <SobreSection logoSobreUrl={logoSobre} onAbrirMapa={() => setMapaOpen(true)} />
        </View>

        <View onLayout={(e) => (sectionY.current['entregas'] = e.nativeEvent.layout.y)}>
          <EntregasSection />
        </View>

        <View
          style={{ backgroundColor: colors.branco }}
          onLayout={(e) => (sectionY.current['contato'] = e.nativeEvent.layout.y)}
        >
          <ContatoSection contato={contato} />
        </View>

        <Footer onAbrirAdmin={onAbrirAdmin} />
      </ScrollView>

      <ChatWidget />
      <IfoodFab />

      <CartPanel
        visible={isCartOpen}
        onClose={closeCart}
        onCheckout={() => {
          closeCart();
          setCheckoutOpen(true);
        }}
      />

      <CheckoutModal visible={checkoutOpen} onClose={() => setCheckoutOpen(false)} pix={pix} />
      <MapaModal visible={mapaOpen} onClose={() => setMapaOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
