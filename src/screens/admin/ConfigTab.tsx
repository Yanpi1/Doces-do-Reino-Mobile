import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '../../theme/ThemeContext';
import { PixConfig, ContatoConfig, ContatoTipo } from '../../types';
import * as api from '../../services/api';
import { pickAndCompressImage } from '../../utils/imagePicker';

type SubTab = 'pix' | 'contato' | 'imagens';

export default function ConfigTab() {
  const { colors } = useAppTheme();
  const [sub, setSub] = useState<SubTab>('pix');

  return (
    <View style={styles.root}>
      <View style={[styles.subTabs, { borderColor: colors.borda }]}>
        {(
          [
            { key: 'pix', label: 'Pix' },
            { key: 'contato', label: 'Contato' },
            { key: 'imagens', label: 'Imagens' },
          ] as { key: SubTab; label: string }[]
        ).map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[
              styles.subTabBtn,
              sub === t.key && { backgroundColor: colors.ouroDark },
            ]}
            onPress={() => setSub(t.key)}
          >
            <Text
              style={[
                styles.subTabTxt,
                { color: sub === t.key ? '#fff' : colors.marromDark },
              ]}
            >
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {sub === 'pix' && <PixForm />}
      {sub === 'contato' && <ContatoForm />}
      {sub === 'imagens' && <ImagensForm />}
    </View>
  );
}

// ============================
//  PIX
// ============================
function PixForm() {
  const { colors } = useAppTheme();
  const [tipo, setTipo] = useState('Telefone');
  const [chave, setChave] = useState('');
  const [nome, setNome] = useState('');
  const [loading, setLoading] = useState(true);
  const [salvo, setSalvo] = useState(false);

  useEffect(() => {
    (async () => {
      const data: PixConfig = await api.getPix();
      setTipo(data.tipo);
      setChave(data.chave);
      setNome(data.nome);
      setLoading(false);
    })();
  }, []);

  const salvar = async () => {
    await api.saveConfig('pix', { tipo, chave: chave.trim(), nome: nome.trim() });
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2000);
  };

  if (loading) return <ActivityIndicator color={colors.ouroDark} style={{ marginTop: 30 }} />;

  return (
    <ScrollView>
      <View style={[styles.card, { backgroundColor: colors.adminCardBg, borderColor: colors.borda }]}>
        <Text style={[styles.h3, { color: colors.marromDark }]}>Chave Pix</Text>
        <Text style={[styles.sub, { color: colors.textoSuave }]}>Exibida ao cliente na hora do pagamento</Text>

        <Text style={[styles.label, { color: colors.marromDark, marginTop: 14 }]}>Tipo de chave</Text>
        <View style={[styles.pickerWrap, { borderColor: colors.borda, backgroundColor: colors.branco }]}>
          <Picker selectedValue={tipo} onValueChange={setTipo} style={{ color: colors.texto }}>
            {['Telefone', 'CPF', 'CNPJ', 'E-mail', 'Aleatória'].map((t) => (
              <Picker.Item key={t} label={t} value={t} />
            ))}
          </Picker>
        </View>

        <Text style={[styles.label, { color: colors.marromDark, marginTop: 12 }]}>Chave Pix</Text>
        <TextInput
          value={chave}
          onChangeText={setChave}
          placeholder="(61) 99279-6430"
          placeholderTextColor={colors.textoSuave}
          style={[styles.input, { borderColor: colors.borda, color: colors.texto, backgroundColor: colors.branco }]}
        />

        <Text style={[styles.label, { color: colors.marromDark, marginTop: 12 }]}>Nome do titular</Text>
        <TextInput
          value={nome}
          onChangeText={setNome}
          placeholder="ReinoGourmet"
          placeholderTextColor={colors.textoSuave}
          style={[styles.input, { borderColor: colors.borda, color: colors.texto, backgroundColor: colors.branco }]}
        />

        <TouchableOpacity style={[styles.btnSalvar, { backgroundColor: colors.ouroDark }]} onPress={salvar}>
          <Text style={styles.btnSalvarTxt}>{salvo ? '✅ Salvo!' : '💾 Salvar Pix'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ============================
//  CONTATO
// ============================
function ContatoForm() {
  const { colors } = useAppTheme();
  const [tipo, setTipo] = useState<ContatoTipo>('whatsapp');
  const [whatsapp, setWhatsapp] = useState('');
  const [msgWpp, setMsgWpp] = useState('');
  const [iframe, setIframe] = useState('');
  const [email, setEmail] = useState('');
  const [assunto, setAssunto] = useState('');
  const [loading, setLoading] = useState(true);
  const [salvo, setSalvo] = useState(false);

  useEffect(() => {
    (async () => {
      const data: ContatoConfig = await api.getContato();
      setTipo(data.tipo);
      setWhatsapp(data.whatsapp);
      setMsgWpp(data.msgWpp);
      setIframe(data.iframe);
      setEmail(data.email);
      setAssunto(data.assunto);
      setLoading(false);
    })();
  }, []);

  const salvar = async () => {
    await api.saveConfig('contato', {
      tipo,
      whatsapp: whatsapp.trim(),
      msgWpp: msgWpp.trim(),
      iframe: iframe.trim(),
      email: email.trim(),
      assunto: assunto.trim(),
    });
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2000);
  };

  if (loading) return <ActivityIndicator color={colors.ouroDark} style={{ marginTop: 30 }} />;

  return (
    <ScrollView>
      <View style={[styles.card, { backgroundColor: colors.adminCardBg, borderColor: colors.borda }]}>
        <Text style={[styles.h3, { color: colors.marromDark }]}>Canal de Contato</Text>
        <Text style={[styles.sub, { color: colors.textoSuave }]}>Escolha como o cliente entra em contato</Text>

        <Text style={[styles.label, { color: colors.marromDark, marginTop: 14 }]}>Tipo</Text>
        <View style={[styles.pickerWrap, { borderColor: colors.borda, backgroundColor: colors.branco }]}>
          <Picker selectedValue={tipo} onValueChange={(v) => setTipo(v as ContatoTipo)} style={{ color: colors.texto }}>
            <Picker.Item label="WhatsApp" value="whatsapp" />
            <Picker.Item label="E-mail" value="email" />
            <Picker.Item label="Iframe (mapa/chat externo)" value="iframe" />
          </Picker>
        </View>

        {tipo === 'whatsapp' && (
          <>
            <Text style={[styles.label, { color: colors.marromDark, marginTop: 12 }]}>Número (com DDI+DDD)</Text>
            <TextInput
              value={whatsapp}
              onChangeText={setWhatsapp}
              placeholder="5561992796430"
              placeholderTextColor={colors.textoSuave}
              keyboardType="number-pad"
              style={[styles.input, { borderColor: colors.borda, color: colors.texto, backgroundColor: colors.branco }]}
            />
            <Text style={[styles.label, { color: colors.marromDark, marginTop: 12 }]}>Mensagem padrão</Text>
            <TextInput
              value={msgWpp}
              onChangeText={setMsgWpp}
              placeholder="Olá! Quero fazer um pedido."
              placeholderTextColor={colors.textoSuave}
              style={[styles.input, { borderColor: colors.borda, color: colors.texto, backgroundColor: colors.branco }]}
            />
          </>
        )}

        {tipo === 'email' && (
          <>
            <Text style={[styles.label, { color: colors.marromDark, marginTop: 12 }]}>E-mail</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="contato@exemplo.com"
              placeholderTextColor={colors.textoSuave}
              keyboardType="email-address"
              autoCapitalize="none"
              style={[styles.input, { borderColor: colors.borda, color: colors.texto, backgroundColor: colors.branco }]}
            />
            <Text style={[styles.label, { color: colors.marromDark, marginTop: 12 }]}>Assunto padrão</Text>
            <TextInput
              value={assunto}
              onChangeText={setAssunto}
              placeholder="Pedido ReinoGourmet"
              placeholderTextColor={colors.textoSuave}
              style={[styles.input, { borderColor: colors.borda, color: colors.texto, backgroundColor: colors.branco }]}
            />
          </>
        )}

        {tipo === 'iframe' && (
          <>
            <Text style={[styles.label, { color: colors.marromDark, marginTop: 12 }]}>URL do iframe</Text>
            <TextInput
              value={iframe}
              onChangeText={setIframe}
              placeholder="https://..."
              placeholderTextColor={colors.textoSuave}
              autoCapitalize="none"
              style={[styles.input, { borderColor: colors.borda, color: colors.texto, backgroundColor: colors.branco }]}
            />
          </>
        )}

        <TouchableOpacity style={[styles.btnSalvar, { backgroundColor: colors.ouroDark }]} onPress={salvar}>
          <Text style={styles.btnSalvarTxt}>{salvo ? '✅ Salvo!' : '💾 Salvar Contato'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ============================
//  IMAGENS (logo header / sobre)
// ============================
function ImagensForm() {
  const { colors } = useAppTheme();
  const [logoHeader, setLogoHeader] = useState('');
  const [logoSobre, setLogoSobre] = useState('');
  const [loading, setLoading] = useState(true);
  const [picking, setPicking] = useState<'header' | 'sobre' | null>(null);
  const [salvoHeader, setSalvoHeader] = useState(false);
  const [salvoSobre, setSalvoSobre] = useState(false);

  useEffect(() => {
    (async () => {
      const [h, s] = await Promise.all([api.getLogoHeader(), api.getLogoSobre()]);
      setLogoHeader(h);
      setLogoSobre(s);
      setLoading(false);
    })();
  }, []);

  const escolher = async (tipo: 'header' | 'sobre') => {
    setPicking(tipo);
    try {
      const uri = await pickAndCompressImage(700, 700, 0.85);
      if (uri) {
        if (tipo === 'header') setLogoHeader(uri);
        else setLogoSobre(uri);
      }
    } finally {
      setPicking(null);
    }
  };

  const salvar = async (tipo: 'header' | 'sobre') => {
    if (tipo === 'header') {
      await api.saveConfig('logo_header', logoHeader.trim());
      setSalvoHeader(true);
      setTimeout(() => setSalvoHeader(false), 2000);
    } else {
      await api.saveConfig('logo_sobre', logoSobre.trim());
      setSalvoSobre(true);
      setTimeout(() => setSalvoSobre(false), 2000);
    }
  };

  if (loading) return <ActivityIndicator color={colors.ouroDark} style={{ marginTop: 30 }} />;

  return (
    <ScrollView>
      <View style={[styles.card, { backgroundColor: colors.adminCardBg, borderColor: colors.borda }]}>
        <Text style={[styles.h3, { color: colors.marromDark }]}>Logo do Cabeçalho</Text>
        <Text style={[styles.sub, { color: colors.textoSuave }]}>Aparece ao lado do nome no topo do site</Text>

        <TouchableOpacity
          style={[styles.imgPicker, { borderColor: colors.borda, backgroundColor: colors.branco }]}
          onPress={() => escolher('header')}
          disabled={picking === 'header'}
        >
          {picking === 'header' ? (
            <ActivityIndicator color={colors.ouroDark} />
          ) : logoHeader ? (
            <Image source={{ uri: logoHeader }} style={styles.imgPreview} resizeMode="contain" />
          ) : (
            <>
              <Feather name="upload" size={20} color={colors.textoSuave} />
              <Text style={{ color: colors.textoSuave, fontSize: 12, marginTop: 6 }}>Toque para escolher</Text>
            </>
          )}
        </TouchableOpacity>
        {!!logoHeader && (
          <TouchableOpacity onPress={() => setLogoHeader('')} style={{ marginTop: 8 }}>
            <Text style={{ color: colors.vermelho, fontSize: 12, fontWeight: '600' }}>Remover</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={[styles.btnSalvar, { backgroundColor: colors.ouroDark }]} onPress={() => salvar('header')}>
          <Text style={styles.btnSalvarTxt}>{salvoHeader ? '✅ Salvo!' : '💾 Salvar Logo do Cabeçalho'}</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.card, { backgroundColor: colors.adminCardBg, borderColor: colors.borda }]}>
        <Text style={[styles.h3, { color: colors.marromDark }]}>Imagem da Seção "Sobre"</Text>
        <Text style={[styles.sub, { color: colors.textoSuave }]}>Foto exibida na seção Sobre o Projeto</Text>

        <TouchableOpacity
          style={[styles.imgPicker, { borderColor: colors.borda, backgroundColor: colors.branco }]}
          onPress={() => escolher('sobre')}
          disabled={picking === 'sobre'}
        >
          {picking === 'sobre' ? (
            <ActivityIndicator color={colors.ouroDark} />
          ) : logoSobre ? (
            <Image source={{ uri: logoSobre }} style={styles.imgPreview} resizeMode="cover" />
          ) : (
            <>
              <Feather name="upload" size={20} color={colors.textoSuave} />
              <Text style={{ color: colors.textoSuave, fontSize: 12, marginTop: 6 }}>Toque para escolher</Text>
            </>
          )}
        </TouchableOpacity>
        {!!logoSobre && (
          <TouchableOpacity onPress={() => setLogoSobre('')} style={{ marginTop: 8 }}>
            <Text style={{ color: colors.vermelho, fontSize: 12, fontWeight: '600' }}>Remover</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={[styles.btnSalvar, { backgroundColor: colors.ouroDark }]} onPress={() => salvar('sobre')}>
          <Text style={styles.btnSalvarTxt}>{salvoSobre ? '✅ Salvo!' : '💾 Salvar Imagem "Sobre"'}</Text>
        </TouchableOpacity>
      </View>
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 16 },
  subTabs: { flexDirection: 'row', borderRadius: 12, borderWidth: 1, overflow: 'hidden', marginBottom: 16 },
  subTabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  subTabTxt: { fontSize: 12.5, fontWeight: '700' },
  card: { borderWidth: 1, borderRadius: 14, padding: 16, marginBottom: 16 },
  h3: { fontSize: 15, fontWeight: '800' },
  sub: { fontSize: 11.5, marginTop: 2 },
  label: { fontSize: 12, fontWeight: '700', marginBottom: 6 },
  input: { borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14 },
  pickerWrap: { borderWidth: 1.5, borderRadius: 12, overflow: 'hidden' },
  btnSalvar: { marginTop: 16, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  btnSalvarTxt: { color: '#fff', fontWeight: '700', fontSize: 13 },
  imgPicker: { height: 120, borderWidth: 1.5, borderStyle: 'dashed', borderRadius: 14, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginTop: 14 },
  imgPreview: { width: '100%', height: '100%' },
});
