import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, Check, Database, Mic, MicOff, Plus, Send, ShieldCheck, Sparkles, User, Volume2, VolumeX, X } from 'lucide-react';
import { apiRequest } from '../../api';
import { useAppContext } from '../../context/AppContext';

type PendingAction = {
  id: string;
  toolName: string;
  description: string;
  arguments: unknown;
  expiresAt: string;
};

type AgentAction = {
  type: string;
  data?: unknown;
  pendingAction?: PendingAction;
};

type Message = {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  actions?: AgentAction[];
};

type Conversation = { id: string; title?: string; updatedAt: string };

export function AICoach() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string>();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [resolvingAction, setResolvingAction] = useState<string>();
  const endRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);
  const { fetchWorkouts, fetchPersonalRecords, fetchBodyMetrics, fetchProgressSummary, refreshProfile } = useAppContext();

  useEffect(() => {
    const loadConversation = async () => {
      try {
        const data = await apiRequest<{ conversations: Conversation[] }>('/conversations');
        const latest = data.conversations[0];
        if (!latest) return;
        const [detail, pending] = await Promise.all([
          apiRequest<{ messages: Array<{ id: string; role: string; content: string; metadata?: { actions?: AgentAction[] } }> }>(`/conversations/${latest.id}/messages`),
          apiRequest<{ actions: Array<{ id: string }> }>('/agent-actions'),
        ]);
        const pendingIds = new Set(pending.actions.map((action) => action.id));
        setConversationId(latest.id);
        setMessages(detail.messages.map((message) => ({
          id: message.id,
          role: message.role === 'assistant' ? 'assistant' : 'user',
          content: message.content,
          actions: message.metadata?.actions?.filter((action) => !action.pendingAction || pendingIds.has(action.pendingAction.id)),
        })));
      } catch (error) {
        console.error('Unable to load coaching conversation', error);
      } finally {
        setIsBooting(false);
      }
    };
    loadConversation();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const refreshAppData = async () => {
    await Promise.all([fetchWorkouts(), fetchPersonalRecords(), fetchBodyMetrics(), fetchProgressSummary(), refreshProfile()]);
  };

  const newConversation = async () => {
    if (isLoading) return;
    const data = await apiRequest<{ conversation: Conversation }>('/conversations', { method: 'POST' });
    setConversationId(data.conversation.id);
    setMessages([]);
  };

  const speak = (text: string) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/[*#_`|]/g, ''));
    utterance.rate = 1.04;
    window.speechSynthesis.speak(utterance);
  };

  const sendMessage = async (messageText = input) => {
    const message = messageText.trim();
    if (!message || isLoading) return;
    if (isListening) recognitionRef.current?.stop();
    setInput('');
    setMessages((current) => [...current, { role: 'user', content: message }]);
    setIsLoading(true);
    try {
      const data = await apiRequest<{ reply: string; actionsTaken: AgentAction[]; conversationId: string }>('/chat', {
        method: 'POST',
        body: JSON.stringify({ message, conversationId, requestId: crypto.randomUUID() }),
      });
      setConversationId(data.conversationId);
      setMessages((current) => [...current, { role: 'assistant', content: data.reply, actions: data.actionsTaken }]);
      speak(data.reply);
      if (data.actionsTaken.some((action) => action.type !== 'APPROVAL_REQUIRED')) await refreshAppData();
    } catch (error) {
      const content = error instanceof Error ? error.message : 'The coaching service is unavailable.';
      setMessages((current) => [...current, { role: 'assistant', content: `I couldn’t complete that request: ${content}` }]);
    } finally {
      setIsLoading(false);
      textareaRef.current?.focus();
    }
  };

  const resolveAction = async (action: PendingAction, decision: 'approve' | 'reject') => {
    setResolvingAction(action.id);
    try {
      const result = await apiRequest<{ message?: string; result?: { message: string } }>(`/agent-actions/${action.id}/resolve`, {
        method: 'POST', body: JSON.stringify({ decision }),
      });
      setMessages((current) => [...current.map((message) => ({
        ...message,
        actions: message.actions?.filter((item) => item.pendingAction?.id !== action.id),
      })), {
        role: 'assistant',
        content: decision === 'approve' ? `Approved and completed: ${result.result?.message ?? action.description}` : 'Cancelled. No changes were made.',
      }]);
      if (decision === 'approve') await refreshAppData();
    } catch (error) {
      setMessages((current) => [...current, { role: 'assistant', content: error instanceof Error ? error.message : 'The action could not be resolved.' }]);
    } finally {
      setResolvingAction(undefined);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = recognitionRef.current ?? new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event: any) => setInput((current) => `${current}${current ? ' ' : ''}${event.results[0][0].transcript}`);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const empty = !isBooting && messages.length === 0;

  return (
    <div className="coach-shell">
      <header className="coach-header">
        <div className="coach-identity"><div><Sparkles size={17} /></div><span><strong>Forge</strong><small>Coaching agent · tools enabled</small></span></div>
        <div className="coach-controls">
          <button className="icon-button" onClick={() => { setVoiceEnabled((enabled) => !enabled); window.speechSynthesis?.cancel(); }} title="Toggle spoken responses">
            {voiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          <button className="new-chat-button" onClick={newConversation}><Plus size={16} /> New chat</button>
        </div>
      </header>

      <div className="coach-messages">
        {isBooting ? <div className="coach-loader"><span /><span /><span /></div> : null}
        {empty ? <Welcome onPrompt={sendMessage} /> : null}
        {messages.map((message, index) => (
          <div className={`message-row ${message.role}`} key={message.id ?? index}>
            <div className="message-avatar">{message.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}</div>
            <div className="message-stack">
              <div className="message-bubble">
                {message.role === 'assistant' ? <ReactMarkdown>{message.content}</ReactMarkdown> : <p>{message.content}</p>}
              </div>
              {message.actions?.map((action, actionIndex) => action.pendingAction ? (
                <ApprovalCard key={action.pendingAction.id} action={action.pendingAction} loading={resolvingAction === action.pendingAction.id} onResolve={resolveAction} />
              ) : (
                <div className="tool-chip" key={`${action.type}-${actionIndex}`}><Database size={12} /> {action.type.toLowerCase().replaceAll('_', ' ')}</div>
              ))}
            </div>
          </div>
        ))}
        {isLoading ? <div className="message-row assistant"><div className="message-avatar"><Bot size={16} /></div><div className="thinking"><span /><span /><span /> Working through the request</div></div> : null}
        <div ref={endRef} />
      </div>

      <footer className="composer-wrap">
        <div className="composer">
          <button className={`icon-button ${isListening ? 'active' : ''}`} onClick={toggleListening} type="button" title="Voice input">
            {isListening ? <Mic size={18} /> : <MicOff size={18} />}
          </button>
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            disabled={isLoading}
            placeholder={isListening ? 'Listening…' : 'Ask, log, analyse, or plan…'}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); sendMessage(); } }}
          />
          <button className="send-button" onClick={() => sendMessage()} disabled={!input.trim() || isLoading} aria-label="Send message"><Send size={17} /></button>
        </div>
        <p>Forge can make mistakes. Review estimates and approve consequential actions.</p>
      </footer>
    </div>
  );
}

function Welcome({ onPrompt }: { onPrompt: (prompt: string) => void }) {
  const prompts = [
    'Review my recent training and tell me what matters most.',
    'Help me set realistic calorie and protein targets.',
    'Build a workout after checking my goal and equipment.',
  ];
  return <div className="coach-welcome">
    <div className="welcome-mark"><Sparkles size={30} /></div>
    <span className="eyebrow">Your data-aware coach</span>
    <h2>Train with a clearer next step.</h2>
    <p>Forge can read your training history, use validated tools, remember stable preferences, and ask before destructive changes.</p>
    <div className="prompt-grid">{prompts.map((prompt) => <button key={prompt} onClick={() => onPrompt(prompt)}>{prompt}<Send size={14} /></button>)}</div>
  </div>;
}

function ApprovalCard({ action, loading, onResolve }: { action: PendingAction; loading: boolean; onResolve: (action: PendingAction, decision: 'approve' | 'reject') => void }) {
  return <div className="approval-card">
    <div className="approval-icon"><ShieldCheck size={20} /></div>
    <div><span>Approval required</span><strong>{action.description}</strong><small>{action.toolName}</small></div>
    <div className="approval-actions">
      <button disabled={loading} onClick={() => onResolve(action, 'reject')}><X size={15} /> Cancel</button>
      <button className="approve" disabled={loading} onClick={() => onResolve(action, 'approve')}><Check size={15} /> Approve</button>
    </div>
  </div>;
}
