
import { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, KeyboardAvoidingView, Platform
} from 'react-native';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatbotScreen({ navigation }: any) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am your FarmIQ AI Assistant. Ask me anything about farming, crops, pests, weather, or soil!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8081/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: updatedMessages.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
          }))
        }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I could not connect. Please try again.' }]);
    }

    setLoading(false);
    scrollRef.current?.scrollToEnd({ animated: true });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>AI Farming Assistant</Text>
      </View>

      <ScrollView ref={scrollRef} style={styles.messages} contentContainerStyle={{ padding: 16 }}>
        {messages.map((msg, index) => (
          <View key={index} style={[styles.bubble, msg.role === 'user' ? styles.userBubble : styles.aiBubble]}>
            <Text style={styles.bubbleText}>{msg.content}</Text>
          </View>
        ))}
        {loading && (
          <View style={styles.aiBubble}>
            <Text style={styles.bubbleText}>Thinking...</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Ask about crops, soil, pests..."
          placeholderTextColor="#888"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f2d1f' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 50, backgroundColor: '#1a3d2b' },
  back: { color: '#4caf50', fontSize: 16, marginRight: 16 },
  title: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  messages: { flex: 1 },
  bubble: { borderRadius: 16, padding: 12, marginBottom: 12, maxWidth: '80%' },
  userBubble: { backgroundColor: '#4caf50', alignSelf: 'flex-end' },
  aiBubble: { backgroundColor: '#1a3d2b', alignSelf: 'flex-start' },
  bubbleText: { color: '#fff', fontSize: 15, lineHeight: 22 },
  inputRow: { flexDirection: 'row', padding: 12, backgroundColor: '#1a3d2b' },
  input: { flex: 1, backgroundColor: '#0f2d1f', borderRadius: 24, paddingHorizontal: 16, paddingVertical: 10, color: '#fff', marginRight: 8 },
  sendBtn: { backgroundColor: '#4caf50', borderRadius: 24, paddingHorizontal: 20, justifyContent: 'center' },
  sendText: { color: '#fff', fontWeight: 'bold' },
});