import React from 'react';
import { ArrowLeft, Menu, Bell, User } from 'lucide-react';
import { PortalType } from '../types';

interface PortalLayoutProps {
  title: string;
  type: PortalType;
  onBack: () => void;
  children: React.ReactNode;
  colorTheme: string; // e.g., 'bg-blue-600'
}

const PortalLayout: React.FC<PortalLayoutProps> = ({ title, type, onBack, children, colorTheme }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className={`${colorTheme} text-white shadow-md sticky top-0 z-40`}>
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-white/20 rounded-full transition-colors">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold tracking-tight">{title}</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-white/20 rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2 pl-4 border-l border-white/20">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <User size={16} />
              </div>
              <span className="text-sm font-medium hidden sm:block">
                {type === PortalType.ADMIN ? 'Administrador' : 
                 type === PortalType.EMPLOYEE ? 'João Silva' : 
                 type === PortalType.CITIZEN ? 'Maria Santos' : 'Visitante'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">© 2024 Gestão Municipal Inteligente - Sausen Tech.</p>
        </div>
      </footer>
    </div>
  );
};

export default PortalLayout;