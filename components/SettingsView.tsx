import React, { useState } from 'react';
import { User, Bell, Monitor, Globe, Save, Lock, Mail, Server } from 'lucide-react';
import { UserSettings } from '../types';

const SettingsView: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings>({
    username: 'Jean Dupont',
    email: 'j.dupont@company.com',
    role: 'HSE Manager',
    language: 'fr',
    theme: 'light',
    notifications: true,
    smtpServer: 'smtp.office365.com',
    smtpPort: '587'
  });

  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  
  const [activeTab, setActiveTab] = useState<'profile' | 'system' | 'security'>('profile');

  const handleSave = () => {
    alert("Paramètres enregistrés avec succès !");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Paramètres</h2>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 bg-slate-50 border-r border-slate-100 p-4">
           <nav className="space-y-1">
              <button 
                onClick={() => setActiveTab('profile')}
                className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'profile' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                 <User className="w-4 h-4 mr-3" />
                 Profil & Compte
              </button>
              <button 
                onClick={() => setActiveTab('security')}
                className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'security' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                 <Lock className="w-4 h-4 mr-3" />
                 Sécurité & Connexion
              </button>
              <button 
                 onClick={() => setActiveTab('system')}
                 className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'system' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                 <Monitor className="w-4 h-4 mr-3" />
                 Système & Affichage
              </button>
           </nav>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 overflow-y-auto">
           {activeTab === 'profile' && (
             <div className="space-y-6 animate-fade-in">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Informations Personnelles</h3>
                  <div className="grid gap-4">
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nom complet</label>
                        <input 
                           type="text" 
                           value={settings.username} 
                           onChange={e => setSettings({...settings, username: e.target.value})}
                           className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none" 
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Adresse Email</label>
                        <input 
                           type="email" 
                           value={settings.email} 
                           onChange={e => setSettings({...settings, email: e.target.value})}
                           className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none" 
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Rôle</label>
                        <input 
                           type="text" 
                           value={settings.role} 
                           disabled
                           className="w-full border border-slate-200 bg-slate-50 text-slate-500 rounded-lg p-2.5 outline-none cursor-not-allowed" 
                        />
                     </div>
                  </div>
                </div>
             </div>
           )}

           {activeTab === 'security' && (
              <div className="space-y-8 animate-fade-in">
                 <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Lock className="w-5 h-5 text-slate-500" /> Mot de Passe</h3>
                    <div className="space-y-4 max-w-md">
                        <div>
                           <label className="block text-sm font-medium text-slate-700 mb-1">Mot de passe actuel</label>
                           <input type="password" value={passwordForm.current} onChange={e => setPasswordForm({...passwordForm, current: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2.5" />
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-slate-700 mb-1">Nouveau mot de passe</label>
                           <input type="password" value={passwordForm.new} onChange={e => setPasswordForm({...passwordForm, new: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2.5" />
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-slate-700 mb-1">Confirmer</label>
                           <input type="password" value={passwordForm.confirm} onChange={e => setPasswordForm({...passwordForm, confirm: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2.5" />
                        </div>
                    </div>
                 </div>

                 <div className="h-px bg-slate-100"></div>

                 <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Server className="w-5 h-5 text-slate-500" /> Intégration Email (SMTP)</h3>
                    <p className="text-sm text-slate-500 mb-4">Configuration pour l'envoi automatique des rapports.</p>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="block text-sm font-medium text-slate-700 mb-1">Serveur SMTP</label>
                           <input type="text" value={settings.smtpServer} onChange={e => setSettings({...settings, smtpServer: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2.5" />
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-slate-700 mb-1">Port</label>
                           <input type="text" value={settings.smtpPort} onChange={e => setSettings({...settings, smtpPort: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2.5" />
                        </div>
                    </div>
                 </div>
              </div>
           )}

           {activeTab === 'system' && (
              <div className="space-y-8 animate-fade-in">
                {/* Contenu Système existant... */}
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                     <Globe className="w-5 h-5 text-slate-500" />
                     Langue & Région
                  </h3>
                  <div className="max-w-xs">
                     <label className="block text-sm font-medium text-slate-700 mb-1">Langue de l'interface</label>
                     <select 
                       value={settings.language}
                       onChange={e => setSettings({...settings, language: e.target.value as 'fr'})}
                       className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
                     >
                        <option value="fr">Français</option>
                        <option value="en">English (US)</option>
                     </select>
                  </div>
                </div>
              </div>
           )}

           <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
              <button 
                 onClick={handleSave}
                 className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-sm"
              >
                 <Save className="w-4 h-4" />
                 Enregistrer
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;