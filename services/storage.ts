
import { Task, Project } from '../types';
import { MOCK_PROJECTS } from '../constants';

const STORAGE_KEY_TASKS = 'werkaholic_tasks';
const STORAGE_KEY_PROJECTS = 'werkaholic_projects';

export const storage = {
  getTasks: (): Task[] => {
    const saved = localStorage.getItem(STORAGE_KEY_TASKS);
    return saved ? JSON.parse(saved) : [];
  },
  saveTasks: (tasks: Task[]): void => {
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
  },
  getProjects: (): Project[] => {
    const saved = localStorage.getItem(STORAGE_KEY_PROJECTS);
    return saved ? JSON.parse(saved) : MOCK_PROJECTS;
  },
  saveProjects: (projects: Project[]): void => {
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
  },
  addTask: (task: Task) => {
    const tasks = storage.getTasks();
    storage.saveTasks([...tasks, task]);
  },
  updateTask: (updatedTask: Task) => {
    const tasks = storage.getTasks();
    storage.saveTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
  },
  deleteTask: (id: string) => {
    const tasks = storage.getTasks();
    storage.saveTasks(tasks.filter(t => t.id !== id));
  }
};
