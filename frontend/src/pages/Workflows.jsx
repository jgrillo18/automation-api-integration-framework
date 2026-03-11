import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Workflows() {
  const [list, setList] = useState([]);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  const token = localStorage.getItem('token');

  const fetch = () => {
    api.get('/workflows', { headers: { Authorization: `Bearer ${token}` } }).then(r => setList(r.data));
  };

  useEffect(() => {
    fetch();
  }, []);

  const create = async () => {
    const r = await api.post('/workflows', { name, type }, { headers: { Authorization: `Bearer ${token}` } });
    setList([...list, r.data]);
    setName('');
    setType('');
  };

  const run = async (id) => {
    setStatusMsg('Running workflow...');
    await api.post(`/workflows/${id}/run`, null, { headers: { Authorization: `Bearer ${token}` } });
    setStatusMsg('Workflow executed');
  };

  const edit = async (w) => {
    const newName = prompt('New name', w.name);
    if (newName) {
      await api.patch(`/workflows/${w.id}`, { name: newName }, { headers: { Authorization: `Bearer ${token}` } });
      fetch();
    }
  };

  return (
    <div className="container">
      <h1>Workflows</h1>
      <div className="card">
        <input placeholder="name" pattern="[\w\s\-]+" maxLength={100} className="mb-2 p-2 w-full" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="type" pattern="[\w\s\-]+" maxLength={100} className="mb-2 p-2 w-full" value={type} onChange={e => setType(e.target.value)} />
        <button onClick={create} className="bg-blue-600 text-white p-2 w-full">Add</button>
      </div>
      {statusMsg && <div className="card">{statusMsg}</div>}
      <ul>
        {list.map(w => (
          <li key={w.id} className="card flex justify-between items-center">
            <span>{w.name} ({w.type})</span>
            <span>
              <button onClick={() => run(w.id)} className="mr-2 bg-green-500 text-white px-2 py-1 rounded">Run</button>
              <button onClick={() => edit(w)} className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
