
import React, { useMemo } from 'react';
import { Task, Project } from '../types';
import { storage } from '../services/storage';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard: React.FC = () => {
  const tasks = storage.getTasks();
  const projects = storage.getProjects();

  const stats = useMemo(() => {
    const totalMinutes = tasks.reduce((acc, t) => acc + t.timeSpentMinutes, 0);
    const completedTasks = tasks.filter(t => t.status === 'done').length;
    const activeTasks = tasks.filter(t => t.status !== 'done').length;
    
    return {
      totalHours: Math.round(totalMinutes / 60),
      completedTasks,
      activeTasks,
      projectCount: projects.length
    };
  }, [tasks, projects]);

  const chartData = [
    { name: 'Mo', mins: 120 },
    { name: 'Di', mins: 300 },
    { name: 'Mi', mins: 210 },
    { name: 'Do', mins: 450 },
    { name: 'Fr', mins: 380 },
    { name: 'Sa', mins: 150 },
    { name: 'So', mins: 90 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold">Guten Tag, Werkaholic! 👋</h1>
        <p className="text-slate-400 mt-1">Hier ist eine Übersicht deiner heutigen Produktivität.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Work Hours" value={stats.totalHours.toString()} icon="⏳" color="blue" />
        <StatCard title="Erledigte Aufgaben" value={stats.completedTasks.toString()} icon="✅" color="green" />
        <StatCard title="Aktive Projekte" value={stats.projectCount.toString()} icon="📁" color="purple" />
        <StatCard title="Offene Tasks" value={stats.activeTasks.toString()} icon="⚡" color="yellow" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <h3 className="text-lg font-semibold mb-6">Wöchentliche Aktivität</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorMins" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#3b82f6' }}
                />
                <Area type="monotone" dataKey="mins" stroke="#3b82f6" fillOpacity={1} fill="url(#colorMins)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <h3 className="text-lg font-semibold mb-4">Letzte Aufgaben</h3>
          <div className="space-y-4">
            {tasks.slice(0, 5).map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{task.title}</span>
                  <span className="text-xs text-slate-400">{task.status}</span>
                </div>
                <div className="text-xs px-2 py-1 bg-slate-800 rounded text-slate-300">
                  {task.timeSpentMinutes}m
                </div>
              </div>
            ))}
            {tasks.length === 0 && (
              <p className="text-center py-8 text-slate-500 italic text-sm">Keine Aufgaben vorhanden.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string; icon: string; color: string }> = ({ title, value, icon, color }) => {
  const colorMap: Record<string, string> = {
    blue: 'text-blue-500',
    green: 'text-emerald-500',
    purple: 'text-purple-500',
    yellow: 'text-amber-500'
  };
  
  return (
    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-slate-500 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <span className="text-2xl">{icon}</span>
        <div className={`w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center ${colorMap[color]}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
        </div>
      </div>
      <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">{title}</p>
      <h3 className="text-3xl font-bold mt-1">{value}</h3>
    </div>
  );
};

export default Dashboard;
