import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '../theme/ThemeContext';

export default function ThemeToggleButton() {
  const { theme, toggleTheme, colors } = useAppTheme();
  return (
    <TouchableOpacity
      onPress={toggleTheme}
      style={[styles.btn, { backgroundColor: colors.ouroLight, borderColor: colors.borda }]}
      activeOpacity={0.8}
    >
      <Feather name={theme === 'dark' ? 'sun' : 'moon'} size={18} color={colors.ouroDark} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});
