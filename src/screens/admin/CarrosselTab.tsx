import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  RefreshControl,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '../../theme/ThemeContext';
import { Slide, CarrosselConfig } from '../../types';
import * as api from '../../services/api';
import { formatMoney } from '../../utils/format';
import SlideFormModal from './SlideFormModal';
import DeleteConfirmModal from './DeleteConfirmModal';

export default function CarrosselTab() {
  const { colors } = useAppTheme();
  const [cfg, setCfg] = useState<CarrosselConfig>({ ativo: false, eyebrow: 'Destaques', titulo: 'Em Destaque', slides: [] });
  const [eyebrow, setEyebrow] = useState('Destaques');
  const [titulo, setTitulo] = useState('Em Destaque');
  const [loading, setLoading] = useState(true);
  const [salvo, setSalvo] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editando, setEditando] = useState<Slide | null>(null);
  const [excluindo, setExcluindo] = useState<Slide | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await api.getCarrossel();
    setCfg(data);
    setEyebrow(data.eyebrow || 'Destaques');
    setTitulo(data.titulo || 'Em Destaque');
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleAtivo = async (value: boolean) => {
    const next = { ...cfg, ativo: value };
    setCfg(next);
    await api.saveConfig('carrossel', { ativo: next.ativo, eyebrow: next.eyebrow, titulo: next.titulo });
  };

  const salvarTextos = async () => {
    const next = { ...cfg, eyebrow: eyebrow.trim() || 'Destaques', titulo: titulo.trim() || 'Em Destaque' };
    setCfg(next);
    await api.saveConfig('carrossel', { ativo: next.ativo, eyebrow: next.eyebrow, titulo: next.titulo });
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2000);
  };

  const confirmarExclusao = async () => {
    if (!excluindo) return;
    await api.deleteSlide(excluindo.id);
    setExcluindo(null);
    load();
  };

  return (
    <View style={styles.root}>
      <Text style={[styles.h2, { color: colors.marromDark }]}>Carrossel de Destaques</Text>
      <Text style={[styles.sub, { color: colors.textoSuave }]}>
        Exiba slides especiais no topo do cardápio
      </Text>

      <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor={colors.ouroDark} />}>
        <View style={[styles.card, { backgroundColor: colors.adminCardBg, borderColor: colors.borda }]}>
          <View style={styles.switchRow}>
            <Text style={[styles.label, { color: colors.marromDark }]}>Carrossel ativo no site</Text>
            <Switch value={cfg.ativo} onValueChange={toggleAtivo} trackColor={{ true: colors.ouroDark }} />
          </View>

          <Text style={[styles.label, { color: colors.marromDark, marginTop: 14 }]}>Eyebrow (texto pequeno)</Text>
          <TextInput
            value={eyebrow}
            onChangeText={setEyebrow}
            style={[styles.input, { borderColor: colors.borda, color: colors.texto, backgroundColor: colors.branco }]}
          />

          <Text style={[styles.label, { color: colors.marromDark, marginTop: 12 }]}>Título da seção</Text>
          <TextInput
            value={titulo}
            onChangeText={setTitulo}
            style={[styles.input, { borderColor: colors.borda, color: colors.texto, backgroundColor: colors.branco }]}
          />

          <TouchableOpacity style={[styles.btnSalvar, { backgroundColor: colors.ouroDark }]} onPress={salvarTextos}>
            <Text style={styles.btnSalvarTxt}>{salvo ? '✅ Salvo!' : '💾 Salvar Textos'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.headerRow}>
          <Text style={[styles.h3, { color: colors.marromDark }]}>Slides</Text>
          <TouchableOpacity
            style={[styles.btnNovo, { backgroundColor: colors.ouroDark }]}
            onPress={() => {
              setEditando(null);
              setFormOpen(true);
            }}
          >
            <Text style={styles.btnNovoTxt}>+ Novo Slide</Text>
          </TouchableOpacity>
        </View>

        {cfg.slides.length === 0 && !loading && (
          <Text style={{ textAlign: 'center', color: colors.textoSuave, marginTop: 20 }}>
            Nenhum slide criado ainda.
          </Text>
        )}

        {cfg.slides.map((s) => (
          <View key={s.id} style={[styles.slideCard, { backgroundColor: colors.adminCardBg, borderColor: colors.borda }]}>
            {s.imagem ? (
              <Image source={{ uri: s.imagem }} style={styles.img} />
            ) : (
              <View style={[styles.img, styles.imgEmoji, { backgroundColor: colors.ouroLight }]}>
                <Text style={{ fontSize: 26 }}>{s.emoji || '🍨'}</Text>
              </View>
            )}
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.nome, { color: colors.marromDark }]} numberOfLines={1}>
                {s.titulo}
              </Text>
              {!!s.preco && (
                <Text style={[styles.meta, { color: colors.textoSuave }]}>{formatMoney(s.preco)}</Text>
              )}
            </View>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => {
                setEditando(s);
                setFormOpen(true);
              }}
            >
              <Feather name="edit-2" size={16} color={colors.ouroDark} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => setExcluindo(s)}>
              <Feather name="trash-2" size={16} color={colors.vermelho} />
            </TouchableOpacity>
          </View>
        ))}
        <View style={{ height: 30 }} />
      </ScrollView>

      <SlideFormModal visible={formOpen} slide={editando} onClose={() => setFormOpen(false)} onSaved={load} />
      <DeleteConfirmModal
        visible={!!excluindo}
        titulo={`Remover "${excluindo?.titulo}"?`}
        onCancel={() => setExcluindo(null)}
        onConfirm={confirmarExclusao}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 16 },
  h2: { fontSize: 18, fontWeight: '800' },
  h3: { fontSize: 15, fontWeight: '800' },
  sub: { fontSize: 11.5, marginTop: 2, marginBottom: 14 },
  card: { borderWidth: 1, borderRadius: 14, padding: 16, marginBottom: 20 },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { fontSize: 12.5, fontWeight: '700', marginBottom: 6 },
  input: { borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14 },
  btnSalvar: { marginTop: 16, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  btnSalvarTxt: { color: '#fff', fontWeight: '700', fontSize: 13 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  btnNovo: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10 },
  btnNovoTxt: { color: '#fff', fontWeight: '700', fontSize: 12 },
  slideCard: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 14, padding: 10, marginBottom: 10 },
  img: { width: 52, height: 52, borderRadius: 10 },
  imgEmoji: { alignItems: 'center', justifyContent: 'center' },
  nome: { fontSize: 13.5, fontWeight: '700' },
  meta: { fontSize: 11.5, marginTop: 3 },
  iconBtn: { padding: 8 },
});
