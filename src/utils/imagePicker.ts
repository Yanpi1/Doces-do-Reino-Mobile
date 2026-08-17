import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

/**
 * Abre a galeria, permite escolher uma imagem, redimensiona e retorna
 * como data URL base64 (mesmo formato usado pelo admin.js original —
 * a API armazena a imagem diretamente como string no banco).
 */
export async function pickAndCompressImage(
  maxW = 800,
  maxH = 800,
  quality = 0.85
): Promise<string | null> {
  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) {
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 1,
    allowsEditing: false,
  });

  if (result.canceled || !result.assets || result.assets.length === 0) return null;

  const asset = result.assets[0];

  const manipulated = await ImageManipulator.manipulateAsync(
    asset.uri,
    [{ resize: { width: maxW, height: maxH } }],
    {
      compress: quality,
      format: ImageManipulator.SaveFormat.JPEG,
      base64: true,
    }
  );

  if (!manipulated.base64) return null;

  return `data:image/jpeg;base64,${manipulated.base64}`;
}
