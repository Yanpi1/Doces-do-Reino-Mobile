import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '../theme/ThemeContext';
import { Produto } from '../types';
import { formatMoney } from '../utils/format';
import { useCart } from '../context/CartContext';

export default function ProdutoCard({ produto }: { produto: Produto }) {
  const { colors } = useAppTheme();
  const { cart, addToCart, removeFromCart } = useCart();

  const qty = cart[produto.id] || 0;
  const esgotado = produto.estoque !== undefined && produto.estoque <= 0;
  const limiteAtingido = produto.estoque !== undefined && qty >= produto.estoque;

  return (
    <View style={[styles.card, { backgroundColor: colors.branco, borderColor: colors.borda }, esgotado && styles.esgotadoCard]}>
      <View style={styles.imgWrap}>
        {produto.imagem ? (
          <Image source={{ uri: produto.imagem }} style={styles.img} resizeMode="cover" />
        ) : (
          <View style={[styles.imgWrap, styles.emojiBg, { backgroundColor: colors.ouroLight }]}>
            <Text style={{ fontSize: 44 }}>{produto.emoji || '🍨'}</Text>
          </View>
        )}
        {esgotado ? (
          <View style={[styles.tag, { backgroundColor: colors.vermelhoBg }]}>
            <Text style={[styles.tagTxt, { color: colors.vermelho }]}>Esgotado</Text>
          </View>
        ) : produto.estoque !== undefined && produto.estoque <= 5 ? (
          <View style={[styles.tag, { backgroundColor: '#FFF3D6' }]}>
            <Text style={[styles.tagTxt, { color: colors.laranja }]}>Últimas {produto.estoque} un.</Text>
          </View>
        ) : produto.estoque !== undefined ? (
          <View style={[styles.tag, { backgroundColor: colors.verdeBg }]}>
            <Text style={[styles.tagTxt, { color: colors.verde }]}>{produto.estoque} disponíveis</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.body}>
        <Text style={[styles.nome, { color: colors.marromDark }]} numberOfLines={2}>
          {produto.nome}
        </Text>
        <Text style={[styles.desc, { color: colors.textoSuave }]} numberOfLines={3}>
          {produto.desc}
        </Text>
        <View style={styles.footer}>
          <Text style={[styles.preco, { color: colors.ouroDark }]}>{formatMoney(produto.preco)}</Text>

          {esgotado ? (
            <View style={[styles.btnAdd, styles.btnDisabled]}>
              <Text style={[styles.btnAddTxt, { color: colors.textoSuave }]}>Esgotado</Text>
            </View>
          ) : qty === 0 ? (
            <TouchableOpacity style={[styles.btnAdd, { backgroundColor: colors.ouroDark }]} onPress={() => addToCart(produto.id)}>
              <Text style={styles.btnAddTxt}>+ Adicionar</Text>
            </TouchableOpacity>
          ) : (
            <View style={[styles.qtyCtrl, { borderColor: colors.borda }]}>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => removeFromCart(produto.id)}>
                <Feather name="minus" size={14} color={colors.marromDark} />
              </TouchableOpacity>
              <Text style={[styles.qtyNum, { color: colors.marromDark }]}>{qty}</Text>
              <TouchableOpacity
                style={[styles.qtyBtn, limiteAtingido && { opacity: 0.4 }]}
                onPress={() => !limiteAtingido && addToCart(produto.id)}
                disabled={limiteAtingido}
              >
                <Feather name="plus" size={14} color={colors.marromDark} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, overflow: 'hidden', borderWidth: 1, marginBottom: 14, flex: 1 },
  esgotadoCard: { opacity: 0.7 },
  imgWrap: { height: 130, width: '100%' },
  emojiBg: { alignItems: 'center', justifyContent: 'center' },
  img: { width: '100%', height: '100%' },
  tag: { position: 'absolute', top: 8, left: 8, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  tagTxt: { fontSize: 10, fontWeight: '700' },
  body: { padding: 12 },
  nome: { fontSize: 14, fontWeight: '700', marginBottom: 3, minHeight: 36 },
  desc: { fontSize: 11.5, lineHeight: 15, marginBottom: 10, minHeight: 30 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  preco: { fontSize: 15.5, fontWeight: '800' },
  btnAdd: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10 },
  btnDisabled: { backgroundColor: '#E5E0D8' },
  btnAddTxt: { color: '#fff', fontSize: 11.5, fontWeight: '700' },
  qtyCtrl: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 10, overflow: 'hidden' },
  qtyBtn: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  qtyNum: { minWidth: 20, textAlign: 'center', fontWeight: '700', fontSize: 13 },
});
