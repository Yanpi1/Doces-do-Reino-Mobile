import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '../../theme/ThemeContext';
import { Produto } from '../../types';
import { pickAndCompressImage } from '../../utils/imagePicker';
import * as api from '../../services/api';

interface Props {
  visible: boolean;
  produto: Produto | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function ProdutoFormModal({ visible, produto, onClose, onSaved }: Props) {
  const { colors } = useAppTheme();
  const [nome, setNome] = useState('');
  const [desc, setDesc] = useState('');
  const [preco, setPreco] = useState('');
  const [estoque, setEstoque] = useState('');
  const [imagem, setImagem] = useState('');
  const [emoji, setEmoji] = useState('🍨');
  const [salvando, setSalvando] = useState(false);
  const [pickingImg, setPickingImg] = useState(false);

  useEffect(() => {
    if (visible) {
      setNome(produto?.nome || '');
      setDesc(produto?.desc || '');
      setPreco(produto ? String(produto.preco) : '');
      setEstoque(produto ? String(produto.estoque) : '');
      setImagem(produto?.imagem || '');
      setEmoji(produto?.emoji || '🍨');
    }
  }, [visible, produto]);

  const escolherImagem = async () => {
    setPickingImg(true);
    try {
      const uri = await pickAndCompressImage(800, 800, 0.85);
      if (uri) setImagem(uri);
    } finally {
      setPickingImg(false);
    }
  };

  const salvar = async () => {
    if (!nome.trim() || !preco) return;
    setSalvando(true);
    try {
      await api.saveProduto({
        id: produto?.id,
        nome: nome.trim(),
        desc: desc.trim(),
        preco: parseFloat(preco.replace(',', '.')) || 0,
        estoque: parseInt(estoque, 10) || 0,
        imagem,
        emoji: emoji.trim() || '🍨',
      });
      onSaved();
      onClose();
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: colors.creme }]}>
          <TouchableOpacity style={styles.close} onPress={onClose}>
            <Feather name="x" size={20} color={colors.marromDark} />
          </TouchableOpacity>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={[styles.titulo, { color: colors.marromDark }]}>
              {produto ? 'Editar Produto' : 'Novo Produto'}
            </Text>

            <Text style={[styles.label, { color: colors.marromDark }]}>Nome</Text>
            <TextInput
              value={nome}
              onChangeText={setNome}
              placeholder="Ex: DinDin de Oreo"
              placeholderTextColor={colors.textoSuave}
              style={[styles.input, { borderColor: colors.borda, color: colors.texto, backgroundColor: colors.branco }]}
            />

            <Text style={[styles.label, { color: colors.marromDark, marginTop: 12 }]}>Descrição</Text>
            <TextInput
              value={desc}
              onChangeText={setDesc}
              placeholder="Ex: Cremoso, com pedacinhos de Oreo..."
              placeholderTextColor={colors.textoSuave}
              multiline
              numberOfLines={3}
              style={[styles.input, styles.textarea, { borderColor: colors.borda, color: colors.texto, backgroundColor: colors.branco }]}
            />

            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.label, { color: colors.marromDark, marginTop: 12 }]}>Preço (R$)</Text>
                <TextInput
                  value={preco}
                  onChangeText={setPreco}
                  placeholder="4.00"
                  placeholderTextColor={colors.textoSuave}
                  keyboardType="decimal-pad"
                  style={[styles.input, { borderColor: colors.borda, color: colors.texto, backgroundColor: colors.branco }]}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.label, { color: colors.marromDark, marginTop: 12 }]}>Estoque</Text>
                <TextInput
                  value={estoque}
                  onChangeText={setEstoque}
                  placeholder="Ex: 10"
                  placeholderTextColor={colors.textoSuave}
                  keyboardType="number-pad"
                  style={[styles.input, { borderColor: colors.borda, color: colors.texto, backgroundColor: colors.branco }]}
                />
              </View>
            </View>

            <Text style={[styles.label, { color: colors.marromDark, marginTop: 12 }]}>Imagem</Text>
            <TouchableOpacity
              style={[styles.imgPicker, { borderColor: colors.borda, backgroundColor: colors.branco }]}
              onPress={escolherImagem}
              disabled={pickingImg}
            >
              {pickingImg ? (
                <ActivityIndicator color={colors.ouroDark} />
              ) : imagem ? (
                <Image source={{ uri: imagem }} style={styles.imgPreview} resizeMode="cover" />
              ) : (
                <>
                  <Feather name="upload" size={20} color={colors.textoSuave} />
                  <Text style={{ color: colors.textoSuave, fontSize: 12, marginTop: 6 }}>
                    Toque para escolher uma foto
                  </Text>
                </>
              )}
            </TouchableOpacity>
            {!!imagem && (
              <TouchableOpacity onPress={() => setImagem('')} style={{ marginTop: 8 }}>
                <Text style={{ color: colors.vermelho, fontSize: 12, fontWeight: '600' }}>Remover imagem</Text>
              </TouchableOpacity>
            )}

            <Text style={[styles.label, { color: colors.marromDark, marginTop: 12 }]}>
              Emoji (usado quando não há imagem)
            </Text>
            <TextInput
              value={emoji}
              onChangeText={setEmoji}
              placeholder="🍫"
              placeholderTextColor={colors.textoSuave}
              maxLength={4}
              style={[styles.input, { borderColor: colors.borda, color: colors.texto, backgroundColor: colors.branco, width: 90 }]}
            />

            <TouchableOpacity
              style={[styles.btnSalvar, { backgroundColor: colors.ouroDark }]}
              onPress={salvar}
              disabled={salvando}
            >
              {salvando ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnSalvarTxt}>💾 Salvar Produto</Text>}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modal: { maxHeight: '92%', borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: 20 },
  close: { alignSelf: 'flex-end', padding: 4 },
  titulo: { fontSize: 18, fontWeight: '800', marginBottom: 14 },
  label: { fontSize: 12, fontWeight: '700', marginBottom: 6 },
  input: { borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14 },
  textarea: { minHeight: 80, textAlignVertical: 'top' },
  row: { flexDirection: 'row', gap: 12 },
  imgPicker: { height: 130, borderWidth: 1.5, borderStyle: 'dashed', borderRadius: 14, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  imgPreview: { width: '100%', height: '100%' },
  btnSalvar: { marginTop: 20, marginBottom: 10, paddingVertical: 14, borderRadius: 13, alignItems: 'center' },
  btnSalvarTxt: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
