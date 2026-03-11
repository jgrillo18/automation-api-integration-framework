import React from 'react';

export default function NavBar({ onLogout }) {
  return (
    <nav className="container flex justify-between items-center py-4">
      <div className="text-xl font-bold">Automation SaaS</div>
      <div>
        <a href="/dashboard" className="mr-4">Dashboard</a>
        <a href="/workflows" className="mr-4">Workflows</a>
        <a href="/admin" className="mr-4">Admin</a>
        <a href="/history" className="mr-4">History</a>
        <button onClick={onLogout} className="bg-red-500 text-white px-2 py-1 rounded">Logout</button>
      </div>
    </nav>
  );
}