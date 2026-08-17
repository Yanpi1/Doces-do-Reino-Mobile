import { API_BASE_URL } from './config';
import {
  Produto,
  Slide,
  CarrosselConfig,
  PixConfig,
  ContatoConfig,
  Pedido,
  ItemPedido,
  StatusPedido,
} from '../types';

// ========================
//  HELPERS HTTP (espelham apiGet/apiPost do app.js)
// ========================

async function apiGet<T = any>(action: string, params: Record<string, string> = {}): Promise<T | null> {
  try {
    const query = new URLSearchParams({ action, ...params }).toString();
    const res = await fetch(`${API_BASE_URL}?${query}`);
    return (await res.json()) as T;
  } catch (e) {
    console.error('API GET error:', action, e);
    return null;
  }
}

async function apiPost<T = any>(action: string, data: Record<string, any> = {}): Promise<T | null> {
  try {
    const query = new URLSearchParams({ action }).toString();
    const res = await fetch(`${API_BASE_URL}?${query}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return (await res.json()) as T;
  } catch (e) {
    console.error('API POST error:', action, e);
    return null;
  }
}

// ========================
//  DEFAULTS (fallback se a API estiver fora do ar)
// ========================

export const PRODUTOS_DEFAULT: Produto[] = [
  { id: 1, nome: 'DinDin Ninho com Nutella', desc: 'Super cremoso, feito com leite Ninho verdadeiro e muita Nutella.', preco: 4.5, emoji: '🍫', imagem: '', estoque: 10 },
  { id: 2, nome: 'DinDin Morango Sensação', desc: 'Aquele sabor de morango cremoso com casquinha de chocolate crocante.', preco: 4.0, emoji: '🍓', imagem: '', estoque: 8 },
  { id: 3, nome: 'DinDin Paçoca Cremosa', desc: 'Feito com amendoim selecionado, sabor marcante e delicioso.', preco: 3.5, emoji: '🥜', imagem: '', estoque: 5 },
];

export const PIX_DEFAULT: PixConfig = { tipo: 'Telefone', chave: '(61) 99279-6430', nome: 'ReinoGourmet' };

export const CONTATO_DEFAULT: ContatoConfig = {
  tipo: 'whatsapp',
  whatsapp: '5561992796430',
  msgWpp: 'Olá! Quero fazer um pedido.',
  iframe: '',
  email: 'yanpietro0101@gmail.com',
  assunto: 'Pedido ReinoGourmet',
};

export const CARROSSEL_DEFAULT: CarrosselConfig = { ativo: false, eyebrow: 'Destaques', titulo: 'Em Destaque', slides: [] };

export const LOGO_DEFAULT = require('../../assets/logo-doces-do-reino.png');

// ========================
//  PRODUTOS
// ========================

export async function getProdutos(): Promise<Produto[]> {
  const data = await apiGet<Produto[]>('get_produtos');
  if (data && Array.isArray(data)) return data;
  return [...PRODUTOS_DEFAULT];
}

export async function saveProduto(p: Partial<Produto>): Promise<{ ok: boolean; id?: number; error?: string } | null> {
  return apiPost('save_produto', p);
}

export async function deleteProduto(id: number): Promise<{ ok: boolean } | null> {
  return apiPost('delete_produto', { id });
}

export async function updateEstoque(itens: { id: number; qty: number }[]): Promise<{ ok: boolean } | null> {
  return apiPost('update_estoque', { itens });
}

// ========================
//  CONFIG (pix, contato, logo, carrossel)
// ========================

export async function getPix(): Promise<PixConfig> {
  const data = await apiGet<PixConfig>('get_config', { chave: 'pix' });
  if (data && (data as any).chave) return data;
  return { ...PIX_DEFAULT };
}

export async function getContato(): Promise<ContatoConfig> {
  const data = await apiGet<ContatoConfig>('get_config', { chave: 'contato' });
  if (data && (data as any).tipo) return data;
  return { ...CONTATO_DEFAULT };
}

export async function getLogoHeader(): Promise<string> {
  const data = await apiGet<string>('get_config', { chave: 'logo_header' });
  const url = typeof data === 'string' ? data.trim() : '';
  return url;
}

export async function getLogoSobre(): Promise<string> {
  const data = await apiGet<string>('get_config', { chave: 'logo_sobre' });
  const url = typeof data === 'string' ? data.trim() : '';
  return url;
}

export async function saveConfig(chave: string, valor: any): Promise<{ ok: boolean } | null> {
  return apiPost('save_config', { chave, valor });
}

export async function getCarrossel(): Promise<CarrosselConfig> {
  const [cfg, slides] = await Promise.all([
    apiGet<Partial<CarrosselConfig>>('get_config', { chave: 'carrossel' }),
    apiGet<Slide[]>('get_slides'),
  ]);
  let base: CarrosselConfig = { ativo: false, eyebrow: 'Destaques', titulo: 'Em Destaque', slides: [] };
  if (cfg && typeof cfg === 'object' && !Array.isArray(cfg)) {
    base = { ...base, ...cfg };
  }
  base.slides = Array.isArray(slides) ? slides : [];
  return base;
}

// ========================
//  SLIDES
// ========================

export async function getSlides(): Promise<Slide[]> {
  const data = await apiGet<Slide[]>('get_slides');
  return Array.isArray(data) ? data : [];
}

export async function saveSlide(s: Partial<Slide>): Promise<{ ok: boolean; id?: number; error?: string } | null> {
  return apiPost('save_slide', s);
}

export async function deleteSlide(id: number): Promise<{ ok: boolean } | null> {
  return apiPost('delete_slide', { id });
}

// ========================
//  PEDIDOS
// ========================

export async function getPedidos(): Promise<Pedido[]> {
  const data = await apiGet<Pedido[]>('get_pedidos');
  return Array.isArray(data) ? data : [];
}

export async function savePedido(payload: {
  nome: string;
  contato: string;
  contatoTipo: string;
  itens: ItemPedido[];
  total: number;
}): Promise<{ ok: boolean; id?: number; error?: string } | null> {
  return apiPost('save_pedido', payload);
}

export async function updateStatusPedido(id: number, status: StatusPedido): Promise<{ ok: boolean } | null> {
  return apiPost('update_status_pedido', { id, status });
}

export async function limparPedidos(): Promise<{ ok: boolean } | null> {
  return apiPost('limpar_pedidos', {});
}

// ========================
//  AUTH (admin)
// ========================

export async function login(user: string, pass: string): Promise<{ ok: boolean; error?: string } | null> {
  return apiPost('login', { user, pass });
}
