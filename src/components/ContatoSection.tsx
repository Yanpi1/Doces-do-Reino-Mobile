import React from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import WebView from 'react-native-webview';
import { useAppTheme } from '../theme/ThemeContext';
import { ContatoConfig } from '../types';

export default function ContatoSection({ contato }: { contato: ContatoConfig | null }) {
  const { colors } = useAppTheme();

  if (!contato) return null;

  const abrirWhatsapp = () => {
    const num = (contato.whatsapp || '').replace(/\D/g, '');
    const msg = encodeURIComponent(contato.msgWpp || '');
    Linking.openURL(`https://wa.me/${num}?text=${msg}`);
  };

  const abrirEmail = () => {
    const assunto = encodeURIComponent(contato.assunto || '');
    Linking.openURL(`mailto:${contato.email}?subject=${assunto}`);
  };

  return (
    <View style={styles.section}>
      <View style={styles.headCentered}>
        <Text style={[styles.eyebrow, { color: colors.ouroDark }]}>Fale conosco</Text>
        <Text style={[styles.titulo, { color: colors.marromDark }]}>Entre em Contato</Text>
      </View>

      {contato.tipo === 'whatsapp' && (
        <View style={[styles.card, { backgroundColor: colors.branco, borderColor: colors.borda }]}>
          <View style={[styles.icon, { backgroundColor: '#DDF7E4' }]}>
            <Feather name="message-circle" size={26} color="#25D366" />
          </View>
          <Text style={[styles.cardTitle, { color: colors.marromDark }]}>Fale pelo WhatsApp</Text>
          <Text style={[styles.cardSub, { color: colors.textoSuave }]}>
            Tire dúvidas ou faça pedidos diretamente.
          </Text>
          <TouchableOpacity style={[styles.btnWpp, { backgroundColor: '#25D366' }]} onPress={abrirWhatsapp}>
            <Feather name="external-link" size={15} color="#fff" />
            <Text style={styles.btnWppTxt}>Abrir WhatsApp</Text>
          </TouchableOpacity>
        </View>
      )}

      {contato.tipo === 'email' && (
        <View style={[styles.card, { backgroundColor: colors.branco, borderColor: colors.borda }]}>
          <View style={[styles.icon, { backgroundColor: '#f0e6ff' }]}>
            <Feather name="mail" size={26} color="#7c3aed" />
          </View>
          <Text style={[styles.cardTitle, { color: colors.marromDark }]}>Envie um e-mail</Text>
          <Text style={[styles.cardSub, { color: colors.textoSuave }]}>{contato.email}</Text>
          <TouchableOpacity style={[styles.btnWpp, { backgroundColor: colors.ouroDark }]} onPress={abrirEmail}>
            <Feather name="send" size={15} color="#fff" />
            <Text style={styles.btnWppTxt}>Enviar E-mail</Text>
          </TouchableOpacity>
        </View>
      )}

      {contato.tipo === 'iframe' && !!contato.iframe && (
        <View style={[styles.iframeWrap, { borderColor: colors.borda }]}>
          <WebView source={{ uri: contato.iframe }} style={{ flex: 1 }} />
        </View>
      )}

      {contato.tipo !== 'whatsapp' && contato.tipo !== 'email' && contato.tipo !== 'iframe' && (
        <Text style={[styles.empty, { color: colors.textoSuave }]}>
          Configure o contato no painel admin.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { paddingHorizontal: 16, paddingVertical: 24 },
  headCentered: { alignItems: 'center', marginBottom: 16 },
  eyebrow: { fontSize: 12.5, fontWeight: '700', marginBottom: 2 },
  titulo: { fontSize: 21, fontWeight: '800' },
  card: { borderRadius: 18, borderWidth: 1, padding: 22, alignItems: 'center' },
  icon: { width: 62, height: 62, borderRadius: 31, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  cardSub: { fontSize: 12.5, textAlign: 'center', marginBottom: 14 },
  btnWpp: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 11, paddingHorizontal: 20, borderRadius: 12 },
  btnWppTxt: { color: '#fff', fontWeight: '700', fontSize: 13 },
  iframeWrap: { height: 320, borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  empty: { textAlign: 'center', paddingVertical: 20, fontSize: 13 },
});
