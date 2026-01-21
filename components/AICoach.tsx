
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';
import { storage } from '../services/storage';

const AICoach: React.FC = () => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    const tasks = storage.getTasks();
    const result = await geminiService.analyzeWorkload(tasks);
    setAnalysis(result || "Konnte keine Analyse erstellen.");
    setLoading(false);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <header className="text-center">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
           <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold">Dein Werkaholic AI Coach</h2>
        <p className="text-slate-400 mt-2">Lass deine Arbeit von Gemini analysieren und erhalte Tipps zur Effizienzsteigerung.</p>
      </header>

      <div className="bg-slate-800 border border-slate-700 p-8 rounded-3xl shadow-xl relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        {!analysis && !loading ? (
          <div className="text-center py-12 relative z-10">
            <p className="text-lg text-slate-300 mb-8">Bereit für eine Tiefenanalyse deiner {storage.getTasks().length} Aufgaben?</p>
            <button 
              onClick={handleAnalyze}
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-blue-900/40"
            >
              Analyse starten
            </button>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-6">
            <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-slate-400 animate-pulse">Gemini analysiert deine Daten...</p>
          </div>
        ) : (
          <div className="relative z-10 space-y-6">
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-xl font-bold flex items-center space-x-2">
                <span className="text-blue-500">✦</span>
                <span>AI Insights</span>
              </h3>
              <button onClick={() => setAnalysis(null)} className="text-xs text-slate-400 hover:text-white">Neu berechnen</button>
            </div>
            
            <div className="prose prose-invert max-w-none bg-slate-900/50 p-6 rounded-2xl border border-slate-700">
              <div className="text-slate-200 leading-relaxed whitespace-pre-wrap">
                {analysis}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <TipCard title="Fokus" desc="Konzentriere dich auf 'Prio: Hoch' Tasks." icon="🎯" />
              <TipCard title="Zeit" desc="Verringere Meetings am Vormittag." icon="⏰" />
              <TipCard title="Batching" desc="Gruppiere kleine Aufgaben zusammen." icon="📦" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const TipCard: React.FC<{ title: string; desc: string; icon: string }> = ({ title, desc, icon }) => (
  <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600">
    <div className="text-2xl mb-2">{icon}</div>
    <h4 className="font-bold text-sm">{title}</h4>
    <p className="text-xs text-slate-400">{desc}</p>
  </div>
);

export default AICoach;
