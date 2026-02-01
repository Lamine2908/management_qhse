import React, { useState } from 'react';
import { WorkPermit, PermitType, PermitStatus } from '../types';
import { Plus, Search, Filter, FileText, CheckCircle, Calendar, Printer, X, PenTool, Trash2, Archive, Edit3, Eye } from 'lucide-react';
import SignaturePad from './SignaturePad';

interface PermitViewProps {
  permits: WorkPermit[];
  onAddPermit: (permit: WorkPermit) => void;
  onUpdatePermit: (permit: WorkPermit) => void;
  onDeletePermit: (id: string) => void;
  onArchivePermit: (id: string) => void;
}

// Données statiques pour les cases à cocher
const WORK_NATURE_OPTIONS = [
  "Soudure / Meulage / Découpage",
  "Travaux en Hauteur / Echafaudage",
  "Travaux Électriques",
  "Manutention / Levage",
  "Nettoyage Industriel",
  "Travaux dans Espace Confiné",
  "Génie Civil / Terrassement",
  "Mécanique / Hydraulique",
  "Désamiantage / Calorifuge",
  "Peinture / Sablage"
];

const DISPOSITIONS_OPTIONS = [
  "Balisage de la zone",
  "Consignation Électrique (Cadenas)",
  "Consignation Fluides/Mécanique",
  "Extincteur à proximité immédiate",
  "Protection contre les étincelles (Bâches)",
  "Test d'atmosphère (Gaz/O2)",
  "Ventilation forcée",
  "Surveillant de trou d'homme",
  "Ligne de vie installée"
];

const EPI_OPTIONS = [
  "Casque de sécurité",
  "Chaussures de sécurité",
  "Lunettes de protection / Visière",
  "Gants adaptés (Chaud/Coupure/Chimique)",
  "Harnais de sécurité (Double longe)",
  "Protections auditives",
  "Masque respiratoire (FFP3 / Cartouche)",
  "Vêtements de travail couvrants"
];

const TOOLS_OPTIONS = [
  "Poste à souder / Oxycoupage",
  "Meuleuse / Disqueuse",
  "Perceuse / Marteau piqueur",
  "Grue / Chariot élévateur",
  "Echafaudage certifié",
  "Echelle / Escabeau",
  "Outillage à main",
  "Groupe électrogène / Compresseur"
];

const PermitView: React.FC<PermitViewProps> = ({ permits, onAddPermit, onUpdatePermit, onDeletePermit, onArchivePermit }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const initialFormState: WorkPermit = {
    id: '',
    type: PermitType.GENERAL,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    startTime: '08:00',
    endTime: '17:00',
    location: '',
    description: '',
    requester: { lastName: '', firstName: '', phone: '', company: 'SOCOCIM' },
    workNature: [],
    precautions: { dispositions: [], epi: [], equipments: [] },
    status: PermitStatus.DRAFT,
    isArchived: false,
    signatures: {
      requester: { nom: '', prenom: '', matricule: '', date: '', visa: false, service: '', signatureData: '' },
      productionLead: { nom: '', prenom: '', matricule: '', date: '', visa: false, service: 'Production', signatureData: '' },
      safety: { nom: '', prenom: '', matricule: '', date: '', visa: false, service: 'HSE', signatureData: '' },
      executor: { nom: '', prenom: '', matricule: '', date: '', visa: false, raisonSociale: '', signatureData: '' }
    }
  };

  const [formData, setFormData] = useState<WorkPermit>(initialFormState);

  const toggleCheckbox = (category: 'workNature' | 'dispositions' | 'epi' | 'equipments', value: string) => {
    if (category === 'workNature') {
      setFormData(prev => ({
        ...prev,
        workNature: prev.workNature.includes(value) 
          ? prev.workNature.filter(i => i !== value) 
          : [...prev.workNature, value]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        precautions: {
          ...prev.precautions,
          [category]: prev.precautions[category].includes(value)
            ? prev.precautions[category].filter(i => i !== value)
            : [...prev.precautions[category], value]
        }
      }));
    }
  };

  const handleOpenNew = () => {
    setFormData(initialFormState);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (permit: WorkPermit) => {
    setFormData(permit);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      onUpdatePermit(formData);
    } else {
      const newPermit = {
        ...formData,
        id: `PERM-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
        status: PermitStatus.ACTIVE
      };
      onAddPermit(newPermit);
    }
    setIsModalOpen(false);
    setFormData(initialFormState);
    setIsEditing(false);
  };

  const displayedPermits = permits.filter(p => showArchived ? p.isArchived : !p.isArchived);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Permis de Travail SOCOCIM</h2>
          <p className="text-slate-500">Gestion des autorisations et signatures électroniques.</p>
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
                Nouveau Permis
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedPermits.map((permit) => (
          <div key={permit.id} className="bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow overflow-hidden flex flex-col group">
             <div className="p-5 border-b border-slate-50 flex justify-between items-start">
               <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded">{permit.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide border ${permit.status === PermitStatus.ACTIVE ? 'bg-green-50 text-green-700 border-green-100' : 'bg-slate-50 text-slate-600 border-slate-100'}`}>
                      {permit.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-lg line-clamp-1">{permit.type}</h3>
                  <p className="text-sm text-slate-500 font-medium">{permit.signatures.executor.raisonSociale || permit.requester.company}</p>
               </div>
               <div className="flex gap-1">
                  <button onClick={() => handleOpenEdit(permit)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Modifier">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => onArchivePermit(permit.id)} className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors" title={permit.isArchived ? "Désarchiver" : "Archiver"}>
                    <Archive className="w-4 h-4" />
                  </button>
                  <button onClick={() => { if(window.confirm('Supprimer ce permis ?')) onDeletePermit(permit.id) }} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Supprimer">
                    <Trash2 className="w-4 h-4" />
                  </button>
               </div>
             </div>
             
             <div className="p-5 space-y-3 flex-1">
                <div className="flex items-start gap-2 text-sm text-slate-600">
                   <div className="mt-0.5 min-w-[16px]"><FileText className="w-4 h-4 text-slate-400" /></div>
                   <p className="line-clamp-2">{permit.description}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                   <div className="min-w-[16px]"><Calendar className="w-4 h-4 text-slate-400" /></div>
                   <span>Du <b>{new Date(permit.startDate).toLocaleDateString()}</b> au <b>{new Date(permit.endDate).toLocaleDateString()}</b></span>
                </div>
             </div>

             <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                <div className="flex -space-x-2">
                   {[permit.signatures.requester, permit.signatures.safety].map((sig, i) => (
                      <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-white overflow-hidden bg-white ${sig.signatureData ? 'border-emerald-500' : 'border-slate-300'}`} title={sig.nom}>
                         {sig.signatureData ? (
                            <img src={sig.signatureData} className="w-full h-full object-cover" alt="Sig" />
                         ) : (
                            sig.nom ? sig.nom.charAt(0) : '?'
                         )}
                      </div>
                   ))}
                </div>
                <button className="text-slate-500 hover:text-emerald-600 transition-colors flex items-center gap-2 text-sm">
                   <Printer className="w-4 h-4" />
                   Imprimer
                </button>
             </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-2 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-none sm:rounded-xl shadow-2xl w-full max-w-5xl my-auto animate-fade-in relative">
            
            <div className="sticky top-0 z-10 bg-slate-900 text-white p-4 sm:px-8 flex justify-between items-center shadow-md">
              <div>
                 <h2 className="text-xl font-bold uppercase tracking-wider">{isEditing ? "Modifier Permis" : "Nouveau Permis"}</h2>
                 <p className="text-xs text-slate-400">Formulaire Sécurité SOCOCIM</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-8 h-8" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-8 space-y-8 bg-slate-50">
              {/* SECTIONS 1, 2, 3 (Simplifiées ici, identiques au code précédent, je garde la structure) */}
              
              {/* SECTION 1: Identification */}
               <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                 <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2 flex items-center gap-2">
                    <span className="bg-emerald-600 text-white w-6 h-6 rounded flex items-center justify-center text-sm">1</span>
                    Identification
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select className="border p-2 rounded" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as PermitType})}>
                         {Object.values(PermitType).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <input className="border p-2 rounded" placeholder="Lieu" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                    <textarea className="border p-2 rounded md:col-span-2" placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                 </div>
                 <div className="grid grid-cols-4 gap-2 mt-2">
                    <input type="date" className="border p-2 rounded" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                    <input type="time" className="border p-2 rounded" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} />
                    <input type="date" className="border p-2 rounded" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
                    <input type="time" className="border p-2 rounded" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} />
                 </div>
               </div>

               {/* SECTION 2: Demandeur (Simplifiée) */}
               <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2 flex items-center gap-2"><span className="bg-emerald-600 text-white w-6 h-6 rounded flex items-center justify-center text-sm">2</span>Demandeur</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <input className="border p-2 rounded" placeholder="Nom" value={formData.requester.lastName} onChange={e => setFormData({...formData, requester: {...formData.requester, lastName: e.target.value}})} />
                        <input className="border p-2 rounded" placeholder="Entreprise" value={formData.requester.company} onChange={e => setFormData({...formData, requester: {...formData.requester, company: e.target.value}})} />
                    </div>
               </div>

              {/* SECTION 3: Checklists (Gardée) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 h-full">
                    <h3 className="font-bold text-slate-800 mb-3 border-b pb-1">Nature des Travaux</h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                       {WORK_NATURE_OPTIONS.map(opt => (
                         <label key={opt} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1 rounded">
                            <input type="checkbox" className="w-4 h-4 text-emerald-600 rounded" checked={formData.workNature.includes(opt)} onChange={() => toggleCheckbox('workNature', opt)} />
                            <span className="text-sm text-slate-700">{opt}</span>
                         </label>
                       ))}
                    </div>
                 </div>
                 <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 h-full">
                    <h3 className="font-bold text-slate-800 mb-3 border-b pb-1">EPI</h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                       {EPI_OPTIONS.map(opt => (
                         <label key={opt} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1 rounded">
                            <input type="checkbox" className="w-4 h-4 text-emerald-600 rounded" checked={formData.precautions.epi.includes(opt)} onChange={() => toggleCheckbox('epi', opt)} />
                            <span className="text-sm text-slate-700">{opt}</span>
                         </label>
                       ))}
                    </div>
                 </div>
              </div>

              {/* SECTION 4: SIGNATURES ÉLECTRONIQUES */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                  <h3 className="text-lg font-bold text-slate-800 mb-6 border-b pb-2 flex items-center gap-2">
                    <span className="bg-emerald-600 text-white w-6 h-6 rounded flex items-center justify-center text-sm">4</span>
                    Signatures Électroniques
                 </h3>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Demandeur */}
                    <div className="border border-slate-200 rounded p-4 bg-slate-50 space-y-3">
                        <div className="text-xs font-bold uppercase text-slate-500 border-b pb-1">1. Demandeur</div>
                        <input className="w-full p-1 border rounded text-sm" placeholder="Nom Complet" value={formData.signatures.requester.nom} onChange={e => setFormData({...formData, signatures: {...formData.signatures, requester: {...formData.signatures.requester, nom: e.target.value}}})} />
                        <SignaturePad 
                            label="Signature Demandeur"
                            initialData={formData.signatures.requester.signatureData}
                            onSave={(data) => setFormData({...formData, signatures: {...formData.signatures, requester: {...formData.signatures.requester, signatureData: data, visa: !!data}}})}
                        />
                    </div>

                    {/* Chef de Quart */}
                    <div className="border border-slate-200 rounded p-4 bg-slate-50 space-y-3">
                        <div className="text-xs font-bold uppercase text-slate-500 border-b pb-1">2. Chef de Quart</div>
                        <input className="w-full p-1 border rounded text-sm" placeholder="Nom Complet" value={formData.signatures.productionLead.nom} onChange={e => setFormData({...formData, signatures: {...formData.signatures, productionLead: {...formData.signatures.productionLead, nom: e.target.value}}})} />
                        <SignaturePad 
                            label="Signature Chef de Quart"
                            initialData={formData.signatures.productionLead.signatureData}
                            onSave={(data) => setFormData({...formData, signatures: {...formData.signatures, productionLead: {...formData.signatures.productionLead, signatureData: data, visa: !!data}}})}
                        />
                    </div>

                    {/* Sécurité */}
                    <div className="border border-slate-200 rounded p-4 bg-slate-50 space-y-3">
                        <div className="text-xs font-bold uppercase text-slate-500 border-b pb-1">3. Sécurité (HSE)</div>
                        <input className="w-full p-1 border rounded text-sm" placeholder="Nom Complet" value={formData.signatures.safety.nom} onChange={e => setFormData({...formData, signatures: {...formData.signatures, safety: {...formData.signatures.safety, nom: e.target.value}}})} />
                        <SignaturePad 
                            label="Signature HSE"
                            initialData={formData.signatures.safety.signatureData}
                            onSave={(data) => setFormData({...formData, signatures: {...formData.signatures, safety: {...formData.signatures.safety, signatureData: data, visa: !!data}}})}
                        />
                    </div>

                    {/* Exécutant */}
                    <div className="border border-slate-200 rounded p-4 bg-slate-50 space-y-3">
                        <div className="text-xs font-bold uppercase text-slate-500 border-b pb-1">4. Exécutant</div>
                        <input className="w-full p-1 border rounded text-sm" placeholder="Nom Complet" value={formData.signatures.executor.nom} onChange={e => setFormData({...formData, signatures: {...formData.signatures, executor: {...formData.signatures.executor, nom: e.target.value}}})} />
                        <SignaturePad 
                            label="Signature Exécutant"
                            initialData={formData.signatures.executor.signatureData}
                            onSave={(data) => setFormData({...formData, signatures: {...formData.signatures, executor: {...formData.signatures.executor, signatureData: data, visa: !!data}}})}
                        />
                    </div>
                 </div>
              </div>

              <div className="sticky bottom-0 bg-slate-50 pt-4 pb-2 border-t border-slate-200 flex justify-end gap-3 z-10">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-slate-600 hover:bg-white bg-slate-200 rounded-lg font-bold">Annuler</button>
                <button type="submit" className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg shadow-lg flex items-center gap-2"><PenTool className="w-5 h-5" /> Valider</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PermitView;