import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';
import { CarrosselConfig } from '../types';
import { formatMoney } from '../utils/format';

const { width: SCREEN_W } = Dimensions.get('window');
const SLIDE_W = SCREEN_W - 32;

interface Props {
  config: CarrosselConfig;
}

export default function Carrossel({ config }: Props) {
  const { colors } = useAppTheme();
  const [idx, setIdx] = useState(0);
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!config.ativo || config.slides.length < 2) return;
    const t = setInterval(() => {
      setIdx((prev) => {
        const next = (prev + 1) % config.slides.length;
        listRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 4500);
    return () => clearInterval(t);
  }, [config]);

  if (!config.ativo || !config.slides || config.slides.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={[styles.eyebrow, { color: colors.ouroDark }]}>{config.eyebrow || 'Destaques'}</Text>
      <Text style={[styles.titulo, { color: colors.marromDark }]}>{config.titulo || 'Em Destaque'}</Text>

      <FlatList
        ref={listRef}
        data={config.slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => String(item.id)}
        onMomentumScrollEnd={(e) => {
          const newIdx = Math.round(e.nativeEvent.contentOffset.x / SLIDE_W);
          setIdx(newIdx);
        }}
        renderItem={({ item: s }) => (
          <View style={[styles.slide, { width: SLIDE_W, backgroundColor: colors.branco, borderColor: colors.borda }]}>
            <View style={[styles.imgWrap, { backgroundColor: colors.ouroLight }]}>
              {s.imagem ? (
                <Image source={{ uri: s.imagem }} style={styles.img} resizeMode="cover" />
              ) : (
                <Text style={{ fontSize: 52 }}>{s.emoji || '🍨'}</Text>
              )}
            </View>
            <View style={styles.info}>
              <Text style={[styles.slideTitulo, { color: colors.marromDark }]}>{s.titulo}</Text>
              {!!s.desc && <Text style={[styles.slideDesc, { color: colors.textoSuave }]}>{s.desc}</Text>}
              {!!s.preco && <Text style={[styles.slidePreco, { color: colors.ouroDark }]}>{formatMoney(s.preco)}</Text>}
            </View>
          </View>
        )}
      />

      <View style={styles.dots}>
        {config.slides.map((s, i) => (
          <TouchableOpacity
            key={s.id}
            onPress={() => {
              listRef.current?.scrollToIndex({ index: i, animated: true });
              setIdx(i);
            }}
          >
            <View
              style={[
                styles.dot,
                { backgroundColor: i === idx ? colors.ouroDark : colors.borda },
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { paddingVertical: 24 },
  eyebrow: { fontSize: 12.5, fontWeight: '700', paddingHorizontal: 16, marginBottom: 2 },
  titulo: { fontSize: 21, fontWeight: '800', paddingHorizontal: 16, marginBottom: 14 },
  slide: { marginHorizontal: 16, borderRadius: 18, overflow: 'hidden', borderWidth: 1 },
  imgWrap: { height: 170, alignItems: 'center', justifyContent: 'center' },
  img: { width: '100%', height: '100%' },
  info: { padding: 14 },
  slideTitulo: { fontSize: 15.5, fontWeight: '700' },
  slideDesc: { fontSize: 12.5, marginTop: 3 },
  slidePreco: { fontSize: 16, fontWeight: '800', marginTop: 6 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 12 },
  dot: { width: 7, height: 7, borderRadius: 4 },
});
