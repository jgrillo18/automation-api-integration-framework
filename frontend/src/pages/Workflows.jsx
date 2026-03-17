import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { LangContext } from '../i18n';

const TYPE_OPTIONS = ['email', 'sync', 'slack', 'report', 'webhook', 'api'];

const typeIcon = (type) => ({ email: '📧', sync: '🔄', slack: '💬', report: '📄', webhook: '🔗', api: '⚡' })[type] || '⚙️';
const typeColor = (type) => ({ email: 'badge-info', sync: 'badge-success', slack: 'badge-purple', report: 'badge-warning', webhook: 'badge-gray', api: 'badge-danger' })[type] || 'badge-gray';

export default function Workflows() {
  const { t } = useContext(LangContext);
  const [list, setList] = useState([]);
  const [name, setName] = useState('');
  const [type, setType] = useState('email');
  const [runMsg, setRunMsg] = useState({});
  const [showForm, setShowForm] = useState(false);

  const load = () => api.get('/workflows').then(r => setList(r.data));

  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await api.post('/workflows', { name: name.trim(), type });
    setName(''); setType('email'); setShowForm(false);
    load();
  };

  const run = async (id) => {
    setRunMsg(p => ({ ...p, [id]: 'running' }));
    try {
      await api.post(`/workflows/${id}/run`);
      setRunMsg(p => ({ ...p, [id]: 'success' }));
    } catch {
      setRunMsg(p => ({ ...p, [id]: 'failed' }));
    }
    setTimeout(() => setRunMsg(p => { const n = { ...p }; delete n[id]; return n; }), 3000);
  };

  const edit = async (w) => {
    const newName = prompt(t.name, w.name);
    if (newName && newName.trim()) {
      await api.patch(`/workflows/${w.id}`, { name: newName.trim() });
      load();
    }
  };

  const statusBadge = (id) => {
    const s = runMsg[id];
    if (!s) return null;
    const map = { running: ['badge-warning', '⏳ Ejecutando...'], success: ['badge-success', '✅ Ejecutado'], failed: ['badge-danger', '❌ Error'] };
    return <span className={`badge ${map[s][0]}`}>{map[s][1]}</span>;
  };

  return (
    <div>
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1>⚙️ {t.workflows}</h1>
            <p>Gestiona y ejecuta tus flujos de automatización</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm(f => !f)}>
            {showForm ? '❌ Cancelar' : `+ ${t.add_workflow}`}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="card mb-4">
          <h2 style={{ marginBottom: 16, fontWeight: 700 }}>{t.add_workflow}</h2>
          <form onSubmit={create}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{t.name}</label>
                <input className="form-input" placeholder="Ej. Email de bienvenida"
                  maxLength={100} value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">{t.type}</label>
                <select className="form-input" value={type} onChange={e => setType(e.target.value)}>
                  {TYPE_OPTIONS.map(o => <option key={o} value={o}>{typeIcon(o)} {o}</option>)}
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-success">✓ {t.create}</button>
          </form>
        </div>
      )}

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>{t.name}</th>
              <th>{t.type}</th>
              <th>{t.status}</th>
              <th>{t.actions}</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr><td colSpan={5}>
                <div className="empty-state">
                  <div className="icon">⚙️</div>
                  <p>{t.no_workflows}</p>
                </div>
              </td></tr>
            ) : (
              list.map(w => (
                <tr key={w.id}>
                  <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>#{w.id}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{typeIcon(w.type)} {w.name}</div>
                  </td>
                  <td><span className={`badge ${typeColor(w.type)}`}>{w.type}</span></td>
                  <td>{statusBadge(w.id) || <span className="badge badge-gray">idle</span>}</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-success btn-sm" onClick={() => run(w.id)}>▶ {t.run}</button>
                      <button className="btn btn-ghost btn-sm" onClick={() => edit(w)}>✏️ {t.edit}</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
