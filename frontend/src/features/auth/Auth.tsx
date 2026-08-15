import { useState } from 'react';
import { Mail, Lock, User, Dumbbell, ArrowRight } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { apiRequest } from '../../api';

export function Auth() {
  const { login } = useAppContext();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const body = isLogin ? { email, password } : { name, email, password };
      
      const data = await apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(body)
      });

      if (data.token) {
        login(data.token);
      } else {
        throw new Error('No token received');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0f172a',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Glows */}
      <div style={{
        position: 'absolute',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, rgba(0,0,0,0) 70%)',
        top: '-20%',
        left: '-10%',
        borderRadius: '50%'
      }} />
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, rgba(0,0,0,0) 70%)',
        bottom: '-10%',
        right: '-5%',
        borderRadius: '50%'
      }} />

      <div style={{
        background: 'rgba(30, 41, 59, 0.7)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '3rem',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        zIndex: 1,
        color: '#f8fafc'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #38bdf8 0%, #3b82f6 100%)',
            marginBottom: '1rem'
          }}>
            <Dumbbell size={32} color="white" />
          </div>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>
            {isLogin ? 'Welcome Back' : 'Join ForgeFit'}
          </h2>
          <p style={{ color: '#94a3b8', margin: 0 }}>
            {isLogin ? 'Sign in to continue your journey' : 'Create an account to start training'}
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#ef4444',
            padding: '0.75rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            textAlign: 'center',
            fontSize: '0.875rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {!isLogin && (
            <div style={{ position: 'relative' }}>
              <User size={20} color="#94a3b8" style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 3rem',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: 'white',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          )}

          <div style={{ position: 'relative' }}>
            <Mail size={20} color="#94a3b8" style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)' }} />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 3rem',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: 'white',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={20} color="#94a3b8" style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)' }} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 3rem',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: 'white',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              background: 'linear-gradient(135deg, #38bdf8 0%, #3b82f6 100%)',
              color: 'white',
              padding: '0.875rem',
              borderRadius: '12px',
              border: 'none',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              marginTop: '0.5rem',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
            {!isLoading && <ArrowRight size={18} />}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            style={{
              background: 'none',
              border: 'none',
              color: '#38bdf8',
              fontWeight: 'bold',
              cursor: 'pointer',
              padding: 0
            }}
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}
