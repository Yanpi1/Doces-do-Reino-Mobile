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
import { Slide } from '../../types';
import { pickAndCompressImage } from '../../utils/imagePicker';
import * as api from '../../services/api';

interface Props {
  visible: boolean;
  slide: Slide | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function SlideFormModal({ visible, slide, onClose, onSaved }: Props) {
  const { colors } = useAppTheme();
  const [titulo, setTitulo] = useState('');
  const [desc, setDesc] = useState('');
  const [preco, setPreco] = useState('');
  const [imagem, setImagem] = useState('');
  const [emoji, setEmoji] = useState('🍨');
  const [salvando, setSalvando] = useState(false);
  const [pickingImg, setPickingImg] = useState(false);

  useEffect(() => {
    if (visible) {
      setTitulo(slide?.titulo || '');
      setDesc(slide?.desc || '');
      setPreco(slide?.preco ? String(slide.preco) : '');
      setImagem(slide?.imagem || '');
      setEmoji(slide?.emoji || '🍨');
    }
  }, [visible, slide]);

  const escolherImagem = async () => {
    setPickingImg(true);
    try {
      const uri = await pickAndCompressImage(900, 600, 0.85);
      if (uri) setImagem(uri);
    } finally {
      setPickingImg(false);
    }
  };

  const salvar = async () => {
    if (!titulo.trim()) return;
    setSalvando(true);
    try {
      await api.saveSlide({
        id: slide?.id,
        titulo: titulo.trim(),
        desc: desc.trim(),
        preco: preco ? parseFloat(preco.replace(',', '.')) : null,
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
              {slide ? 'Editar Slide' : 'Novo Slide'}
            </Text>

            <Text style={[styles.label, { color: colors.marromDark }]}>Título</Text>
            <TextInput
              value={titulo}
              onChangeText={setTitulo}
              placeholder="Ex: Combo Especial"
              placeholderTextColor={colors.textoSuave}
              style={[styles.input, { borderColor: colors.borda, color: colors.texto, backgroundColor: colors.branco }]}
            />

            <Text style={[styles.label, { color: colors.marromDark, marginTop: 12 }]}>Descrição</Text>
            <TextInput
              value={desc}
              onChangeText={setDesc}
              placeholder="Ex: 3 DinDins + 1 Bolo de Pote"
              placeholderTextColor={colors.textoSuave}
              multiline
              numberOfLines={3}
              style={[styles.input, styles.textarea, { borderColor: colors.borda, color: colors.texto, backgroundColor: colors.branco }]}
            />

            <Text style={[styles.label, { color: colors.marromDark, marginTop: 12 }]}>Preço (opcional)</Text>
            <TextInput
              value={preco}
              onChangeText={setPreco}
              placeholder="Ex: 15.00"
              placeholderTextColor={colors.textoSuave}
              keyboardType="decimal-pad"
              style={[styles.input, { borderColor: colors.borda, color: colors.texto, backgroundColor: colors.branco }]}
            />

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

            <Text style={[styles.label, { color: colors.marromDark, marginTop: 12 }]}>Emoji (fallback)</Text>
            <TextInput
              value={emoji}
              onChangeText={setEmoji}
              placeholder="🍨"
              placeholderTextColor={colors.textoSuave}
              maxLength={4}
              style={[styles.input, { borderColor: colors.borda, color: colors.texto, backgroundColor: colors.branco, width: 90 }]}
            />

            <TouchableOpacity
              style={[styles.btnSalvar, { backgroundColor: colors.ouroDark }]}
              onPress={salvar}
              disabled={salvando}
            >
              {salvando ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnSalvarTxt}>💾 Salvar Slide</Text>}
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
  imgPicker: { height: 130, borderWidth: 1.5, borderStyle: 'dashed', borderRadius: 14, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  imgPreview: { width: '100%', height: '100%' },
  btnSalvar: { marginTop: 20, marginBottom: 10, paddingVertical: 14, borderRadius: 13, alignItems: 'center' },
  btnSalvarTxt: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
