# Doces do Reino — App Mobile (React Native + TypeScript)

Versão mobile do site original (`index.html` + `admin.html`), construída com **Expo + React Native + TypeScript**,
usando a **mesma API PHP** (`api/api.php`) já hospedada.

## ✅ O que foi recriado

### Loja (cliente)
- Topo com aviso + Header com logo, navegação e carrinho
- Hero, barra de benefícios
- Carrossel de destaques (mesmo `get_config?chave=carrossel` + `get_slides`)
- Cardápio (grid de produtos com controle de quantidade e estoque em tempo real)
- Seção Sobre (com foto configurável) + horários de culto + botão para abrir o endereço no mapa
- Seção Entregas
- Seção Contato (WhatsApp / E-mail / Iframe — conforme configurado no admin)
- Carrinho lateral (modal)
- Checkout em 3 etapas (dados → resumo + Pix → confirmação), igual ao site
- Assistente de chat (respostas rápidas locais + proxy de IA, mesmo endpoint do site)
- Botão flutuante do iFood
- Modo claro/escuro (equivalente ao dark mode do `style.css`), com preferência salva no aparelho

### Painel Admin
- Login (mesma action `login` da API)
- **Produtos**: listar, criar, editar, excluir, com upload de imagem (a partir da galeria do celular, comprimida automaticamente para base64, assim como no admin original)
- **Carrossel**: ativar/desativar, editar textos, gerenciar slides (criar/editar/excluir)
- **Pedidos**: listar pedidos, trocar status (pendente/confirmado/entregue/cancelado), limpar todos
- **Config**: Pix (tipo/chave/nome), Contato (WhatsApp/E-mail/Iframe), Imagens (logo do cabeçalho e da seção Sobre)

## ⚙️ Configuração

A URL da API já está configurada em `src/services/config.ts`:

```ts
export const API_BASE_URL = 'https://doces-do-reino.site.je/api/api.php';
```

Se o endereço mudar, basta editar esse arquivo.

> ⚠️ **Importante sobre CORS**: como o app vai rodar fora do navegador (nativo), problemas de CORS do navegador
> não afetam o app. Mas confirme que o `api.php` está acessível publicamente (HTTPS) — o app não consegue
> acessar `localhost` do seu computador.

## ▶️ Como rodar

```bash
cd DocesDoReinoApp
npm install
npx expo start
```

Depois:
- Escaneie o QR code com o app **Expo Go** (Android/iOS), ou
- Pressione `a` para abrir no emulador Android, ou `i` para o simulador iOS (necessário Xcode no Mac)

## 📦 Gerar o app instalável (APK/AAB/IPA)

Este projeto usa Expo, então o jeito mais simples é o **EAS Build**:

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android   # gera .apk/.aab
eas build --platform ios       # gera .ipa (requer conta Apple Developer)
```

## 🗂️ Estrutura de pastas

```
src/
  theme/        → cores (claro/escuro) e ThemeContext
  types/        → tipos TS espelhando o banco (Produto, Slide, Pedido, etc.)
  services/     → api.ts (chamadas para api.php) e config.ts (URL base)
  context/      → CartContext (carrinho) e AuthContext (login admin)
  components/   → seções e componentes reutilizáveis do site
  screens/      → HomeScreen (loja) e screens/admin/* (painel admin)
  navigation/    → RootNavigator (site ↔ admin) e AdminNavigator (login ↔ painel)
  utils/        → formatMoney, seleção/compressão de imagem
```

## 🔩 O que NÃO foi portado (não se aplica a mobile)

- `mobile-fixes.css` — era só um ajuste responsivo do site web; o app já é nativo/responsivo por padrão.
- O backend PHP (`api/`) continua sendo usado **como está**, hospedado no servidor — não foi reescrito.

## 📝 Observações

- As imagens de produtos/slides/logos são salvas como `data:image/...;base64,...`, exatamente como o admin.js
  original fazia — então tudo que já está salvo no banco funciona sem nenhuma migração.
- O chat de IA usa o mesmo proxy (`CHAT_PROXY_URL` em `src/services/config.ts`). Troque se você hospedar o seu próprio.
