import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    if (!email || !password) {
      alert("Ingrese correo y contraseña");
      return;
    }
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.access_token);
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.detail || "Login failed";
      alert(msg + ". Please register if you don't have an account.");
    }
  };

  return (
    <div className="container">
      <h1>Login</h1>
      <div className="card">
        <input className="mb-2 p-2 w-full" placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input type="password" className="mb-2 p-2 w-full" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <button className="bg-blue-600 text-white p-2 w-full" onClick={login}>
          Ingresar
        </button>
        <p className="text-center mt-4">
          ¿No tienes cuenta? <Link to="/register" className="text-blue-400">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}