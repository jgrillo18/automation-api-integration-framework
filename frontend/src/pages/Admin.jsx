import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [orgs, setOrgs] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = () => {
    api.get('/admin/users', { headers }).then(r => setUsers(r.data));
    api.get('/admin/organizations', { headers }).then(r => setOrgs(r.data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const createUser = async () => {
    if (!email || !password) {
      alert('Ingrese email y contraseña');
      return;
    }
    try {
      // organization value is ignored by server (it uses admin's org), but schema requires a string
      await api.post('/admin/users', { email, password, organization: 'ignored', is_admin: isAdmin }, { headers });
      setEmail(''); setPassword('');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.detail || 'Error creando usuario');
    }
  };

  return (
    <div className="container">
      <h1>Panel de administración</h1>
      <div className="card mb-4">
        <h2>Crear usuario</h2>
        <input className="mb-2 p-2 w-full" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" className="mb-2 p-2 w-full" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <label className="block mb-2">
          <input type="checkbox" checked={isAdmin} onChange={e => setIsAdmin(e.target.checked)} /> Administrador
        </label>
        <button className="bg-blue-600 text-white p-2 w-full" onClick={createUser}>Crear</button>
      </div>
      <div className="card mb-4">
        <h2>Organizaciones</h2>
        <ul>
          {orgs.map(o => <li key={o.id}>{o.name}</li>)}
        </ul>
      </div>
      <div className="card">
        <h2>Usuarios</h2>
        <ul>
          {users.map(u => <li key={u.id}>{u.email} {u.is_admin ? '(admin)' : ''}</li>)}
        </ul>
      </div>
    </div>
  );
}
