
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TaskManager from './components/TaskManager';
import AICoach from './components/AICoach';
import { User, AuthState } from './types';

// Mock Auth logic
const App: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  });

  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('werkaholic_user');
    if (savedUser) {
      setAuthState({ user: JSON.parse(savedUser), loading: false, error: null });
    } else {
      setAuthState({ user: null, loading: false, error: null });
    }
  }, []);

  const login = (email: string) => {
    const mockUser: User = {
      id: 'user-1',
      email: email,
      displayName: email.split('@')[0],
      isPro: false
    };
    localStorage.setItem('werkaholic_user', JSON.stringify(mockUser));
    setAuthState({ user: mockUser, loading: false, error: null });
    navigate('/');
  };

  const logout = () => {
    localStorage.removeItem('werkaholic_user');
    setAuthState({ user: null, loading: false, error: null });
    navigate('/login');
  };

  if (authState.loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-900">
        <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={
        authState.user ? <Navigate to="/" /> : <LoginPage onLogin={login} />
      } />
      
      <Route path="/" element={
        authState.user ? <Layout user={authState.user} onLogout={logout} /> : <Navigate to="/login" />
      }>
        {/* Fix: Removed the invalid <index> element that caused a JSX error on line 64 */}
        <Route index element={<Dashboard />} />
        <Route path="tasks" element={<TaskManager />} />
        <Route path="ai-coach" element={<AICoach />} />
        <Route path="analytics" element={<Dashboard />} /> {/* Simplified demo */}
        <Route path="settings" element={<SettingsPage user={authState.user} />} />
      </Route>
    </Routes>
  );
};

const LoginPage: React.FC<{ onLogin: (email: string) => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6">
      <div className="w-full max-w-md space-y-8 bg-slate-800 p-10 rounded-3xl border border-slate-700 shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center font-bold text-3xl mx-auto mb-6 shadow-xl shadow-blue-900/40">W</div>
          <h2 className="text-3xl font-extrabold">Willkommen zurück</h2>
          <p className="text-slate-400 mt-2">Logge dich ein, um Werkaholic AI zu nutzen.</p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="mt-1 w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="name@beispiel.de"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">Passwort</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="mt-1 w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>
          <button 
            onClick={() => onLogin(email || 'demo@werkaholic.ai')}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-900/30"
          >
            Anmelden
          </button>
          <div className="text-center">
            <button className="text-sm text-slate-400 hover:text-white">Account erstellen?</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingsPage: React.FC<{ user: User | null }> = ({ user }) => (
  <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-300">
    <header>
      <h2 className="text-2xl font-bold">Einstellungen</h2>
      <p className="text-slate-400">Verwalte dein Konto und dein Abonnement.</p>
    </header>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
        <h3 className="text-lg font-semibold mb-4">Profil</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-500 uppercase font-bold mb-1">Name</label>
            <p className="text-slate-200 font-medium">{user?.displayName}</p>
          </div>
          <div>
            <label className="block text-xs text-slate-500 uppercase font-bold mb-1">E-Mail</label>
            <p className="text-slate-200 font-medium">{user?.email}</p>
          </div>
          <button className="text-sm text-blue-500 hover:text-blue-400 font-medium">Profil bearbeiten</button>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl shadow-xl">
        <h3 className="text-lg font-bold text-white mb-2">Upgrade auf Pro</h3>
        <p className="text-blue-100 text-sm mb-6">Erhalte unbegrenzte AI-Analysen, Team-Features und detaillierte Reports.</p>
        <div className="flex items-baseline space-x-1 mb-6">
          <span className="text-4xl font-bold text-white">9,99€</span>
          <span className="text-blue-200">/ Monat</span>
        </div>
        <button className="w-full bg-white text-blue-600 font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-lg">
          Jetzt Pro werden
        </button>
      </div>
    </div>
  </div>
);

export default App;
