import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function History() {
  const [executions, setExecutions] = useState([]);
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    api.get('/workflows', { headers }).then(r => {
      const wfs = r.data;
      // fetch executions for each workflow sequentially
      Promise.all(wfs.map(w => api.get(`/workflows/${w.id}/executions`, { headers }).then(res => res.data)))
        .then(results => {
          setExecutions(results.flat());
        });
    });
  }, []);

  return (
    <div className="container">
      <h1>Execution History</h1>
      <ul>
        {executions.map(e => (
          <li key={e.id} className="card">
            {e.status} at {new Date(e.timestamp).toLocaleString()} (wf {e.workflow_id})
          </li>
        ))}
      </ul>
    </div>
  );
}
