import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { LangContext } from '../i18n';

const statusConfig = {
  success:  { cls: 'badge-success', icon: '✅', label: 'Success' },
  failed:   { cls: 'badge-danger',  icon: '❌', label: 'Failed' },
  running:  { cls: 'badge-warning', icon: '⏳', label: 'Running' },
  pending:  { cls: 'badge-gray',    icon: '⏸️', label: 'Pending' },
};

export default function History() {
  const { t } = useContext(LangContext);
  const [executions, setExecutions] = useState([]);
  const [workflows, setWorkflows] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const load = async () => {
      try {
        const wfRes = await api.get('/workflows');
        const wfMap = {};
        wfRes.data.forEach(w => { wfMap[w.id] = w; });
        setWorkflows(wfMap);

        const allExecs = await Promise.all(
          wfRes.data.map(w =>
            api.get(`/workflows/${w.id}/executions`).then(r => r.data).catch(() => [])
          )
        );
        const flat = allExecs.flat().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setExecutions(flat);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = filter === 'all' ? executions : executions.filter(e => e.status === filter);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: '2rem', marginBottom: 8 }}>⏳</div><p>Cargando historial...</p>
      </div>
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1>📋 {t.execution_history}</h1>
            <p>{executions.length} ejecuciones registradas</p>
          </div>
          <div className="flex gap-2">
            {['all', 'success', 'failed', 'running'].map(f => (
              <button key={f}
                className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setFilter(f)}>
                {f === 'all' ? 'Todas' : f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>{t.workflow}</th>
              <th>{t.status}</th>
              <th>{t.timestamp}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={4}>
                <div className="empty-state">
                  <div className="icon">📋</div>
                  <p>No hay ejecuciones</p>
                </div>
              </td></tr>
            ) : (
              filtered.map(e => {
                const cfg = statusConfig[e.status] || statusConfig.pending;
                const wf = workflows[e.workflow_id];
                return (
                  <tr key={e.id}>
                    <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>#{e.id}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{wf ? wf.name : `Flujo #${e.workflow_id}`}</div>
                      {wf && <div style={{ fontSize: '.78rem', color: 'var(--text-muted)' }}>{wf.type}</div>}
                    </td>
                    <td><span className={`badge ${cfg.cls}`}>{cfg.icon} {cfg.label}</span></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '.83rem' }}>
                      {new Date(e.timestamp).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' })}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
