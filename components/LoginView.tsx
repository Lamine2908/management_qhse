import React, { useState } from 'react';
import { ShieldAlert, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';

interface LoginViewProps {
  onLogin: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulation d'un appel API backend
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex overflow-hidden min-h-[600px]">
        
        {/* Left Side - Brand */}
        <div className="w-1/2 bg-gradient-to-br from-emerald-900 to-slate-900 p-12 hidden md:flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-emerald-500 blur-3xl"></div>
             <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full bg-blue-500 blur-3xl"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 text-emerald-400 mb-8">
              <ShieldAlert className="w-10 h-10" />
              <span className="text-2xl font-bold tracking-wider">SENTINELLE</span>
            </div>
            <h1 className="text-4xl font-bold text-white leading-tight mb-6">
              Système de Management QHSE Intégré
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              Gérez vos incidents, risques, permis de travail et formations dans une interface unifiée propulsée par l'Intelligence Artificielle.
            </p>
          </div>

          <div className="relative z-10 text-slate-400 text-sm">
            © 2023 Sentinelle QHSE. Tous droits réservés.
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md mx-auto w-full">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Bienvenue</h2>
            <p className="text-slate-500 mb-10">Connectez-vous pour accéder à votre espace.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Adresse Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    placeholder="nom@entreprise.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Mot de Passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500" />
                  <span className="text-slate-600">Se souvenir de moi</span>
                </label>
                <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium">Mot de passe oublié ?</a>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    Se connecter
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-slate-100 text-center">
               <p className="text-slate-500 text-sm">
                 Vous n'avez pas de compte ? <a href="#" className="text-emerald-600 font-bold hover:underline">Contactez l'IT</a>
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;