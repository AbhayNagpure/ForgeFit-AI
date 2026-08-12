import { useState } from 'react';
import { Mail, Lock, User, Dumbbell, ArrowRight } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { apiRequest } from '../../api';

export function Auth() {
  const { login } = useAppContext();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;

      const data = await apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      // Pass the token and user to the AppContext login method
      login(data.token, data.user);
      
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: 'var(--bg-dark)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background glow effects */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '20%',
        width: '300px',
        height: '300px',
        background: 'var(--accent)',
        filter: 'blur(120px)',
        opacity: 0.15,
        borderRadius: '50%'
      }} />
      
      <div className="card" style={{
        maxWidth: '440px',
        width: '100%',
        padding: '40px',
        position: 'relative',
        zIndex: 1,
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 24px 48px rgba(0,0,0,0.4)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '20px', background: 'linear-gradient(135deg, var(--accent), #818cf8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto',
            boxShadow: '0 8px 16px rgba(99, 102, 241, 0.3)'
          }}>
            <Dumbbell size={32} color="#fff" />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 8px 0', background: 'linear-gradient(to right, #fff, #9ca3af)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            ForgeFit AI
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', margin: 0 }}>
            {isLogin ? 'Welcome back, athlete.' : 'Start your fitness journey today.'}
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            padding: '12px 16px',
            borderRadius: '12px',
            marginBottom: '20px',
            fontSize: '0.875rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {!isLogin && (
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
                <User size={20} />
              </div>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required={!isLogin}
                style={{
                  width: '100%', padding: '16px 16px 16px 48px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '16px',
                  color: '#fff', fontSize: '1rem',
                  outline: 'none', transition: 'all 0.2s',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          )}

          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
              <Mail size={20} />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%', padding: '16px 16px 16px 48px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-glass)',
                borderRadius: '16px',
                color: '#fff', fontSize: '1rem',
                outline: 'none', transition: 'all 0.2s',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
              <Lock size={20} />
            </div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              style={{
                width: '100%', padding: '16px 16px 16px 48px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-glass)',
                borderRadius: '16px',
                color: '#fff', fontSize: '1rem',
                outline: 'none', transition: 'all 0.2s',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '16px', marginTop: '8px',
              background: 'var(--accent)', color: '#fff',
              border: 'none', borderRadius: '16px',
              fontSize: '1rem', fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: '0 8px 16px rgba(99, 102, 241, 0.4)',
              transition: 'all 0.2s', opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setFormData({ name: '', email: '', password: '' });
            }}
            style={{
              background: 'none', border: 'none',
              color: 'var(--text-secondary)', fontSize: '0.875rem',
              cursor: 'pointer', transition: 'color 0.2s'
            }}
          >
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span style={{ color: 'var(--accent)', fontWeight: 600 }}>
              {isLogin ? 'Sign Up' : 'Sign In'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
