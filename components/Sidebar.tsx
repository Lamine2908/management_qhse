import React from 'react';
import { LayoutDashboard, AlertTriangle, ShieldAlert, ClipboardList, Bot, LogOut, GraduationCap, Settings, PieChart } from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, isOpen, setIsOpen }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Tableau de Bord', icon: LayoutDashboard },
    { id: 'incidents', label: 'Incidents', icon: AlertTriangle },
    { id: 'risks', label: 'Risques', icon: ShieldAlert },
    { id: 'permits', label: 'Permis de Travail', icon: ClipboardList },
    { id: 'training', label: 'Formations', icon: GraduationCap },
    { id: 'reports', label: 'Rapports Auto', icon: PieChart },
    { id: 'ai-assistant', label: 'Assistant IA', icon: Bot },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 z-20 bg-black/50 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-20 border-b border-slate-700 bg-slate-950">
            <div className="flex items-center gap-2 font-bold text-xl text-emerald-400">
               <ShieldAlert className="w-8 h-8" />
               <span>SENTINELLE</span>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onChangeView(item.id as ViewState);
                    setIsOpen(false);
                  }}
                  className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-700">
            <button className="flex items-center w-full px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">
              <LogOut className="w-5 h-5 mr-3" />
              Déconnexion
            </button>
            <div className="mt-4 flex items-center gap-3 px-2">
                <img src="https://picsum.photos/40/40" alt="User" className="w-8 h-8 rounded-full border border-slate-600" />
                <div className="text-xs">
                    <p className="text-white font-medium">Jean Dupont</p>
                    <p className="text-slate-500">Resp. QHSE</p>
                </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;