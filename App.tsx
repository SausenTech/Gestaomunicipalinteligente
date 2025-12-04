import React, { useState } from 'react';
import { PortalType } from './types';
import CitizenPortal from './portals/CitizenPortal';
import AdminPortal from './portals/AdminPortal';
import EmployeePortal from './portals/EmployeePortal';
import CouncilPortal from './portals/CouncilPortal';
import CityAssistant from './components/CityAssistant';
import { Users, Building2, Landmark, Briefcase, ChevronRight } from 'lucide-react';

const App: React.FC = () => {
  const [activePortal, setActivePortal] = useState<PortalType>(PortalType.LANDING);

  const handlePortalSelect = (portal: PortalType) => {
    setActivePortal(portal);
  };

  const handleBack = () => {
    setActivePortal(PortalType.LANDING);
  };

  const renderPortal = () => {
    switch (activePortal) {
      case PortalType.CITIZEN:
        return <CitizenPortal onBack={handleBack} />;
      case PortalType.ADMIN:
        return <AdminPortal onBack={handleBack} />;
      case PortalType.EMPLOYEE:
        return <EmployeePortal onBack={handleBack} />;
      case PortalType.COUNCIL:
        return <CouncilPortal onBack={handleBack} />;
      default:
        return <LandingPage onSelect={handlePortalSelect} />;
    }
  };

  return (
    <>
      {renderPortal()}
      {/* The City Assistant is global, but aware of context via props */}
      <CityAssistant currentPortal={activePortal} />
    </>
  );
};

interface LandingPageProps {
  onSelect: (type: PortalType) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onSelect }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-12 max-w-2xl">
        <div className="flex justify-center mb-6">
           <div className="bg-blue-600 text-white p-4 rounded-2xl shadow-lg">
             <Landmark size={48} />
           </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2 tracking-tight">Gestão Municipal Inteligente</h1>
        <h2 className="text-2xl font-semibold text-slate-600 mb-6">Sausen Tech</h2>
        <p className="text-lg text-slate-500">
          Bem-vindo ao portal integrado de gestão municipal. 
          Selecione seu perfil de acesso para continuar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        
        {/* Citizen Card */}
        <button 
          onClick={() => onSelect(PortalType.CITIZEN)}
          className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:scale-105 transition-all group text-left"
        >
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <Users size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Cidadão</h2>
          <p className="text-slate-500 text-sm mb-6">Acesse serviços, pague impostos, veja notícias e abra solicitações.</p>
          <div className="flex items-center text-emerald-600 font-semibold text-sm">
            Acessar Portal <ChevronRight size={16} className="ml-1" />
          </div>
        </button>

        {/* Council Card */}
        <button 
          onClick={() => onSelect(PortalType.COUNCIL)}
          className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:scale-105 transition-all group text-left"
        >
          <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-amber-600 group-hover:text-white transition-colors">
            <Landmark size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Câmara</h2>
          <p className="text-slate-500 text-sm mb-6">Acompanhe projetos de lei, sessões ao vivo e portal da transparência.</p>
          <div className="flex items-center text-amber-600 font-semibold text-sm">
            Acessar Portal <ChevronRight size={16} className="ml-1" />
          </div>
        </button>

        {/* Employee Card */}
        <button 
          onClick={() => onSelect(PortalType.EMPLOYEE)}
          className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:scale-105 transition-all group text-left"
        >
          <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <Briefcase size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Servidor</h2>
          <p className="text-slate-500 text-sm mb-6">Consulte holerites, informe de rendimentos, férias e benefícios.</p>
          <div className="flex items-center text-indigo-600 font-semibold text-sm">
            Acessar Portal <ChevronRight size={16} className="ml-1" />
          </div>
        </button>

        {/* Admin Card */}
        <button 
          onClick={() => onSelect(PortalType.ADMIN)}
          className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:scale-105 transition-all group text-left"
        >
          <div className="w-14 h-14 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-slate-800 group-hover:text-white transition-colors">
            <Building2 size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Administrativo</h2>
          <p className="text-slate-500 text-sm mb-6">Gestão interna, indicadores, relatórios e CRM da prefeitura.</p>
          <div className="flex items-center text-slate-600 font-semibold text-sm">
            Acessar Portal <ChevronRight size={16} className="ml-1" />
          </div>
        </button>

      </div>
      
      <div className="mt-16 text-center text-slate-400 text-sm">
        <p>© 2024 Gestão Municipal Inteligente - Sausen Tech. Todos os direitos reservados.</p>
      </div>
    </div>
  );
};

export default App;