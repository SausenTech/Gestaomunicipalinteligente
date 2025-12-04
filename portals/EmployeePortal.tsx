import React from 'react';
import PortalLayout from '../components/PortalLayout';
import { PortalType } from '../types';
import { DollarSign, Clock, Calendar, FileText, Briefcase, Award } from 'lucide-react';

interface EmployeePortalProps {
  onBack: () => void;
}

const EmployeePortal: React.FC<EmployeePortalProps> = ({ onBack }) => {
  return (
    <PortalLayout title="Portal do Servidor" type={PortalType.EMPLOYEE} onBack={onBack} colorTheme="bg-indigo-600">
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Profile & Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-center">
             <div className="w-24 h-24 mx-auto bg-slate-100 rounded-full mb-4 overflow-hidden border-4 border-white shadow-md">
                <img src="https://picsum.photos/200/200?random=50" alt="Profile" className="w-full h-full object-cover" />
             </div>
             <h2 className="text-xl font-bold text-slate-800">João da Silva</h2>
             <p className="text-indigo-600 font-medium">Analista Administrativo</p>
             <p className="text-slate-500 text-sm mt-1">Matrícula: 48920-1</p>
             <div className="mt-6 flex justify-center gap-2">
               <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Ativo</span>
               <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">Efetivo</span>
             </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
             <div className="p-4 bg-slate-50 border-b border-slate-100 font-semibold text-slate-700">Banco de Horas</div>
             <div className="p-6">
                <div className="flex justify-between items-end mb-2">
                   <span className="text-slate-500">Saldo atual</span>
                   <span className="text-2xl font-bold text-indigo-600">+12:30h</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                   <div className="bg-indigo-500 h-2 rounded-full" style={{width: '60%'}}></div>
                </div>
                <p className="text-xs text-slate-400 mt-2 text-right">Vence em 30/12/2024</p>
             </div>
          </div>
        </div>

        {/* Center & Right: Dashboard */}
        <div className="md:col-span-2 space-y-6">
           
           {/* Actions Grid */}
           <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <button className="p-6 bg-white border border-slate-200 rounded-xl hover:shadow-md hover:border-indigo-300 transition-all flex flex-col items-center gap-3 group">
                 <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <DollarSign size={24} />
                 </div>
                 <span className="font-semibold text-slate-700">Holerite Online</span>
              </button>
              <button className="p-6 bg-white border border-slate-200 rounded-xl hover:shadow-md hover:border-indigo-300 transition-all flex flex-col items-center gap-3 group">
                 <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Calendar size={24} />
                 </div>
                 <span className="font-semibold text-slate-700">Marcar Férias</span>
              </button>
              <button className="p-6 bg-white border border-slate-200 rounded-xl hover:shadow-md hover:border-indigo-300 transition-all flex flex-col items-center gap-3 group">
                 <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    <FileText size={24} />
                 </div>
                 <span className="font-semibold text-slate-700">Informe Rendim.</span>
              </button>
           </div>

           {/* Paystub Preview */}
           <div className="bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                 <h3 className="font-bold text-slate-800">Último Pagamento (Maio/2024)</h3>
                 <button className="text-indigo-600 text-sm hover:underline">Ver detalhado</button>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
                 <div>
                    <span className="text-sm text-slate-500 block mb-1">Proventos</span>
                    <span className="text-lg font-bold text-green-600">R$ 4.250,00</span>
                 </div>
                 <div>
                    <span className="text-sm text-slate-500 block mb-1">Descontos</span>
                    <span className="text-lg font-bold text-red-500">R$ 890,20</span>
                 </div>
                 <div>
                    <span className="text-sm text-slate-500 block mb-1">Líquido</span>
                    <span className="text-xl font-bold text-slate-800">R$ 3.359,80</span>
                 </div>
              </div>
           </div>

           {/* Notifications */}
           <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-slate-800 mb-4">Mural do Servidor</h3>
              <div className="space-y-4">
                 <div className="flex gap-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="mt-1 text-indigo-600"><Briefcase size={20} /></div>
                    <div>
                       <h4 className="font-semibold text-sm text-slate-800">Novo convênio com farmácias</h4>
                       <p className="text-sm text-slate-500">Servidores agora têm 20% de desconto na rede DrogaCity.</p>
                    </div>
                 </div>
                 <div className="flex gap-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="mt-1 text-amber-600"><Award size={20} /></div>
                    <div>
                       <h4 className="font-semibold text-sm text-slate-800">Avaliação de Desempenho</h4>
                       <p className="text-sm text-slate-500">O prazo para autoavaliação encerra dia 30/06.</p>
                    </div>
                 </div>
              </div>
           </div>

        </div>
      </div>
    </PortalLayout>
  );
};

export default EmployeePortal;
