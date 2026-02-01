import React, { useState } from 'react';
import { Training } from '../types';
import { GraduationCap, Calendar, Users, Plus, Archive, Edit3, Trash2, X } from 'lucide-react';

interface TrainingViewProps {
  trainings: Training[];
  onAddTraining: (training: Training) => void;
  onUpdateTraining: (training: Training) => void;
  onDeleteTraining: (id: string) => void;
  onArchiveTraining: (id: string) => void;
}

const TrainingView: React.FC<TrainingViewProps> = ({ trainings, onAddTraining, onUpdateTraining, onDeleteTraining, onArchiveTraining }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const initialFormState: Training = {
    id: '',
    title: '',
    date: new Date().toISOString().split('T')[0],
    attendees: 0,
    status: 'Planifié',
    instructor: '',
    description: '',
    isArchived: false
  };

  const [formData, setFormData] = useState<Training>(initialFormState);

  const handleOpenNew = () => {
    setFormData(initialFormState);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (training: Training) => {
    setFormData(training);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      onUpdateTraining(formData);
    } else {
      const newTraining = {
        ...formData,
        id: `TRN-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`
      };
      onAddTraining(newTraining);
    }
    setIsModalOpen(false);
  };

  const displayedTrainings = trainings.filter(t => showArchived ? t.isArchived : !t.isArchived);

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
           <div>
               <h2 className="text-2xl font-bold text-slate-800">Suivi des Formations</h2>
               <p className="text-slate-500">Planification et historique des formations sécurité.</p>
           </div>
           <div className="flex gap-2">
                <button 
                    onClick={() => setShowArchived(!showArchived)}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all border ${showArchived ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-300'}`}
                >
                    <Archive className="w-4 h-4" />
                    {showArchived ? 'Voir Actifs' : 'Archives'}
                </button>
                <button 
                    onClick={handleOpenNew}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Ajouter Formation
                </button>
           </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedTrainings.map(training => (
             <div key={training.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col group relative overflow-hidden">
                <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleOpenEdit(training)} className="p-1.5 bg-slate-100 hover:bg-blue-100 text-slate-500 hover:text-blue-600 rounded"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => onArchiveTraining(training.id)} className="p-1.5 bg-slate-100 hover:bg-amber-100 text-slate-500 hover:text-amber-600 rounded"><Archive className="w-4 h-4" /></button>
                    <button onClick={() => {if(window.confirm('Supprimer ?')) onDeleteTraining(training.id)}} className="p-1.5 bg-slate-100 hover:bg-red-100 text-slate-500 hover:text-red-600 rounded"><Trash2 className="w-4 h-4" /></button>
                </div>

                <div className="flex justify-between items-start mb-4">
                   <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                      <GraduationCap className="w-6 h-6" />
                   </div>
                   <span className={`px-2 py-1 rounded text-xs font-bold border ${training.status === 'Complété' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : training.status === 'Annulé' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                      {training.status}
                   </span>
                </div>
                
                <h3 className="text-lg font-bold text-slate-800 mb-2">{training.title}</h3>
                <p className="text-sm text-slate-500 mb-4 line-clamp-2">{training.instructor} - {training.description || 'Pas de description'}</p>
                
                <div className="mt-auto pt-4 border-t border-slate-50 grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                       <Calendar className="w-4 h-4 text-slate-400" />
                       {new Date(training.date).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                       <Users className="w-4 h-4 text-slate-400" />
                       {training.attendees} participants
                    </div>
                </div>
             </div>
          ))}
          {displayedTrainings.length === 0 && (
             <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-xl border border-dashed border-slate-300">
                 <p>Aucune formation {showArchived ? 'archivée' : 'planifiée'}.</p>
             </div>
          )}
       </div>

       {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg animate-fade-in">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                 <h3 className="text-xl font-bold text-slate-800">{isEditing ? 'Modifier Formation' : 'Nouvelle Formation'}</h3>
                 <button onClick={() => setIsModalOpen(false)}><X className="w-6 h-6 text-slate-400" /></button>
             </div>
             <form onSubmit={handleSubmit} className="p-6 space-y-4">
                 <div>
                    <label className="block text-sm font-medium mb-1">Titre</label>
                    <input required className="w-full border rounded-lg p-2" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium mb-1">Date</label>
                        <input type="date" required className="w-full border rounded-lg p-2" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                     </div>
                     <div>
                        <label className="block text-sm font-medium mb-1">Participants</label>
                        <input type="number" required className="w-full border rounded-lg p-2" value={formData.attendees} onChange={e => setFormData({...formData, attendees: parseInt(e.target.value)})} />
                     </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Instructeur</label>
                        <input required className="w-full border rounded-lg p-2" value={formData.instructor} onChange={e => setFormData({...formData, instructor: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Statut</label>
                        <select className="w-full border rounded-lg p-2" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}>
                            <option value="Planifié">Planifié</option>
                            <option value="Complété">Complété</option>
                            <option value="Annulé">Annulé</option>
                        </select>
                    </div>
                 </div>
                 <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea className="w-full border rounded-lg p-2" rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                 </div>
                 <div className="flex justify-end gap-2 pt-4">
                     <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Annuler</button>
                     <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Enregistrer</button>
                 </div>
             </form>
          </div>
        </div>
       )}
    </div>
  );
};

export default TrainingView;