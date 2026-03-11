import { useState } from "react";
import api from '../services/api';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [org, setOrg] = useState('');

  const register = async () => {
    if (!email || !password || !org) {
      alert('Complete todos los campos');
      return;
    }
    try {
      await api.post('/auth/register', { email, password, organization: org });
      alert('Usuario creado, ahora puedes ingresar');
      window.location.href = '/login';
    } catch (err) {
      const msg = err.response?.data?.detail || 'Error al registrar';
      alert(msg);
    }
  };

  return (
    <div className="container">
      <h1>Registro</h1>
      <div className="card">
        <form onSubmit={e => { e.preventDefault(); register(); }}>
          <input className="mb-2 p-2 w-full" placeholder="Email" onChange={e => setEmail(e.target.value)} />
          <input type="password" maxLength={72} className="mb-2 p-2 w-full" placeholder="Password" onChange={e => setPassword(e.target.value)} />
          <input pattern="[\w\s\-]+" maxLength={100} className="mb-2 p-2 w-full" placeholder="Organización" onChange={e => setOrg(e.target.value)} />
          <button type="submit" className="bg-green-600 text-white p-2 w-full">
            Registrar
          </button>
        </form>
      </div>
    </div>
  );
}
