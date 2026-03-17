import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { LangContext } from '../i18n';

export default function Admin() {
  const { t } = useContext(LangContext);
  const [users, setUsers] = useState([]);
  const [orgs, setOrgs] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    api.get('/admin/users').then(r => setUsers(r.data)).catch(() => {});
    api.get('/admin/organizations').then(r => setOrgs(r.data)).catch(() => {});
  };

  useEffect(() => { fetchData(); }, []);

  const createUser = async (e) => {
    e.preventDefault();
    if (!email || !password) { setMsg('⚠️ Ingresa email y contraseña'); return; }
    setLoading(true); setMsg('');
    try {
      await api.post('/admin/users', { email, password, organization: 'admin-created', is_admin: isAdmin });
      setEmail(''); setPassword(''); setIsAdmin(false);
      setMsg('✅ Usuario creado');
      fetchData();
    } catch (err) {
      setMsg('❌ ' + (err.response?.data?.detail || 'Error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>🛡️ {t.admin_panel}</h1>
        <p>Gestiona usuarios y organizaciones del sistema</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        {/* Stat mini */}
        <div className="stat-card indigo">
          <div className="stat-icon">👥</div>
          <div className="stat-value">{users.length}</div>
          <div className="stat-label">{t.users}</div>
        </div>
        <div className="stat-card emerald">
          <div className="stat-icon">🏢</div>
          <div className="stat-value">{orgs.length}</div>
          <div className="stat-label">{t.organizations}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="card">
          <div className="card-header"><h2>➕ {t.create_user}</h2></div>
          {msg && (
            <div className={`alert ${msg.startsWith('✅') ? 'alert-success' : 'alert-warning'}`}>{msg}</div>
          )}
          <form onSubmit={createUser}>
            <div className="form-group">
              <label className="form-label">{t.email}</label>
              <input className="form-input" type="email" placeholder="usuario@empresa.com"
                value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">{t.password}</label>
              <input className="form-input" type="password" placeholder="Contraseña"
                value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input type="checkbox" id="isAdmin" checked={isAdmin} onChange={e => setIsAdmin(e.target.checked)}
                style={{ width: 16, height: 16, cursor: 'pointer' }} />
              <label htmlFor="isAdmin" className="form-label" style={{ margin: 0, cursor: 'pointer' }}>
                🛡️ {t.is_admin}
              </label>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? '⏳...' : `➕ ${t.create}`}
            </button>
          </form>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card">
            <div className="card-header"><h2>🏢 {t.organizations}</h2></div>
            {orgs.length === 0 ? (
              <p className="text-muted text-sm">Sin organizaciones</p>
            ) : (
              <table>
                <thead><tr><th>#</th><th>Nombre</th><th>Plan</th></tr></thead>
                <tbody>
                  {orgs.map(o => (
                    <tr key={o.id}>
                      <td style={{ color: 'var(--text-muted)' }}>#{o.id}</td>
                      <td style={{ fontWeight: 600 }}>{o.name}</td>
                      <td><span className="badge badge-info">{o.plan || 'basic'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="card">
            <div className="card-header"><h2>👥 {t.users}</h2></div>
            {users.length === 0 ? (
              <p className="text-muted text-sm">Sin usuarios</p>
            ) : (
              <table>
                <thead><tr><th>Email</th><th>Rol</th></tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td style={{ fontWeight: 500 }}>{u.email}</td>
                      <td>
                        {u.is_admin
                          ? <span className="badge badge-purple">🛡️ Admin</span>
                          : <span className="badge badge-gray">Usuario</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
