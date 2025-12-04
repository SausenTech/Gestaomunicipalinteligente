import React, { useState } from 'react';
import PortalLayout from '../components/PortalLayout';
import { PortalType, ServiceRequest } from '../types';
import { FileText, MapPin, Truck, Lightbulb, Construction, Calendar, AlertTriangle, ArrowRight } from 'lucide-react';

interface CitizenPortalProps {
  onBack: () => void;
}

const CitizenPortal: React.FC<CitizenPortalProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'services' | 'requests'>('services');

  const services = [
    { icon: <FileText size={24} />, title: '2ª Via IPTU', desc: 'Emita a segunda via do seu imposto' },
    { icon: <Lightbulb size={24} />, title: 'Iluminação Pública', desc: 'Reparo em postes e lâmpadas' },
    { icon: <Truck size={24} />, title: 'Coleta de Lixo', desc: 'Consulte horários e rotas' },
    { icon: <Construction size={24} />, title: 'Tapa Buraco', desc: 'Solicite manutenção asfáltica' },
    { icon: <MapPin size={24} />, title: 'Zoneamento', desc: 'Consulte o mapa de uso do solo' },
    { icon: <Calendar size={24} />, title: 'Agenda Cultural', desc: 'Eventos e feiras na cidade' },
  ];

  const myRequests: ServiceRequest[] = [
    { id: 'REQ-2024-001', type: 'Iluminação Pública', status: 'Concluído', date: '10/05/2024', description: 'Lâmpada queimada na Rua 15' },
    { id: 'REQ-2024-045', type: 'Poda de Árvore', status: 'Em Análise', date: '22/05/2024', description: 'Risco de queda em fiação' },
  ];

  return (
    <PortalLayout title="Portal do Cidadão" type={PortalType.CITIZEN} onBack={onBack} colorTheme="bg-emerald-600">
      
      {/* Hero Search */}
      <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 text-center border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">O que você precisa hoje?</h2>
        <p className="text-slate-500 mb-6">Acesse serviços, notícias e faça solicitações sem sair de casa.</p>
        <div className="max-w-2xl mx-auto relative">
          <input 
            type="text" 
            placeholder="Ex: Pagar IPTU, Denúncia, Horário de ônibus..." 
            className="w-full px-6 py-4 rounded-full bg-slate-50 border-2 border-slate-200 focus:border-emerald-500 focus:ring-0 text-lg transition-all"
          />
          <button className="absolute right-2 top-2 bg-emerald-600 text-white p-2 rounded-full hover:bg-emerald-700 transition-colors">
            <ArrowRight size={24} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('services')}
          className={`pb-3 px-2 font-medium transition-colors border-b-2 ${activeTab === 'services' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Serviços Rápidos
        </button>
        <button 
          onClick={() => setActiveTab('requests')}
          className={`pb-3 px-2 font-medium transition-colors border-b-2 ${activeTab === 'requests' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Minhas Solicitações
        </button>
      </div>

      {activeTab === 'services' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer group">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                {service.icon}
              </div>
              <h3 className="font-semibold text-slate-800 text-lg mb-1">{service.title}</h3>
              <p className="text-slate-500 text-sm">{service.desc}</p>
            </div>
          ))}
          
          <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-xl border border-red-100 hover:shadow-md transition-all cursor-pointer">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-lg flex items-center justify-center mb-4">
              <AlertTriangle size={24} />
            </div>
            <h3 className="font-semibold text-red-800 text-lg mb-1">Defesa Civil</h3>
            <p className="text-red-600 text-sm">Reportar emergências e desastres</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-600 text-sm uppercase">
              <tr>
                <th className="p-4 font-semibold">Protocolo</th>
                <th className="p-4 font-semibold">Tipo</th>
                <th className="p-4 font-semibold">Data</th>
                <th className="p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {myRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50">
                  <td className="p-4 font-medium text-slate-700">#{req.id}</td>
                  <td className="p-4 text-slate-600">{req.type}</td>
                  <td className="p-4 text-slate-500">{req.date}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${req.status === 'Concluído' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}
                    `}>
                      {req.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 border-t border-slate-100 bg-slate-50 text-center">
            <button className="text-emerald-600 font-medium hover:underline text-sm">Ver todas as solicitações</button>
          </div>
        </div>
      )}

      {/* Featured News */}
      <div className="mt-12">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span className="w-1 h-6 bg-emerald-600 rounded-full"></span>
          Notícias da Cidade
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row border border-slate-100">
            <img src="https://picsum.photos/400/300?random=1" alt="News" className="w-full md:w-48 h-48 object-cover" />
            <div className="p-6 flex flex-col justify-center">
              <span className="text-emerald-600 text-xs font-bold uppercase tracking-wider mb-2">Saúde</span>
              <h4 className="font-bold text-lg text-slate-800 mb-2">Campanha de vacinação contra a gripe começa segunda-feira</h4>
              <p className="text-slate-500 text-sm line-clamp-2">Todas as unidades básicas de saúde estarão abertas das 8h às 17h para atender os grupos prioritários.</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row border border-slate-100">
            <img src="https://picsum.photos/400/300?random=2" alt="News" className="w-full md:w-48 h-48 object-cover" />
            <div className="p-6 flex flex-col justify-center">
              <span className="text-blue-600 text-xs font-bold uppercase tracking-wider mb-2">Obras</span>
              <h4 className="font-bold text-lg text-slate-800 mb-2">Nova praça central será inaugurada no fim de semana</h4>
              <p className="text-slate-500 text-sm line-clamp-2">O espaço conta com playground, academia ao ar livre e wi-fi gratuito para a população.</p>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default CitizenPortal;
