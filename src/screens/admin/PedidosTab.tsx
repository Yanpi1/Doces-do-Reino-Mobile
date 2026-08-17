import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAppTheme } from '../../theme/ThemeContext';
import { Pedido, StatusPedido } from '../../types';
import * as api from '../../services/api';
import { formatMoney } from '../../utils/format';
import DeleteConfirmModal from './DeleteConfirmModal';

const STATUS_OPTS: StatusPedido[] = ['pendente', 'confirmado', 'entregue', 'cancelado'];

const STATUS_COLORS: Record<StatusPedido, string> = {
  pendente: '#E8702A',
  confirmado: '#2E7D52',
  entregue: '#6B4226',
  cancelado: '#C0392B',
};

export default function PedidosTab() {
  const { colors } = useAppTheme();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [limparAberto, setLimparAberto] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await api.getPedidos();
    setPedidos(data.slice().reverse());
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const atualizarStatus = async (id: number, status: StatusPedido) => {
    setPedidos((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
    await api.updateStatusPedido(id, status);
  };

  const confirmarLimpar = async () => {
    await api.limparPedidos();
    setLimparAberto(false);
    load();
  };

  return (
    <View style={styles.root}>
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.h2, { color: colors.marromDark }]}>Pedidos</Text>
          <Text style={[styles.sub, { color: colors.textoSuave }]}>{pedidos.length} pedido(s) registrado(s)</Text>
        </View>
        <TouchableOpacity style={[styles.btnLimpar, { borderColor: colors.vermelho }]} onPress={() => setLimparAberto(true)}>
          <Text style={{ color: colors.vermelho, fontSize: 12, fontWeight: '700' }}>Limpar tudo</Text>
        </TouchableOpacity>
      </View>

      <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor={colors.ouroDark} />}>
        {pedidos.length === 0 && !loading && (
          <Text style={{ textAlign: 'center', color: colors.textoSuave, marginTop: 30 }}>
            Nenhum pedido ainda.
          </Text>
        )}

        {pedidos.map((p) => (
          <View key={p.id} style={[styles.card, { backgroundColor: colors.adminCardBg, borderColor: colors.borda }]}>
            <View style={styles.cardHeader}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.nome, { color: colors.marromDark }]}>{p.nome}</Text>
                <Text style={[styles.meta, { color: colors.textoSuave }]}>
                  {p.contato_tipo}: {p.contato}
                </Text>
              </View>
              <Text style={[styles.total, { color: colors.ouroDark }]}>{formatMoney(p.total)}</Text>
            </View>

            <View style={styles.itens}>
              {(p.itens || []).map((it, idx) => (
                <Text key={idx} style={[styles.item, { color: colors.texto }]}>
                  {it.qty}× {it.nome}
                </Text>
              ))}
            </View>

            <View style={styles.footerRow}>
              <Text style={[styles.data, { color: colors.textoSuave }]}>{p.criado || p.data || ''}</Text>
              <View style={[styles.pickerWrap, { borderColor: STATUS_COLORS[p.status] || colors.borda }]}>
                <Picker
                  selectedValue={p.status}
                  onValueChange={(v) => atualizarStatus(p.id, v as StatusPedido)}
                  style={{ color: STATUS_COLORS[p.status] || colors.texto, width: 150, height: 40 }}
                  dropdownIconColor={STATUS_COLORS[p.status]}
                >
                  {STATUS_OPTS.map((s) => (
                    <Picker.Item key={s} label={s.charAt(0).toUpperCase() + s.slice(1)} value={s} />
                  ))}
                </Picker>
              </View>
            </View>
          </View>
        ))}
        <View style={{ height: 30 }} />
      </ScrollView>

      <DeleteConfirmModal
        visible={limparAberto}
        titulo="Limpar todos os pedidos?"
        mensagem="Todos os pedidos registrados serão apagados permanentemente."
        onCancel={() => setLimparAberto(false)}
        onConfirm={confirmarLimpar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  h2: { fontSize: 18, fontWeight: '800' },
  sub: { fontSize: 11.5, marginTop: 2 },
  btnLimpar: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1.5 },
  card: { borderWidth: 1, borderRadius: 14, padding: 14, marginBottom: 12 },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  nome: { fontSize: 14.5, fontWeight: '700' },
  meta: { fontSize: 11.5, marginTop: 2 },
  total: { fontSize: 15, fontWeight: '800' },
  itens: { marginTop: 8, marginBottom: 8 },
  item: { fontSize: 12, marginBottom: 2 },
  footerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  data: { fontSize: 10.5 },
  pickerWrap: { borderWidth: 1.5, borderRadius: 10, overflow: 'hidden' },
});
