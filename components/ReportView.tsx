import React, { useState } from 'react';
import { FileText, Loader2, Download, Printer, Mail, Check, Archive, Trash2, Eye, Plus, History } from 'lucide-react';
import { generateExecutiveReport } from '../services/geminiService';
import { Incident, Risk, SavedReport } from '../types';

interface ReportViewProps {
  incidents: Incident[];
  risks: Risk[];
  savedReports: SavedReport[];
  onSaveReport: (report: SavedReport) => void;
  onUpdateReport: (report: SavedReport) => void; // Pour l'historique
  onDeleteReport: (id: string) => void;
  onArchiveReport: (id: string) => void;
}

const ReportView: React.FC<ReportViewProps> = ({ 
  incidents, 
  risks, 
  savedReports, 
  onSaveReport, 
  onUpdateReport,
  onDeleteReport, 
  onArchiveReport 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedReport, setSelectedReport] = useState<SavedReport | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');

  // Fonction pour nettoyer le markdown pour le "Modèle Simple"
  const cleanMarkdown = (text: string) => {
    return text
      .replace(/[#*]/g, '') // Enlève # et *
      .replace(/\n\n/g, '\n') // Réduit les sauts de ligne
      .replace(/- /g, '• '); // Remplace les tirets par des puces
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    const stats = {
      incidents: incidents.filter(i => !i.isArchived).length,
      openIncidents: incidents.filter(i => i.status !== 'Clôturé' && !i.isArchived).length,
      criticalRisks: risks.filter(r => r.riskScore >= 15 && !r.isArchived).length,
      compliance: 94
    };

    const rawText = await generateExecutiveReport(stats);
    const cleanText = cleanMarkdown(rawText);
    
    const newReport: SavedReport = {
        id: `RPT-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
        title: `Rapport QHSE - ${new Date().toLocaleDateString()}`,
        date: new Date().toISOString().split('T')[0],
        content: cleanText,
        isArchived: false,
        history: [{ id: Math.random().toString(), type: 'print', date: new Date().toISOString(), details: 'Création du rapport' }]
    };

    onSaveReport(newReport);
    setSelectedReport(newReport);
    setViewMode('detail');
    setIsGenerating(false);
  };

  const logAction = (type: 'print' | 'email') => {
      if (!selectedReport) return;
      const newAction = {
          id: Math.random().toString(),
          type,
          date: new Date().toISOString(),
          details: type === 'print' ? 'Impression PDF' : 'Envoi par email au CODIR'
      };
      const updatedReport = {
          ...selectedReport,
          history: [...(selectedReport.history || []), newAction]
      };
      onUpdateReport(updatedReport);
      setSelectedReport(updatedReport);
  };

  const handlePrint = () => {
      window.print();
      logAction('print');
  };

  const handleEmail = () => {
     setEmailSent(true);
     logAction('email');
     setTimeout(() => setEmailSent(false), 3000);
  };

  const displayedReports = savedReports.filter(r => showArchived ? r.isArchived : !r.isArchived);

  return (
    <div className="space-y-6">
      
      {/* View Switcher / Header */}
      {viewMode === 'list' && (
        <>
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Gestion des Rapports</h2>
                    <p className="text-slate-500">Historique des analyses et génération automatique.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setShowArchived(!showArchived)} className={`px-4 py-2 rounded-lg flex items-center gap-2 border ${showArchived ? 'bg-slate-800 text-white' : 'bg-white'}`}>
                        <Archive className="w-4 h-4" /> {showArchived ? 'Voir Actifs' : 'Archives'}
                    </button>
                    <button onClick={handleGenerate} disabled={isGenerating} className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 flex items-center gap-2">
                        {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />} Générer
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Titre</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Actions Récents</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {displayedReports.map(report => (
                            <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-mono text-slate-500">{report.id}</td>
                                <td className="px-6 py-4 font-medium text-slate-800">{report.title}</td>
                                <td className="px-6 py-4 text-slate-500">{new Date(report.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-xs text-slate-400">
                                    {report.history?.length > 0 ? report.history[report.history.length - 1].details : 'Aucune'}
                                </td>
                                <td className="px-6 py-4 flex justify-end gap-2">
                                    <button onClick={() => { setSelectedReport(report); setViewMode('detail'); }} className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded"><Eye className="w-4 h-4" /></button>
                                    <button onClick={() => onArchiveReport(report.id)} className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded"><Archive className="w-4 h-4" /></button>
                                    <button onClick={() => { if(window.confirm('Supprimer définitivement ?')) onDeleteReport(report.id) }} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
      )}

      {/* Detail View */}
      {viewMode === 'detail' && selectedReport && (
        <div className="animate-fade-in space-y-4">
           <div className="flex items-center justify-between print:hidden">
              <button onClick={() => setViewMode('list')} className="text-slate-500 hover:text-slate-700 flex items-center gap-1 text-sm font-medium">
                  &larr; Retour à la liste
              </button>
              <h2 className="text-xl font-bold text-slate-800">{selectedReport.title}</h2>
           </div>

           <div className="flex flex-wrap justify-between gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-sm print:hidden">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                 <History className="w-4 h-4" />
                 <span>Historique: {selectedReport.history?.length || 0} actions</span>
              </div>
              <div className="flex gap-2">
                <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg border border-slate-200 text-sm font-medium">
                    <Printer className="w-4 h-4" /> Imprimer
                </button>
                <button onClick={handleEmail} className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors ${emailSent ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                    {emailSent ? <Check className="w-4 h-4" /> : <Mail className="w-4 h-4" />} {emailSent ? 'Envoyé' : 'Email CODIR'}
                </button>
              </div>
           </div>
           
           <div id="print-area" className="bg-white rounded-none shadow-lg border border-slate-200 p-10 md:p-16 min-h-[800px] max-w-4xl mx-auto print:shadow-none print:border-none print:w-full print:max-w-none">
              <div className="flex justify-between items-end border-b-4 border-slate-900 pb-6 mb-8">
                <div>
                   <h1 className="text-3xl font-bold text-slate-900">RAPPORT EXÉCUTIF QHSE</h1>
                   <p className="text-slate-500 mt-2 font-mono">Date: {new Date(selectedReport.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                   <div className="text-emerald-600 font-bold text-lg">SENTINELLE</div>
                   <div className="text-xs text-slate-400">Système de Management</div>
                </div>
              </div>

              <div className="prose prose-slate max-w-none text-justify font-serif text-lg leading-relaxed text-slate-800 whitespace-pre-wrap">
                  {selectedReport.content}
              </div>

              <div className="mt-16 pt-8 border-t border-slate-100 grid grid-cols-2 gap-8 print:break-inside-avoid">
                 <div>
                    <p className="text-xs text-slate-400 uppercase font-bold mb-12">Préparé par</p>
                    <div className="h-px bg-slate-300 w-full"></div>
                    <p className="mt-2 font-medium">Direction QHSE</p>
                 </div>
                 <div>
                    <p className="text-xs text-slate-400 uppercase font-bold mb-12">Validé par</p>
                    <div className="h-px bg-slate-300 w-full"></div>
                    <p className="mt-2 font-medium">Direction Générale</p>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ReportView;