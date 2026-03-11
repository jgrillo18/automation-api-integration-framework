import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function Dashboard() {
  const [data, setData] = useState({ workflows: 0, executions: 0 });

  useEffect(() => {
    const token = localStorage.getItem('token');
    api.get('/dashboard', { headers: { Authorization: `Bearer ${token}` } }).then(res => {
      setData(res.data);
    });
  }, []);

  const [workflows, setWorkflows] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    api.get('/dashboard', { headers: { Authorization: `Bearer ${token}` } }).then(res => {
      setData(res.data);
    });
    api.get('/workflows', { headers: { Authorization: `Bearer ${token}` } }).then(res => {
      setWorkflows(res.data);
    });
  }, []);

  return (
    <div className="container">
      <h1>Dashboard</h1>
      <div className={"card " + (data.workflows > 0 ? 'bg-green-50' : 'bg-red-50')}>
        <div className="card-title">Workflows</div>
        <div className="card-value">{data.workflows}</div>
      </div>
      <div className={"card " + (data.executions > 0 ? 'bg-green-50' : 'bg-red-50')}>
        <div className="card-title">Executions</div>
        <div className="card-value">{data.executions}</div>
      </div>
      <div className="mt-4">
        <h2>Recent workflows</h2>
        <ul>
          {workflows.map(w => (
            <li key={w.id}>{w.name} ({w.type})</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
