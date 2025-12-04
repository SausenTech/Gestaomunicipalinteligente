import React, { useState } from 'react';
import PortalLayout from '../components/PortalLayout';
import { PortalType, LawProject } from '../types';
import { Search, FileText, Gavel, Calendar, Users, Mic2 } from 'lucide-react';
import { summarizeLaw } from '../services/geminiService';

interface CouncilPortalProps {
  onBack: () => void;
}

const CouncilPortal: React.FC<CouncilPortalProps> = ({ onBack }) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState<string | null>(null);

  const laws: LawProject[] = [
    { id: '1', number: 'PL 045/2024', title: 'Institui o programa de hortas comunitárias em terrenos baldios.', author: 'Ver. Carlos Silva', status: 'Em Tramitação', date: '15/05/2024' },
    { id: '2', number: 'PL 042/2024', title: 'Dispõe sobre a obrigatoriedade de energia solar em prédios públicos.', author: 'Ver. Ana Souza', status: 'Aprovado', date: '10/05/2024' },
    { id: '3', number: 'PL 039/2024', title: 'Altera o horário de funcionamento do comércio local aos domingos.', author: 'Executivo', status: 'Em Tramitação', date: '02/05/2024' },
  ];

  const handleSummarize = async (law: LawProject) => {
    if (summary && loadingSummary === law.id) {
      setSummary(null);
      setLoadingSummary(null);
      return;
    }
    
    setLoadingSummary(law.id);
    const result = await summarizeLaw(law.title); // Using title as proxy for text for this demo
    setSummary(result);
    // In a real app, loadingSummary would control loading state per item
  };

  return (
    <PortalLayout title="Câmara Municipal" type={PortalType.COUNCIL} onBack={onBack} colorTheme="bg-slate-900">
      
      {/* Search Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-8 mb-8 text-white shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-2 font-serif">Transparência Legislativa</h2>
            <p className="opacity-90">Acompanhe projetos de lei, sessões e gastos públicos.</p>
          </div>
          <div className="flex gap-4">
             <button className="bg-white/20 backdrop-blur-sm p-3 rounded-lg hover:bg-white/30 transition-colors flex flex-col items-center min-w-[100px]">
                <Mic2 size={24} className="mb-1" />
                <span className="text-xs font-semibold">Sessão Ao Vivo</span>
             </button>
             <button className="bg-white/20 backdrop-blur-sm p-3 rounded-lg hover:bg-white/30 transition-colors flex flex-col items-center min-w-[100px]">
                <Calendar size={24} className="mb-1" />
                <span className="text-xs font-semibold">Pauta do Dia</span>
             </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Law Projects List */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Gavel size={20} className="text-amber-600" />
              Projetos em Tramitação
            </h3>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Buscar projeto..." 
                className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:ring-amber-500 focus:border-amber-500" 
              />
              <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
            </div>
          </div>

          <div className="space-y-4">
            {laws.map((law) => (
              <div key={law.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded uppercase">{law.number}</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${law.status === 'Aprovado' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {law.status}
                  </span>
                </div>
                <h4 className="font-bold text-lg text-slate-800 mb-2">{law.title}</h4>
                <div className="flex justify-between items-center text-sm text-slate-500 mt-4">
                   <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1"><Users size={14} /> {law.author}</span>
                      <span className="flex items-center gap-1"><Calendar size={14} /> {law.date}</span>
                   </div>
                   <button 
                    onClick={() => handleSummarize(law)}
                    className="text-amber-600 font-medium hover:underline flex items-center gap-1"
                   >
                     {loadingSummary === law.id ? 'Resumindo...' : 'Resumir com IA'}
                     <FileText size={14} />
                   </button>
                </div>
                {summary && loadingSummary === law.id && (
                  <div className="mt-4 p-4 bg-amber-50 rounded-lg text-sm text-amber-900 border border-amber-100 animate-in fade-in">
                    <strong>Resumo IA:</strong> {summary}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Vereadores</h3>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                  <div className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden">
                    <img src={`https://picsum.photos/100/100?random=${i+10}`} alt="Vereador" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-slate-700">Vereador Nome {i}</p>
                    <p className="text-xs text-slate-500">Partido {String.fromCharCode(65+i)}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-center text-sm text-amber-600 font-medium hover:underline">Ver todos</button>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl text-white">
            <h3 className="font-bold mb-2">Participe!</h3>
            <p className="text-sm text-slate-300 mb-4">A próxima sessão ordinária acontece na terça-feira, às 19h.</p>
            <button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 rounded-lg transition-colors">
              Inscrever para Tribuna Livre
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default CouncilPortal;
