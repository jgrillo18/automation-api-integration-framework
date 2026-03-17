import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { LangContext } from '../i18n';

export default function Login({ onLogin }) {
  const { t } = useContext(LangContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const login = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Ingresa correo y contraseña'); return; }
    setLoading(true); setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      onLogin(res.data.access_token, email);
    } catch (err) {
      setError(err.response?.data?.detail || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="logo-icon">⚡</div>
          <h1>AutoSaaS</h1>
          <p>{t.tagline}</p>
        </div>

        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 20 }}>{t.welcome}</h2>

        {error && <div className="alert alert-warning">⚠️ {error}</div>}

        <form onSubmit={login}>
          <div className="form-group">
            <label className="form-label">{t.email}</label>
            <input className="form-input" type="email" placeholder="tu@empresa.com"
              value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">{t.password}</label>
            <input className="form-input" type="password" placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? '⏳ Ingresando...' : `🔐 ${t.signIn}`}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-muted">
          {t.noAccount} <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>{t.signUp}</Link>
        </p>
      </div>
    </div>
  );
}