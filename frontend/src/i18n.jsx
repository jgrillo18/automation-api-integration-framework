import { createContext, useContext, useState } from 'react';

const T = {
  en: {
    dashboard: 'Dashboard', workflows: 'Workflows', admin: 'Admin', history: 'History',
    logout: 'Logout', login: 'Login', register: 'Register',
    email: 'Email', password: 'Password', org: 'Organization',
    signIn: 'Sign In', signUp: 'Create Account', noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?', total_workflows: 'Total Workflows',
    total_executions: 'Total Executions', active: 'Active', success: 'Success',
    failed: 'Failed', running: 'Running', pending: 'Pending',
    name: 'Name', type: 'Type', actions: 'Actions', run: 'Run', edit: 'Edit',
    add_workflow: 'Add Workflow', status: 'Status', timestamp: 'Date / Time',
    workflow: 'Workflow', create_user: 'Create User', organizations: 'Organizations',
    users: 'Users', create: 'Create', admin_panel: 'Admin Panel',
    execution_history: 'Execution History', tagline: 'Enterprise Automation Platform',
    load_demo: 'Load Demo Data', org_placeholder: 'Organization name',
    welcome: 'Welcome back', registerTitle: 'Create your account',
    recent_workflows: 'Recent Workflows', quick_stats: 'Quick Stats',
    no_workflows: 'No workflows yet', run_workflow: 'Run',
    is_admin: 'Admin role', delete: 'Delete', search: 'Search...',
  },
  es: {
    dashboard: 'Panel', workflows: 'Flujos', admin: 'Administración', history: 'Historial',
    logout: 'Cerrar sesión', login: 'Iniciar sesión', register: 'Registrarse',
    email: 'Correo electrónico', password: 'Contraseña', org: 'Organización',
    signIn: 'Ingresar', signUp: 'Crear cuenta', noAccount: '¿No tienes cuenta?',
    hasAccount: '¿Ya tienes cuenta?', total_workflows: 'Total de Flujos',
    total_executions: 'Total de Ejecuciones', active: 'Activo', success: 'Exitoso',
    failed: 'Fallido', running: 'En ejecución', pending: 'Pendiente',
    name: 'Nombre', type: 'Tipo', actions: 'Acciones', run: 'Ejecutar', edit: 'Editar',
    add_workflow: 'Añadir Flujo', status: 'Estado', timestamp: 'Fecha / Hora',
    workflow: 'Flujo', create_user: 'Crear usuario', organizations: 'Organizaciones',
    users: 'Usuarios', create: 'Crear', admin_panel: 'Panel de Administración',
    execution_history: 'Historial de Ejecuciones', tagline: 'Plataforma de Automatización Empresarial',
    load_demo: 'Cargar datos demo', org_placeholder: 'Nombre de organización',
    welcome: 'Bienvenido de vuelta', registerTitle: 'Crea tu cuenta',
    recent_workflows: 'Flujos Recientes', quick_stats: 'Estadísticas Rápidas',
    no_workflows: 'Sin flujos aún', run_workflow: 'Ejecutar',
    is_admin: 'Rol admin', delete: 'Eliminar', search: 'Buscar...',
  }
};

export const LangContext = createContext({ lang: 'es', t: T.es, toggleLang: () => {} });

export function LangProvider({ children }) {
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'es');
  const toggleLang = () => {
    const next = lang === 'es' ? 'en' : 'es';
    setLang(next);
    localStorage.setItem('lang', next);
  };
  return (
    <LangContext.Provider value={{ lang, t: T[lang], toggleLang }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
