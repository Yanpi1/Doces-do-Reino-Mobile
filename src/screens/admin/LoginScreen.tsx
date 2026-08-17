import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useAppTheme } from '../../theme/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen({ onVoltar }: { onVoltar: () => void }) {
  const { colors } = useAppTheme();
  const { doLogin, loading, error } = useAuth();
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: colors.adminBg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.card, { backgroundColor: colors.adminCardBg }]}>
        <View style={[styles.logoWrap, { backgroundColor: colors.ouroLight }]}>
          <Text style={{ fontSize: 30 }}>👑</Text>
        </View>
        <Text style={[styles.title, { color: colors.marromDark }]}>Área Admin</Text>
        <Text style={[styles.sub, { color: colors.textoSuave }]}>Doces do Reino</Text>

        <Text style={[styles.label, { color: colors.marromDark }]}>Usuário</Text>
        <TextInput
          value={user}
          onChangeText={setUser}
          placeholder="admin"
          placeholderTextColor={colors.textoSuave}
          autoCapitalize="none"
          style={[styles.input, { borderColor: colors.borda, color: colors.texto, backgroundColor: colors.branco }]}
        />

        <Text style={[styles.label, { color: colors.marromDark, marginTop: 12 }]}>Senha</Text>
        <TextInput
          value={pass}
          onChangeText={setPass}
          placeholder="••••••••"
          placeholderTextColor={colors.textoSuave}
          secureTextEntry
          style={[styles.input, { borderColor: colors.borda, color: colors.texto, backgroundColor: colors.branco }]}
        />

        {!!error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: colors.ouroDark, marginTop: 16 }]}
          onPress={() => doLogin(user, pass)}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnTxt}>Entrar →</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={onVoltar} style={{ marginTop: 16, alignItems: 'center' }}>
          <Text style={{ color: colors.ouroDark, fontSize: 12.5, fontWeight: '600' }}>← Voltar ao site</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: { width: '100%', maxWidth: 380, borderRadius: 20, padding: 26, alignItems: 'center' },
  logoWrap: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  title: { fontSize: 19, fontWeight: '800' },
  sub: { fontSize: 12.5, marginBottom: 20, marginTop: 2 },
  label: { alignSelf: 'flex-start', fontSize: 12, fontWeight: '700', marginBottom: 6 },
  input: { alignSelf: 'stretch', borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11, fontSize: 14 },
  btn: { alignSelf: 'stretch', paddingVertical: 13, borderRadius: 12, alignItems: 'center' },
  btnTxt: { color: '#fff', fontWeight: '700', fontSize: 14 },
  error: { color: '#C0392B', fontSize: 12, marginTop: 10, textAlign: 'center' },
});
