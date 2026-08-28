import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { apiRequest } from '../../api';
import { useAppContext } from '../../context/AppContext';
import { Trash2, Send, Bot, User, ChevronRight, Activity, Target, Database } from 'lucide-react';

type Message = {
  role: 'user' | 'ai';
  text: string;
  actions?: any[];
};

export function AICoach() {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { fetchWorkouts, fetchPersonalRecords, fetchBodyMetrics, refreshProfile, userProfile } = useAppContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('forgefit_ai_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return [{ role: 'ai', text: 'ForgeFit AI Engine Initialized. Ready to process telemetry and execute commands.' }];
  });

  useEffect(() => {
    localStorage.setItem('forgefit_ai_history', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleClearHistory = () => {
    if (confirm('Clear telemetry and chat logs?')) {
      setMessages([{ role: 'ai', text: 'System logs cleared. Awaiting input.' }]);
    }
  };

  const executePrompt = (promptText: string) => {
    setInputText(promptText);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = inputText.trim();
    setInputText('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const history = messages.slice(1).map(m => ({ role: m.role, text: m.text }));
      
      const data = await apiRequest('/chat', {
        method: 'POST',
        body: JSON.stringify({ message: userMessage, history })
      });

      if (data.actionsTaken && data.actionsTaken.length > 0) {
        data.actionsTaken.forEach((action: any) => {
           if (action.type === 'WORKOUT_ADDED' || action.type === 'WORKOUT_DELETED') fetchWorkouts();
           if (action.type === 'PR_ADDED') fetchPersonalRecords();
           if (action.type === 'METRICS_LOGGED' || action.type === 'WEIGHT_LOGGED') fetchBodyMetrics();
           if (action.type === 'PROFILE_UPDATED' || action.type === 'GOAL_UPDATED') refreshProfile();
        });
      }
      
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'ai', text: data.reply, actions: data.actionsTaken }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', text: 'ERR: System encountered an unexpected fault.' }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: 'ERR: Connection to AI core lost.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    "Analyze my recent workouts and suggest improvements.",
    "Log a new Personal Record: Bench Press 225lbs x 3",
    "What should my macronutrients look like on rest days?",
    "Generate a 4-day push/pull/legs routine."
  ];

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 120px)', gap: '1rem', width: '100%' }}>
      
      {/* LEFT PANEL: Context & Dashboard (Utilitarian Data-Dense) */}
      <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        {/* System Status Card */}
        <div style={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '6px', padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #374151', paddingBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>System Context</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#10b981', fontSize: '0.75rem' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }}></div> ONLINE
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#e5e7eb' }}>
              <User size={14} color="#60a5fa" />
              <span>User: <strong>{userProfile?.name || 'Active'}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#e5e7eb' }}>
              <Target size={14} color="#f43f5e" />
              <span>Goal: <strong>{userProfile?.goal || 'Unspecified'}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#e5e7eb' }}>
              <Database size={14} color="#fbbf24" />
              <span>Modules: <strong>Connected (6/6)</strong></span>
            </div>
          </div>
        </div>

        {/* Quick Commands Card */}
        <div style={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '6px', padding: '1rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '0.85rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem', borderBottom: '1px solid #374151', paddingBottom: '0.5rem' }}>
            Quick Commands
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto' }}>
            {quickPrompts.map((prompt, idx) => (
              <button 
                key={idx}
                onClick={() => executePrompt(prompt)}
                style={{ 
                  textAlign: 'left', 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151', 
                  color: '#d1d5db',
                  padding: '0.75rem',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#374151'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1f2937'}
              >
                <span style={{ maxWidth: '85%' }}>{prompt}</span>
                <ChevronRight size={14} color="#9ca3af" />
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* RIGHT PANEL: The Terminal/Chat Area */}
      <div style={{ flexGrow: 1, backgroundColor: '#0f172a', border: '1px solid #374151', borderRadius: '6px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)' }}>
        
        {/* Terminal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', backgroundColor: '#1e293b', borderBottom: '1px solid #374151' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bot size={16} color="#38bdf8" />
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f1f5f9', fontFamily: 'monospace' }}>AI_COACH_INTERFACE.exe</span>
          </div>
          <button onClick={handleClearHistory} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem' }} title="Wipe Memory">
            <Trash2 size={14} /> WIPE_MEM
          </button>
        </div>

        {/* Chat History */}
        <div style={{ flexGrow: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', scrollBehavior: 'smooth' }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              
              <div style={{ 
                maxWidth: '85%', 
                padding: '1rem', 
                borderRadius: '6px',
                backgroundColor: msg.role === 'user' ? '#1e293b' : 'transparent',
                border: msg.role === 'user' ? '1px solid #334155' : 'none',
                color: '#f8fafc',
                fontFamily: msg.role === 'ai' ? 'inherit' : 'monospace'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: msg.role === 'user' ? '#94a3b8' : '#38bdf8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {msg.role === 'ai' ? <Bot size={14} /> : <User size={14} />}
                  {msg.role === 'ai' ? 'ForgeFit AI' : 'CMD_INPUT'}
                </div>
                
                {msg.role === 'user' ? (
                  <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5', fontSize: '0.9rem' }}>{msg.text}</div>
                ) : (
                  <div className="markdown-body" style={{ lineHeight: '1.6', fontSize: '0.95rem', color: '#e2e8f0' }}>
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                )}
              </div>

              {/* Data Execution Chips */}
              {msg.actions && msg.actions.length > 0 && (
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', marginLeft: msg.role === 'ai' ? '1rem' : '0' }}>
                  {msg.actions.map((action, i) => (
                    <div key={i} style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', color: '#34d399', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontFamily: 'monospace' }}>
                      <Activity size={12} />
                      {action.type === 'WORKOUT_ADDED' ? 'SYS_DB_WRITE: WORKOUT' : 
                       action.type === 'PR_ADDED' ? 'SYS_DB_WRITE: PR_LOGGED' : 
                       action.type === 'METRICS_LOGGED' ? 'SYS_DB_WRITE: BODY_METRICS' : 
                       action.type === 'PROFILE_UPDATED' ? 'SYS_DB_WRITE: PROFILE' : 'SYS_DB_WRITE: SUCCESS'}
                    </div>
                  ))}
                </div>
              )}
              
            </div>
          ))}
          {isLoading && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginLeft: '1rem' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                  <Bot size={14} className="animate-pulse" /> <em>Processing request...</em>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{ padding: '1rem', backgroundColor: '#1e293b', borderTop: '1px solid #374151' }}>
          <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              type="text" 
              placeholder="Enter command or natural language request..." 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
              style={{ 
                flexGrow: 1, 
                backgroundColor: '#0f172a', 
                border: '1px solid #475569', 
                color: '#f8fafc',
                padding: '0.75rem 1rem',
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#38bdf8'}
              onBlur={(e) => e.target.style.borderColor = '#475569'}
            />
            <button type="submit" disabled={isLoading || !inputText.trim()} style={{ 
              backgroundColor: '#38bdf8', 
              color: '#0f172a', 
              border: 'none', 
              padding: '0 1.5rem', 
              borderRadius: '4px',
              fontWeight: 600,
              cursor: (isLoading || !inputText.trim()) ? 'not-allowed' : 'pointer',
              opacity: (isLoading || !inputText.trim()) ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s'
            }}>
              <Send size={16} /> EXECUTE
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
