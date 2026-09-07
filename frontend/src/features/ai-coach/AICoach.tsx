import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { apiRequest } from '../../api';
import { useAppContext } from '../../context/AppContext';
import { Trash2, Send, Cpu, User, Database, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Mascot } from '../../components/ui/Mascot';

type Message = {
  role: 'user' | 'ai';
  text: string;
  actions?: any[];
};

export function AICoach() {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isVoiceOutputEnabled, setIsVoiceOutputEnabled] = useState(false);
  const { fetchWorkouts, fetchPersonalRecords, fetchBodyMetrics, refreshProfile } = useAppContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('forgefit_ai_history');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        // Automatically remove old hardcoded greetings that got stuck in local storage
        const filtered = parsed.filter((m: Message) => 
          !m.text.includes("Chat history cleared") && 
          !m.text.includes("Hi! I am your ForgeFit AI Coach")
        );
        return filtered;
      } catch (e) { /* ignore */ }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('forgefit_ai_history', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleClearHistory = () => {
    if (confirm('Clear chat history?')) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setMessages([]);
    }
  };

  const speakText = (text: string) => {
    if (!isVoiceOutputEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/(\*\*|\*|#|_|`)/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
    } else {
      if (!recognitionRef.current) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) { alert('Voice input is not supported in this browser.'); return; }
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) transcript += event.results[i][0].transcript;
          }
          if (transcript) {
            setInputText(prev => prev + (prev ? ' ' : '') + transcript);
            if (textareaRef.current) {
              textareaRef.current.style.height = 'auto';
              textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
            }
          }
        };
        recognition.onend = () => setIsListening(false);
        recognitionRef.current = recognition;
      }
      try {
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) { console.error('Speech recognition error', e); }
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    if (isListening && recognitionRef.current) { recognitionRef.current.stop(); setIsListening(false); }
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();

    const userMessage = inputText.trim();
    setInputText('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const data = await apiRequest('/chat', {
        method: 'POST',
        body: JSON.stringify({ message: userMessage, history: messages }),
      });
      if (data.actionsTaken?.length > 0) {
        data.actionsTaken.forEach((action: any) => {
          if (action.type === 'WORKOUT_ADDED' || action.type === 'WORKOUT_DELETED') fetchWorkouts();
          if (action.type === 'PR_ADDED') fetchPersonalRecords();
          if (action.type === 'METRICS_LOGGED' || action.type === 'WEIGHT_LOGGED') fetchBodyMetrics();
          if (action.type === 'PROFILE_UPDATED' || action.type === 'GOAL_UPDATED' || action.type === 'NUTRITION_LOGGED') refreshProfile();
        });
      }
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'ai', text: data.reply, actions: data.actionsTaken }]);
        speakText(data.reply);
      } else {
        setMessages(prev => [...prev, { role: 'ai', text: 'Error: System encountered an unexpected fault.' }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Error: Connection to AI core lost.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  const isEmptyChat = messages.length === 0;

  return (
    <div className="ai-coach-wrapper">

      {/* Chat Area — starts from very top */}
      <div style={{ flexGrow: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column' }}>

        {/* Empty state */}
        {isEmptyChat && (
          <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Top Left Branding */}
            <div style={{ padding: '0 4px', marginTop: '12px' }}>
              <h1 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'var(--accent)' }}>✦</span> ForgeFit AI
              </h1>
            </div>

            {/* Centered Mascot & Text */}
            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '-40px' }}>
              <div style={{ marginBottom: '24px' }}>
                <Mascot state={isListening ? "thinking" : "idle"} size={200} />
              </div>
              <p style={{ color: '#71717a', fontSize: '0.95rem', lineHeight: '1.5', maxWidth: '280px', margin: 0, textAlign: 'center' }}>
                Everything in this app is handled by AI. Just speak or type your updates.
              </p>
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '10px', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: '20px' }}>
            {msg.role === 'ai' && (
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                <Cpu size={14} color="#000" />
              </div>
            )}
            <div style={{ maxWidth: '85%', padding: '10px 14px', borderRadius: '14px', borderTopRightRadius: msg.role === 'user' ? '4px' : '14px', borderTopLeftRadius: msg.role === 'ai' ? '4px' : '14px', backgroundColor: msg.role === 'user' ? '#27272a' : 'transparent', color: 'var(--text-primary)', lineHeight: '1.6', fontSize: '0.95rem' }}>
              {msg.role === 'user' ? (
                <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
              ) : (
                <div className="markdown-body"><ReactMarkdown>{msg.text}</ReactMarkdown></div>
              )}
              {msg.actions && msg.actions.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                  {msg.actions.map((action, i) => (
                    <div key={i} style={{ backgroundColor: 'rgba(234, 179, 8, 0.1)', border: '1px solid var(--accent)', color: 'var(--accent)', padding: '3px 8px', borderRadius: '6px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                      <Database size={10} />
                      {action.type.replace('_', ' ')}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {msg.role === 'user' && (
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#27272a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                <User size={14} color="#a1a1aa" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Cpu size={14} color="#000" />
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="animate-pulse" style={{ width: '6px', height: '6px', backgroundColor: 'var(--accent)', borderRadius: '50%' }} />
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{ flexShrink: 0, padding: '8px 12px', paddingBottom: 'max(12px, env(safe-area-inset-bottom, 12px))', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-glass)' }}>
        <form onSubmit={handleSendMessage} style={{
          display: 'flex', width: '100%', backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '20px', padding: '6px 10px', alignItems: 'flex-end',
          ...(isListening ? { borderColor: 'var(--accent)', boxShadow: '0 0 12px rgba(234, 179, 8, 0.15)' } : {})
        }}>
          <div style={{ display: 'flex', gap: '2px', alignItems: 'center', marginBottom: '4px' }}>
            <button type="button" onClick={handleClearHistory}
              style={{ background: 'none', border: 'none', color: '#71717a', padding: '6px', borderRadius: '50%', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
              title="Clear chat">
              <Trash2 size={16} />
            </button>
            <button type="button" onClick={() => { if (isVoiceOutputEnabled && 'speechSynthesis' in window) window.speechSynthesis.cancel(); setIsVoiceOutputEnabled(!isVoiceOutputEnabled); }}
              style={{ background: 'none', border: 'none', color: isVoiceOutputEnabled ? '#f8fafc' : '#71717a', padding: '6px', borderRadius: '50%', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
              title={isVoiceOutputEnabled ? "Mute AI Voice" : "Enable AI Voice"}>
              {isVoiceOutputEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
            <button type="button" onClick={toggleListening}
              style={{ background: isListening ? 'rgba(234, 179, 8, 0.2)' : 'none', border: 'none', color: isListening ? 'var(--accent)' : '#a1a1aa', padding: '6px', borderRadius: '50%', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
              title={isListening ? "Stop listening" : "Start voice dictation"}>
              {isListening ? <Mic size={18} /> : <MicOff size={18} />}
            </button>
          </div>
          <textarea
            ref={textareaRef}
            placeholder={isListening ? "Listening..." : "Message Forge AI..."}
            value={inputText}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            rows={1}
            style={{ flexGrow: 1, backgroundColor: 'transparent', border: 'none', color: '#fff', padding: '10px 8px', fontSize: '0.95rem', outline: 'none', resize: 'none', maxHeight: '200px', minHeight: '40px', fontFamily: 'inherit', lineHeight: '1.5' }}
          />
          <button type="submit" disabled={isLoading || (!inputText.trim() && !isListening)} style={{
            backgroundColor: (isLoading || (!inputText.trim() && !isListening)) ? '#27272a' : 'var(--accent)',
            color: (isLoading || (!inputText.trim() && !isListening)) ? '#71717a' : '#000',
            border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: (isLoading || (!inputText.trim() && !isListening)) ? 'not-allowed' : 'pointer', marginBottom: '4px', flexShrink: 0
          }}>
            <Send size={14} style={{ marginLeft: '1px' }} />
          </button>
        </form>
      </div>
    </div>
  );
}
