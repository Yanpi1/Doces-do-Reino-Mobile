import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Linking,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '../theme/ThemeContext';
import { ChatMessage } from '../types';
import { CHAT_PROXY_URL, WHATSAPP_PADRAO } from '../services/config';

const QUICK_INITIAL = [
  '🍫 Ver produtos',
  '📦 Como pedir?',
  '🚚 Área de entrega',
  '💸 Formas de pagamento',
  '📞 Falar no WhatsApp',
];

function localAnswer(text: string): { reply: string; actions?: string[] } | null {
  const t = text.toLowerCase().trim();

  if (/^(oi|ol[aá]|hey|hello|hi|bom dia|boa tarde|boa noite|tudo|e a[ií]|eai|oie|opa)[\s!?.,]*$/i.test(t)) {
    return {
      reply: 'Olá! Que bom ter você aqui! 😊\n\nSou a assistente da Doces do Reino. Como posso ajudar você hoje?',
      actions: QUICK_INITIAL,
    };
  }
  if (/pedir|comprar|pedido|carrinho|como fa[cç]|como pedir|quero pedir/i.test(t)) {
    return {
      reply:
        '🛒 É bem simples:\n\n1. Toque em "Ver Cardápio"\n2. Escolha os produtos e adicione ao carrinho\n3. Toque no ícone de carrinho 🛒\n4. Informe nome e contato\n5. Pague via Pix e aguarde! 🎉',
      actions: ['💸 Pagamento', '🚚 Entrega', '📞 WhatsApp'],
    };
  }
  if (/entreg|regi[aã]o|[aá]rea|atend|samambaia|bras[ií]lia|cidade|onde|local/i.test(t)) {
    return {
      reply:
        '🚚 Fazemos entregas em Brasília - DF, com foco principal em Samambaia.\n\nHorário e local de entrega são combinados pelo contato após o pedido. 📍',
      actions: ['📞 WhatsApp', '🛒 Como pedir?'],
    };
  }
  if (/pagament|pix|dinheiro|forma|pagar|cart[aã]o|transfer/i.test(t)) {
    return {
      reply: '💸 Aceitamos pagamento via Pix.\n\nAo finalizar o pedido, a chave Pix aparece automaticamente na tela. Rápido e seguro! 🔒',
      actions: ['🛒 Como pedir?', '📞 WhatsApp'],
    };
  }
  if (/whatsapp|wpp|zap|telefone|ligar|contato|falar|n[uú]mero|tel/i.test(t)) {
    return {
      reply: `📱 Nosso número: (61) 99279-6430. Vai ser um prazer atender! 😊`,
      actions: ['🍫 Ver produtos', '🛒 Como pedir?'],
    };
  }
  if (/pre[çc]o|quanto custa|quanto [eé]|valor|barato|caro/i.test(t)) {
    return {
      reply: 'Os preços ficam no Cardápio do app e podem variar por sabor e disponibilidade.\n\nToque em "Ver Cardápio" para conferir! 😋',
      actions: ['🛒 Como pedir?', '📞 WhatsApp'],
    };
  }
  if (/projeto|causa|igreja|solid[aá]rio|doa[cç]|contribui/i.test(t)) {
    return {
      reply: '❤️ A Doces do Reino é um projeto solidário da Igreja do Reino em Brasília.\n\nTodo o lucro vai para uma causa especial. Cada pedido faz a diferença!',
      actions: ['🍫 Ver produtos', '📞 WhatsApp'],
    };
  }
  return null;
}

export default function ChatWidget() {
  const { colors } = useAppTheme();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [quickReplies, setQuickReplies] = useState<string[]>(QUICK_INITIAL);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const openChat = () => {
    setOpen(true);
    if (messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: '👋 Olá! Sou a assistente virtual da Doces do Reino.\nComo posso te ajudar hoje?',
        },
      ]);
      setQuickReplies(QUICK_INITIAL);
    }
  };

  const sendMessage = async (text?: string) => {
    const value = (text ?? input).trim();
    if (!value || typing) return;

    setQuickReplies([]);
    setInput('');
    const newHistory: ChatMessage[] = [...messages, { role: 'user', content: value }];
    setMessages(newHistory);
    setTyping(true);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);

    // Detecta pedido de WhatsApp para abrir o app
    if (/whatsapp|wpp|zap|falar no whatsapp|abrir whatsapp/i.test(value)) {
      setTimeout(() => {
        Linking.openURL(
          `https://wa.me/${WHATSAPP_PADRAO}?text=${encodeURIComponent(
            'Olá! Vi o app da Doces do Reino e gostaria de mais informações 😊'
          )}`
        );
      }, 350);
    }

    const local = localAnswer(value);
    if (local) {
      await new Promise((r) => setTimeout(r, 500));
      setMessages((prev) => [...prev, { role: 'assistant', content: local.reply }]);
      setQuickReplies(local.actions?.length ? local.actions : ['🍫 Produtos', '📦 Como pedir?', '📞 WhatsApp']);
      setTyping(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
      return;
    }

    try {
      const res = await fetch(CHAT_PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newHistory.slice(-14) }),
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      const reply =
        (data.content || []).find((b: any) => b.type === 'text')?.text ||
        'Desculpe, não consegui processar sua mensagem. Fale pelo WhatsApp! 😊';
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
      setQuickReplies(['🍫 Produtos', '📦 Como pedir?', '📞 WhatsApp']);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '⚠️ Dificuldade de conexão no momento.\n\nFale diretamente pelo WhatsApp: (61) 99279-6430 📱',
        },
      ]);
      setQuickReplies(['📞 Abrir WhatsApp']);
    } finally {
      setTyping(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.ouroDark }]}
        onPress={openChat}
        activeOpacity={0.85}
      >
        <Feather name="message-square" size={24} color="#fff" />
      </TouchableOpacity>

      <Modal visible={open} animationType="slide" transparent onRequestClose={() => setOpen(false)}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={[styles.box, { backgroundColor: colors.creme }]}
          >
            <View style={[styles.header, { backgroundColor: colors.ouroDark }]}>
              <View style={styles.avatar}>
                <Feather name="user" size={18} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.hname}>Assistente Doces do Reino</Text>
                <Text style={styles.hstatus}>● Online agora</Text>
              </View>
              <TouchableOpacity onPress={() => setOpen(false)}>
                <Feather name="x" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView
              ref={scrollRef}
              style={styles.msgs}
              contentContainerStyle={{ padding: 14, gap: 9 }}
              onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
            >
              {messages.map((m, i) => (
                <View
                  key={i}
                  style={[
                    styles.msg,
                    m.role === 'user'
                      ? [styles.msgUser, { backgroundColor: colors.ouroDark }]
                      : [styles.msgBot, { backgroundColor: colors.branco, borderColor: colors.borda }],
                  ]}
                >
                  <Text style={{ color: m.role === 'user' ? '#fff' : colors.texto, fontSize: 13.5, lineHeight: 19 }}>
                    {m.content}
                  </Text>
                </View>
              ))}
              {typing && (
                <View style={[styles.msg, styles.msgBot, { backgroundColor: colors.branco, borderColor: colors.borda }]}>
                  <Text style={{ color: colors.textoSuave }}>digitando...</Text>
                </View>
              )}
            </ScrollView>

            {quickReplies.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickRow} contentContainerStyle={{ gap: 6, paddingHorizontal: 12 }}>
                {quickReplies.map((q) => (
                  <TouchableOpacity
                    key={q}
                    style={[styles.quickBtn, { backgroundColor: colors.ouroLight, borderColor: colors.ouro }]}
                    onPress={() => sendMessage(q)}
                  >
                    <Text style={{ color: colors.marrom, fontSize: 12 }}>{q}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            <View style={[styles.inputRow, { borderTopColor: colors.borda }]}>
              <TextInput
                value={input}
                onChangeText={setInput}
                placeholder="Escreva sua mensagem..."
                placeholderTextColor={colors.textoSuave}
                style={[styles.input, { backgroundColor: colors.branco, borderColor: colors.borda, color: colors.texto }]}
                onSubmitEditing={() => sendMessage()}
              />
              <TouchableOpacity
                style={[styles.sendBtn, { backgroundColor: colors.ouroDark }, typing && { opacity: 0.5 }]}
                onPress={() => sendMessage()}
                disabled={typing}
              >
                <Feather name="send" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' },
  box: { height: '75%', borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.22)', alignItems: 'center', justifyContent: 'center' },
  hname: { color: '#fff', fontWeight: '700', fontSize: 14 },
  hstatus: { color: 'rgba(255,255,255,0.85)', fontSize: 11, marginTop: 2 },
  msgs: { flex: 1 },
  msg: { maxWidth: '84%', padding: 11, borderRadius: 16 },
  msgBot: { alignSelf: 'flex-start', borderWidth: 1, borderBottomLeftRadius: 4 },
  msgUser: { alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  quickRow: { flexGrow: 0, paddingVertical: 6 },
  quickBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderTopWidth: 1 },
  input: { flex: 1, borderWidth: 1.5, borderRadius: 13, paddingHorizontal: 13, paddingVertical: 9, fontSize: 13.5 },
  sendBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});
