import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppTheme } from '../../theme/ThemeContext';

interface Props {
  visible: boolean;
  titulo?: string;
  mensagem?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmModal({
  visible,
  titulo = 'Excluir item?',
  mensagem = 'Esta ação não pode ser desfeita.',
  onCancel,
  onConfirm,
}: Props) {
  const { colors } = useAppTheme();
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: colors.creme }]}>
          <Text style={{ fontSize: 32, textAlign: 'center', marginBottom: 8 }}>🗑️</Text>
          <Text style={[styles.titulo, { color: colors.marromDark }]}>{titulo}</Text>
          <Text style={[styles.msg, { color: colors.textoSuave }]}>{mensagem}</Text>
          <View style={styles.row}>
            <TouchableOpacity style={[styles.btn, styles.btnOutline, { borderColor: colors.borda }]} onPress={onCancel}>
              <Text style={{ color: colors.marromDark, fontWeight: '700' }}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, { backgroundColor: colors.vermelho }]} onPress={onConfirm}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', padding: 30 },
  modal: { width: '100%', borderRadius: 18, padding: 22 },
  titulo: { fontSize: 15.5, fontWeight: '800', textAlign: 'center' },
  msg: { fontSize: 12.5, textAlign: 'center', marginTop: 6, marginBottom: 18 },
  row: { flexDirection: 'row', gap: 10 },
  btn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  btnOutline: { borderWidth: 1.5 },
});
