import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { LangContext } from '../i18n';

const DEMO_WORKFLOWS = [
  { name: 'Email Marketing Campaign', type: 'email' },
  { name: 'Daily Data Sync', type: 'sync' },
  { name: 'Slack Alerts Bot', type: 'slack' },
  { name: 'Weekly Report Generator', type: 'report' },
];

export default function Dashboard() {
  const { t } = useContext(LangContext);
  const [workflows, setWorkflows] = useState([]);
  const [execCount, setExecCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [demoLoaded, setDemoLoaded] = useState(false);

  const loadData = async () => {
    try {
      const [wfRes, dashRes] = await Promise.all([
        api.get('/workflows'),
        api.get('/dashboard').catch(() => ({ data: { executions: 0 } }))
      ]);
      setWorkflows(wfRes.data);
      setExecCount(dashRes.data.executions || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // Auto-seed demo data on first load if empty
  useEffect(() => {
    if (!loading && workflows.length === 0 && !seeding) {
      seedDemo();
    }
  }, [loading, workflows.length]);

  const seedDemo = async () => {
    setSeeding(true);
    try {
      const created = [];
      for (const wf of DEMO_WORKFLOWS) {
        const r = await api.post('/workflows', wf);
        created.push(r.data);
      }
      // run each workflow once to generate history
      await Promise.all(created.map(w => api.post(`/workflows/${w.id}/run`).catch(() => {})));
      setDemoLoaded(true);
      await loadData();
    } catch (e) {
      console.error('seed error', e);
    } finally {
      setSeeding(false);
    }
  };

  const typeIcon = (type) => ({
    email: '📧', sync: '🔄', slack: '💬', report: '📄', webhook: '🔗', api: '⚡'
  })[type] || '⚙️';

  const typeColor = (type) => ({
    email: 'badge-info', sync: 'badge-success', slack: 'badge-purple',
    report: 'badge-warning', webhook: 'badge-gray', api: 'badge-danger'
  })[type] || 'badge-gray';

  if (loading || seeding) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>⏳</div>
          <p>{seeding ? 'Cargando datos de demo...' : 'Cargando...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1>📊 {t.dashboard}</h1>
        <p>Resumen general de tu plataforma de automatización</p>
      </div>

      {demoLoaded && (
        <div className="alert alert-success">✅ Datos de demo cargados correctamente. ¡Explora tu dashboard!</div>
      )}

      <div className="stat-grid">
        <div className="stat-card indigo">
          <div className="stat-icon">⚙️</div>
          <div className="stat-value">{workflows.length}</div>
          <div className="stat-label">{t.total_workflows}</div>
        </div>
        <div className="stat-card emerald">
          <div className="stat-icon">⚡</div>
          <div className="stat-value">{execCount}</div>
          <div className="stat-label">{t.total_executions}</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-icon">🟢</div>
          <div className="stat-value">{workflows.filter(w => ['email','slack'].includes(w.type)).length}</div>
          <div className="stat-label">{t.active}</div>
        </div>
        <div className="stat-card cyan">
          <div className="stat-icon">📈</div>
          <div className="stat-value">{execCount > 0 ? Math.round((execCount / Math.max(workflows.length, 1)) * 10) / 10 : 0}</div>
          <div className="stat-label">Ejec. / Flujo</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>⚡ {t.recent_workflows}</h2>
          <span className="badge badge-info">{workflows.length} total</span>
        </div>
        {workflows.length === 0 ? (
          <div className="empty-state">
            <div className="icon">⚙️</div>
            <p>{t.no_workflows}</p>
          </div>
        ) : (
          workflows.slice(0, 6).map(w => (
            <div key={w.id} className="workflow-item">
              <div>
                <div className="workflow-name">{typeIcon(w.type)} {w.name}</div>
                <div className="workflow-meta">ID #{w.id} &middot; tipo: {w.type}</div>
              </div>
              <span className={`badge ${typeColor(w.type)}`}>{w.type}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
