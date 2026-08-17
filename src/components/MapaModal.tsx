import React from 'react';
import { View, Text, Modal, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import WebView from 'react-native-webview';
import { useAppTheme } from '../theme/ThemeContext';

export default function MapaModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { colors } = useAppTheme();
  const endereco = 'Qr 415 Cj 3 lote 26 Planaltina DF Brasil';

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: colors.creme }]}>
          <TouchableOpacity style={styles.close} onPress={onClose}>
            <Feather name="x" size={20} color={colors.marromDark} />
          </TouchableOpacity>
          <Text style={[styles.titulo, { color: colors.marromDark }]}>📍 Doces do Reino</Text>
          <Text style={[styles.endereco, { color: colors.textoSuave }]}>
            Qr 415 Cj 3 lote 26 — Planaltina, DF
          </Text>

          <View style={styles.mapWrap}>
            <WebView
              source={{
                uri: `https://maps.google.com/maps?q=${encodeURIComponent(endereco)}&output=embed&z=15`,
              }}
              style={{ flex: 1, borderRadius: 12 }}
            />
          </View>

          <TouchableOpacity
            style={[styles.btn, { backgroundColor: colors.ouroDark }]}
            onPress={() =>
              Linking.openURL(`https://www.google.com/maps/search/${encodeURIComponent(endereco)}`)
            }
          >
            <Text style={styles.btnTxt}>🗺️ Abrir no Google Maps</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  modal: { width: '100%', borderRadius: 20, padding: 20 },
  close: { alignSelf: 'flex-end', padding: 4 },
  titulo: { fontSize: 17, fontWeight: '800', marginBottom: 4 },
  endereco: { fontSize: 13, marginBottom: 14 },
  mapWrap: { height: 260, borderRadius: 12, overflow: 'hidden', marginBottom: 16 },
  btn: { paddingVertical: 13, borderRadius: 12, alignItems: 'center' },
  btnTxt: { color: '#fff', fontWeight: '700', fontSize: 13.5 },
});
