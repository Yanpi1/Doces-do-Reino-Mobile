import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '../../theme/ThemeContext';
import { Produto } from '../../types';
import * as api from '../../services/api';
import { formatMoney } from '../../utils/format';
import ProdutoFormModal from './ProdutoFormModal';
import DeleteConfirmModal from './DeleteConfirmModal';

export default function ProdutosTab() {
  const { colors } = useAppTheme();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editando, setEditando] = useState<Produto | null>(null);
  const [excluindo, setExcluindo] = useState<Produto | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await api.getProdutos();
    setProdutos(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const confirmarExclusao = async () => {
    if (!excluindo) return;
    await api.deleteProduto(excluindo.id);
    setExcluindo(null);
    load();
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.h2, { color: colors.marromDark }]}>Produtos</Text>
          <Text style={[styles.sub, { color: colors.textoSuave }]}>Gerencie o cardápio e estoque disponível</Text>
        </View>
        <TouchableOpacity
          style={[styles.btnNovo, { backgroundColor: colors.ouroDark }]}
          onPress={() => {
            setEditando(null);
            setFormOpen(true);
          }}
        >
          <Text style={styles.btnNovoTxt}>+ Novo</Text>
        </TouchableOpacity>
      </View>

      <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor={colors.ouroDark} />}>
        {produtos.map((p) => (
          <View key={p.id} style={[styles.card, { backgroundColor: colors.adminCardBg, borderColor: colors.borda }]}>
            {p.imagem ? (
              <Image source={{ uri: p.imagem }} style={styles.img} />
            ) : (
              <View style={[styles.img, styles.imgEmoji, { backgroundColor: colors.ouroLight }]}>
                <Text style={{ fontSize: 26 }}>{p.emoji || '🍨'}</Text>
              </View>
            )}
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.nome, { color: colors.marromDark }]} numberOfLines={1}>
                {p.nome}
              </Text>
              <Text style={[styles.meta, { color: colors.textoSuave }]}>
                {formatMoney(p.preco)} · estoque: {p.estoque}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => {
                setEditando(p);
                setFormOpen(true);
              }}
            >
              <Feather name="edit-2" size={16} color={colors.ouroDark} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => setExcluindo(p)}>
              <Feather name="trash-2" size={16} color={colors.vermelho} />
            </TouchableOpacity>
          </View>
        ))}
        {produtos.length === 0 && !loading && (
          <Text style={{ textAlign: 'center', color: colors.textoSuave, marginTop: 30 }}>
            Nenhum produto cadastrado.
          </Text>
        )}
        <View style={{ height: 30 }} />
      </ScrollView>

      <ProdutoFormModal
        visible={formOpen}
        produto={editando}
        onClose={() => setFormOpen(false)}
        onSaved={load}
      />
      <DeleteConfirmModal
        visible={!!excluindo}
        titulo={`Excluir "${excluindo?.nome}"?`}
        onCancel={() => setExcluindo(null)}
        onConfirm={confirmarExclusao}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  h2: { fontSize: 18, fontWeight: '800' },
  sub: { fontSize: 11.5, marginTop: 2 },
  btnNovo: { paddingVertical: 9, paddingHorizontal: 14, borderRadius: 10 },
  btnNovoTxt: { color: '#fff', fontWeight: '700', fontSize: 12.5 },
  card: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 14, padding: 10, marginBottom: 10 },
  img: { width: 52, height: 52, borderRadius: 10 },
  imgEmoji: { alignItems: 'center', justifyContent: 'center' },
  nome: { fontSize: 13.5, fontWeight: '700' },
  meta: { fontSize: 11.5, marginTop: 3 },
  iconBtn: { padding: 8 },
});
