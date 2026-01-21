
import React, { useState, useEffect } from 'react';
import { Task, Project, TaskStatus } from '../types';
import { storage } from '../services/storage';

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [showModal, setShowModal] = useState(false);
  
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    projectId: '',
    status: 'todo',
    priority: 'medium',
    timeSpentMinutes: 0
  });

  useEffect(() => {
    setTasks(storage.getTasks());
    setProjects(storage.getProjects());
  }, []);

  const handleCreateTask = () => {
    if (!newTask.title) return;
    const task: Task = {
      ...(newTask as Task),
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      projectId: newTask.projectId || projects[0]?.id || 'default'
    };
    storage.addTask(task);
    setTasks(storage.getTasks());
    setShowModal(false);
    setNewTask({ title: '', description: '', projectId: '', status: 'todo', priority: 'medium', timeSpentMinutes: 0 });
  };

  const updateStatus = (id: string, status: TaskStatus) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      storage.updateTask({ ...task, status });
      setTasks(storage.getTasks());
    }
  };

  const deleteTask = (id: string) => {
    storage.deleteTask(id);
    setTasks(storage.getTasks());
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Deine Aufgaben</h2>
          <p className="text-slate-400">Verwalte deine täglichen Tasks und Projekte.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
          <span>Neuer Task</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Column 
          title="To Do" 
          tasks={tasks.filter(t => t.status === 'todo')} 
          onUpdateStatus={updateStatus} 
          onDelete={deleteTask}
        />
        <Column 
          title="In Arbeit" 
          tasks={tasks.filter(t => t.status === 'in-progress')} 
          onUpdateStatus={updateStatus} 
          onDelete={deleteTask}
        />
        <Column 
          title="Erledigt" 
          tasks={tasks.filter(t => t.status === 'done')} 
          onUpdateStatus={updateStatus} 
          onDelete={deleteTask}
        />
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-800 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold mb-4">Neuen Task erstellen</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Titel</label>
                <input 
                  type="text" 
                  value={newTask.title}
                  onChange={e => setNewTask({...newTask, title: e.target.value})}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Task Name"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Projekt</label>
                <select 
                  value={newTask.projectId}
                  onChange={e => setNewTask({...newTask, projectId: e.target.value})}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Priorität</label>
                  <select 
                    value={newTask.priority}
                    onChange={e => setNewTask({...newTask, priority: e.target.value as any})}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2"
                  >
                    <option value="low">Niedrig</option>
                    <option value="medium">Mittel</option>
                    <option value="high">Hoch</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Zeit (Minuten)</label>
                  <input 
                    type="number" 
                    value={newTask.timeSpentMinutes}
                    onChange={e => setNewTask({...newTask, timeSpentMinutes: parseInt(e.target.value) || 0})}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Beschreibung</label>
                <textarea 
                  value={newTask.description}
                  onChange={e => setNewTask({...newTask, description: e.target.value})}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 h-24"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button 
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 font-medium"
              >
                Abbrechen
              </button>
              <button 
                onClick={handleCreateTask}
                className="flex-1 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 font-medium"
              >
                Erstellen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Column: React.FC<{ 
  title: string; 
  tasks: Task[]; 
  onUpdateStatus: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
}> = ({ title, tasks, onUpdateStatus, onDelete }) => (
  <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-800 flex flex-col h-full min-h-[500px]">
    <div className="flex items-center justify-between mb-4 px-2">
      <h3 className="font-bold flex items-center space-x-2">
        <span>{title}</span>
        <span className="text-xs bg-slate-700 px-2 py-0.5 rounded-full text-slate-400">{tasks.length}</span>
      </h3>
    </div>
    <div className="space-y-4 flex-1">
      {tasks.map(task => (
        <div key={task.id} className="bg-slate-800 border border-slate-700 p-4 rounded-xl shadow-sm hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-2">
            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
              task.priority === 'high' ? 'bg-red-500/10 text-red-500' : 
              task.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-500' : 
              'bg-blue-500/10 text-blue-500'
            }`}>
              {task.priority}
            </span>
            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => onDelete(task.id)} className="p-1 hover:text-red-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>
          </div>
          <h4 className="font-semibold text-sm mb-1">{task.title}</h4>
          <p className="text-xs text-slate-400 line-clamp-2 mb-3">{task.description}</p>
          <div className="flex justify-between items-center mt-auto pt-3 border-t border-slate-700/50">
            <div className="text-xs text-slate-500 flex items-center space-x-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span>{task.timeSpentMinutes}m</span>
            </div>
            <select 
              className="text-[10px] bg-slate-700 border-none rounded px-2 py-1 outline-none cursor-pointer"
              value={task.status}
              onChange={(e) => onUpdateStatus(task.id, e.target.value as TaskStatus)}
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Arbeit</option>
              <option value="done">Erledigt</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default TaskManager;
