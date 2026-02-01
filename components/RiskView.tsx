import React from 'react';
import { Risk } from '../types';
import { ShieldAlert, Trash2, Archive, Edit3 } from 'lucide-react';

interface RiskViewProps {
  risks: Risk[];
  onAddRisk: (risk: Risk) => void;
  onUpdateRisk: (risk: Risk) => void;
  onDeleteRisk: (id: string) => void;
  onArchiveRisk: (id: string) => void;
}

const RiskView: React.FC<RiskViewProps> = ({ risks, onDeleteRisk, onArchiveRisk }) => {
  const [showArchived, setShowArchived] = React.useState(false);

  const getRiskLevel = (score: number) => {
    if (score >= 15) return { label: 'CRITIQUE', color: 'bg-red-500' };
    if (score >= 10) return { label: 'ÉLEVÉ', color: 'bg-orange-500' };
    if (score >= 5) return { label: 'MOYEN', color: 'bg-yellow-500' };
    return { label: 'FAIBLE', color: 'bg-emerald-500' };
  };

  const displayedRisks = risks.filter(r => showArchived ? r.isArchived : !r.isArchived);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">Évaluation des Risques</h2>
           <p className="text-slate-500">Document Unique et gestion des dangers.</p>
        </div>
        <button 
            onClick={() => setShowArchived(!showArchived)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all border ${showArchived ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-300'}`}
        >
            <Archive className="w-4 h-4" />
            {showArchived ? 'Voir Actifs' : 'Archives'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Matrix Visualization */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-slate-500" />
            Matrice de Risque
          </h3>
          <div className="grid grid-cols-5 gap-1 text-xs text-white text-center font-bold aspect-square">
             {/* Simple 5x5 Matrix Logic for Visuals */}
             {[5,4,3,2,1].map(prob => (
                [1,2,3,4,5].map(imp => {
                   const score = prob * imp;
                   const level = getRiskLevel(score);
                   return (
                      <div key={`${prob}-${imp}`} className={`${level.color} opacity-80 hover:opacity-100 transition-opacity rounded-sm flex items-center justify-center cursor-help`} title={`Prob: ${prob}, Imp: ${imp} = ${score}`}>
                         {score}
                      </div>
                   )
                })
             ))}
          </div>
          <div className="mt-4 flex justify-between text-xs text-slate-500">
             <span>Impact Faible</span>
             <span>Impact Élevé</span>
          </div>
          <div className="text-center text-xs text-slate-500 font-medium mt-1">Conséquence &rarr;</div>
        </div>

        {/* Risk List */}
        <div className="lg:col-span-2 space-y-4">
           {displayedRisks.map(risk => {
             const level = getRiskLevel(risk.riskScore);
             return (
               <div key={risk.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                 <div className={`absolute top-0 left-0 w-1.5 h-full ${level.color}`}></div>
                 
                 {/* Actions */}
                 <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onArchiveRisk(risk.id)} className="p-1.5 bg-slate-100 text-slate-500 hover:text-amber-600 rounded">
                        <Archive className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDeleteRisk(risk.id)} className="p-1.5 bg-slate-100 text-slate-500 hover:text-red-600 rounded">
                        <Trash2 className="w-4 h-4" />
                    </button>
                 </div>

                 <div className="pl-4">
                    <div className="flex justify-between items-start mb-2 pr-12">
                       <h4 className="font-bold text-slate-800 text-lg">{risk.hazard}</h4>
                       <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${level.color}`}>
                          {level.label} ({risk.riskScore})
                       </span>
                    </div>
                    <p className="text-slate-600 text-sm mb-3">{risk.consequence}</p>
                    
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                       <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Mesures de Prévention</span>
                       <p className="text-sm text-slate-700">{risk.controlMeasures}</p>
                    </div>
                 </div>
               </div>
             )
           })}
           {displayedRisks.length === 0 && (
                <div className="p-8 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
                    <p>Aucun risque {showArchived ? 'archivé' : 'actif'}.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default RiskView;