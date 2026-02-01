import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { Incident, Risk, Status, IncidentType } from '../types';
import { Users, AlertTriangle, CheckCircle, TrendingDown } from 'lucide-react';

interface DashboardProps {
  incidents: Incident[];
  risks: Risk[];
}

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6'];

const Dashboard: React.FC<DashboardProps> = ({ incidents, risks }) => {
  
  // Calculate KPIs
  const totalIncidents = incidents.length;
  const openIncidents = incidents.filter(i => i.status !== Status.CLOSED).length;
  const criticalRisks = risks.filter(r => r.riskScore >= 15).length;
  const complianceRate = 94; // Hardcoded for demo

  // Data for Charts
  const typeData = Object.values(IncidentType).map(type => ({
    name: type,
    value: incidents.filter(i => i.type === type).length
  })).filter(d => d.value > 0);

  const monthData = [
    { name: 'Jan', incidents: 4 },
    { name: 'Fév', incidents: 3 },
    { name: 'Mar', incidents: 2 },
    { name: 'Avr', incidents: 6 },
    { name: 'Mai', incidents: 3 },
    { name: 'Juin', incidents: openIncidents }, // Rough mapping for demo
  ];

  const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800 mt-2">{value}</h3>
        <span className={`text-xs font-medium mt-1 inline-block px-2 py-0.5 rounded-full ${trend === 'good' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
          {trend === 'good' ? '+2.4%' : '-1.5%'} vs mois dernier
        </span>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Incidents (Année)" 
          value={totalIncidents} 
          icon={AlertTriangle} 
          color="bg-blue-500" 
          trend="bad"
        />
        <StatCard 
          title="Actions Ouvertes" 
          value={openIncidents} 
          icon={TrendingDown} 
          color="bg-amber-500" 
          trend="good"
        />
        <StatCard 
          title="Risques Critiques" 
          value={criticalRisks} 
          icon={Users} 
          color="bg-red-500" 
          trend="good"
        />
        <StatCard 
          title="Conformité Audit" 
          value={`${complianceRate}%`} 
          icon={CheckCircle} 
          color="bg-emerald-500" 
          trend="good"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incident Trends */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Tendances Incidents (6 Mois)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}} 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="incidents" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Incident by Type */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Répartition par Type</h3>
          <div className="h-80 flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Recent Activity Mockup */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">Journal d'Activité Récent</h3>
        </div>
        <div className="p-6 space-y-4">
            {[1,2,3].map((_, i) => (
                <div key={i} className="flex items-center gap-4 text-sm">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-slate-500 w-24">10:4{i}</span>
                    <span className="font-medium text-slate-700">Audit #40{i} complété par Jean Dupont</span>
                    <span className="ml-auto text-slate-400 cursor-pointer hover:text-emerald-600">Voir</span>
                </div>
            ))}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;