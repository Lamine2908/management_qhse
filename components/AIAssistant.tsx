import React, { useState } from 'react';
import { Bot, Send, Sparkles, Loader2 } from 'lucide-react';
import { analyzeIncident, suggestRiskControls } from '../services/geminiService';

const AIAssistant: React.FC = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'incident' | 'risk'>('incident');

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResponse('');
    
    let result = '';
    if (mode === 'incident') {
      result = await analyzeIncident(input, 'Sécurité Générale');
    } else {
      result = await suggestRiskControls(input);
    }
    
    setResponse(result);
    setLoading(false);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
        <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Bot className="w-6 h-6 text-indigo-600" />
            Assistant Sécurité IA
            </h2>
            <p className="text-sm text-slate-500">Propulsé par Gemini pour l'analyse avancée.</p>
        </div>
        <div className="flex bg-white p-1 rounded-lg border border-slate-200">
            <button 
                onClick={() => setMode('incident')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${mode === 'incident' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
            >
                Analyse Incident
            </button>
            <button 
                onClick={() => setMode('risk')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${mode === 'risk' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
            >
                Contrôle Risque
            </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Welcome Message */}
        {response === '' && !loading && (
            <div className="text-center py-12 text-slate-400">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-indigo-200" />
                <h3 className="text-lg font-medium text-slate-600">Comment puis-je vous aider ?</h3>
                <p className="max-w-md mx-auto mt-2">
                    Je peux analyser les causes racines d'un incident ou suggérer des mesures de prévention pour un danger spécifique.
                </p>
            </div>
        )}

        {/* Response Area */}
        {loading && (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                <span className="ml-3 text-slate-600 font-medium">Analyse en cours...</span>
            </div>
        )}

        {response && (
             <div className="bg-indigo-50/50 p-6 rounded-xl border border-indigo-100">
                <div className="prose prose-slate max-w-none prose-headings:text-indigo-900 prose-p:text-slate-700">
                    <div className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                        {response}
                    </div>
                </div>
             </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-200 bg-white">
        <div className="relative">
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === 'incident' ? "Collez la description de l'incident ici..." : "Décrivez un danger (ex: Travail en hauteur sans harnais)..."}
                className="w-full pl-4 pr-14 py-4 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none h-24 text-sm"
            />
            <button 
                onClick={handleAnalyze}
                disabled={loading || !input.trim()}
                className="absolute right-3 bottom-3 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <Send className="w-5 h-5" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;