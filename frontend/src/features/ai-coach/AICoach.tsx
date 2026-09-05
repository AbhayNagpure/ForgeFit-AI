import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { apiRequest } from '../../api';
import { useAppContext } from '../../context/AppContext';
import { Trash2, Send, Cpu, User, Database, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

type Message = {
  role: 'user' | 'ai';
  text: string;
  actions?: any[];
};

export function AICoach() {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isVoiceOutputEnabled, setIsVoiceOutputEnabled] = useState(true);
  const { fetchWorkouts, fetchPersonalRecords, fetchBodyMetrics, refreshProfile } = useAppContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('forgefit_ai_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return [{ role: 'ai', text: 'Hi! I am your ForgeFit AI Coach. I can log your workouts, track your meals, and update your profile. What would you like to do today?' }];
  });

  useEffect(() => {
    localStorage.setItem('forgefit_ai_history', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleClearHistory = () => {
    if (confirm('Clear chat history?')) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setMessages([{ role: 'ai', text: 'Chat history cleared. How can I help you?' }]);
    }
  };

  const speakText = (text: string) => {
    if (!isVoiceOutputEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    
    // Strip basic markdown formatting
    const cleanText = text.replace(/(\*\*|\*|#|_|`)/g, '');
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05; // Slightly faster for a snappy AI feel
    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
    } else {
      if (!recognitionRef.current) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
          alert('Voice input is not supported in this browser.');
          return;
        }
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        
        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              currentTranscript += event.results[i][0].transcript;
            }
          }
          if (currentTranscript) {
            setInputText(prev => prev + (prev ? ' ' : '') + currentTranscript);
          }
        };
        
        recognition.onend = () => {
          setIsListening(false);
        };
        
        recognitionRef.current = recognition;
      }
      
      try {
        if ('speechSynthesis' in window) window.speechSynthesis.cancel(); // Stop AI talking when user starts speaking
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error('Speech recognition error', e);
      }
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop AI from talking over the new request
    }

    const userMessage = inputText.trim();
    setInputText('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const data = await apiRequest('/chat', {
        method: 'POST',
        body: JSON.stringify({ message: userMessage, history: messages }),
      });
      
      if (data.actionsTaken && data.actionsTaken.length > 0) {
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
        const errText = 'Error: System encountered an unexpected fault.';
        setMessages(prev => [...prev, { role: 'ai', text: errText }]);
        speakText(errText);
      }
    } catch (error) {
      const errText = 'Error: Connection to AI core lost.';
      setMessages(prev => [...prev, { role: 'ai', text: errText }]);
      speakText(errText);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    "Log 300 calories of chicken.",
    "I weigh 85kg now.",
    "I hit a new PR on Bench Press: 100kg for 5 reps."
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-glass)' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu size={20} color="var(--accent)" />
          Forge AI
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {isListening && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontSize: '0.8rem', fontWeight: 600, animation: 'pulse 2s infinite' }}>
              <div style={{ width: '8px', height: '8px', backgroundColor: '#ef4444', borderRadius: '50%' }}></div>
              Listening...
            </div>
          )}
          
          <button 
            onClick={handleClearHistory} 
            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', transition: 'color 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.color = '#ef4444'}
            onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            <Trash2 size={16} /> Clear Chat
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div style={{ flexGrow: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', scrollBehavior: 'smooth' }}>
        <div style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {messages.length === 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginTop: '24px' }}>
              {quickPrompts.map((prompt, idx) => (
                <button 
                  key={idx}
                  onClick={() => { setInputText(prompt); }}
                  style={{ 
                    backgroundColor: 'transparent', 
                    border: '1px solid var(--border-color)', 
                    color: 'var(--text-primary)',
                    padding: '8px 16px',
                    borderRadius: '24px',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '16px', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              
              {msg.role === 'ai' && (
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Cpu size={18} color="#000" />
                </div>
              )}

              <div style={{ 
                maxWidth: '80%', 
                padding: '12px 16px', 
                borderRadius: '16px',
                borderTopRightRadius: msg.role === 'user' ? '4px' : '16px',
                borderTopLeftRadius: msg.role === 'ai' ? '4px' : '16px',
                backgroundColor: msg.role === 'user' ? '#27272a' : 'transparent',
                color: 'var(--text-primary)',
                lineHeight: '1.6',
                fontSize: '1rem'
              }}>
                {msg.role === 'user' ? (
                  <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
                ) : (
                  <div className="markdown-body">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                )}

                {/* Data Execution Chips */}
                {msg.actions && msg.actions.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                    {msg.actions.map((action, i) => (
                      <div key={i} style={{ backgroundColor: 'rgba(234, 179, 8, 0.1)', border: '1px solid var(--accent)', color: 'var(--accent)', padding: '4px 10px', borderRadius: 'var(--radius)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                        <Database size={12} />
                        {action.type.replace('_', ' ')}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#27272a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <User size={18} color="#a1a1aa" />
                </div>
              )}

            </div>
          ))}

          {isLoading && (
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Cpu size={18} color="#000" />
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="animate-pulse" style={{ width: '8px', height: '8px', backgroundColor: 'var(--accent)', borderRadius: '50%' }}></div>
                Thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} style={{ height: '40px' }} />
        </div>
      </div>

      {/* Input Area */}
      <div style={{ padding: '0 24px 24px 24px', display: 'flex', justifyContent: 'center', backgroundColor: 'transparent' }}>
        <form onSubmit={handleSendMessage} style={{ 
          display: 'flex', 
          width: '100%', 
          maxWidth: '800px', 
          backgroundColor: '#18181b', 
          border: '1px solid #3f3f46', 
          borderRadius: '24px',
          padding: '8px 12px',
          alignItems: 'center',
          boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
          transition: 'border-color 0.2s',
          ...(isListening ? { borderColor: 'var(--accent)', boxShadow: '0 0 16px rgba(234, 179, 8, 0.2)' } : {})
        }}>
          
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <button 
              type="button" 
              onClick={() => {
                if (isVoiceOutputEnabled && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
                setIsVoiceOutputEnabled(!isVoiceOutputEnabled);
              }} 
              style={{ 
                background: isVoiceOutputEnabled ? 'rgba(255, 255, 255, 0.05)' : 'none', 
                border: 'none', 
                color: isVoiceOutputEnabled ? '#f8fafc' : '#71717a', 
                padding: '8px', 
                borderRadius: '50%',
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              title={isVoiceOutputEnabled ? "Mute AI Voice" : "Enable AI Voice"}
            >
              {isVoiceOutputEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>

            <button 
              type="button" 
              onClick={toggleListening}
              style={{ 
                background: isListening ? 'rgba(234, 179, 8, 0.2)' : 'none', 
                border: 'none', 
                color: isListening ? 'var(--accent)' : '#a1a1aa', 
                padding: '8px', 
                borderRadius: '50%',
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              title={isListening ? "Stop listening" : "Start voice dictation"}
            >
              {isListening ? <Mic size={20} /> : <MicOff size={20} />}
            </button>
          </div>
          
          <input 
            type="text" 
            placeholder={isListening ? "Listening..." : "Message Forge AI..."} 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            style={{ 
              flexGrow: 1, 
              backgroundColor: 'transparent', 
              border: 'none', 
              color: '#fff',
              padding: '8px 12px',
              fontSize: '1rem',
              outline: 'none',
              marginLeft: '4px'
            }}
          />
          <button type="submit" disabled={isLoading || (!inputText.trim() && !isListening)} style={{ 
            backgroundColor: (isLoading || (!inputText.trim() && !isListening)) ? '#27272a' : 'var(--accent)', 
            color: (isLoading || (!inputText.trim() && !isListening)) ? '#71717a' : '#000', 
            border: 'none', 
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: (isLoading || (!inputText.trim() && !isListening)) ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s'
          }}>
            <Send size={16} style={{ marginLeft: '2px' }} />
          </button>
        </form>
      </div>

    </div>
  );
}
