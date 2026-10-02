import { useState } from 'react';
import { Activity, ArrowRight, LockKeyhole, Mail, User } from 'lucide-react';
import { apiRequest } from '../../api';
import { useAppContext } from '../../context/AppContext';

export function Auth() {
  const { login } = useAppContext();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await apiRequest<{ token: string }>(`/auth/${mode === 'login' ? 'login' : 'register'}`, {
        method: 'POST', body: JSON.stringify(mode === 'login' ? { email, password } : { name, email, password }),
      });
      login(data.token);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return <main className="auth-shell">
    <section className="auth-story">
      <div className="auth-brand"><div><Activity size={20} /></div><strong>Forge<span>Fit</span></strong></div>
      <div className="auth-copy">
        <span className="eyebrow">Adaptive coaching, grounded in your data</span>
        <h1>A stronger plan starts with a clearer signal.</h1>
        <p>Train, recover, and progress with an AI coach that uses validated tools, remembers what matters, and asks before consequential changes.</p>
      </div>
      <div className="auth-proof"><span>01</span><p><strong>Real progress</strong>No decorative metrics. Every trend comes from your history.</p></div>
      <div className="auth-proof"><span>02</span><p><strong>Controlled agency</strong>You stay in charge of destructive or sensitive actions.</p></div>
    </section>
    <section className="auth-form-panel">
      <form className="auth-form" onSubmit={submit}>
        <div><span className="eyebrow">{mode === 'login' ? 'Welcome back' : 'Create your profile'}</span><h2>{mode === 'login' ? 'Continue training.' : 'Start building.'}</h2><p>{mode === 'login' ? 'Sign in to resume your coaching history.' : 'Your coach will learn only what you choose to share.'}</p></div>
        {error ? <div className="form-error">{error}</div> : null}
        {mode === 'register' ? <label><span>Name</span><div><User size={17} /><input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required placeholder="Your name" /></div></label> : null}
        <label><span>Email</span><div><Mail size={17} /><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required placeholder="you@example.com" /></div></label>
        <label><span>Password</span><div><LockKeyhole size={17} /><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} minLength={mode === 'register' ? 8 : undefined} required placeholder="At least 8 characters" /></div></label>
        <button className="auth-submit" disabled={loading}>{loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}<ArrowRight size={18} /></button>
        <button className="auth-switch" type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>{mode === 'login' ? 'New to ForgeFit? Create an account' : 'Already have an account? Sign in'}</button>
      </form>
    </section>
  </main>;
}
