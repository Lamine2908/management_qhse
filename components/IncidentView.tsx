import React, { useState } from 'react';
import { Incident, IncidentType, Severity, Status } from '../types';
import { Plus, Search, Filter, Eye, AlertCircle, Edit3, Trash2, Archive } from 'lucide-react';

interface IncidentViewProps {
  incidents: Incident[];
  onAddIncident: (incident: Incident) => void;
  onUpdateIncident: (incident: Incident) => void;
  onDeleteIncident: (id: string) => void;
  onArchiveIncident: (id: string) => void;
}

const IncidentView: React.FC<IncidentViewProps> = ({ 
  incidents, 
  onAddIncident, 
  onUpdateIncident,
  onDeleteIncident,
  onArchiveIncident 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('Tous');
  const [showArchived, setShowArchived] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const initialFormState: Partial<Incident> = {
    type: IncidentType.NEAR_MISS,
    severity: Severity.LOW,
    status: Status.OPEN,
    title: '',
    description: '',
    location: ''
  };

  const [formData, setFormData] = useState<Partial<Incident>>(initialFormState);

  const handleOpenNew = () => {
    setFormData(initialFormState);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (incident: Incident) => {
    setFormData(incident);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.description) {
      if (isEditing && formData.id) {
          // Update existing
          onUpdateIncident(formData as Incident);
      } else {
          // Create new
          const newIncident: Incident = {
            id: `INC-${Math.floor(Math.random() * 10000)}`,
            title: formData.title,
            date: new Date().toISOString().split('T')[0],
            type: formData.type as IncidentType,
            severity: formData.severity as Severity,
            status: Status.OPEN,
            location: formData.location || 'Inconnu',
            description: formData.description,
            correctiveActions: '',
            isArchived: false
          };
          onAddIncident(newIncident);
      }
      setIsModalOpen(false);
      setFormData(initialFormState);
      setIsEditing(false);
    }
  };

  const getSeverityColor = (sev: Severity) => {
    switch (sev) {
      case Severity.CRITICAL: return 'bg-red-100 text-red-800 border-red-200';
      case Severity.HIGH: return 'bg-orange-100 text-orange-800 border-orange-200';
      case Severity.MEDIUM: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case Severity.LOW: return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const displayedIncidents = incidents.filter(i => showArchived ? i.isArchived : !i.isArchived);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gestion des Incidents</h2>
          <p className="text-slate-500">Suivi et gestion des accidents et presque-accidents.</p>
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
            Signaler un Incident
            </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50/50">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-500" />
            <select 
              className="border border-slate-300 rounded-lg text-sm px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="Tous">Tous les statuts</option>
              <option value="Ouvert">Ouvert</option>
              <option value="Clôturé">Clôturé</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Titre</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Sévérité</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedIncidents.map((incident) => (
                <tr key={incident.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-slate-500">{incident.id}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{incident.title}</td>
                  <td className="px-6 py-4 text-slate-500">{incident.date}</td>
                  <td className="px-6 py-4">
                     <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs border border-slate-200">
                       {incident.type}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getSeverityColor(incident.severity)}`}>
                      {incident.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${incident.status === Status.CLOSED ? 'bg-slate-400' : 'bg-emerald-500 animate-pulse'}`}></div>
                        <span className="text-slate-700">{incident.status}</span>
                     </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                        <button onClick={() => handleOpenEdit(incident)} className="p-1 text-slate-400 hover:text-blue-600 rounded transition-colors" title="Modifier">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => onArchiveIncident(incident.id)} className="p-1 text-slate-400 hover:text-amber-600 rounded transition-colors" title={incident.isArchived ? "Désarchiver" : "Archiver"}>
                          <Archive className="w-4 h-4" />
                        </button>
                        <button onClick={() => { if(window.confirm('Supprimer ?')) onDeleteIncident(incident.id) }} className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors" title="Supprimer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {displayedIncidents.length === 0 && (
            <div className="p-12 text-center text-slate-400">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>Aucun incident {showArchived ? 'archivé' : 'actif'} trouvé.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 sticky top-0">
              <h3 className="text-xl font-bold text-slate-800">{isEditing ? "Modifier l'Incident" : "Signalement d'Incident"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Titre de l'incident *</label>
                  <input 
                    required
                    type="text" 
                    className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    value={formData.title || ''}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    placeholder="ex: Déversement produit chimique Labo 2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Lieu *</label>
                  <input 
                    required
                    type="text" 
                    className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={formData.location || ''}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                  <select 
                    className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value as IncidentType})}
                  >
                    {Object.values(IncidentType).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Sévérité</label>
                  <select 
                    className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={formData.severity}
                    onChange={e => setFormData({...formData, severity: e.target.value as Severity})}
                  >
                    {Object.values(Severity).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description Détaillée *</label>
                <textarea 
                  required
                  rows={4}
                  className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={formData.description || ''}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="Décrivez les faits..."
                ></textarea>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-sm transition-colors"
                >
                  {isEditing ? "Mettre à jour" : "Soumettre"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidentView;