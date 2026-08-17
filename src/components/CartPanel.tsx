import React from 'react';
import { View, Text, Modal, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '../theme/ThemeContext';
import { useCart } from '../context/CartContext';
import { formatMoney } from '../utils/format';

interface Props {
  visible: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export default function CartPanel({ visible, onClose, onCheckout }: Props) {
  const { colors } = useAppTheme();
  const { cart, produtos, cartTotal, addToCart, removeFromCart, removeItemCompletely } = useCart();

  const entries = Object.entries(cart).filter(([, qty]) => qty > 0);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />
      <View style={[styles.panel, { backgroundColor: colors.creme }]}>
        <View style={[styles.header, { borderBottomColor: colors.borda }]}>
          <Text style={[styles.headerTxt, { color: colors.marromDark }]}>🛒 Seu Pedido</Text>
          <TouchableOpacity onPress={onClose}>
            <Feather name="x" size={22} color={colors.marromDark} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.items} contentContainerStyle={{ paddingBottom: 20 }}>
          {entries.length === 0 ? (
            <View style={styles.empty}>
              <Feather name="shopping-bag" size={38} color={colors.ouro} />
              <Text style={[styles.emptyTitle, { color: colors.marromDark }]}>Carrinho vazio</Text>
              <Text style={[styles.emptySub, { color: colors.textoSuave }]}>
                Adicione DinDins ou Bolos de Pote para fazer seu pedido!
              </Text>
            </View>
          ) : (
            entries.map(([id, qty]) => {
              const p = produtos.find((x) => x.id === Number(id));
              if (!p) return null;
              return (
                <View key={id} style={[styles.item, { borderBottomColor: colors.borda }]}>
                  {p.imagem ? (
                    <Image source={{ uri: p.imagem }} style={styles.itemImg} />
                  ) : (
                    <View style={[styles.itemImg, styles.itemEmoji, { backgroundColor: colors.ouroLight }]}>
                      <Text style={{ fontSize: 20 }}>{p.emoji || '🍨'}</Text>
                    </View>
                  )}
                  <View style={styles.itemInfo}>
                    <Text style={[styles.itemNome, { color: colors.marromDark }]} numberOfLines={1}>
                      {p.nome}
                    </Text>
                    <Text style={[styles.itemPreco, { color: colors.textoSuave }]}>
                      {qty}× {formatMoney(p.preco)}
                    </Text>
                  </View>
                  <View style={[styles.itemCtrl, { borderColor: colors.borda }]}>
                    <TouchableOpacity style={styles.qtyBtnSm} onPress={() => removeFromCart(p.id)}>
                      <Feather name="minus" size={12} color={colors.marromDark} />
                    </TouchableOpacity>
                    <Text style={{ color: colors.marromDark, fontWeight: '700', minWidth: 16, textAlign: 'center' }}>
                      {qty}
                    </Text>
                    <TouchableOpacity style={styles.qtyBtnSm} onPress={() => addToCart(p.id)}>
                      <Feather name="plus" size={12} color={colors.marromDark} />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity onPress={() => removeItemCompletely(p.id)} style={{ marginLeft: 6 }}>
                    <Feather name="trash-2" size={16} color={colors.vermelho} />
                  </TouchableOpacity>
                </View>
              );
            })
          )}
        </ScrollView>

        {entries.length > 0 && (
          <View style={[styles.footer, { borderTopColor: colors.borda, backgroundColor: colors.creme }]}>
            <Text style={[styles.total, { color: colors.marromDark }]}>
              Total: <Text style={{ fontWeight: '800' }}>{formatMoney(cartTotal)}</Text>
            </Text>
            <TouchableOpacity style={[styles.btnCheckout, { backgroundColor: colors.ouroDark }]} onPress={onCheckout}>
              <Text style={styles.btnCheckoutTxt}>Finalizar Pedido →</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  panel: { position: 'absolute', bottom: 0, left: 0, right: 0, maxHeight: '82%', borderTopLeftRadius: 22, borderTopRightRadius: 22, overflow: 'hidden' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 18, borderBottomWidth: 1 },
  headerTxt: { fontSize: 16, fontWeight: '700' },
  items: { paddingHorizontal: 16 },
  empty: { alignItems: 'center', paddingVertical: 40, gap: 6 },
  emptyTitle: { fontSize: 14.5, fontWeight: '700', marginTop: 6 },
  emptySub: { fontSize: 12, textAlign: 'center', paddingHorizontal: 20 },
  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, gap: 10 },
  itemImg: { width: 44, height: 44, borderRadius: 10 },
  itemEmoji: { alignItems: 'center', justifyContent: 'center' },
  itemInfo: { flex: 1 },
  itemNome: { fontSize: 13, fontWeight: '700' },
  itemPreco: { fontSize: 11.5, marginTop: 2 },
  itemCtrl: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 8, gap: 6, paddingHorizontal: 4 },
  qtyBtnSm: { padding: 5 },
  footer: { padding: 16, borderTopWidth: 1, gap: 10 },
  total: { fontSize: 14, textAlign: 'right' },
  btnCheckout: { paddingVertical: 13, borderRadius: 12, alignItems: 'center' },
  btnCheckoutTxt: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
