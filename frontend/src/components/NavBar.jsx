import React, { useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LangContext } from '../i18n';

export default function NavBar({ onLogout }) {
  const { t, lang, toggleLang } = useContext(LangContext);
  const email = localStorage.getItem('userEmail') || 'user';
  const initials = email[0].toUpperCase();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">⚡</div>
        <span>Auto<span className="accent">SaaS</span></span>
      </div>

      <div className="sidebar-section-label">MENÚ</div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}>
          <span className="icon">📊</span> {t.dashboard}
        </NavLink>
        <NavLink to="/workflows" className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}>
          <span className="icon">⚙️</span> {t.workflows}
        </NavLink>
        <NavLink to="/history" className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}>
          <span className="icon">📋</span> {t.history}
        </NavLink>
        <div className="sidebar-divider" />
        <div className="sidebar-section-label">SISTEMA</div>
        <NavLink to="/admin" className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}>
          <span className="icon">🛡️</span> {t.admin}
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="user-chip">
          <div className="avatar">{initials}</div>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{email}</span>
        </div>
        <button className="lang-btn" onClick={toggleLang}>
          🌐 {lang === 'es' ? 'Switch to English' : 'Cambiar a Español'}
        </button>
        <button className="btn btn-danger btn-sm" style={{ width: '100%', justifyContent: 'center' }} onClick={onLogout}>
          🚪 {t.logout}
        </button>
      </div>
    </aside>
  );
}