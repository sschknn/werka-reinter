
import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ICONS } from '../constants.tsx';

interface LayoutProps {
  onLogout: () => void;
  user: any;
}

const Layout: React.FC<LayoutProps> = ({ onLogout, user }) => {
  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
        <div className="p-6 flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-xl">W</div>
          <span className="text-xl font-bold tracking-tight">Werkaholic <span className="text-blue-500">AI</span></span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          <NavItem to="/" icon={<ICONS.Dashboard />} label="Dashboard" />
          <NavItem to="/tasks" icon={<ICONS.Tasks />} label="Aufgaben" />
          <NavItem to="/analytics" icon={<ICONS.Analytics />} label="Analyse" />
          <NavItem to="/ai-coach" icon={<ICONS.AI />} label="AI Coach" />
          <NavItem to="/settings" icon={<ICONS.Settings />} label="Einstellungen" />
        </nav>

        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center text-sm font-medium">
              {user?.displayName?.[0] || 'U'}
            </div>
            <div className="flex-1 truncate">
              <p className="text-sm font-medium truncate">{user?.displayName}</p>
              <p className="text-xs text-slate-400 truncate">{user?.isPro ? 'Pro Plan' : 'Free Plan'}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full py-2 px-4 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors text-sm font-medium flex items-center justify-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Abmelden</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative p-8">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

const NavItem: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) => 
      `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
        isActive 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
          : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-100'
      }`
    }
  >
    {icon}
    <span className="font-medium">{label}</span>
  </NavLink>
);

export default Layout;
