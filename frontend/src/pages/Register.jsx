import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { LangContext } from '../i18n';

export default function Register({ onLogin }) {
  const { t } = useContext(LangContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [org, setOrg] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const register = async (e) => {
    e.preventDefault();
    if (!email || !password || !org) { setError('Completa todos los campos'); return; }
    setLoading(true); setError('');
    try {
      await api.post('/auth/register', { email, password, organization: org });
      // auto-login after register
      const res = await api.post('/auth/login', { email, password });
      onLogin(res.data.access_token, email);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al registrar');
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

        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 20 }}>{t.registerTitle}</h2>

        {error && <div className="alert alert-warning">⚠️ {error}</div>}

        <form onSubmit={register}>
          <div className="form-group">
            <label className="form-label">{t.email}</label>
            <input className="form-input" type="email" placeholder="tu@empresa.com"
              value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">{t.password}</label>
            <input className="form-input" type="password" placeholder="Mínimo 6 caracteres" maxLength={72}
              value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">{t.org}</label>
            <input className="form-input" placeholder={t.org_placeholder} maxLength={100}
              pattern="[\w\s\-]+" value={org} onChange={e => setOrg(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? '⏳ Creando cuenta...' : `🚀 ${t.signUp}`}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-muted">
          {t.hasAccount} <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>{t.signIn}</Link>
        </p>
      </div>
    </div>
  );
}
