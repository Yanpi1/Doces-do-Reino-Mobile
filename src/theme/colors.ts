// ============================================
//  Doces do Reino — Paleta de cores
//  Espelha 1:1 as variáveis CSS de style.css
// ============================================

export type ThemeName = 'light' | 'dark';

export interface AppColors {
  ouro: string;
  ouroDark: string;
  ouroEscuro: string;
  ouroLight: string;
  marrom: string;
  marromDark: string;
  marromLight: string;
  creme: string;
  branco: string;
  fundo: string;
  texto: string;
  textoSuave: string;
  borda: string;
  verde: string;
  verdeBg: string;
  laranja: string;
  vermelho: string;
  vermelhoBg: string;
  adminBg: string;
  adminCardBg: string;
}

export const lightColors: AppColors = {
  ouro: '#C9A96E',
  ouroDark: '#A07840',
  ouroEscuro: '#A07840',
  ouroLight: '#F7F0E3',
  marrom: '#6B4226',
  marromDark: '#3E2310',
  marromLight: '#F2EAE0',
  creme: '#FDFAF6',
  branco: '#ffffff',
  fundo: '#F5F0EA',
  texto: '#2C1A0E',
  textoSuave: '#8A6E58',
  borda: '#EAE0D5',
  verde: '#2E7D52',
  verdeBg: '#EAF5EE',
  laranja: '#E8702A',
  vermelho: '#C0392B',
  vermelhoBg: '#FDECEA',
  adminBg: '#EDE7DF',
  adminCardBg: '#ffffff',
};

export const darkColors: AppColors = {
  ouro: '#D4B87A',
  ouroDark: '#E2C27E',
  ouroEscuro: '#B98A49',
  ouroLight: '#352514',
  marrom: '#8D5A34',
  marromDark: '#F0D8AA',
  marromLight: '#24160D',
  creme: '#171311',
  branco: '#221A16',
  fundo: '#1B1512',
  texto: '#F5E9D6',
  textoSuave: '#B89A7A',
  borda: '#3A2B21',
  verde: '#4ABA80',
  verdeBg: '#13261C',
  laranja: '#F08040',
  vermelho: '#E05050',
  vermelhoBg: '#321412',
  adminBg: '#181311',
  adminCardBg: '#231B17',
};

export function getColors(theme: ThemeName): AppColors {
  return theme === 'dark' ? darkColors : lightColors;
}

export const radius = { lg: 16, md: 10, sm: 6 };

export const fontFamily = {
  display: 'Fredoka_600SemiBold',
  displayBold: 'Fredoka_700Bold',
  body: 'Fredoka_400Regular',
  bodyMedium: 'Fredoka_500Medium',
  bodySemiBold: 'Fredoka_600SemiBold',
};
