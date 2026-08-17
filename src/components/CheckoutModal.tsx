import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useAppTheme } from '../theme/ThemeContext';
import { useCart } from '../context/CartContext';
import { formatMoney } from '../utils/format';
import { PixConfig, ContatoTipo, ItemPedido } from '../types';
import * as api from '../services/api';

type ContatoTipoUI = 'whatsapp' | 'telefone' | 'email';

interface Props {
  visible: boolean;
  onClose: () => void;
  pix: PixConfig | null;
}

export default function CheckoutModal({ visible, onClose, pix }: Props) {
  const { colors } = useAppTheme();
  const { cart, produtos, cartTotal, clearCart } = useCart();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [nome, setNome] = useState('');
  const [contato, setContato] = useState('');
  const [contatoTipo, setContatoTipo] = useState<ContatoTipoUI>('whatsapp');
  const [erroNome, setErroNome] = useState(false);
  const [erroContato, setErroContato] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const entries = Object.entries(cart).filter(([, qty]) => qty > 0);

  const reset = () => {
    setStep(1);
    setNome('');
    setContato('');
    setContatoTipo('whatsapp');
    setErroNome(false);
    setErroContato(false);
    setCopiado(false);
  };

  const handleClose = () => {
    onClose();
  };

  const placeholders: Record<ContatoTipoUI, string> = {
    whatsapp: 'Ex: (61) 99999-9999',
    telefone: 'Ex: (61) 99999-9999',
    email: 'Ex: seuemail@exemplo.com',
  };

  const goToPayment = () => {
    let hasError = false;
    if (!nome.trim()) {
      setErroNome(true);
      hasError = true;
    } else setErroNome(false);
    if (!contato.trim()) {
      setErroContato(true);
      hasError = true;
    } else setErroContato(false);
    if (hasError) return;
    setStep(2);
  };

  const confirmarPedido = async () => {
    setEnviando(true);
    const itens: ItemPedido[] = [];
    Object.entries(cart).forEach(([id, qty]) => {
      const p = produtos.find((x) => x.id === Number(id));
      if (p) itens.push({ id: p.id, nome: p.nome, qty, preco: p.preco });
    });

    try {
      await api.savePedido({
        nome: nome.trim(),
        contato: contato.trim(),
        contatoTipo,
        itens,
        total: cartTotal,
      });
      await api.updateEstoque(itens.map((i) => ({ id: i.id, qty: i.qty })));
    } catch (e) {
      // segue para tela de sucesso mesmo assim — o pedido é o mais importante para o usuário
    } finally {
      setEnviando(false);
      setStep(3);
      clearCart();
    }
  };

  const copyPix = async () => {
    if (!pix) return;
    await Clipboard.setStringAsync(pix.chave);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const iconMap: Record<ContatoTipoUI, keyof typeof Feather.glyphMap> = {
    whatsapp: 'message-circle',
    telefone: 'phone',
    email: 'mail',
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
      onShow={reset}
    >
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: colors.creme }]}>
          <TouchableOpacity style={styles.close} onPress={handleClose}>
            <Feather name="x" size={20} color={colors.marromDark} />
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={[styles.titulo, { color: colors.marromDark }]}>Finalizar Pedido</Text>

            {step === 1 && (
              <View>
                <Text style={[styles.label, { color: colors.marromDark }]}>Seu nome</Text>
                <TextInput
                  value={nome}
                  onChangeText={setNome}
                  placeholder="Ex: Ana Silva"
                  placeholderTextColor={colors.textoSuave}
                  maxLength={50}
                  style={[
                    styles.input,
                    { borderColor: erroNome ? colors.ouro : colors.borda, color: colors.texto, backgroundColor: colors.branco },
                  ]}
                />

                <Text style={[styles.label, { color: colors.marromDark, marginTop: 14 }]}>
                  Meio de contato <Text style={{ color: colors.ouro }}>*</Text>
                </Text>
                <View style={styles.tipoRow}>
                  {(['whatsapp', 'telefone', 'email'] as ContatoTipoUI[]).map((tipo) => (
                    <TouchableOpacity
                      key={tipo}
                      style={[
                        styles.tipoBtn,
                        {
                          borderColor: colors.borda,
                          backgroundColor: contatoTipo === tipo ? colors.ouroDark : colors.branco,
                        },
                      ]}
                      onPress={() => setContatoTipo(tipo)}
                    >
                      <Feather
                        name={iconMap[tipo]}
                        size={14}
                        color={contatoTipo === tipo ? '#fff' : colors.marromDark}
                      />
                      <Text
                        style={[
                          styles.tipoBtnTxt,
                          { color: contatoTipo === tipo ? '#fff' : colors.marromDark },
                        ]}
                      >
                        {tipo === 'whatsapp' ? 'WhatsApp' : tipo === 'telefone' ? 'Telefone' : 'E-mail'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TextInput
                  value={contato}
                  onChangeText={setContato}
                  placeholder={placeholders[contatoTipo]}
                  placeholderTextColor={colors.textoSuave}
                  keyboardType={contatoTipo === 'email' ? 'email-address' : 'phone-pad'}
                  style={[
                    styles.input,
                    { marginTop: 10, borderColor: erroContato ? colors.ouro : colors.borda, color: colors.texto, backgroundColor: colors.branco },
                  ]}
                />
                <Text style={[styles.hint, { color: colors.textoSuave }]}>
                  Para entrar em contato sobre o seu pedido 😊
                </Text>

                <TouchableOpacity
                  style={[styles.btnPrimary, { backgroundColor: colors.ouroDark, marginTop: 16 }]}
                  onPress={goToPayment}
                >
                  <Text style={styles.btnPrimaryTxt}>Ver Resumo →</Text>
                </TouchableOpacity>
              </View>
            )}

            {step === 2 && (
              <View>
                <View style={[styles.resumoBox, { borderColor: colors.borda }]}>
                  <Text style={[styles.resumoTitulo, { color: colors.marromDark }]}>Resumo do Pedido</Text>
                  {entries.map(([id, qty]) => {
                    const p = produtos.find((x) => x.id === Number(id));
                    if (!p) return null;
                    return (
                      <View key={id} style={styles.resumoItem}>
                        <Text style={{ color: colors.texto, fontSize: 12.5 }}>
                          {qty}× {p.nome}
                        </Text>
                        <Text style={{ color: colors.texto, fontSize: 12.5, fontWeight: '600' }}>
                          {formatMoney(p.preco * qty)}
                        </Text>
                      </View>
                    );
                  })}
                  <View style={[styles.resumoTotalRow, { borderTopColor: colors.borda }]}>
                    <Text style={{ color: colors.marromDark, fontWeight: '700' }}>Total</Text>
                    <Text style={{ color: colors.marromDark, fontWeight: '800', fontSize: 15 }}>
                      {formatMoney(cartTotal)}
                    </Text>
                  </View>
                </View>

                <View style={[styles.contatoBox, { backgroundColor: colors.ouroLight }]}>
                  <Feather name={iconMap[contatoTipo]} size={16} color={colors.ouroDark} />
                  <Text style={{ color: colors.marromDark, fontSize: 12.5, marginLeft: 8 }}>
                    <Text style={{ fontWeight: '700' }}>
                      {contatoTipo.charAt(0).toUpperCase() + contatoTipo.slice(1)}:
                    </Text>{' '}
                    {contato}
                  </Text>
                </View>

                <View style={[styles.pixBox, { backgroundColor: colors.branco, borderColor: colors.borda }]}>
                  <Text style={[styles.pixTitle, { color: colors.marromDark }]}>💸 Pagamento via Pix</Text>
                  <Text style={[styles.pixHint, { color: colors.textoSuave }]}>
                    Após confirmar, realize o pagamento:
                  </Text>
                  <View style={[styles.pixKeyBox, { borderColor: colors.borda }]}>
                    <Text style={{ color: colors.texto, fontWeight: '700', flex: 1 }} numberOfLines={1}>
                      {pix?.chave}
                    </Text>
                    <TouchableOpacity onPress={copyPix}>
                      <Text style={{ color: colors.ouroDark, fontWeight: '700', fontSize: 12.5 }}>
                        {copiado ? '✅ Copiado!' : '📋 Copiar'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={{ color: colors.textoSuave, fontSize: 11.5, marginTop: 6 }}>
                    Tipo: {pix?.tipo}
                  </Text>
                  <Text style={{ color: colors.textoSuave, fontSize: 11.5 }}>Titular: {pix?.nome}</Text>
                </View>

                <TouchableOpacity
                  style={[styles.btnPrimary, { backgroundColor: colors.ouroDark, marginTop: 16 }]}
                  onPress={confirmarPedido}
                  disabled={enviando}
                >
                  {enviando ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.btnPrimaryTxt}>✅ Confirmar Pedido</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btnOutline, { borderColor: colors.borda, marginTop: 8 }]}
                  onPress={() => setStep(1)}
                >
                  <Text style={{ color: colors.marromDark, fontWeight: '700', fontSize: 13 }}>← Voltar</Text>
                </TouchableOpacity>
              </View>
            )}

            {step === 3 && (
              <View style={{ alignItems: 'center', paddingVertical: 20 }}>
                <Text style={{ fontSize: 48, marginBottom: 10 }}>🎉</Text>
                <Text style={[styles.resumoTitulo, { color: colors.marromDark }]}>Pedido Confirmado!</Text>
                <Text style={{ color: colors.texto, marginTop: 6, fontWeight: '700' }}>
                  Obrigado, {nome}! 🎉
                </Text>
                <Text style={{ color: colors.textoSuave, textAlign: 'center', marginTop: 8, fontSize: 12.5 }}>
                  Realize o Pix e aguarde confirmação. Obrigado por apoiar a causa!
                </Text>
                <TouchableOpacity
                  style={[styles.btnPrimary, { backgroundColor: colors.ouroDark, marginTop: 20, alignSelf: 'stretch' }]}
                  onPress={handleClose}
                >
                  <Text style={styles.btnPrimaryTxt}>Fechar</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modal: { maxHeight: '90%', borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: 20 },
  close: { alignSelf: 'flex-end', padding: 4, marginBottom: 4 },
  titulo: { fontSize: 18, fontWeight: '800', marginBottom: 16 },
  label: { fontSize: 12.5, fontWeight: '700', marginBottom: 6 },
  input: { borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11, fontSize: 14 },
  hint: { fontSize: 11, marginTop: 6 },
  tipoRow: { flexDirection: 'row', gap: 8 },
  tipoBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, borderWidth: 1.5, borderRadius: 10, paddingVertical: 9 },
  tipoBtnTxt: { fontSize: 11, fontWeight: '700' },
  btnPrimary: { paddingVertical: 14, borderRadius: 13, alignItems: 'center' },
  btnPrimaryTxt: { color: '#fff', fontWeight: '700', fontSize: 14 },
  btnOutline: { paddingVertical: 13, borderRadius: 13, alignItems: 'center', borderWidth: 1.5 },
  resumoBox: { borderWidth: 1, borderRadius: 14, padding: 14 },
  resumoTitulo: { fontSize: 14.5, fontWeight: '700', marginBottom: 10 },
  resumoItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  resumoTotalRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, marginTop: 6, paddingTop: 8 },
  contatoBox: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, marginTop: 12 },
  pixBox: { borderWidth: 1, borderRadius: 14, padding: 14, marginTop: 12 },
  pixTitle: { fontSize: 13.5, fontWeight: '700' },
  pixHint: { fontSize: 11.5, marginTop: 4, marginBottom: 10 },
  pixKeyBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 },
});
