import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import IncidentView from './components/IncidentView';
import RiskView from './components/RiskView';
import PermitView from './components/PermitView';
import AIAssistant from './components/AIAssistant';
import TrainingView from './components/TrainingView';
import SettingsView from './components/SettingsView';
import ReportView from './components/ReportView';
import LoginView from './components/LoginView';
import { ViewState, Incident, Risk, IncidentType, Severity, Status, WorkPermit, PermitType, PermitStatus, SavedReport, Training } from './types';
import { Menu, Bell } from 'lucide-react';

// Mock Data Initialization
const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'INC-2023-001',
    title: 'Collision Chariot Élévateur Entrepôt B',
    date: '2023-10-15',
    type: IncidentType.PROPERTY_DAMAGE,
    severity: Severity.MEDIUM,
    status: Status.CLOSED,
    location: 'Entrepôt B',
    description: 'Le cariste a heurté le rayonnage en reculant, causant des dommages mineurs.',
    isArchived: false
  },
  // ... autres incidents
];

const INITIAL_RISKS: Risk[] = [
    {
        id: 'RSK-001',
        hazard: 'Travail en Hauteur',
        consequence: 'Chute entraînant décès ou blessure grave',
        probability: 3,
        impact: 5,
        riskScore: 15,
        controlMeasures: 'Harnais obligatoire > 2m. Garde-corps installés sur mezzanine.',
        isArchived: false
    },
    // ... autres risques
];

const INITIAL_PERMITS: WorkPermit[] = [
  {
    id: 'PERM-2023-1024',
    type: PermitType.HOT_WORK,
    description: 'Soudure sur la ligne de vapeur principale',
    location: 'Zone Technique Nord',
    startDate: '2023-11-15',
    endDate: '2023-11-16',
    startTime: '08:00',
    endTime: '17:00',
    requester: { lastName: 'Diop', firstName: 'Moussa', phone: '77 000 00 00', company: 'SOCOCIM Maintenance' },
    workNature: ['Soudure / Meulage / Découpage'],
    precautions: { 
      dispositions: ['Extincteur à proximité immédiate', 'Balisage de la zone'], 
      epi: ['Masque respiratoire (FFP3 / Cartouche)', 'Gants adaptés (Chaud/Coupure/Chimique)'], 
      equipments: ['Poste à souder / Oxycoupage'] 
    },
    status: PermitStatus.ACTIVE,
    isArchived: false,
    signatures: {
      requester: { nom: 'Diop', prenom: 'Moussa', matricule: 'M123', date: '2023-11-15', visa: true, service: 'Maintenance' },
      productionLead: { nom: 'Fall', prenom: 'Cheikh', matricule: 'P456', date: '2023-11-15', visa: true, service: 'Production' },
      safety: { nom: 'Ndiaye', prenom: 'Fatou', matricule: 'S789', date: '2023-11-15', visa: true, service: 'HSE' },
      executor: { nom: 'Gaye', prenom: 'Aliou', matricule: '', date: '2023-11-15', visa: true, raisonSociale: 'MetalWorks SA' }
    }
  }
];

const INITIAL_REPORTS: SavedReport[] = [
    {
        id: 'RPT-2023-10',
        title: 'Rapport Mensuel - Octobre 2023',
        date: '2023-11-01',
        content: 'Rapport Mensuel\n\nPerformance stable. Aucun accident avec arrêt.',
        isArchived: false,
        history: []
    }
];

const INITIAL_TRAININGS: Training[] = [
    { id: 'TRN-001', title: 'Habilitation Électrique H1/B1', date: '2023-11-10', attendees: 8, status: 'Planifié', instructor: 'Bureau Veritas', isArchived: false },
    { id: 'TRN-002', title: 'Gestes et Postures', date: '2023-10-05', attendees: 12, status: 'Complété', instructor: 'Interne', isArchived: false },
];

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // State Management
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [risks, setRisks] = useState<Risk[]>(INITIAL_RISKS);
  const [permits, setPermits] = useState<WorkPermit[]>(INITIAL_PERMITS);
  const [reports, setReports] = useState<SavedReport[]>(INITIAL_REPORTS);
  const [trainings, setTrainings] = useState<Training[]>(INITIAL_TRAININGS);

  // --- CRUD Handlers ---

  // Incidents
  const handleAddIncident = (newIncident: Incident) => setIncidents([newIncident, ...incidents]);
  const handleUpdateIncident = (updated: Incident) => setIncidents(incidents.map(i => i.id === updated.id ? updated : i));
  const handleDeleteIncident = (id: string) => setIncidents(incidents.filter(i => i.id !== id));
  const handleArchiveIncident = (id: string) => setIncidents(incidents.map(i => i.id === id ? { ...i, isArchived: !i.isArchived } : i));

  // Risks
  const handleAddRisk = (newRisk: Risk) => setRisks([newRisk, ...risks]);
  const handleUpdateRisk = (updated: Risk) => setRisks(risks.map(r => r.id === updated.id ? updated : r));
  const handleDeleteRisk = (id: string) => setRisks(risks.filter(r => r.id !== id));
  const handleArchiveRisk = (id: string) => setRisks(risks.map(r => r.id === id ? { ...r, isArchived: !r.isArchived } : r));

  // Permits
  const handleAddPermit = (newPermit: WorkPermit) => setPermits([newPermit, ...permits]);
  const handleUpdatePermit = (updated: WorkPermit) => setPermits(permits.map(p => p.id === updated.id ? updated : p));
  const handleDeletePermit = (id: string) => setPermits(permits.filter(p => p.id !== id));
  const handleArchivePermit = (id: string) => setPermits(permits.map(p => p.id === id ? { ...p, isArchived: !p.isArchived } : p));

  // Reports
  const handleSaveReport = (newReport: SavedReport) => setReports([newReport, ...reports]);
  const handleUpdateReport = (updated: SavedReport) => setReports(reports.map(r => r.id === updated.id ? updated : r));
  const handleDeleteReport = (id: string) => setReports(reports.filter(r => r.id !== id));
  const handleArchiveReport = (id: string) => setReports(reports.map(r => r.id === id ? { ...r, isArchived: !r.isArchived } : r));

  // Trainings
  const handleAddTraining = (newTraining: Training) => setTrainings([newTraining, ...trainings]);
  const handleUpdateTraining = (updated: Training) => setTrainings(trainings.map(t => t.id === updated.id ? updated : t));
  const handleDeleteTraining = (id: string) => setTrainings(trainings.filter(t => t.id !== id));
  const handleArchiveTraining = (id: string) => setTrainings(trainings.map(t => t.id === id ? { ...t, isArchived: !t.isArchived } : t));

  if (!isAuthenticated) {
    return <LoginView onLogin={() => setIsAuthenticated(true)} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard incidents={incidents} risks={risks} />;
      case 'incidents':
        return (
          <IncidentView 
            incidents={incidents} 
            onAddIncident={handleAddIncident}
            onUpdateIncident={handleUpdateIncident}
            onDeleteIncident={handleDeleteIncident}
            onArchiveIncident={handleArchiveIncident}
          />
        );
      case 'risks':
        return (
          <RiskView 
            risks={risks} 
            onAddRisk={handleAddRisk}
            onUpdateRisk={handleUpdateRisk}
            onDeleteRisk={handleDeleteRisk}
            onArchiveRisk={handleArchiveRisk}
          />
        );
      case 'permits':
        return (
          <PermitView 
            permits={permits} 
            onAddPermit={handleAddPermit} 
            onUpdatePermit={handleUpdatePermit}
            onDeletePermit={handleDeletePermit}
            onArchivePermit={handleArchivePermit}
          />
        );
      case 'training':
        return (
          <TrainingView 
             trainings={trainings}
             onAddTraining={handleAddTraining}
             onUpdateTraining={handleUpdateTraining}
             onDeleteTraining={handleDeleteTraining}
             onArchiveTraining={handleArchiveTraining}
          />
        );
      case 'reports':
        return (
          <ReportView 
            incidents={incidents} 
            risks={risks} 
            savedReports={reports}
            onSaveReport={handleSaveReport}
            onUpdateReport={handleUpdateReport}
            onDeleteReport={handleDeleteReport}
            onArchiveReport={handleArchiveReport}
          />
        );
      case 'settings':
        return <SettingsView />;
      case 'ai-assistant':
        return <AIAssistant />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-96 text-slate-400">
            <h2 className="text-2xl font-bold mb-2">Module en construction</h2>
            <p>Le module {currentView} sera disponible dans la prochaine version.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar 
        currentView={currentView} 
        onChangeView={setCurrentView} 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 shrink-0 z-10 print:hidden">
          <div className="flex items-center gap-4">
             <button 
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
             >
                <Menu className="w-6 h-6" />
             </button>
             <h1 className="text-xl font-bold text-slate-800 capitalize hidden sm:block">
               {currentView === 'ai-assistant' ? 'Assistant IA' : 
                currentView === 'reports' ? 'Rapports' :
                currentView === 'training' ? 'Formations' :
                currentView === 'permits' ? 'Permis de Travail' :
                currentView === 'settings' ? 'Paramètres' :
                currentView === 'dashboard' ? 'Tableau de Bord' :
                currentView === 'risks' ? 'Gestion des Risques' : 'Incidents'}
             </h1>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="relative">
                <Bell className="w-6 h-6 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
             </div>
             <div className="h-8 w-px bg-slate-200 mx-2"></div>
             <span className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                Sentinelle v2.0
             </span>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth print:p-0 print:overflow-visible">
          <div className="max-w-7xl mx-auto print:max-w-none">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;