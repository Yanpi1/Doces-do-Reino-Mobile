// ============================================
//  Doces do Reino — Tipos (espelham api/banco.sql)
// ============================================

export interface Produto {
  id: number;
  nome: string;
  desc: string;
  preco: number;
  estoque: number;
  imagem: string;
  emoji: string;
  ordem?: number;
  criado?: string;
}

export interface Slide {
  id: number;
  titulo: string;
  desc: string;
  preco: number | null;
  imagem: string;
  emoji: string;
  ordem?: number;
}

export interface CarrosselConfig {
  ativo: boolean;
  eyebrow: string;
  titulo: string;
  slides: Slide[];
}

export interface PixConfig {
  tipo: string;
  chave: string;
  nome: string;
}

export type ContatoTipo = 'whatsapp' | 'iframe' | 'email';

export interface ContatoConfig {
  tipo: ContatoTipo;
  whatsapp: string;
  msgWpp: string;
  iframe: string;
  email: string;
  assunto: string;
}

export type StatusPedido = 'pendente' | 'confirmado' | 'entregue' | 'cancelado';

export interface ItemPedido {
  id: number;
  nome: string;
  qty: number;
  preco: number;
}

export interface Pedido {
  id: number;
  nome: string;
  contato: string;
  contato_tipo: string;
  itens: ItemPedido[];
  total: number;
  status: StatusPedido;
  criado: string;
  data?: string;
}

export type CartMap = Record<number, number>;

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
