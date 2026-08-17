// ============================================
//  Doces do Reino — Configuração da API
// ============================================
// Ajuste aqui a URL pública do seu backend PHP.
// O app chama exatamente os mesmos endpoints que o site usa
// (api/api.php?action=...) e o proxy de chat com IA.

export const API_BASE_URL = 'https://doces-do-reino.site.je/api/api.php';

// Proxy do chat com IA (mesmo usado no site — troque se hospedar o seu próprio)
export const CHAT_PROXY_URL = 'https://project-l4g6v.vercel.app/api/chat-proxy';

// WhatsApp / contato padrão (fallback caso a API não responda)
export const WHATSAPP_PADRAO = '5561992796430';
