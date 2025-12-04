import React, { useState, useEffect, useRef } from 'react';
import PortalLayout from '../components/PortalLayout';
import { PortalType } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, Legend } from 'recharts';
import { 
  Users, AlertCircle, CheckCircle, Clock, Calendar, 
  LayoutDashboard, Building2, HeartPulse, HandHeart, 
  GraduationCap, Leaf, ArrowUpRight, ArrowDownRight, 
  Activity, DollarSign, FileText, ClipboardList,
  PieChart as IconPieChart, Calculator, ShoppingCart, Landmark, Package, Truck, MessageCircle, Eye, Globe, Receipt, BookOpen, BarChart3, AlertOctagon, TrendingUp, Coins, MapPin, Percent, ShieldAlert, Search, HardHat, Gavel,
  Ticket, Monitor, Megaphone, UserPlus, Ban, CheckSquare, ChevronLeft,
  CalendarClock, Stethoscope, Pill, Clipboard, Smile, Plane, FlaskConical, Database, BedDouble, FileCheck, Syringe, Microscope, Ambulance, Bus, Smartphone, Siren, Network, Scan, ShieldCheck,
  FileSpreadsheet, Home, Baby, Utensils, HeartHandshake, Accessibility, Briefcase, Shield, UserCog, ScrollText, Warehouse, Users2, BrainCircuit,
  Wifi, Server, Cpu, Lock, Code, Cloud, Laptop, Camera, Radio, Signal, Fingerprint, MousePointer2, Headset, Phone,
  School, Library, Backpack, BookOpenCheck, Eraser, PenTool, Award, Sprout, TreePine, Recycle, Droplets, PawPrint, Trash2, Flower2, Mountain,
  UserCheck, DatabaseBackup, GitBranch, RadioTower, FileKey, FolderKanban, GlobeLock, Edit, Filter, Download, X, Save, Plus, Printer, Share2, MoreHorizontal, ChevronRight, Maximize2, Volume2, ListPlus, Target, Scale, FileBarChart, Hospital,
  Thermometer, Heart, UserMinus, PackageCheck, PackageMinus, PackagePlus, History, AlertTriangle, CalendarDays, LockKeyhole, FileDigit, Truck as TruckIcon, BadgeAlert, Trash,
  Paperclip, Layers, GitCommit, FileInput, UploadCloud, Wallet, Landmark as LandmarkIcon, FileWarning, Scroll, Umbrella, Siren as SirenIcon,
  FileSignature, ShoppingBag, Archive, TrendingDown, Hammer, FileAxis3D, RefreshCcw
} from 'lucide-react';

interface AdminPortalProps {
  onBack: () => void;
}

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  department: string;
}

interface QueueItem {
  number: string;
  type: 'Geral' | 'Prioritário' | 'Exames';
  timestamp: Date;
}

// Interface for Invoice Items
interface InvoiceItem {
  itemId: string;
  itemName: string;
  qty: number;
  cost: number;
  total: number;
}

const AdminPortal: React.FC<AdminPortalProps> = ({ onBack }) => {
  const [activeCategory, setActiveCategory] = useState('admin');
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // --- DATA DEFINITIONS ---

  // Modules for Administration (Sorted Alphabetically)
  const adminModules = [
    { name: 'Almoxarifado', icon: <Package size={24} />, desc: 'Controle de Estoque e Requisições', highlight: true },
    { name: 'Autoatendimento Web', icon: <Globe size={24} />, desc: 'Acesso do Cidadão' },
    { name: 'Compras e Licitações', icon: <ShoppingCart size={24} />, desc: 'Processos Licitatórios', highlight: true },
    { name: 'Contabilidade Pública', icon: <Calculator size={24} />, desc: 'Execução Financeira' },
    { name: 'Contribuição de Melhoria', icon: <TrendingUp size={24} />, desc: 'Valorização Imobiliária' },
    { name: 'Controle da Arrecadação', icon: <BarChart3 size={24} />, desc: 'Monitoramento de Receitas' },
    { name: 'Controle Interno', icon: <ShieldAlert size={24} />, desc: 'Auditoria e Compliance' },
    { name: 'Dívida Ativa', icon: <AlertOctagon size={24} />, desc: 'Gestão de Débitos' },
    { name: 'Escrita Fiscal', icon: <BookOpen size={24} />, desc: 'Livros Fiscais' },
    { name: 'Fiscalização Fazendária', icon: <Search size={24} />, desc: 'Autuações e Vistorias' },
    { name: 'Frotas', icon: <Truck size={24} />, desc: 'Gestão de Veículos' },
    { name: 'IPTU', icon: <MapPin size={24} />, desc: 'Imposto Territorial' },
    { name: 'ISSQN', icon: <Percent size={24} />, desc: 'Imposto Sobre Serviços' },
    { name: 'Nota Fiscal Eletrônica', icon: <Receipt size={24} />, desc: 'Emissão e Consulta' },
    { name: 'Obras e Posturas', icon: <HardHat size={24} />, desc: 'Fiscalização Urbana' },
    { name: 'Ouvidoria', icon: <MessageCircle size={24} />, desc: 'Atendimento ao Cidadão' },
    { name: 'Patrimônio', icon: <Landmark size={24} />, desc: 'Gestão de Bens' },
    { name: 'Planejamento e Orçamento', icon: <IconPieChart size={24} />, desc: 'PPA, LDO e LOA', highlight: true },
    { name: 'Portal da Transparência', icon: <Eye size={24} />, desc: 'Prestação de Contas' },
    { name: 'Protocolo e Processo Digital', icon: <FileText size={24} />, desc: 'Tramitação de Documentos' },
    { name: 'Recursos Humanos', icon: <Users size={24} />, desc: 'Folha, Ponto e E-Social', highlight: true },
    { name: 'Sistema de Senhas', icon: <Ticket size={24} />, desc: 'Gestão de Filas e Atendimento', id: 'queue_sys', highlight: true },
    { name: 'Taxas e Tarifas', icon: <Coins size={24} />, desc: 'Receitas Diversas' },
  ];

  // Modules for Health (Sorted Alphabetically)
  const healthModules = [
    { name: 'Acesso ACS', icon: <Smartphone size={24} />, desc: 'Agentes de Saúde' },
    { name: 'Agendamento e Cadastros', icon: <CalendarClock size={24} />, desc: 'Regulação de Consultas' },
    { name: 'AIH', icon: <BedDouble size={24} />, desc: 'Autorização Internação' },
    { name: 'Ambulatório', icon: <Stethoscope size={24} />, desc: 'Atendimento Médico' },
    { name: 'APAC', icon: <FileCheck size={24} />, desc: 'Alto Custo' },
    { name: 'Controle de TFD', icon: <Plane size={24} />, desc: 'Tratamento Fora Domicílio' },
    { name: 'E-SUS Atenção Básica', icon: <Database size={24} />, desc: 'Integração Federal' },
    { name: 'Ecografia', icon: <Activity size={24} />, desc: 'Diagnóstico por Imagem' },
    { name: 'Farmácia', icon: <Pill size={24} />, desc: 'Estoque e Dispensação' },
    { name: 'Faturamento SUS', icon: <DollarSign size={24} />, desc: 'BPA e AIH' },
    { name: 'Imunizações', icon: <Syringe size={24} />, desc: 'Controle de Vacinas' },
    { name: 'Laboratório', icon: <FlaskConical size={24} />, desc: 'Exames e Resultados' },
    { name: 'Portal do Paciente', icon: <Globe size={24} />, desc: 'Acesso Web Cidadão' },
    { name: 'Prontuário Médico', icon: <Clipboard size={24} />, desc: 'Histórico do Paciente' },
    { name: 'Prontuário Odontológico', icon: <Smile size={24} />, desc: 'Saúde Bucal' },
    { name: 'Radiologia', icon: <Scan size={24} />, desc: 'Raios-X e Imagens' },
    { name: 'Regulação', icon: <Network size={24} />, desc: 'Gestão de Vagas' },
    { name: 'SAMU', icon: <Ambulance size={24} />, desc: 'Urgência e Emergência' },
    { name: 'Transporte Pacientes', icon: <Bus size={24} />, desc: 'Logística Sanitária' },
    { name: 'UPA', icon: <Siren size={24} />, desc: 'Pronto Atendimento' },
    { name: 'Vigilância em Saúde', icon: <ShieldCheck size={24} />, desc: 'Sanitária e Ambiental' },
    { name: 'Vigilância Epidemiológica', icon: <Microscope size={24} />, desc: 'Controle de Doenças' },
  ];

  // Modules for Hospital Municipal (Sorted Alphabetically)
  const hospitalModules = [
    { name: 'Arquivo Médico (SAME)', icon: <FolderKanban size={24} />, desc: 'Prontuários Antigos' },
    { name: 'CCIH', icon: <ShieldAlert size={24} />, desc: 'Controle de Infecção' },
    { name: 'Centro Cirúrgico', icon: <Activity size={24} />, desc: 'Agendamento e Salas' },
    { name: 'Farmácia Hospitalar', icon: <Pill size={24} />, desc: 'Dispensação Interna' },
    { name: 'Gestão de Leitos', icon: <BedDouble size={24} />, desc: 'Ocupação e Altas', highlight: true },
    { name: 'Gestão de Óbitos', icon: <FileText size={24} />, desc: 'Declarações e Trâmites' },
    { name: 'Hotelaria e Limpeza', icon: <Droplets size={24} />, desc: 'Higiene e Rouparia' },
    { name: 'Manutenção Hospitalar', icon: <HardHat size={24} />, desc: 'Equipamentos e Predial' },
    { name: 'Maternidade', icon: <Baby size={24} />, desc: 'Partos e Alojamento' },
    { name: 'Nutrição e Dietética', icon: <Utensils size={24} />, desc: 'Refeições de Pacientes' },
    { name: 'Pronto Socorro', icon: <Siren size={24} />, desc: 'Atendimento de Emergência', highlight: true },
    { name: 'Triagem (Manchester)', icon: <ClipboardList size={24} />, desc: 'Classificação de Risco' },
  ];

  // Modules for Social Assistance (Sorted Alphabetically)
  const socialModules = [
    { name: 'Benefícios Eventuais', icon: <Package size={24} />, desc: 'Cestas Básicas e Auxílios' },
    { name: 'BPC', icon: <FileCheck size={24} />, desc: 'Benefício Prestação Continuada' },
    { name: 'Carteira do Idoso', icon: <ScrollText size={24} />, desc: 'Emissão e Controle' },
    { name: 'Casas de Acolhimento', icon: <BedDouble size={24} />, desc: 'Abrigos Municipais' },
    { name: 'Centro do Idoso', icon: <UserCog size={24} />, desc: 'Convivência e Fortalecimento' },
    { name: 'Conselho Tutelar', icon: <Baby size={24} />, desc: 'Proteção à Criança' },
    { name: 'Criança Feliz', icon: <Smile size={24} />, desc: 'Visitação Domiciliar' },
    { name: 'Fundos Municipais', icon: <Coins size={24} />, desc: 'Gestão Financeira Social' },
    { name: 'Gestão CRAS', icon: <Users2 size={24} />, desc: 'Proteção Básica' },
    { name: 'Gestão CREAS', icon: <ShieldAlert size={24} />, desc: 'Proteção Especial' },
    { name: 'Gestão do Bolsa Família', icon: <HeartHandshake size={24} />, desc: 'Acompanhamento de Beneficiários' },
    { name: 'Gestão do CadÚnico', icon: <FileSpreadsheet size={24} />, desc: 'Base de Dados Federal' },
    { name: 'Habitação', icon: <Home size={24} />, desc: 'Programas de Moradia' },
    { name: 'Inclusão Produtiva', icon: <Briefcase size={24} />, desc: 'Cursos e Capacitação' },
    { name: 'Mulher Protegida', icon: <Shield size={24} />, desc: 'Combate à Violência' },
    { name: 'Pessoa com Deficiência', icon: <Accessibility size={24} />, desc: 'Acessibilidade e Direitos' },
    { name: 'População de Rua', icon: <Warehouse size={24} />, desc: 'Abordagem Social' },
    { name: 'Prontuário SUAS', icon: <ClipboardList size={24} />, desc: 'Histórico Social' },
    { name: 'Restaurante Popular', icon: <Utensils size={24} />, desc: 'Segurança Alimentar' },
    { name: 'Vigilância Socioassistencial', icon: <BrainCircuit size={24} />, desc: 'Indicadores e Metas' },
  ];

  // Modules for Technology (Sorted Alphabetically)
  const technologyModules = [
    { name: 'Acesso Remoto (VPN)', icon: <GlobeLock size={24} />, desc: 'Conectividade Segura' },
    { name: 'Backup e Disaster Recovery', icon: <DatabaseBackup size={24} />, desc: 'Cópias e Recuperação' },
    { name: 'Computação em Nuvem', icon: <Cloud size={24} />, desc: 'Serviços Online' },
    { name: 'Data Center', icon: <Server size={24} />, desc: 'Servidores e Storage' },
    { name: 'Desenvolvimento e Integração', icon: <GitBranch size={24} />, desc: 'APIs e Novos Projetos' },
    { name: 'Geoprocessamento', icon: <Globe size={24} />, desc: 'Mapas e Cadastros (GIS)' },
    { name: 'Gestão de Ativos', icon: <Laptop size={24} />, desc: 'Inventário de Hardware' },
    { name: 'Gestão de Licenças', icon: <FileKey size={24} />, desc: 'Controle de Software Legal' },
    { name: 'Gestão de Softwares', icon: <Code size={24} />, desc: 'Sistemas Internos' },
    { name: 'Gestão de Usuários', icon: <UserCheck size={24} />, desc: 'Controle de Acessos e AD' },
    { name: 'Identidade Digital', icon: <Fingerprint size={24} />, desc: 'Autenticação e Biometria' },
    { name: 'Inclusão Digital', icon: <MousePointer2 size={24} />, desc: 'Telecentros e Cursos' },
    { name: 'Infraestrutura de Rede', icon: <Network size={24} />, desc: 'Conectividade e Fibra' },
    { name: 'Internet das Coisas', icon: <Signal size={24} />, desc: 'Sensores IoT' },
    { name: 'Monitoramento Urbano', icon: <Camera size={24} />, desc: 'Câmeras e Segurança' },
    { name: 'Projetos de TI', icon: <FolderKanban size={24} />, desc: 'PMO e Cronogramas' },
    { name: 'Proteção de Dados', icon: <Lock size={24} />, desc: 'LGPD e Privacidade' },
    { name: 'Rádio Comunicação', icon: <Radio size={24} />, desc: 'Sistemas Operacionais' },
    { name: 'Segurança da Info.', icon: <ShieldCheck size={24} />, desc: 'Firewall e Antivírus' },
    { name: 'Smart City', icon: <BrainCircuit size={24} />, desc: 'Inteligência Urbana' },
    { name: 'Suporte Técnico', icon: <Headset size={24} />, desc: 'Helpdesk e Chamados' },
    { name: 'Telecomunicação', icon: <RadioTower size={24} />, desc: 'Torres e Links' },
    { name: 'Telefonia VoIP', icon: <Phone size={24} />, desc: 'Comunicação Interna' },
    { name: 'Wi-Fi Público', icon: <Wifi size={24} />, desc: 'Pontos de Acesso Gratuitos' },
  ];

  // Modules for Education (Sorted Alphabetically)
  const educationModules = [
    { name: 'Almoxarifado Escolar', icon: <Package size={24} />, desc: 'Material Didático e Consumo' },
    { name: 'Biblioteca Municipal', icon: <Library size={24} />, desc: 'Acervo e Empréstimos' },
    { name: 'Capacitação Docente', icon: <Award size={24} />, desc: 'Cursos e Treinamentos' },
    { name: 'Censo Escolar', icon: <ClipboardList size={24} />, desc: 'Dados Estatísticos' },
    { name: 'Diário de Classe Digital', icon: <BookOpenCheck size={24} />, desc: 'Frequência e Notas' },
    { name: 'Educação Especial', icon: <Accessibility size={24} />, desc: 'Inclusão e Acompanhamento' },
    { name: 'Gestão de Creches', icon: <Baby size={24} />, desc: 'Educação Infantil' },
    { name: 'Gestão de Matrículas', icon: <School size={24} />, desc: 'Controle de Alunos e Vagas' },
    { name: 'Gestão EJA', icon: <GraduationCap size={24} />, desc: 'Educação de Jovens e Adultos' },
    { name: 'Infraestrutura Escolar', icon: <Building2 size={24} />, desc: 'Manutenção e Obras' },
    { name: 'Merenda Escolar', icon: <Utensils size={24} />, desc: 'Cardápio e Nutrição' },
    { name: 'Patrimônio Escolar', icon: <Landmark size={24} />, desc: 'Móveis e Equipamentos' },
    { name: 'Plano de Carreira', icon: <Briefcase size={24} />, desc: 'Gestão de Professores' },
    { name: 'Portal do Aluno', icon: <Globe size={24} />, desc: 'Boletim e Ocorrências' },
    { name: 'Projetos Pedagógicos', icon: <PenTool size={24} />, desc: 'Planejamento e Atividades' },
    { name: 'Transporte Escolar', icon: <Bus size={24} />, desc: 'Rotas e Frota' },
  ];

  // Modules for Environment (Sorted Alphabetically)
  const environmentModules = [
    { name: 'Análise de Solo', icon: <FlaskConical size={24} />, desc: 'Laboratório e Laudos' },
    { name: 'Arborização Urbana', icon: <Leaf size={24} />, desc: 'Inventário e Plantio' },
    { name: 'Aterro Sanitário', icon: <Mountain size={24} />, desc: 'Controle de Descarte' },
    { name: 'Bem-estar Animal', icon: <PawPrint size={24} />, desc: 'Castração e Adoção' },
    { name: 'Cadastro Rural', icon: <MapPin size={24} />, desc: 'CAR e Propriedades' },
    { name: 'Coleta de Resíduos', icon: <Trash2 size={24} />, desc: 'Gestão de Lixo Urbano' },
    { name: 'Controle de Pragas', icon: <Scan size={24} />, desc: 'Vigilância Sanitária' },
    { name: 'Denúncias Ambientais', icon: <Megaphone size={24} />, desc: 'Canal de Reporte' },
    { name: 'Educação Ambiental', icon: <Sprout size={24} />, desc: 'Projetos e Conscientização' },
    { name: 'Fiscalização Ambiental', icon: <ShieldAlert size={24} />, desc: 'Vistorias e Autos' },
    { name: 'Gestão de Parques', icon: <Flower2 size={24} />, desc: 'Áreas Verdes e Praças' },
    { name: 'Licenciamento Ambiental', icon: <FileCheck size={24} />, desc: 'Emissão de Licenças' },
    { name: 'Podas e Cortes', icon: <TreePine size={24} />, desc: 'Manejo de Vegetação' },
    { name: 'Reciclagem', icon: <Recycle size={24} />, desc: 'Cooperativas e EcoPontos' },
    { name: 'Recursos Hídricos', icon: <Droplets size={24} />, desc: 'Nascentes e Rios' },
  ];

  // HR State
  const [hrTab, setHrTab] = useState<'dashboard' | 'pessoas' | 'folha' | 'ponto' | 'sesmt' | 'previdencia' | 'esocial'>('dashboard');

  // Purchasing and Bidding State
  const [purchasingTab, setPurchasingTab] = useState<'dashboard' | 'licitacoes' | 'compras' | 'contratos' | 'cadastros'>('dashboard');

  // Planning and Budget State
  const [planningTab, setPlanningTab] = useState<'dashboard' | 'ppa' | 'ldo' | 'loa' | 'audiencias' | 'relatorios'>('dashboard');
  const [ppaVersion, setPpaVersion] = useState('V1 - Proposta Inicial');
  
  // Public Accounting State
  const [accountingTab, setAccountingTab] = useState<'dashboard' | 'orcamento' | 'execucao' | 'financeiro' | 'relatorios'>('dashboard');

  // Hospital Dashboard State
  const [activeHospitalTab, setActiveHospitalTab] = useState('beds');

  // Warehouse Module State
  const [activeWarehouseTab, setActiveWarehouseTab] = useState('dashboard');
  const [activeReport, setActiveReport] = useState<string | null>(null);
  const [warehouseItems, setWarehouseItems] = useState([
    { id: 'MAT-001', name: 'Papel A4 (Caixa)', stock: 45, min: 20, unit: 'CX', price: 185.00, status: 'Normal', expiry: null, locked: false },
    { id: 'MAT-002', name: 'Caneta Esferográfica Azul', stock: 12, min: 50, unit: 'UN', price: 1.50, status: 'Crítico', expiry: null, locked: false },
    { id: 'MED-055', name: 'Dipirona 500mg', stock: 2000, min: 500, unit: 'CP', price: 0.25, status: 'Normal', expiry: '2024-06-15', locked: false },
    { id: 'MED-089', name: 'Soro Fisiológico 500ml', stock: 150, min: 100, unit: 'FR', price: 4.50, status: 'Normal', expiry: '2025-10-10', locked: false },
    { id: 'LIM-010', name: 'Desinfetante 5L', stock: 8, min: 10, unit: 'GL', price: 22.90, status: 'Baixo', expiry: null, locked: false },
  ]);

  const [warehouseReqs, setWarehouseReqs] = useState([
    { id: 'REQ-2024/991', dept: 'Secretaria de Saúde', date: '2024-05-28', status: 'Pendente', items: [{itemId: 'MED-055', qty: 100}], totalItems: 1 },
    { id: 'REQ-2024/990', dept: 'Gabinete do Prefeito', date: '2024-05-27', status: 'Atendido Parcial', items: [{itemId: 'MAT-001', qty: 2}], totalItems: 5 },
    { id: 'REQ-2024/988', dept: 'Escola Municipal Central', date: '2024-05-26', status: 'Atendido', items: [{itemId: 'MAT-002', qty: 10}], totalItems: 12 },
  ]);

  const [isInventoryLocked, setIsInventoryLocked] = useState(false);
  const [showEntryModal, setShowEntryModal] = useState(false);
  
  // Invoice Entry States
  const [invoiceHeader, setInvoiceHeader] = useState({ number: '', series: '', supplier: '', key: '', date: '' });
  const [invoiceItemsList, setInvoiceItemsList] = useState<InvoiceItem[]>([]);
  const [tempEntry, setTempEntry] = useState({ itemId: 'MAT-001', qty: 0, cost: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New Request Modal State
  const [showReqModal, setShowReqModal] = useState(false);
  const [tempReq, setTempReq] = useState({ dept: 'Secretaria de Saúde', items: [] as {itemId: string, qty: number}[] });
  const [tempReqItem, setTempReqItem] = useState({ itemId: 'MAT-001', qty: 1 });

  const handleXmlImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      showToast(`Processando NFe ${file.name}...`, 'info');
      // Simulation of XML parsing
      setTimeout(() => {
        setInvoiceHeader({
           number: '000.459.201',
           series: '1',
           supplier: 'Distribuidora ABC Ltda',
           key: '3524 0512 3456 7890 1234 5500 1000 4592 0110 0023 4567',
           date: new Date().toISOString().split('T')[0]
        });
        
        setInvoiceItemsList([
           { itemId: 'MAT-001', itemName: 'Papel A4 (Caixa)', qty: 50, cost: 18.50, total: 925.00 },
           { itemId: 'MAT-002', itemName: 'Caneta Esferográfica Azul', qty: 100, cost: 1.20, total: 120.00 }
        ]);

        setShowEntryModal(true);
        showToast('Nota Fiscal importada com sucesso!', 'success');
        if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input
      }, 1500);
    }
  };

  // Queue System State
  const [showTVMode, setShowTVMode] = useState(false);
  const [currentTicket, setCurrentTicket] = useState({ number: 'A-102', desk: '03', type: 'Geral', status: 'Atendido' });
  const [waitingQueue, setWaitingQueue] = useState<QueueItem[]>([
     { number: 'A-103', type: 'Geral', timestamp: new Date() },
     { number: 'P-056', type: 'Prioritário', timestamp: new Date() },
     { number: 'A-104', type: 'Geral', timestamp: new Date() },
     { number: 'A-105', type: 'Geral', timestamp: new Date() },
     { number: 'E-012', type: 'Exames', timestamp: new Date() },
  ]);
  const [queueHistory, setQueueHistory] = useState([
    { number: 'P-055', time: '10:45', status: 'Atendido', desk: '01' },
    { number: 'A-101', time: '10:42', status: 'Atendido', desk: '03' },
    { number: 'A-100', time: '10:30', status: 'Cancelado', desk: '-' },
  ]);

  // UI States for Queue System
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [manualType, setManualType] = useState<'Geral' | 'Prioritário' | 'Exames'>('Geral');
  const [toast, setToast] = useState<{msg: string, type: 'success' | 'info' | 'error'} | null>(null);

  const showToast = (msg: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Audio / Speech Function
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Warehouse Handlers
  const addItemToInvoice = () => {
     if (tempEntry.qty <= 0 || tempEntry.cost <= 0) return;
     
     const product = warehouseItems.find(i => i.id === tempEntry.itemId);
     if (!product) return;

     const newItem: InvoiceItem = {
        itemId: tempEntry.itemId,
        itemName: product.name,
        qty: tempEntry.qty,
        cost: tempEntry.cost,
        total: tempEntry.qty * tempEntry.cost
     };

     setInvoiceItemsList(prev => [...prev, newItem]);
     setTempEntry({ itemId: 'MAT-001', qty: 0, cost: 0 }); // Reset form
  };

  const removeInvoiceItem = (index: number) => {
     setInvoiceItemsList(prev => prev.filter((_, i) => i !== index));
  };

  const processInvoiceEntry = () => {
      if (isInventoryLocked) {
          showToast('Erro: Inventário em andamento. Movimentação bloqueada.', 'error');
          return;
      }
      if (invoiceItemsList.length === 0) {
         showToast('Adicione pelo menos um item à nota.', 'error');
         return;
      }

      const updatedItems = [...warehouseItems];

      invoiceItemsList.forEach(invoiceItem => {
         const index = updatedItems.findIndex(i => i.id === invoiceItem.itemId);
         if (index !== -1) {
            const currentItem = updatedItems[index];
            const newStock = currentItem.stock + invoiceItem.qty;
            
            // Weighted Average Price Calculation
            const currentTotalValue = currentItem.stock * currentItem.price;
            const invoiceTotalValue = invoiceItem.qty * invoiceItem.cost;
            const newPrice = (currentTotalValue + invoiceTotalValue) / newStock;

            updatedItems[index] = {
               ...currentItem,
               stock: newStock,
               price: newPrice,
               status: newStock < currentItem.min ? 'Crítico' : 'Normal'
            };
         }
      });

      setWarehouseItems(updatedItems);
      showToast(`Nota Fiscal ${invoiceHeader.number} processada com sucesso!`, 'success');
      setShowEntryModal(false);
      
      // Reset invoice data
      setInvoiceHeader({ number: '', series: '', supplier: '', key: '', date: '' });
      setInvoiceItemsList([]);
  };

  const handleAddReqItem = () => {
     if (tempReqItem.qty <= 0) {
        showToast('Quantidade deve ser maior que zero.', 'info');
        return;
     }
     setTempReq(prev => ({
        ...prev,
        items: [...prev.items, tempReqItem]
     }));
     setTempReqItem({ itemId: 'MAT-001', qty: 1 }); // Reset item input
  };

  const handleFinalizeReq = () => {
     if (tempReq.items.length === 0) {
        showToast('Adicione pelo menos um item à requisição.', 'error');
        return;
     }

     const newReq = {
        id: `REQ-${new Date().getFullYear()}/${Math.floor(Math.random() * 1000)}`,
        dept: tempReq.dept,
        date: new Date().toISOString(),
        status: 'Pendente',
        items: tempReq.items,
        totalItems: tempReq.items.reduce((acc, i) => acc + i.qty, 0)
     };

     // @ts-ignore
     setWarehouseReqs(prev => [newReq, ...prev]);
     showToast('Requisição criada com sucesso!', 'success');
     setShowReqModal(false);
     setTempReq({ dept: 'Secretaria de Saúde', items: [] });
  };

  const handleFulfillReq = (reqId: string) => {
      if (isInventoryLocked) {
          showToast('Erro: Inventário em andamento. Saídas bloqueadas.', 'error');
          return;
      }
      
      const req = warehouseReqs.find(r => r.id === reqId);
      if (!req || req.status === 'Atendido') return;

      const itemReq = req.items[0]; // Simplified for demo
      const stockItem = warehouseItems.find(i => i.id === itemReq.itemId);

      if (stockItem) {
          if (stockItem.stock >= itemReq.qty) {
              // Deduct Stock
              setWarehouseItems(prev => prev.map(i => {
                  if (i.id === itemReq.itemId) {
                      const newStock = i.stock - itemReq.qty;
                      return { ...i, stock: newStock, status: newStock < i.min ? 'Crítico' : i.status };
                  }
                  return i;
              }));
              // Update Req Status
              setWarehouseReqs(prev => prev.map(r => r.id === reqId ? { ...r, status: 'Atendido' } : r));
              showToast(`Requisição ${reqId} atendida com sucesso.`, 'success');
          } else {
              // Partial or Fail (Regra 2 & 9)
              showToast(`Estoque insuficiente (${stockItem.stock} disp). Atendimento cancelado.`, 'error');
          }
      }
  };

  // Report Rendering Logic
  const renderReportView = () => {
     switch (activeReport) {
        case 'kardex':
           return (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                 <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <FileBarChart className="text-blue-600" size={24} /> Ficha Kardex
                 </h3>
                 <div className="mb-6 p-4 bg-slate-50 rounded-lg flex items-end gap-4">
                    <div className="flex-1">
                       <label className="block text-sm font-medium text-slate-700 mb-1">Selecionar Produto</label>
                       <select className="w-full border border-slate-300 rounded-lg p-2 bg-white">
                          {warehouseItems.map(item => <option key={item.id}>{item.id} - {item.name}</option>)}
                       </select>
                    </div>
                    <div className="w-40">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Período</label>
                        <select className="w-full border border-slate-300 rounded-lg p-2 bg-white">
                           <option>Últimos 30 dias</option>
                           <option>Este Ano</option>
                        </select>
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700">Gerar</button>
                 </div>
                 <table className="w-full text-sm text-left">
                    <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                       <tr>
                          <th className="p-3">Data</th>
                          <th className="p-3">Documento</th>
                          <th className="p-3">Histórico</th>
                          <th className="p-3 text-right">Entrada</th>
                          <th className="p-3 text-right">Saída</th>
                          <th className="p-3 text-right">Saldo</th>
                          <th className="p-3 text-right">Custo Médio</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       <tr className="hover:bg-slate-50">
                          <td className="p-3">01/05/2024</td>
                          <td className="p-3 font-mono text-slate-500">-</td>
                          <td className="p-3">Saldo Inicial</td>
                          <td className="p-3 text-right text-green-600">-</td>
                          <td className="p-3 text-right text-red-600">-</td>
                          <td className="p-3 text-right font-bold">120</td>
                          <td className="p-3 text-right">R$ 180,00</td>
                       </tr>
                       <tr className="hover:bg-slate-50">
                          <td className="p-3">05/05/2024</td>
                          <td className="p-3 font-mono text-slate-500">REQ-882</td>
                          <td className="p-3">Req. Secretaria Educação</td>
                          <td className="p-3 text-right text-green-600">-</td>
                          <td className="p-3 text-right text-red-600">20</td>
                          <td className="p-3 text-right font-bold">100</td>
                          <td className="p-3 text-right">R$ 180,00</td>
                       </tr>
                       <tr className="hover:bg-slate-50">
                          <td className="p-3">10/05/2024</td>
                          <td className="p-3 font-mono text-slate-500">NF-1029</td>
                          <td className="p-3">Entrada Fornecedor A</td>
                          <td className="p-3 text-right text-green-600">50</td>
                          <td className="p-3 text-right text-red-600">-</td>
                          <td className="p-3 text-right font-bold">150</td>
                          <td className="p-3 text-right">R$ 182,50</td>
                       </tr>
                    </tbody>
                 </table>
              </div>
           );
        case 'financeiro':
           return (
              <div className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-green-200 shadow-sm">
                       <p className="text-sm text-slate-500 font-medium">Valor Total em Estoque</p>
                       <h3 className="text-3xl font-bold text-slate-800 mt-2">
                          R$ {warehouseItems.reduce((acc, i) => acc + (i.stock * i.price), 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                       </h3>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                       <p className="text-sm text-slate-500 font-medium">Curva ABC (Classe A)</p>
                       <h3 className="text-3xl font-bold text-slate-800 mt-2">80% <span className="text-sm font-normal text-slate-400">do valor</span></h3>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                       <p className="text-sm text-slate-500 font-medium">Giro de Estoque</p>
                       <h3 className="text-3xl font-bold text-slate-800 mt-2">4.5 <span className="text-sm font-normal text-slate-400">x/ano</span></h3>
                    </div>
                 </div>
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-lg mb-4 text-slate-800">Detalhamento por Item (Top 5 Valor)</h3>
                    <table className="w-full text-sm text-left">
                       <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                          <tr>
                             <th className="p-3">Item</th>
                             <th className="p-3 text-right">Estoque</th>
                             <th className="p-3 text-right">Custo Unit.</th>
                             <th className="p-3 text-right">Valor Total</th>
                             <th className="p-3 text-center">% Total</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100">
                          {warehouseItems.map(item => ({...item, total: item.stock * item.price}))
                             .sort((a,b) => b.total - a.total)
                             .map((item, idx) => (
                             <tr key={idx} className="hover:bg-slate-50">
                                <td className="p-3 font-medium">{item.name}</td>
                                <td className="p-3 text-right">{item.stock}</td>
                                <td className="p-3 text-right">R$ {item.price.toFixed(2)}</td>
                                <td className="p-3 text-right font-bold">R$ {item.total.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
                                <td className="p-3 text-center text-slate-500">
                                   {((item.total / warehouseItems.reduce((acc, i) => acc + (i.stock * i.price), 0)) * 100).toFixed(1)}%
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
           );
        case 'validade':
           return (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                 <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-amber-700">
                    <CalendarClock size={24} /> Controle de Validade (Lotes)
                 </h3>
                 <div className="space-y-3">
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex justify-between items-center">
                       <div>
                          <p className="font-bold text-red-800">Dipirona 500mg (Lote XYZ-99)</p>
                          <p className="text-sm text-red-600">Vence em: 15/06/2024 (Crítico)</p>
                       </div>
                       <span className="bg-white px-3 py-1 rounded border border-red-200 text-sm font-bold text-red-700">200 un</span>
                    </div>
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex justify-between items-center">
                       <div>
                          <p className="font-bold text-amber-800">Soro Fisiológico (Lote AABB)</p>
                          <p className="text-sm text-amber-600">Vence em: 10/10/2025 (Atenção)</p>
                       </div>
                       <span className="bg-white px-3 py-1 rounded border border-amber-200 text-sm font-bold text-amber-700">150 un</span>
                    </div>
                    {warehouseItems.filter(i => !i.expiry).length > 0 && (
                       <p className="text-center text-slate-400 py-4 italic">Outros {warehouseItems.filter(i => !i.expiry).length} itens não possuem controle de lote ativado.</p>
                    )}
                 </div>
              </div>
           );
        case 'anual':
           return (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                 <h3 className="font-bold text-lg mb-6">Resumo Anual de Movimentações (2024)</h3>
                 <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={[
                          {name: 'Jan', in: 4000, out: 2400},
                          {name: 'Fev', in: 3000, out: 1398},
                          {name: 'Mar', in: 2000, out: 5800},
                          {name: 'Abr', in: 2780, out: 3908},
                          {name: 'Mai', in: 1890, out: 4800},
                          {name: 'Jun', in: 2390, out: 3800},
                       ]}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="in" name="Entradas (R$)" fill="#10b981" radius={[4,4,0,0]} />
                          <Bar dataKey="out" name="Saídas (R$)" fill="#f97316" radius={[4,4,0,0]} />
                       </BarChart>
                    </ResponsiveContainer>
                 </div>
              </div>
           );
        case 'contabil':
           return (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
                 <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600">
                    <Calculator size={32} />
                 </div>
                 <h3 className="font-bold text-lg mb-2">Exportação Contábil (RMA)</h3>
                 <p className="text-slate-500 mb-6 max-w-md mx-auto">Gere o arquivo de integração para o sistema de contabilidade pública, contendo todas as entradas por empenho e baixas por centro de custo.</p>
                 
                 <div className="bg-slate-50 p-4 rounded-lg max-w-lg mx-auto text-left mb-6 border border-slate-200">
                    <p className="text-sm font-mono text-slate-600 mb-1">Período: <strong>Maio/2024</strong></p>
                    <p className="text-sm font-mono text-slate-600 mb-1">Total Entradas: <strong>R$ 15.420,00</strong></p>
                    <p className="text-sm font-mono text-slate-600 mb-1">Total Saídas: <strong>R$ 12.890,50</strong></p>
                    <p className="text-sm font-mono text-slate-600">Registros: <strong>145</strong></p>
                 </div>

                 <button className="bg-slate-800 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-900 flex items-center gap-2 mx-auto">
                    <Download size={20} /> Baixar Arquivo de Integração
                 </button>
              </div>
           );
        default:
           return null;
     }
  }

  // Queue System Logic
  const handleCallNext = () => {
    if (waitingQueue.length === 0) return showToast("Fila vazia!", "info");
    
    // Logic to pick next: Priority first
    const nextPriorityIndex = waitingQueue.findIndex(i => i.type === 'Prioritário');
    const nextIndex = nextPriorityIndex >= 0 ? nextPriorityIndex : 0;
    const next = waitingQueue[nextIndex];

    // Archive current if occupied
    if (currentTicket.status === 'Atendido') {
       const historyItem = {
          number: currentTicket.number,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'}),
          status: 'Atendido',
          desk: currentTicket.desk
       };
       setQueueHistory(prev => [historyItem, ...prev].slice(0, 5));
    }

    const newTicketState = { number: next.number, desk: '03', type: next.type, status: 'Atendido' };
    setCurrentTicket(newTicketState);
    setWaitingQueue(prev => prev.filter((_, i) => i !== nextIndex));

    speak(`Senha ${next.number}, guichê 03`);
  };

  const handleRepeatCall = () => {
    if (currentTicket.status !== 'Atendido') return;
    speak(`Atenção, senha ${currentTicket.number}, comparecer ao guichê 03`);
  };

  const handleFinish = () => {
    if (currentTicket.status === 'Livre') return;

    // Save history
    const historyItem = {
      number: currentTicket.number,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'}),
      status: 'Concluído',
      desk: currentTicket.desk
    };
    setQueueHistory(prev => [historyItem, ...prev].slice(0, 5));

    // Set desk to free
    setCurrentTicket(prev => ({ ...prev, number: '---', type: 'Geral', status: 'Livre' }));
    showToast("Atendimento finalizado com sucesso.", "success");
  };

  const handleAbsent = () => {
    if (currentTicket.status === 'Livre') return;

    // Save history as absent
    const historyItem = {
      number: currentTicket.number,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'}),
      status: 'Ausente',
      desk: currentTicket.desk
    };
    setQueueHistory(prev => [historyItem, ...prev].slice(0, 5));

    // Set desk to free
    setCurrentTicket(prev => ({ ...prev, number: '---', type: 'Geral', status: 'Livre' }));
    showToast("Paciente marcado como ausente.", "info");
  };

  const handleManualEntryClick = () => {
    setManualInput('');
    setManualType('Geral');
    setShowManualModal(true);
  };

  const confirmManualEntry = () => {
    if (!manualInput) return;
    
    // Archive current if occupied
    if (currentTicket.status === 'Atendido') {
       const historyItem = {
         number: currentTicket.number,
         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'}),
         status: 'Atendido',
         desk: currentTicket.desk
       };
       setQueueHistory(prev => [historyItem, ...prev].slice(0, 5));
    }

    const formattedNumber = manualInput.toUpperCase();
    setCurrentTicket({ number: formattedNumber, desk: '03', type: manualType, status: 'Atendido' });
    speak(`Senha ${formattedNumber}, guichê 03`);
    setShowManualModal(false);
    showToast(`Senha ${formattedNumber} chamada manualmente.`, "success");
  };

  const addToQueueManual = () => {
    if (!manualInput) return;
    const formattedNumber = manualInput.toUpperCase();
    
    const newTicket: QueueItem = {
        number: formattedNumber,
        type: manualType,
        timestamp: new Date()
    };
    
    setWaitingQueue(prev => [...prev, newTicket]);
    setShowManualModal(false);
    showToast(`Senha ${formattedNumber} adicionada à fila.`, "success");
  };

  const handleIssueTicket = (type: 'Geral' | 'Prioritário' | 'Exames') => {
     let lastNum = 0;
     const prefix = type === 'Geral' ? 'A' : type === 'Prioritário' ? 'P' : 'E';
     const allNumbers = [...waitingQueue.map(i => i.number), currentTicket.number];
     const matchingNumbers = allNumbers.filter(n => n.startsWith(prefix));
     
     if (matchingNumbers.length > 0) {
        const nums = matchingNumbers.map(n => parseInt(n.split('-')[1]) || 0);
        lastNum = Math.max(...nums);
     } else {
        lastNum = 99;
     }

     const newNumber = `${prefix}-${lastNum + 1}`;
     const newTicket: QueueItem = {
        number: newNumber,
        type: type,
        timestamp: new Date()
     };
     setWaitingQueue(prev => [...prev, newTicket]);
     showToast(`Senha ${newNumber} impressa com sucesso!`, "success");
  };

  // User Management State
  const [usersList, setUsersList] = useState<UserData[]>([
    { id: 1, name: 'Ana Pereira', email: 'ana.pereira@sausen.tech', role: 'Administrador', status: 'Ativo', department: 'Tecnologia' },
    { id: 2, name: 'Carlos Silva', email: 'carlos.silva@sausen.tech', role: 'Gerente', status: 'Ativo', department: 'Recursos Humanos' },
    { id: 3, name: 'Beatriz Costa', email: 'beatriz.costa@sausen.tech', role: 'Operador', status: 'Inativo', department: 'Financeiro' },
    { id: 4, name: 'João Santos', email: 'joao.santos@sausen.tech', role: 'Auditor', status: 'Ativo', department: 'Controladoria' },
    { id: 5, name: 'Fernanda Lima', email: 'fernanda.lima@sausen.tech', role: 'Operador', status: 'Pendente', department: 'Saúde' },
  ]);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [tempUser, setTempUser] = useState<UserData>({
    id: 0, name: '', email: '', role: 'Operador', status: 'Ativo', department: 'Administrativo'
  });

  // Generic Module Mock Data Generator
  const getModuleConfig = (moduleName: string) => {
    // Default config
    let config = {
      theme: 'blue',
      kpis: [
        { title: 'Processos Ativos', value: '124', change: '+5%', icon: <FileText size={20} /> },
        { title: 'Pendências', value: '12', change: '-2%', icon: <AlertCircle size={20} /> },
        { title: 'Concluídos (Mês)', value: '45', change: '+12%', icon: <CheckCircle size={20} /> },
      ],
      chartData: [
        { name: 'Seg', value: 12 }, { name: 'Ter', value: 19 }, { name: 'Qua', value: 15 },
        { name: 'Qui', value: 25 }, { name: 'Sex', value: 22 }, { name: 'Sab', value: 10 },
      ],
      actions: ['Novo Registro', 'Gerar Relatório', 'Configurações'],
      tableHeaders: ['ID', 'Descrição', 'Data', 'Status', 'Responsável'],
      tableData: [
        { c1: '#001', c2: 'Atualização Cadastral', c3: '10/05/2024', c4: 'Concluído', c5: 'João Silva' },
        { c1: '#002', c2: 'Solicitação de Análise', c3: '11/05/2024', c4: 'Pendente', c5: 'Maria Souza' },
        { c1: '#003', c2: 'Revisão Mensal', c3: '12/05/2024', c4: 'Em Progresso', c5: 'Carlos Lima' },
      ]
    };

    // Check Categories
    const isHealth = healthModules.some(m => m.name === moduleName);
    const isSocial = socialModules.some(m => m.name === moduleName);
    const isEducation = educationModules.some(m => m.name === moduleName);
    const isEnvironment = environmentModules.some(m => m.name === moduleName);
    const isTech = technologyModules.some(m => m.name === moduleName);
    const isHospital = hospitalModules.some(m => m.name === moduleName);

    // 1. Financial & Fiscal
    if (['Planejamento e Orçamento', 'Contabilidade Pública', 'Nota Fiscal Eletrônica', 'Escrita Fiscal', 'Controle da Arrecadação', 'Dívida Ativa', 'Tesouraria', 'IPTU', 'ISSQN', 'Taxas e Tarifas', 'Contribuição de Melhoria'].includes(moduleName)) {
      config.theme = 'emerald';
      config.kpis = [
        { title: 'Receita (Mês)', value: 'R$ 1.2M', change: '+8%', icon: <DollarSign size={20} /> },
        { title: 'Despesa Empenhada', value: 'R$ 850k', change: '-1%', icon: <TrendingUp size={20} /> },
        { title: 'Inadimplência', value: '4.2%', change: '-0.5%', icon: <AlertOctagon size={20} /> },
      ];
      config.actions = ['Novo Lançamento', 'Emitir Guia', 'Conciliação Bancária', 'Relatório Fiscal'];
      config.tableHeaders = ['Documento', 'Referência', 'Vencimento', 'Valor', 'Status'];
      config.tableData = [
        { c1: 'NF-e 2024/5501', c2: 'Serviços de TI', c3: '15/06/2024', c4: 'R$ 15.000,00', c5: 'Pago' },
        { c1: 'IPTU Lote 44', c2: 'Quadra 12', c3: '10/06/2024', c4: 'R$ 450,00', c5: 'Aberto' },
        { c1: 'Empenho 882', c2: 'Material Escritório', c3: '12/06/2024', c4: 'R$ 2.300,00', c5: 'Liquidado' },
      ];
    }

    // 2. HR
    else if (['Recursos Humanos', 'Folha de Pagamento', 'Gestão de Pessoas'].includes(moduleName)) {
      config.theme = 'indigo';
      config.kpis = [
        { title: 'Servidores Ativos', value: '2,450', change: '+12', icon: <Users size={20} /> },
        { title: 'Folha Bruta', value: 'R$ 8.5M', change: '+2%', icon: <DollarSign size={20} /> },
        { title: 'Férias/Licenças', value: '145', change: '0%', icon: <CalendarClock size={20} /> },
      ];
      config.actions = ['Admitir Servidor', 'Lançar Férias', 'Processar Folha', 'Holerites'];
      config.tableHeaders = ['Matrícula', 'Nome', 'Cargo', 'Departamento', 'Situação'];
      config.tableData = [
        { c1: '10293-1', c2: 'Roberto Almeida', c3: 'Analista', c4: 'Fazenda', c5: 'Ativo' },
        { c1: '44920-2', c2: 'Juliana Paes', c3: 'Professor I', c4: 'Educação', c5: 'Férias' },
        { c1: '33211-5', c2: 'Marcos Santos', c3: 'Motorista', c4: 'Saúde', c5: 'Ativo' },
      ];
    }

    // 3. Logistics & Assets
    else if (['Compras e Licitações', 'Patrimônio', 'Almoxarifado', 'Frotas'].includes(moduleName)) {
      config.theme = 'orange';
      config.kpis = [
        { title: 'Licitações Abertas', value: '8', change: '2', icon: <Gavel size={20} /> },
        { title: 'Itens em Estoque', value: '15.4k', change: '-500', icon: <Package size={20} /> },
        { title: 'Frota em Uso', value: '45/50', change: '90%', icon: <Truck size={20} /> },
      ];
      config.actions = ['Nova Requisição', 'Entrada Nota', 'Saída Estoque', 'Manutenção Frota'];
      config.tableHeaders = ['Código', 'Item/Veículo', 'Localização', 'Quantidade/KM', 'Status'];
      config.tableData = [
        { c1: 'PAT-00441', c2: 'Notebook Dell', c3: 'Gabinete', c4: '1 un', c5: 'Em Uso' },
        { c1: 'VCL-2022', c2: 'Ambulância UTI', c3: 'SAMU Base', c4: '45.200 km', c5: 'Disponível' },
        { c1: 'REQ-9921', c2: 'Papel A4', c3: 'Almoxarifado Central', c4: '500 cx', c5: 'Estoque Baixo' },
      ];
    }

    // 4. Citizen Services & Protocol
    else if (['Protocolo e Processo Digital', 'Ouvidoria', 'Portal da Transparência', 'Autoatendimento Web'].includes(moduleName)) {
      config.theme = 'sky';
      config.kpis = [
        { title: 'Novos Protocolos', value: '156', change: '+24', icon: <FileText size={20} /> },
        { title: 'Tempo Resposta', value: '2.5d', change: '-4h', icon: <Clock size={20} /> },
        { title: 'Satisfação', value: '4.8/5', change: '+0.1', icon: <Smile size={20} /> },
      ];
      config.actions = ['Abrir Processo', 'Responder Ouvidoria', 'Publicar Edital', 'Configurar Portal'];
      config.tableHeaders = ['Protocolo', 'Solicitante', 'Assunto', 'Data Abertura', 'Prazo'];
      config.tableData = [
        { c1: '2024/05-001', c2: 'Condomínio Solar', c3: 'Alvará de Construção', c4: '20/05/2024', c5: '5 dias' },
        { c1: '2024/05-045', c2: 'Anônimo', c3: 'Denúncia Ambiental', c4: '21/05/2024', c5: 'Urgente' },
        { c1: '2024/05-089', c2: 'Maria José', c3: 'Poda de Árvore', c4: '22/05/2024', c5: '15 dias' },
      ];
    }

    // 5. Audit, Control & Fiscalization
    else if (['Controle Interno', 'Fiscalização Fazendária', 'Obras e Posturas'].includes(moduleName)) {
      config.theme = 'slate';
      config.kpis = [
        { title: 'Processos Auditados', value: '34', change: '+2', icon: <FileCheck size={20} /> },
        { title: 'Irregularidades', value: '5', change: '-1', icon: <AlertCircle size={20} /> },
        { title: 'Conformidade', value: '98%', change: '+0.5%', icon: <ShieldCheck size={20} /> },
      ];
      config.actions = ['Nova Auditoria', 'Emitir Relatório', 'Notificação Fiscal', 'Acompanhar Prazos'];
      config.tableHeaders = ['Nº Processo', 'Objeto/Contribuinte', 'Tipo', 'Data Início', 'Status'];
      config.tableData = [
        { c1: 'AUD-2024/012', c2: 'Secretaria de Obras', c3: 'Rotina', c4: '02/05/2024', c5: 'Em Andamento' },
        { c1: 'FISC-9982', c2: 'Comércio Central Ltda', c3: 'Alvará', c4: '15/05/2024', c5: 'Notificado' },
        { c1: 'AUD-2024/010', c2: 'Folha de Pagamento', c3: 'Denúncia', c4: '10/04/2024', c5: 'Concluído' },
      ];
    }

    // === NEW IMPLEMENTATIONS ===
    
    // Health (Saúde Pública)
    else if (isHealth) {
      config.theme = 'red';
      config.kpis = [
        { title: 'Pacientes na Fila', value: '34', change: '+5', icon: <Users size={20} /> },
        { title: 'Medicamentos Críticos', value: '3', change: '-1', icon: <AlertCircle size={20} /> },
        { title: 'Leitos Disponíveis', value: '12/40', change: '-2', icon: <BedDouble size={20} /> },
      ];
      config.actions = ['Novo Agendamento', 'Dispensar Medicamento', 'Registrar Triagem', 'Boletim Epidemiológico'];
      config.tableHeaders = ['Paciente', 'Cartão SUS', 'Procedimento', 'Médico/Unidade', 'Status'];
      config.tableData = [
        { c1: 'Maria Silva', c2: '892.112.445', c3: 'Consulta Clínica', c4: 'UBS Central', c5: 'Aguardando' },
        { c1: 'João Oliveira', c2: '123.456.789', c3: 'Exame de Sangue', c4: 'Laboratório', c5: 'Coletado' },
        { c1: 'Pedro Santos', c2: '987.654.321', c3: 'Retirada Medicamento', c4: 'Farmácia Popular', c5: 'Entregue' },
      ];
    }

    // Hospital Municipal (NEW)
    else if (isHospital) {
      config.theme = 'rose';
      config.kpis = [
        { title: 'Leitos Ocupados', value: '85%', change: '+5%', icon: <BedDouble size={20} /> },
        { title: 'Atendimentos PS', value: '240', change: '+12%', icon: <Siren size={20} /> },
        { title: 'Cirurgias Agendadas', value: '12', change: '-2', icon: <Activity size={20} /> },
      ];
      config.actions = ['Registrar Admissão', 'Alta Médica', 'Solicitar Exame', 'Prescrição Eletrônica'];
      config.tableHeaders = ['Paciente', 'Prontuário', 'Localização', 'Diagnóstico', 'Situação'];
      config.tableData = [
        { c1: 'Sérgio Mendes', c2: '29381', c3: 'Enfermaria 03 - Leito 01', c4: 'Pneumonia', c5: 'Internado' },
        { c1: 'Amanda Nunes', c2: '29382', c3: 'UTI Geral - Leito 04', c4: 'Pós-Op Cardíaco', c5: 'Estável' },
        { c1: 'Bruno Dias', c2: '29385', c3: 'Box de Emergência 02', c4: 'Fratura de Fêmur', c5: 'Aguardando Cirurgia' },
      ];
    }

    // Social Assistance (Assistência Social)
    else if (isSocial) {
      config.theme = 'purple';
      config.kpis = [
        { title: 'Famílias Atendidas', value: '1,205', change: '+12', icon: <HeartHandshake size={20} /> },
        { title: 'Benefícios Concedidos', value: '45', change: '+5', icon: <Package size={20} /> },
        { title: 'Visitas Pendentes', value: '8', change: '-2', icon: <Home size={20} /> },
      ];
      config.actions = ['Novo Cadastro (CadÚnico)', 'Agendar Visita', 'Conceder Benefício', 'Relatório Social'];
      config.tableHeaders = ['Beneficiário', 'NIS', 'Programa', 'Bairro', 'Situação'];
      config.tableData = [
        { c1: 'Ana Costa', c2: '123.444.555-0', c3: 'Bolsa Família', c4: 'Jd. Flores', c5: 'Ativo' },
        { c1: 'Roberto Lima', c2: '999.888.777-1', c3: 'Auxílio Gás', c4: 'Centro', c5: 'Em Análise' },
        { c1: 'Carla Dias', c2: '555.444.333-2', c3: 'Criança Feliz', c4: 'Vila Nova', c5: 'Acompanhamento' },
      ];
    }

    // Education (Educação)
    else if (isEducation) {
      config.theme = 'blue';
      config.kpis = [
        { title: 'Alunos Matriculados', value: '5,400', change: '+50', icon: <GraduationCap size={20} /> },
        { title: 'Frequência Média', value: '94%', change: '+1%', icon: <UserCheck size={20} /> },
        { title: 'Vagas em Creche', value: '25', change: '-5', icon: <Baby size={20} /> },
      ];
      config.actions = ['Novo Matrícula', 'Lançar Frequência', 'Transporte Escolar', 'Cardápio Merenda'];
      config.tableHeaders = ['Aluno', 'Série/Turma', 'Escola', 'Turno', 'Status'];
      config.tableData = [
        { c1: 'Lucas Pereira', c2: '3º Ano A', c3: 'EMEF Monteiro Lobato', c4: 'Manhã', c5: 'Cursando' },
        { c1: 'Beatriz Almeida', c2: 'Berçário II', c3: 'CMEI Girassol', c4: 'Integral', c5: 'Adaptando' },
        { c1: 'Gabriel Costa', c2: '9º Ano B', c3: 'EMEF Tiradentes', c4: 'Tarde', c5: 'Transferido' },
      ];
    }

    // Environment (Meio Ambiente)
    else if (isEnvironment) {
      config.theme = 'green';
      config.kpis = [
        { title: 'Licenças Emitidas', value: '12', change: '+2', icon: <FileCheck size={20} /> },
        { title: 'Coleta (Toneladas)', value: '450t', change: '-10t', icon: <Trash2 size={20} /> },
        { title: 'Árvores Plantadas', value: '1,500', change: '+200', icon: <TreePine size={20} /> },
      ];
      config.actions = ['Nova Licença', 'Registrar Denúncia', 'Agendar Poda', 'Fiscalização'];
      config.tableHeaders = ['Processo', 'Tipo', 'Requerente/Local', 'Data', 'Parecer'];
      config.tableData = [
        { c1: 'LIC-2024/040', c2: 'Licença Operação', c3: 'Indústria Têxtil', c4: '10/05/2024', c5: 'Aprovado' },
        { c1: 'DEN-2024/112', c2: 'Descarte Irregular', c3: 'Terreno Baldio - Centro', c4: '20/05/2024', c5: 'Multado' },
        { c1: 'SER-2024/005', c2: 'Poda de Árvore', c3: 'Rua das Acácias, 40', c4: '22/05/2024', c5: 'Agendado' },
      ];
    }

    // Technology (Tecnologia) - If not caught by User Management
    else if (isTech) {
      config.theme = 'cyan';
      config.kpis = [
        { title: 'Chamados TI', value: '15', change: '+3', icon: <Headset size={20} /> },
        { title: 'Uptime Servidores', value: '99.9%', change: '0%', icon: <Server size={20} /> },
        { title: 'Backups Realizados', value: '100%', change: '0%', icon: <DatabaseBackup size={20} /> },
      ];
      config.actions = ['Novo Chamado', 'Gerenciar Usuário', 'Monitoramento', 'Inventário'];
      config.tableHeaders = ['Ticket', 'Solicitante', 'Assunto', 'Prioridade', 'Status'];
      config.tableData = [
        { c1: '#4092', c2: 'Sec. Saúde', c3: 'Impressora sem rede', c4: 'Alta', c5: 'Em Atendimento' },
        { c1: '#4093', c2: 'RH', c3: 'Acesso ao sistema', c4: 'Média', c5: 'Resolvido' },
        { c1: '#4094', c2: 'Gabinete', c3: 'Instalação Office', c4: 'Baixa', c5: 'Pendente' },
      ];
    }

    return config;
  };

  // User CRUD Handlers
  const handleOpenUserModal = (user?: UserData) => {
    if (user) {
      setEditingUser(user);
      setTempUser(user);
    } else {
      setEditingUser(null);
      setTempUser({ id: 0, name: '', email: '', role: 'Operador', status: 'Ativo', department: 'Administrativo' });
    }
    setShowUserModal(true);
  };

  const handleSaveUser = () => {
    if (!tempUser.name || !tempUser.email) return;

    if (editingUser) {
      setUsersList(prev => prev.map(u => u.id === tempUser.id ? tempUser : u));
    } else {
      const newUser = { ...tempUser, id: Date.now() };
      setUsersList(prev => [...prev, newUser]);
    }
    setShowUserModal(false);
  };

  const handleDeleteUser = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      setUsersList(prev => prev.filter(u => u.id !== id));
    }
  };

  const categories = [
    { id: 'admin', label: 'Administração Municipal', icon: <Building2 size={20} /> },
    { id: 'social', label: 'Assistência Social', icon: <HandHeart size={20} /> },
    { id: 'education', label: 'Educação Municipal', icon: <GraduationCap size={20} /> },
    { id: 'hospital', label: 'Hospital Municipal', icon: <Hospital size={20} /> },
    { id: 'environment', label: 'Meio Ambiente', icon: <Leaf size={20} /> },
    { id: 'health', label: 'Saúde Municipal', icon: <HeartPulse size={20} /> },
    { id: 'tech', label: 'Tecnologia', icon: <Monitor size={20} /> },
  ];

  const getActiveModules = () => {
    switch (activeCategory) {
      case 'admin': return adminModules;
      case 'health': return healthModules;
      case 'social': return socialModules;
      case 'education': return educationModules;
      case 'environment': return environmentModules;
      case 'tech': return technologyModules;
      case 'hospital': return hospitalModules;
      default: return []; // Overview handles differently
    }
  };

  // --- SPECIFIC RENDERERS ---

  const renderQueueSystem = () => (
    <div className="animate-in fade-in duration-300 h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
           <button onClick={() => setSelectedModule(null)} className="flex items-center text-slate-500 hover:text-slate-800 transition-colors">
             <ChevronLeft size={20} />
           </button>
           <div>
             <h2 className="text-2xl font-bold text-slate-800">Sistema de Senhas</h2>
             <p className="text-sm text-slate-500">Gestão de Atendimento e Filas</p>
           </div>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={() => setShowTVMode(!showTVMode)}
             className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${showTVMode ? 'bg-red-600 text-white' : 'bg-slate-800 text-white'}`}
           >
             <Monitor size={18} /> {showTVMode ? 'Sair do Modo TV' : 'Modo TV (Painel)'}
           </button>
        </div>
      </div>

      {showTVMode ? (
        <div className="flex-1 bg-slate-900 rounded-2xl overflow-hidden flex flex-col relative p-8 text-white">
           <div className="flex-1 flex items-center justify-center">
              <div className="text-center animate-pulse">
                 <p className="text-4xl text-slate-400 mb-4 font-light">SENHA ATUAL</p>
                 <h1 className="text-[12rem] font-bold leading-none tracking-tighter text-white">{currentTicket.number}</h1>
                 <div className="mt-8 flex justify-center gap-12">
                    <div>
                       <p className="text-2xl text-slate-400">GUICHÊ</p>
                       <p className="text-6xl font-bold text-yellow-400">{currentTicket.desk}</p>
                    </div>
                    <div>
                       <p className="text-2xl text-slate-400">TIPO</p>
                       <p className="text-6xl font-bold text-cyan-400">{currentTicket.type}</p>
                    </div>
                 </div>
              </div>
           </div>
           <div className="h-32 bg-slate-800 rounded-xl flex items-center px-8 gap-8 overflow-x-auto">
              <span className="text-xl font-bold text-slate-400 whitespace-nowrap">ÚLTIMAS CHAMADAS:</span>
              {queueHistory.map((h, i) => (
                 <div key={i} className="flex flex-col items-center px-6 border-l border-slate-700">
                    <span className="text-3xl font-bold text-white">{h.number}</span>
                    <span className="text-sm text-slate-400">Guichê {h.desk}</span>
                 </div>
              ))}
           </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
           {/* Current Attendance */}
           <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
                 <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-2">Em Atendimento</p>
                 <div className="flex justify-center items-center gap-8 mb-8">
                    <div className="text-right">
                       <h2 className="text-7xl font-bold text-slate-800">{currentTicket.number}</h2>
                       <p className="text-slate-500 mt-2">{currentTicket.type}</p>
                    </div>
                    <div className="h-20 w-px bg-slate-200"></div>
                    <div className="text-left">
                       <h3 className="text-4xl font-bold text-blue-600">Guichê {currentTicket.desk}</h3>
                       <p className="text-emerald-600 font-medium mt-2 flex items-center gap-1"><Clock size={16} /> 00:00</p>
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button onClick={handleCallNext} className="py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-md flex flex-col items-center gap-2">
                       <Megaphone size={24} /> Chamar Próximo
                    </button>
                    <button onClick={handleRepeatCall} className="py-4 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 shadow-md flex flex-col items-center gap-2">
                       <Volume2 size={24} /> Chamar Novamente
                    </button>
                    <button onClick={handleFinish} className="py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-md flex flex-col items-center gap-2">
                       <CheckCircle size={24} /> Finalizar
                    </button>
                    <button onClick={handleAbsent} className="py-4 bg-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-300 flex flex-col items-center gap-2">
                       <UserMinus size={24} /> Ausente
                    </button>
                 </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2"><ListPlus size={20} /> Fila de Espera</h3>
                    <div className="flex gap-2">
                       <button onClick={handleManualEntryClick} className="px-3 py-1 text-sm bg-slate-100 hover:bg-slate-200 rounded text-slate-700">Entrada Manual</button>
                       <button onClick={() => handleIssueTicket('Geral')} className="px-3 py-1 text-sm bg-blue-50 hover:bg-blue-100 rounded text-blue-700">+ Geral</button>
                       <button onClick={() => handleIssueTicket('Prioritário')} className="px-3 py-1 text-sm bg-red-50 hover:bg-red-100 rounded text-red-700">+ Prioridade</button>
                    </div>
                 </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                       <thead className="bg-slate-50 text-slate-600">
                          <tr>
                             <th className="p-3 rounded-l-lg">Senha</th>
                             <th className="p-3">Tipo</th>
                             <th className="p-3">Chegada</th>
                             <th className="p-3 rounded-r-lg text-right">Ação</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50">
                          {waitingQueue.length === 0 ? (
                             <tr><td colSpan={4} className="p-4 text-center text-slate-400">Ninguém na fila</td></tr>
                          ) : (
                             waitingQueue.map((item, idx) => (
                                <tr key={idx} className="hover:bg-slate-50">
                                   <td className="p-3 font-bold text-slate-700">{item.number}</td>
                                   <td className="p-3">
                                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.type === 'Prioritário' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                                         {item.type}
                                      </span>
                                   </td>
                                   <td className="p-3 text-slate-500">{item.timestamp.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</td>
                                   <td className="p-3 text-right">
                                      <button className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash size={14} /></button>
                                   </td>
                                </tr>
                             ))
                          )}
                       </tbody>
                    </table>
                 </div>
              </div>
           </div>

           {/* Sidebar Info */}
           <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                 <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><History size={20} /> Histórico Recente</h3>
                 <div className="space-y-3">
                    {queueHistory.map((h, i) => (
                       <div key={i} className="flex justify-between items-center text-sm p-2 bg-slate-50 rounded-lg">
                          <div>
                             <span className="font-bold text-slate-700 block">{h.number}</span>
                             <span className="text-xs text-slate-500">{h.time}</span>
                          </div>
                          <div className="text-right">
                             <span className={`text-xs px-2 py-0.5 rounded ${h.status === 'Atendido' ? 'bg-blue-100 text-blue-700' : h.status === 'Concluído' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-500'}`}>
                                {h.status}
                             </span>
                             <span className="text-xs text-slate-400 block">Guichê {h.desk}</span>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl text-white shadow-lg">
                 <h3 className="font-bold mb-2">Estatísticas do Dia</h3>
                 <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                       <p className="text-blue-200 text-xs uppercase">Atendidos</p>
                       <p className="text-3xl font-bold">45</p>
                    </div>
                    <div>
                       <p className="text-blue-200 text-xs uppercase">T. Médio</p>
                       <p className="text-3xl font-bold">5m</p>
                    </div>
                    <div>
                       <p className="text-blue-200 text-xs uppercase">Espera</p>
                       <p className="text-3xl font-bold">12m</p>
                    </div>
                    <div>
                       <p className="text-blue-200 text-xs uppercase">Guichês</p>
                       <p className="text-3xl font-bold">5/8</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Manual Entry Modal */}
      {showManualModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl p-6 w-96 shadow-2xl">
               <h3 className="font-bold text-lg mb-4">Entrada Manual / Chamada</h3>
               <div className="space-y-4">
                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Número da Senha</label>
                     <input 
                        type="text" 
                        value={manualInput} 
                        onChange={(e) => setManualInput(e.target.value)}
                        placeholder="Ex: A-205" 
                        className="w-full border border-slate-300 rounded-lg p-2 uppercase"
                        autoFocus
                     />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
                     <select 
                        value={manualType} 
                        // @ts-ignore
                        onChange={(e) => setManualType(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg p-2"
                     >
                        <option value="Geral">Geral</option>
                        <option value="Prioritário">Prioritário</option>
                        <option value="Exames">Exames</option>
                     </select>
                  </div>
                  <div className="flex gap-2 pt-2">
                     <button onClick={() => setShowManualModal(false)} className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-medium">Cancelar</button>
                     <button onClick={addToQueueManual} className="flex-1 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg text-blue-700 font-medium">Adicionar à Fila</button>
                     <button onClick={confirmManualEntry} className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium">Chamar Agora</button>
                  </div>
               </div>
            </div>
         </div>
      )}
    </div>
  );

  const renderWarehouseModule = () => (
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
           <button onClick={() => setSelectedModule(null)} className="flex items-center text-slate-500 hover:text-slate-800 transition-colors">
             <ChevronLeft size={20} />
           </button>
           <div>
             <h2 className="text-2xl font-bold text-slate-800">Almoxarifado Central</h2>
             <p className="text-sm text-slate-500">Controle de Estoque e Requisições</p>
           </div>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={() => setIsInventoryLocked(!isInventoryLocked)}
             className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${isInventoryLocked ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-slate-100 text-slate-700 border border-slate-200'}`}
           >
             {isInventoryLocked ? <Lock size={16} /> : <LockKeyhole size={16} />} 
             {isInventoryLocked ? 'Inventário em Andamento (Bloqueado)' : 'Bloquear para Inventário'}
           </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-xl w-fit">
         {['dashboard', 'estoque', 'requisicoes', 'entradas', 'relatorios'].map(tab => (
            <button 
               key={tab}
               onClick={() => setActiveWarehouseTab(tab)}
               className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                  activeWarehouseTab === tab ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
               }`}
            >
               {tab}
            </button>
         ))}
      </div>

      {/* Content */}
      {activeWarehouseTab === 'dashboard' && (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
               <div className="flex justify-between items-start">
                  <div>
                     <p className="text-sm text-slate-500 font-medium">Itens Críticos</p>
                     <h3 className="text-3xl font-bold text-red-600 mt-2">{warehouseItems.filter(i => i.status === 'Crítico').length}</h3>
                  </div>
                  <div className="p-2 bg-red-50 text-red-600 rounded-lg"><AlertTriangle size={24} /></div>
               </div>
               <p className="text-xs text-slate-400 mt-2">Abaixo do estoque mínimo</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
               <div className="flex justify-between items-start">
                  <div>
                     <p className="text-sm text-slate-500 font-medium">Valor em Estoque</p>
                     <h3 className="text-3xl font-bold text-slate-800 mt-2">
                        R$ {warehouseItems.reduce((acc, i) => acc + (i.stock * i.price), 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                     </h3>
                  </div>
                  <div className="p-2 bg-green-50 text-green-600 rounded-lg"><DollarSign size={24} /></div>
               </div>
               <p className="text-xs text-slate-400 mt-2">Preço médio ponderado</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
               <div className="flex justify-between items-start">
                  <div>
                     <p className="text-sm text-slate-500 font-medium">Req. Pendentes</p>
                     <h3 className="text-3xl font-bold text-amber-600 mt-2">{warehouseReqs.filter(r => r.status === 'Pendente').length}</h3>
                  </div>
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><ClipboardList size={24} /></div>
               </div>
               <p className="text-xs text-slate-400 mt-2">Aguardando atendimento</p>
            </div>
         </div>
      )}

      {activeWarehouseTab === 'estoque' && (
         <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
               <div className="relative max-w-md w-full">
                  <input type="text" placeholder="Buscar item..." className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm" />
                  <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
               </div>
               <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">+ Novo Item</button>
            </div>
            <table className="w-full text-left text-sm">
               <thead className="bg-white text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                     <th className="p-4">Código</th>
                     <th className="p-4">Descrição</th>
                     <th className="p-4 text-right">Estoque</th>
                     <th className="p-4 text-right">Mínimo</th>
                     <th className="p-4 text-center">Unid.</th>
                     <th className="p-4 text-center">Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {warehouseItems.map(item => (
                     <tr key={item.id} className="hover:bg-slate-50">
                        <td className="p-4 font-mono text-slate-500">{item.id}</td>
                        <td className="p-4 font-medium text-slate-800">{item.name}</td>
                        <td className="p-4 text-right font-bold">{item.stock}</td>
                        <td className="p-4 text-right text-slate-500">{item.min}</td>
                        <td className="p-4 text-center text-slate-500">{item.unit}</td>
                        <td className="p-4 text-center">
                           <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.status === 'Crítico' ? 'bg-red-100 text-red-700' : item.status === 'Baixo' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                              {item.status}
                           </span>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      )}

      {activeWarehouseTab === 'requisicoes' && (
         <div className="space-y-4">
            <div className="flex justify-end">
               <button 
                  onClick={() => setShowReqModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
               >
                  <Plus size={16} /> Nova Requisição
               </button>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
               <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                     <tr>
                        <th className="p-4">ID</th>
                        <th className="p-4">Departamento</th>
                        <th className="p-4">Data</th>
                        <th className="p-4">Itens</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4 text-right">Ações</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {warehouseReqs.map(req => (
                        <tr key={req.id} className="hover:bg-slate-50">
                           <td className="p-4 font-mono text-slate-500">{req.id}</td>
                           <td className="p-4">{req.dept}</td>
                           <td className="p-4 text-slate-500">{req.date}</td>
                           <td className="p-4">{req.totalItems} itens</td>
                           <td className="p-4 text-center">
                              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                 req.status === 'Pendente' ? 'bg-amber-100 text-amber-700' : 
                                 req.status === 'Atendido' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                              }`}>
                                 {req.status}
                              </span>
                           </td>
                           <td className="p-4 text-right">
                              {req.status === 'Pendente' && (
                                 <button 
                                    onClick={() => handleFulfillReq(req.id)}
                                    className="text-blue-600 font-medium hover:underline"
                                 >
                                    Atender
                                 </button>
                              )}
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      )}

      {activeWarehouseTab === 'entradas' && (
         <div className="space-y-6">
            <div className="bg-white p-8 rounded-xl border border-dashed border-slate-300 text-center hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
               <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UploadCloud size={32} />
               </div>
               <h3 className="text-lg font-bold text-slate-800">Importar XML da Nota Fiscal (NFe)</h3>
               <p className="text-slate-500 mt-2">Clique para selecionar ou arraste o arquivo aqui</p>
               <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleXmlImport} 
                  className="hidden" 
                  accept=".xml" 
               />
            </div>
         </div>
      )}

      {activeWarehouseTab === 'relatorios' && (
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-2">
               {['kardex', 'financeiro', 'validade', 'anual', 'contabil'].map(rep => (
                  <button 
                     key={rep}
                     onClick={() => setActiveReport(rep)}
                     className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors border ${
                        activeReport === rep 
                           ? 'bg-blue-50 border-blue-200 text-blue-700' 
                           : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                     }`}
                  >
                     Relatório: {rep.charAt(0).toUpperCase() + rep.slice(1)}
                  </button>
               ))}
            </div>
            <div className="md:col-span-2">
               {activeReport ? renderReportView() : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl p-8">
                     <FileBarChart size={48} className="mb-4 opacity-50" />
                     <p>Selecione um relatório para visualizar</p>
                  </div>
               )}
            </div>
         </div>
      )}
      
      {/* Invoice Entry Modal */}
      {showEntryModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
               <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-2xl">
                  <div>
                     <h3 className="font-bold text-xl text-slate-800">Entrada de Nota Fiscal</h3>
                     <p className="text-sm text-slate-500">Conferência e Lançamento de Estoque</p>
                  </div>
                  <button onClick={() => setShowEntryModal(false)} className="hover:bg-slate-200 p-2 rounded-full"><X size={20} /></button>
               </div>
               
               <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Header Info */}
                  <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                     <div>
                        <span className="text-xs text-slate-500 uppercase font-bold">Número</span>
                        <p className="font-mono font-medium">{invoiceHeader.number}</p>
                     </div>
                     <div>
                        <span className="text-xs text-slate-500 uppercase font-bold">Fornecedor</span>
                        <p className="font-medium">{invoiceHeader.supplier}</p>
                     </div>
                     <div>
                        <span className="text-xs text-slate-500 uppercase font-bold">Data Emissão</span>
                        <p className="font-medium">{invoiceHeader.date}</p>
                     </div>
                     <div className="col-span-3">
                        <span className="text-xs text-slate-500 uppercase font-bold">Chave de Acesso</span>
                        <p className="font-mono text-xs">{invoiceHeader.key}</p>
                     </div>
                  </div>

                  {/* Items Table */}
                  <table className="w-full text-sm text-left">
                     <thead className="bg-slate-100 text-slate-600 font-semibold">
                        <tr>
                           <th className="p-3">Item</th>
                           <th className="p-3 text-right">Qtd</th>
                           <th className="p-3 text-right">Custo Unit.</th>
                           <th className="p-3 text-right">Total</th>
                           <th className="p-3 text-center">Ação</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {invoiceItemsList.map((item, idx) => (
                           <tr key={idx}>
                              <td className="p-3">{item.itemName}</td>
                              <td className="p-3 text-right">{item.qty}</td>
                              <td className="p-3 text-right">R$ {item.cost.toFixed(2)}</td>
                              <td className="p-3 text-right">R$ {item.total.toFixed(2)}</td>
                              <td className="p-3 text-center">
                                 <button onClick={() => removeInvoiceItem(idx)} className="text-red-500 hover:text-red-700"><Trash size={16} /></button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>

                  {/* Add Manual Item */}
                  <div className="flex gap-4 items-end bg-slate-50 p-4 rounded-xl">
                     <div className="flex-1">
                        <label className="block text-xs font-bold text-slate-500 mb-1">Produto</label>
                        <select 
                           className="w-full border border-slate-300 rounded p-2 text-sm"
                           value={tempEntry.itemId}
                           onChange={(e) => setTempEntry({...tempEntry, itemId: e.target.value})}
                        >
                           {warehouseItems.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                        </select>
                     </div>
                     <div className="w-24">
                        <label className="block text-xs font-bold text-slate-500 mb-1">Qtd</label>
                        <input 
                           type="number" className="w-full border border-slate-300 rounded p-2 text-sm" 
                           value={tempEntry.qty}
                           onChange={(e) => setTempEntry({...tempEntry, qty: Number(e.target.value)})}
                        />
                     </div>
                     <div className="w-32">
                        <label className="block text-xs font-bold text-slate-500 mb-1">Custo (R$)</label>
                        <input 
                           type="number" step="0.01" className="w-full border border-slate-300 rounded p-2 text-sm" 
                           value={tempEntry.cost}
                           onChange={(e) => setTempEntry({...tempEntry, cost: Number(e.target.value)})}
                        />
                     </div>
                     <button 
                        onClick={addItemToInvoice}
                        className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700"
                     >
                        Adicionar
                     </button>
                  </div>
               </div>

               <div className="p-6 border-t border-slate-200 bg-slate-50 rounded-b-2xl flex justify-between items-center">
                  <div>
                     <span className="text-sm text-slate-500">Valor Total da Nota</span>
                     <p className="text-2xl font-bold text-slate-800">
                        R$ {invoiceItemsList.reduce((acc, i) => acc + i.total, 0).toFixed(2)}
                     </p>
                  </div>
                  <div className="flex gap-3">
                     <button onClick={() => setShowEntryModal(false)} className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-white">Cancelar</button>
                     <button onClick={processInvoiceEntry} className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 shadow-md flex items-center gap-2">
                        <CheckCircle size={20} /> Confirmar Entrada
                     </button>
                  </div>
               </div>
            </div>
         </div>
      )}

      {/* New Request Modal */}
      {showReqModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl p-6">
               <h3 className="font-bold text-xl mb-4 text-slate-800">Nova Requisição de Material</h3>
               <div className="space-y-4">
                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Departamento Solicitante</label>
                     <select 
                        className="w-full border border-slate-300 rounded-lg p-2.5"
                        value={tempReq.dept}
                        onChange={(e) => setTempReq({...tempReq, dept: e.target.value})}
                     >
                        <option>Secretaria de Saúde</option>
                        <option>Secretaria de Educação</option>
                        <option>Gabinete do Prefeito</option>
                        <option>Obras e Serviços</option>
                     </select>
                  </div>
                  
                  <div className="border rounded-xl p-4 bg-slate-50">
                     <h4 className="font-bold text-sm text-slate-600 mb-3">Itens da Requisição</h4>
                     <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
                        {tempReq.items.map((item, i) => (
                           <div key={i} className="flex justify-between items-center text-sm bg-white p-2 rounded border border-slate-200">
                              <span>{warehouseItems.find(w => w.id === item.itemId)?.name}</span>
                              <div className="flex gap-4">
                                 <span className="font-bold">{item.qty} un</span>
                                 <button onClick={() => setTempReq({...tempReq, items: tempReq.items.filter((_, idx) => idx !== i)})} className="text-red-500"><X size={14} /></button>
                              </div>
                           </div>
                        ))}
                        {tempReq.items.length === 0 && <p className="text-center text-slate-400 text-sm">Nenhum item adicionado</p>}
                     </div>

                     <div className="flex gap-2 items-end">
                        <div className="flex-1">
                           <select 
                              className="w-full border border-slate-300 rounded p-2 text-sm"
                              value={tempReqItem.itemId}
                              onChange={(e) => setTempReqItem({...tempReqItem, itemId: e.target.value})}
                           >
                              {warehouseItems.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                           </select>
                        </div>
                        <div className="w-24">
                           <input 
                              type="number" className="w-full border border-slate-300 rounded p-2 text-sm" placeholder="Qtd"
                              value={tempReqItem.qty}
                              onChange={(e) => setTempReqItem({...tempReqItem, qty: Number(e.target.value)})}
                           />
                        </div>
                        <button onClick={handleAddReqItem} className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700">+</button>
                     </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                     <button onClick={() => setShowReqModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">Cancelar</button>
                     <button onClick={handleFinalizeReq} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">Criar Requisição</button>
                  </div>
               </div>
            </div>
         </div>
      )}
    </div>
  );

  const renderPublicAccounting = () => {
    // Mock Data
    const quotas = [
      { code: '3.3.90.30.00', desc: 'Material de Consumo', budget: 1500000, locked: 200000, available: 850000, percentage: 70 },
      { code: '3.3.90.39.00', desc: 'Serviços de Terceiros PJ', budget: 3200000, locked: 500000, available: 1200000, percentage: 45 },
      { code: '4.4.90.51.00', desc: 'Obras e Instalações', budget: 5000000, locked: 0, available: 4800000, percentage: 95 },
    ];

    const empenhos = [
      { id: '2024/00552', credor: 'Papelaria Central Ltda', valor: 4500.00, data: '10/05/2024', fase: 'Empenhado' },
      { id: '2024/00551', credor: 'Construtora Forte', valor: 125000.00, data: '08/05/2024', fase: 'Liquidado' },
      { id: '2024/00540', credor: 'Distribuidora Água Pura', valor: 890.00, data: '02/05/2024', fase: 'Pago' },
    ];

    const accounts = [
      { bank: 'Banco do Brasil', agency: '001-9', account: '10.500-X', name: 'Movimento Geral', balance: 4500200.50 },
      { bank: 'Caixa Econômica', agency: '2040', account: '500-1', name: 'Convênio Saúde', balance: 125000.00 },
      { bank: 'Banco do Brasil', agency: '001-9', account: '12.000-5', name: 'Fundo Educação', balance: 890000.00 },
    ];

    return (
      <div className="animate-in fade-in duration-300">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
               <button onClick={() => setSelectedModule(null)} className="flex items-center text-slate-500 hover:text-slate-800 transition-colors">
                 <ChevronLeft size={20} />
               </button>
               <div>
                 <h2 className="text-2xl font-bold text-slate-800">Contabilidade Pública</h2>
                 <p className="text-sm text-slate-500">Execução Orçamentária e Financeira</p>
               </div>
            </div>
            <div className="flex gap-2">
               <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 flex items-center gap-2">
                  <Calculator size={16} /> Novo Lançamento
               </button>
               <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2">
                  <LockKeyhole size={16} /> Fechar Mês
               </button>
            </div>
         </div>

         {/* Internal Navigation */}
         <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-xl w-fit overflow-x-auto max-w-full">
            {[
               { id: 'dashboard', label: 'Visão Geral' },
               { id: 'orcamento', label: 'Gestão do Orçamento' },
               { id: 'execucao', label: 'Execução Orçamentária' },
               { id: 'financeiro', label: 'Financeiro' },
               { id: 'relatorios', label: 'Prestação de Contas' }
            ].map(tab => (
               <button 
                  key={tab.id}
                  onClick={() => setAccountingTab(tab.id as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap capitalize ${
                     accountingTab === tab.id ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
               >
                  {tab.label}
               </button>
            ))}
         </div>

         {/* --- DASHBOARD TAB --- */}
         {accountingTab === 'dashboard' && (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-xl border border-emerald-200 shadow-sm">
                     <p className="text-sm text-slate-500 font-medium">Superávit Financeiro</p>
                     <h3 className="text-2xl font-bold text-emerald-700 mt-1">R$ 2.450.000,00</h3>
                     <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1"><TrendingUp size={12} /> +12% vs ano anterior</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-red-200 shadow-sm">
                     <p className="text-sm text-slate-500 font-medium">Restos a Pagar</p>
                     <h3 className="text-2xl font-bold text-red-700 mt-1">R$ 850.000,00</h3>
                     <p className="text-xs text-red-600 mt-2 flex items-center gap-1"><AlertCircle size={12} /> Exige atenção</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-sm">
                     <p className="text-sm text-slate-500 font-medium">Disponibilidade de Caixa</p>
                     <h3 className="text-2xl font-bold text-blue-700 mt-1">R$ 5.120.000,00</h3>
                     <p className="text-xs text-slate-400 mt-2">Todas as fontes</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-orange-200 shadow-sm">
                     <p className="text-sm text-slate-500 font-medium">Dívida Flutuante</p>
                     <h3 className="text-2xl font-bold text-orange-700 mt-1">R$ 1.200.000,00</h3>
                     <p className="text-xs text-slate-400 mt-2">Curto prazo</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                     <h3 className="font-bold text-slate-800 mb-4">Evolução da Receita x Despesa</h3>
                     <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                           <AreaChart data={[
                              {name: 'Jan', rec: 4000, desp: 2400},
                              {name: 'Fev', rec: 3000, desp: 1398},
                              {name: 'Mar', rec: 2000, desp: 9800},
                              {name: 'Abr', rec: 2780, desp: 3908},
                              {name: 'Mai', rec: 1890, desp: 4800},
                           ]}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Area type="monotone" dataKey="rec" name="Receita" stroke="#10b981" fill="#d1fae5" />
                              <Area type="monotone" dataKey="desp" name="Despesa" stroke="#ef4444" fill="#fee2e2" />
                           </AreaChart>
                        </ResponsiveContainer>
                     </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                     <h3 className="font-bold text-slate-800 mb-4">Execução por Grupo de Despesa</h3>
                     <div className="h-64 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                           <PieChart>
                              <Pie data={[
                                 {name: 'Pessoal', value: 45},
                                 {name: 'Custeio', value: 30},
                                 {name: 'Investimento', value: 20},
                                 {name: 'Dívida', value: 5},
                              ]} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                 <Cell fill="#3b82f6" />
                                 <Cell fill="#f97316" />
                                 <Cell fill="#10b981" />
                                 <Cell fill="#ef4444" />
                              </Pie>
                              <Tooltip />
                              <Legend />
                           </PieChart>
                        </ResponsiveContainer>
                     </div>
                  </div>
               </div>
            </div>
         )}

         {/* --- ORCAMENTO TAB --- */}
         {accountingTab === 'orcamento' && (
            <div className="space-y-6">
               <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <div className="flex justify-between items-center mb-6">
                     <div>
                        <h3 className="font-bold text-slate-800 text-lg">Controle de Cotas de Despesa</h3>
                        <p className="text-sm text-slate-500">Gerenciamento bimestral/trimestral do orçamento</p>
                     </div>
                     <div className="flex gap-2">
                        <button className="px-3 py-2 border border-red-200 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 flex items-center gap-2">
                           <FileWarning size={16} /> Contingenciar
                        </button>
                        <button className="px-3 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900">
                           Recalcular Cotas
                        </button>
                     </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                     <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                           <tr>
                              <th className="p-3">Dotação</th>
                              <th className="p-3">Descrição</th>
                              <th className="p-3 text-right">Orçado Atualizado</th>
                              <th className="p-3 text-right">Contingenciado/Bloqueado</th>
                              <th className="p-3 text-right">Disponível para Empenho</th>
                              <th className="p-3 text-center">Execução</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                           {quotas.map((q, i) => (
                              <tr key={i} className="hover:bg-slate-50">
                                 <td className="p-3 font-mono text-slate-500">{q.code}</td>
                                 <td className="p-3 font-medium text-slate-700">{q.desc}</td>
                                 <td className="p-3 text-right font-bold">R$ {q.budget.toLocaleString()}</td>
                                 <td className="p-3 text-right text-red-600">R$ {q.locked.toLocaleString()}</td>
                                 <td className="p-3 text-right text-emerald-600">R$ {q.available.toLocaleString()}</td>
                                 <td className="p-3 align-middle">
                                    <div className="w-full bg-slate-200 rounded-full h-2">
                                       <div className="bg-blue-600 h-2 rounded-full" style={{width: `${q.percentage}%`}}></div>
                                    </div>
                                    <span className="text-xs text-slate-500 text-center block mt-1">{q.percentage}%</span>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-xl border border-slate-200">
                     <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><LockKeyhole size={20} /> Abertura e Encerramento</h4>
                     <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex justify-between p-2 hover:bg-slate-50 rounded cursor-pointer">
                           <span>Encerramento do Exercício (Etapas)</span>
                           <span className="text-blue-600 font-medium">Iniciar</span>
                        </li>
                        <li className="flex justify-between p-2 hover:bg-slate-50 rounded cursor-pointer">
                           <span>Inscrição em Restos a Pagar</span>
                           <span className="text-blue-600 font-medium">Processar</span>
                        </li>
                        <li className="flex justify-between p-2 hover:bg-slate-50 rounded cursor-pointer">
                           <span>Abertura de Orçamento (Lançamentos Iniciais)</span>
                           <span className="text-blue-600 font-medium">Gerar</span>
                        </li>
                     </ul>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-slate-200">
                     <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><AlertTriangle size={20} /> Consistência de Dados</h4>
                     <p className="text-sm text-slate-500 mb-4">Verificação de integridade da base antes do encerramento.</p>
                     <button className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors">
                        Executar Verificação de Inconsistências
                     </button>
                  </div>
               </div>
            </div>
         )}

         {/* --- EXECUCAO TAB --- */}
         {accountingTab === 'execucao' && (
            <div className="space-y-6">
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                     <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-800">Empenhos Emitidos</h3>
                        <div className="flex gap-2">
                           <button className="text-sm px-3 py-1 border border-slate-300 rounded bg-white hover:bg-slate-50">Filtros</button>
                           <button className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">+ Empenho</button>
                        </div>
                     </div>
                     <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-600">
                           <tr>
                              <th className="p-3">Número</th>
                              <th className="p-3">Data</th>
                              <th className="p-3">Credor</th>
                              <th className="p-3 text-right">Valor</th>
                              <th className="p-3 text-center">Fase Atual</th>
                              <th className="p-3 text-center">Ações</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                           {empenhos.map((e, i) => (
                              <tr key={i} className="hover:bg-slate-50 group">
                                 <td className="p-3 font-medium text-slate-700">{e.id}</td>
                                 <td className="p-3 text-slate-500">{e.data}</td>
                                 <td className="p-3 text-slate-700 font-medium">{e.credor}</td>
                                 <td className="p-3 text-right">R$ {e.valor.toLocaleString()}</td>
                                 <td className="p-3 text-center">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                                       e.fase === 'Pago' ? 'bg-green-100 text-green-700' :
                                       e.fase === 'Liquidado' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                                    }`}>
                                       {e.fase}
                                    </span>
                                 </td>
                                 <td className="p-3 text-center">
                                    <button className="text-slate-400 hover:text-blue-600">Gerenciar</button>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>

                  <div className="space-y-6">
                     <div className="bg-white p-6 rounded-xl border border-slate-200">
                        <h4 className="font-bold text-slate-800 mb-4">Ações Rápidas</h4>
                        <div className="grid grid-cols-2 gap-3">
                           <button className="p-3 bg-slate-50 rounded-lg text-sm text-slate-700 hover:bg-slate-100 flex flex-col items-center gap-2">
                              <FileCheck size={20} className="text-blue-600" /> Liquidar
                           </button>
                           <button className="p-3 bg-slate-50 rounded-lg text-sm text-slate-700 hover:bg-slate-100 flex flex-col items-center gap-2">
                              <Wallet size={20} className="text-green-600" /> Pagar
                           </button>
                           <button className="p-3 bg-slate-50 rounded-lg text-sm text-slate-700 hover:bg-slate-100 flex flex-col items-center gap-2">
                              <FileWarning size={20} className="text-red-600" /> Anular
                           </button>
                           <button className="p-3 bg-slate-50 rounded-lg text-sm text-slate-700 hover:bg-slate-100 flex flex-col items-center gap-2">
                              <Scroll size={20} className="text-amber-600" /> Restos a Pagar
                           </button>
                        </div>
                     </div>
                     
                     <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <h4 className="font-bold text-xs text-slate-500 uppercase mb-2">Liquidações Pendentes</h4>
                        <div className="flex justify-between items-center mb-1">
                           <span className="text-sm">Folha de Pagamento</span>
                           <span className="text-sm font-bold">R$ 2.4M</span>
                        </div>
                        <div className="w-full bg-white h-2 rounded-full mb-3">
                           <div className="bg-orange-500 h-2 rounded-full" style={{width: '80%'}}></div>
                        </div>
                        <button className="text-xs text-blue-600 hover:underline w-full text-center">Ver todas</button>
                     </div>
                  </div>
               </div>
            </div>
         )}

         {/* --- FINANCEIRO TAB --- */}
         {accountingTab === 'financeiro' && (
            <div className="space-y-6">
               <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                        <LandmarkIcon size={24} className="text-slate-600" /> Tesouraria e Conciliação
                     </h3>
                     <button className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm hover:bg-slate-900 flex items-center gap-2">
                        <UploadCloud size={16} /> Importar OFX (Extrato)
                     </button>
                  </div>

                  <table className="w-full text-left text-sm">
                     <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                        <tr>
                           <th className="p-3">Banco</th>
                           <th className="p-3">Agência/Conta</th>
                           <th className="p-3">Descrição da Conta</th>
                           <th className="p-3 text-right">Saldo Atual</th>
                           <th className="p-3 text-center">Status Conciliação</th>
                           <th className="p-3 text-center">Ações</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {accounts.map((acc, i) => (
                           <tr key={i} className="hover:bg-slate-50">
                              <td className="p-3 font-medium text-slate-700">{acc.bank}</td>
                              <td className="p-3 text-slate-500 font-mono">{acc.agency} / {acc.account}</td>
                              <td className="p-3 text-slate-600">{acc.name}</td>
                              <td className="p-3 text-right font-bold text-slate-800">R$ {acc.balance.toLocaleString()}</td>
                              <td className="p-3 text-center">
                                 <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Conciliado</span>
                              </td>
                              <td className="p-3 text-center">
                                 <button className="text-blue-600 hover:underline text-xs mr-2">Extrato</button>
                                 <button className="text-slate-500 hover:text-slate-800 text-xs">Conciliar</button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-xl border border-slate-200">
                     <h4 className="font-bold text-slate-700 mb-4">Pagamentos em Lote (Borderôs)</h4>
                     <p className="text-sm text-slate-500 mb-4">Gerencie os pagamentos agrupados e gere arquivos de remessa para o banco.</p>
                     <button className="w-full py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100">
                        Gerar Borderô de Pagamento
                     </button>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-slate-200">
                     <h4 className="font-bold text-slate-700 mb-4">Retenções e Extra-Orçamentário</h4>
                     <p className="text-sm text-slate-500 mb-4">Controle de ISS, IRRF, INSS retidos e consignações.</p>
                     <button className="w-full py-2 bg-slate-50 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-100">
                        Gerenciar Guias de Recolhimento
                     </button>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-slate-200">
                     <h4 className="font-bold text-slate-700 mb-4">Transferências Financeiras</h4>
                     <p className="text-sm text-slate-500 mb-4">Repasses para Câmara, Autarquias e Fundos.</p>
                     <button className="w-full py-2 bg-slate-50 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-100">
                        Registrar Transferência
                     </button>
                  </div>
               </div>
            </div>
         )}

         {/* --- RELATORIOS / PRESTACAO DE CONTAS TAB --- */}
         {accountingTab === 'relatorios' && (
            <div className="bg-white p-8 rounded-xl border border-slate-200">
               <h3 className="font-bold text-xl text-slate-800 mb-2">Central de Prestação de Contas</h3>
               <p className="text-slate-500 mb-8">Emissão de relatórios oficiais e arquivos para órgãos fiscalizadores.</p>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                     <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><FileText size={18} /> Relatórios Obrigatórios (LRF 101/2000)</h4>
                     <div className="space-y-2">
                        {['RREO - Resumido da Execução Orçamentária', 'RGF - Gestão Fiscal', 'Balanço Orçamentário', 'Balanço Financeiro', 'Balanço Patrimonial', 'Dívida Flutuante'].map((rep, i) => (
                           <button key={i} className="w-full text-left p-3 border border-slate-100 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors text-sm text-slate-600 flex justify-between items-center group">
                              {rep} <Download size={16} className="opacity-0 group-hover:opacity-100 text-blue-600 transition-opacity" />
                           </button>
                        ))}
                     </div>
                  </div>
                  <div>
                     <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><UploadCloud size={18} /> Arquivos Digitais (Exportação)</h4>
                     <div className="space-y-3">
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                           <h5 className="font-bold text-slate-800 text-sm">Tribunal de Contas (TCE)</h5>
                           <p className="text-xs text-slate-500 mb-3">Remessa mensal de dados contábeis.</p>
                           <button className="px-3 py-1 bg-slate-800 text-white text-xs rounded hover:bg-slate-900">Gerar Remessa</button>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                           <h5 className="font-bold text-slate-800 text-sm">SICONFI / STN</h5>
                           <p className="text-xs text-slate-500 mb-3">Matriz de Saldos Contábeis (MSC).</p>
                           <button className="px-3 py-1 bg-slate-800 text-white text-xs rounded hover:bg-slate-900">Gerar MSC</button>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                           <h5 className="font-bold text-slate-800 text-sm">SIOPS / SIOPE</h5>
                           <p className="text-xs text-slate-500 mb-3">Dados da Saúde e Educação.</p>
                           <button className="px-3 py-1 bg-slate-800 text-white text-xs rounded hover:bg-slate-900">Exportar XML</button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </div>
    );
  };

  const renderPlanningBudget = () => (
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
           <button onClick={() => setSelectedModule(null)} className="flex items-center text-slate-500 hover:text-slate-800 transition-colors">
             <ChevronLeft size={20} />
           </button>
           <div>
             <h2 className="text-2xl font-bold text-slate-800">Planejamento e Orçamento</h2>
             <p className="text-sm text-slate-500">PPA, LDO e LOA</p>
           </div>
        </div>
        <div className="flex gap-2">
           <select 
              value={ppaVersion} 
              onChange={(e) => setPpaVersion(e.target.value)}
              className="bg-white border border-slate-300 text-slate-700 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
           >
              <option>V1 - Proposta Inicial</option>
              <option>V2 - Revisão Audiência Pública</option>
              <option>V3 - Aprovado Câmara</option>
           </select>
           <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
              <Save size={16} /> Salvar Revisão
           </button>
        </div>
      </div>

      <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-xl w-fit">
         {['dashboard', 'ppa', 'ldo', 'loa', 'audiencias'].map(tab => (
            <button 
               key={tab}
               onClick={() => setPlanningTab(tab as any)}
               className={`px-4 py-2 rounded-lg text-sm font-medium transition-all uppercase ${
                  planningTab === tab ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
               }`}
            >
               {tab}
            </button>
         ))}
      </div>

      {planningTab === 'dashboard' && (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {/* Charts and KPIs for Planning */}
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-2">PPA 2022-2025</h3>
                <div className="flex justify-between items-end mb-4">
                   <span className="text-slate-500 text-sm">Execução Física</span>
                   <span className="text-2xl font-bold text-green-600">68%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                   <div className="bg-green-500 h-2 rounded-full" style={{width: '68%'}}></div>
                </div>
             </div>
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-2">LOA 2024</h3>
                <div className="flex justify-between items-end mb-4">
                   <span className="text-slate-500 text-sm">Receita Prevista</span>
                   <span className="text-2xl font-bold text-blue-600">R$ 150M</span>
                </div>
                <p className="text-xs text-slate-400">Atualizado em 10/05/2024</p>
             </div>
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-2">Audiências Públicas</h3>
                <div className="flex justify-between items-end mb-4">
                   <span className="text-slate-500 text-sm">Próxima Data</span>
                   <span className="text-xl font-bold text-amber-600">15/06</span>
                </div>
                <button className="text-sm text-blue-600 hover:underline">Ver Edital</button>
             </div>
         </div>
      )}

      {planningTab === 'ppa' && (
         <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
             <h3 className="font-bold text-lg mb-4">Plano Plurianual - Programas de Governo</h3>
             <div className="space-y-4">
                {[
                   {prog: 'Educação para Todos', meta: 'Construir 3 novas creches', status: 'Em andamento', progresso: 45},
                   {prog: 'Saúde Humanizada', meta: 'Reforma do Hospital Municipal', status: 'Concluído', progresso: 100},
                   {prog: 'Cidade Pavimentada', meta: '100km de asfalto novo', status: 'Atrasado', progresso: 20},
                ].map((item, idx) => (
                   <div key={idx} className="border border-slate-100 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex justify-between mb-2">
                         <h4 className="font-bold text-slate-700">{item.prog}</h4>
                         <span className={`text-xs px-2 py-1 rounded font-bold ${item.status === 'Concluído' ? 'bg-green-100 text-green-700' : item.status === 'Atrasado' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                            {item.status}
                         </span>
                      </div>
                      <p className="text-sm text-slate-500 mb-3">{item.meta}</p>
                      <div className="flex items-center gap-4">
                         <div className="flex-1 bg-slate-200 rounded-full h-2">
                            <div className={`h-2 rounded-full ${item.status === 'Concluído' ? 'bg-green-500' : item.status === 'Atrasado' ? 'bg-red-500' : 'bg-blue-500'}`} style={{width: `${item.progresso}%`}}></div>
                         </div>
                         <span className="text-xs font-bold text-slate-600">{item.progresso}%</span>
                      </div>
                   </div>
                ))}
             </div>
         </div>
      )}
    </div>
  );

  const renderGenericModule = (moduleName: string) => {
    const config = getModuleConfig(moduleName);
    
    return (
      <div className="animate-in fade-in duration-300">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
             <button onClick={() => setSelectedModule(null)} className="flex items-center text-slate-500 hover:text-slate-800 transition-colors">
               <ChevronLeft size={20} />
             </button>
             <div>
               <h2 className="text-2xl font-bold text-slate-800">{moduleName}</h2>
               <p className="text-sm text-slate-500">Visão Geral e Operações</p>
             </div>
          </div>
          <div className="flex gap-2">
             {config.actions.slice(0, 2).map((action, i) => (
                <button key={i} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${i === 0 ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
                   {action}
                </button>
             ))}
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           {config.kpis.map((kpi, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                 <div className="flex justify-between items-start mb-2">
                    <span className="text-slate-500 text-sm font-medium">{kpi.title}</span>
                    <span className={`p-2 rounded-lg bg-${config.theme}-50 text-${config.theme}-600`}>{kpi.icon}</span>
                 </div>
                 <h3 className="text-3xl font-bold text-slate-800">{kpi.value}</h3>
                 <p className={`text-xs font-medium mt-2 ${kpi.change.includes('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {kpi.change} <span className="text-slate-400 font-normal">vs mês anterior</span>
                 </p>
              </div>
           ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           {/* Main Chart Area */}
           <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-6">Desempenho Recente</h3>
              <div className="h-80">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={config.chartData}>
                       <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                             <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                       <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                       <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                       <Tooltip 
                          contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                       />
                       <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </div>

           {/* Quick Table */}
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <h3 className="font-bold text-slate-800 mb-4">Registros Recentes</h3>
              <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-400 uppercase font-bold border-b border-slate-100">
                       <tr>
                          <th className="py-2">{config.tableHeaders[0]}</th>
                          <th className="py-2">{config.tableHeaders[4]}</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {config.tableData.map((row, i) => (
                          <tr key={i}>
                             <td className="py-3">
                                <p className="font-medium text-slate-700">{row.c1}</p>
                                <p className="text-xs text-slate-500">{row.c2}</p>
                             </td>
                             <td className="py-3 text-right">
                                <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-bold">{row.c5}</span>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
              <button className="w-full mt-4 text-center text-sm text-blue-600 font-medium hover:underline">Ver Todos</button>
           </div>
        </div>
      </div>
    );
  };

  const renderUserManagement = () => (
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
           <button onClick={() => setSelectedModule(null)} className="flex items-center text-slate-500 hover:text-slate-800 transition-colors">
             <ChevronLeft size={20} />
           </button>
           <div>
             <h2 className="text-2xl font-bold text-slate-800">Gestão de Usuários</h2>
             <p className="text-sm text-slate-500">Controle de Acessos e Permissões</p>
           </div>
        </div>
        <button 
           onClick={() => handleOpenUserModal()}
           className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-sm"
        >
           <UserPlus size={18} /> Novo Usuário
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
         <div className="p-4 border-b border-slate-100 flex gap-4 bg-slate-50">
            <div className="relative flex-1 max-w-md">
               <input 
                 type="text" 
                 placeholder="Buscar por nome ou email..." 
                 className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                 value={userSearchTerm}
                 onChange={(e) => setUserSearchTerm(e.target.value)}
               />
               <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
            </div>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
               <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                     <th className="px-6 py-4">Usuário</th>
                     <th className="px-6 py-4">Departamento</th>
                     <th className="px-6 py-4">Perfil</th>
                     <th className="px-6 py-4 text-center">Status</th>
                     <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {usersList.filter(u => u.name.toLowerCase().includes(userSearchTerm.toLowerCase())).map((user) => (
                     <tr key={user.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                 {user.name.charAt(0)}
                              </div>
                              <div>
                                 <p className="font-medium text-slate-800">{user.name}</p>
                                 <p className="text-xs text-slate-500">{user.email}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{user.department}</td>
                        <td className="px-6 py-4">
                           <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs border border-slate-200">{user.role}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                           <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-500'}`}>
                              {user.status}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <button 
                              onClick={() => handleOpenUserModal(user)}
                              className="text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline"
                           >
                              Editar
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );

  const renderHospitalManagement = () => (
    <div className="animate-in fade-in duration-300">
       <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
             <button onClick={() => setSelectedModule(null)} className="flex items-center text-slate-500 hover:text-slate-800 transition-colors">
               <ChevronLeft size={20} />
             </button>
             <div>
               <h2 className="text-2xl font-bold text-slate-800">Hospital Municipal</h2>
               <p className="text-sm text-slate-500">Gestão de Leitos e Pronto Socorro</p>
             </div>
          </div>
          <div className="flex gap-2">
             <button className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 flex items-center gap-2">
                <Siren size={18} /> Emergência
             </button>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><BedDouble size={20} className="text-blue-600" /> Ocupação de Leitos</h3>
             <div className="space-y-4">
                {[
                   { setor: 'UTI Geral', total: 10, ocupados: 8, color: 'bg-red-500' },
                   { setor: 'Enfermaria Masc.', total: 20, ocupados: 15, color: 'bg-blue-500' },
                   { setor: 'Enfermaria Fem.', total: 20, ocupados: 12, color: 'bg-pink-500' },
                   { setor: 'Pediatria', total: 10, ocupados: 4, color: 'bg-yellow-500' },
                ].map((item, idx) => (
                   <div key={idx}>
                      <div className="flex justify-between text-sm mb-1">
                         <span className="font-medium text-slate-700">{item.setor}</span>
                         <span className="text-slate-500">{item.ocupados}/{item.total} ({Math.round(item.ocupados/item.total*100)}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full">
                         <div className={`${item.color} h-2 rounded-full transition-all duration-1000`} style={{width: `${(item.ocupados/item.total)*100}%`}}></div>
                      </div>
                   </div>
                ))}
             </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Activity size={20} className="text-rose-600" /> Pronto Socorro (Tempo Real)</h3>
             <div className="grid grid-cols-2 gap-4 mb-4">
                 <div className="bg-red-50 p-4 rounded-lg text-center border border-red-100">
                    <span className="block text-2xl font-bold text-red-700">12</span>
                    <span className="text-xs text-red-600 font-bold uppercase">Emergência (Vermelho)</span>
                 </div>
                 <div className="bg-yellow-50 p-4 rounded-lg text-center border border-yellow-100">
                    <span className="block text-2xl font-bold text-yellow-700">08</span>
                    <span className="text-xs text-yellow-600 font-bold uppercase">Urgência (Amarelo)</span>
                 </div>
             </div>
             <div className="border-t border-slate-100 pt-4">
                 <p className="text-sm font-bold text-slate-700 mb-2">Últimas Admissões</p>
                 <div className="space-y-2">
                    {[1,2,3].map(i => (
                       <div key={i} className="flex justify-between items-center text-sm p-2 bg-slate-50 rounded">
                          <span className="text-slate-600">Paciente #{2040+i}</span>
                          <span className="text-xs px-2 py-1 bg-white border border-slate-200 rounded text-slate-500">Há {i*5} min</span>
                       </div>
                    ))}
                 </div>
             </div>
          </div>
       </div>
    </div>
  );

  const renderHRManagement = () => {
    const hrEmployees = [
      { id: '4092-1', name: 'Maria Silva', role: 'Assistente Administrativo', sector: 'Gabinete', admission: '10/02/2018', status: 'Ativo' },
      { id: '3920-2', name: 'João Santos', role: 'Motorista', sector: 'Saúde', admission: '22/05/2019', status: 'Férias' },
      { id: '5502-1', name: 'Ana Costa', role: 'Professora', sector: 'Educação', admission: '01/02/2020', status: 'Ativo' },
    ];

    const payrollHistory = [
      { comp: '05/2024', status: 'Fechada', value: 854000.00, employees: 245 },
      { comp: '04/2024', status: 'Fechada', value: 849500.00, employees: 244 },
      { comp: '03/2024', status: 'Fechada', value: 830000.00, employees: 240 },
    ];

    return (
      <div className="animate-in fade-in duration-300">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
               <button onClick={() => setSelectedModule(null)} className="flex items-center text-slate-500 hover:text-slate-800 transition-colors">
                 <ChevronLeft size={20} />
               </button>
               <div>
                 <h2 className="text-2xl font-bold text-slate-800">Recursos Humanos</h2>
                 <p className="text-sm text-slate-500">Gestão de Pessoas, Folha e E-Social</p>
               </div>
            </div>
            <div className="flex gap-2">
               <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2">
                  <UserPlus size={16} /> Admitir Servidor
               </button>
               <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2">
                  <UploadCloud size={16} /> Enviar E-Social
               </button>
            </div>
         </div>

         {/* Internal Navigation */}
         <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-xl w-fit overflow-x-auto max-w-full">
            {[
               { id: 'dashboard', label: 'Visão Geral' },
               { id: 'pessoas', label: 'Gestão de Pessoas' },
               { id: 'folha', label: 'Folha de Pagamento' },
               { id: 'ponto', label: 'Ponto Eletrônico' },
               { id: 'sesmt', label: 'Saúde e Segurança' },
               { id: 'previdencia', label: 'Previdência (RPPS)' },
               { id: 'esocial', label: 'E-Social' }
            ].map(tab => (
               <button 
                  key={tab.id}
                  onClick={() => setHrTab(tab.id as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap capitalize ${
                     hrTab === tab.id ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
               >
                  {tab.label}
               </button>
            ))}
         </div>

         {/* --- HR DASHBOARD --- */}
         {hrTab === 'dashboard' && (
            <div className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-xl border border-indigo-200 shadow-sm">
                     <p className="text-sm text-slate-500 font-medium">Servidores Ativos</p>
                     <h3 className="text-2xl font-bold text-indigo-700 mt-1">2,450</h3>
                     <p className="text-xs text-indigo-600 mt-2 flex items-center gap-1"><ArrowUpRight size={12} /> +12 este mês</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-emerald-200 shadow-sm">
                     <p className="text-sm text-slate-500 font-medium">Folha Bruta (Mai/24)</p>
                     <h3 className="text-2xl font-bold text-emerald-700 mt-1">R$ 8.5M</h3>
                     <p className="text-xs text-emerald-600 mt-2">Processamento em andamento</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-orange-200 shadow-sm">
                     <p className="text-sm text-slate-500 font-medium">Férias Vencidas</p>
                     <h3 className="text-2xl font-bold text-orange-700 mt-1">45</h3>
                     <p className="text-xs text-slate-400 mt-2">Aguardando programação</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-sm">
                     <p className="text-sm text-slate-500 font-medium">Eventos E-Social</p>
                     <h3 className="text-2xl font-bold text-blue-700 mt-1">12</h3>
                     <p className="text-xs text-slate-400 mt-2">Pendentes de envio</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                     <h3 className="font-bold text-slate-800 mb-4">Evolução da Folha de Pagamento</h3>
                     <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                           <BarChart data={[
                              {name: 'Jan', valor: 7.8},
                              {name: 'Fev', valor: 7.9},
                              {name: 'Mar', valor: 8.1},
                              {name: 'Abr', valor: 8.2},
                              {name: 'Mai', valor: 8.5},
                           ]}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip formatter={(value) => `R$ ${value}M`} />
                              <Bar dataKey="valor" fill="#6366f1" radius={[4, 4, 0, 0]} />
                           </BarChart>
                        </ResponsiveContainer>
                     </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                     <h3 className="font-bold text-slate-800 mb-4">Distribuição por Vínculo</h3>
                     <div className="h-64 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                           <PieChart>
                              <Pie data={[
                                 {name: 'Estatutários', value: 60},
                                 {name: 'Comissionados', value: 15},
                                 {name: 'Contratados', value: 20},
                                 {name: 'Estagiários', value: 5},
                              ]} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                 <Cell fill="#4f46e5" />
                                 <Cell fill="#f59e0b" />
                                 <Cell fill="#10b981" />
                                 <Cell fill="#64748b" />
                              </Pie>
                              <Tooltip />
                              <Legend />
                           </PieChart>
                        </ResponsiveContainer>
                     </div>
                  </div>
               </div>
            </div>
         )}

         {/* --- HR REGISTRY --- */}
         {hrTab === 'pessoas' && (
            <div className="space-y-6">
               <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="font-bold text-slate-800 text-lg">Cadastro de Servidores</h3>
                     <div className="relative w-64">
                        <input type="text" placeholder="Buscar por nome ou CPF..." className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm" />
                        <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                     </div>
                  </div>
                  
                  <table className="w-full text-left text-sm">
                     <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                        <tr>
                           <th className="p-3">Matrícula</th>
                           <th className="p-3">Nome</th>
                           <th className="p-3">Cargo/Função</th>
                           <th className="p-3">Lotação</th>
                           <th className="p-3">Admissão</th>
                           <th className="p-3 text-center">Status</th>
                           <th className="p-3 text-center">Ações</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {hrEmployees.map((emp, i) => (
                           <tr key={i} className="hover:bg-slate-50">
                              <td className="p-3 font-mono text-slate-500">{emp.id}</td>
                              <td className="p-3 font-medium text-slate-700">{emp.name}</td>
                              <td className="p-3 text-slate-600">{emp.role}</td>
                              <td className="p-3 text-slate-600">{emp.sector}</td>
                              <td className="p-3 text-slate-500">{emp.admission}</td>
                              <td className="p-3 text-center">
                                 <span className={`px-2 py-1 rounded-full text-xs font-bold ${emp.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {emp.status}
                                 </span>
                              </td>
                              <td className="p-3 text-center">
                                 <button className="text-indigo-600 hover:underline text-xs mr-2">Ficha</button>
                                 <button className="text-slate-500 hover:text-slate-800 text-xs">Histórico</button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <button className="bg-white p-6 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all text-left flex items-start gap-4">
                     <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg"><Briefcase size={24} /></div>
                     <div>
                        <h4 className="font-bold text-slate-800">Cargos e Salários</h4>
                        <p className="text-sm text-slate-500">Gestão de tabelas salariais e estrutura de cargos.</p>
                     </div>
                  </button>
                  <button className="bg-white p-6 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all text-left flex items-start gap-4">
                     <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg"><UserCheck size={24} /></div>
                     <div>
                        <h4 className="font-bold text-slate-800">Estagiários</h4>
                        <p className="text-sm text-slate-500">Controle de contratos, CIEE e termos de compromisso.</p>
                     </div>
                  </button>
                  <button className="bg-white p-6 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all text-left flex items-start gap-4">
                     <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg"><Gavel size={24} /></div>
                     <div>
                        <h4 className="font-bold text-slate-800">Concursos Públicos</h4>
                        <p className="text-sm text-slate-500">Cadastro de editais, candidatos e classificação.</p>
                     </div>
                  </button>
               </div>
            </div>
         )}

         {/* --- PAYROLL TAB --- */}
         {hrTab === 'folha' && (
            <div className="space-y-6">
               <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <div className="flex justify-between items-center mb-6">
                     <div>
                        <h3 className="font-bold text-slate-800 text-lg">Processamento da Folha</h3>
                        <p className="text-sm text-slate-500">Cálculos mensais e complementares</p>
                     </div>
                     <div className="flex gap-2">
                        <button className="px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50">Simular Cálculo</button>
                        <button className="px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">Calcular Folha Mensal</button>
                     </div>
                  </div>
                  
                  <table className="w-full text-left text-sm">
                     <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                        <tr>
                           <th className="p-3">Competência</th>
                           <th className="p-3">Tipo</th>
                           <th className="p-3 text-right">Valor Líquido</th>
                           <th className="p-3 text-right">Encargos</th>
                           <th className="p-3 text-center">Servidores</th>
                           <th className="p-3 text-center">Status</th>
                           <th className="p-3 text-center">Ações</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {payrollHistory.map((p, i) => (
                           <tr key={i} className="hover:bg-slate-50">
                              <td className="p-3 font-medium text-slate-700">{p.comp}</td>
                              <td className="p-3 text-slate-500">Mensal</td>
                              <td className="p-3 text-right font-bold text-slate-700">R$ {p.value.toLocaleString()}</td>
                              <td className="p-3 text-right text-slate-500">R$ {(p.value * 0.2).toLocaleString()}</td>
                              <td className="p-3 text-center">{p.employees}</td>
                              <td className="p-3 text-center">
                                 <span className="px-2 py-1 bg-slate-200 text-slate-600 rounded-full text-xs font-bold">{p.status}</span>
                              </td>
                              <td className="p-3 text-center">
                                 <button className="text-indigo-600 hover:underline text-xs">Relatórios</button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-xl border border-slate-200">
                     <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><FileWarning size={20} /> Rescisões</h4>
                     <p className="text-sm text-slate-500 mb-4">Cálculo de rescisão, GRRF e termos.</p>
                     <button className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors">
                        Calcular Rescisão
                     </button>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-slate-200">
                     <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><CalendarClock size={20} /> Férias</h4>
                     <p className="text-sm text-slate-500 mb-4">Programação, cálculo e recibos de férias.</p>
                     <button className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors">
                        Gerenciar Férias
                     </button>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-slate-200">
                     <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><Coins size={20} /> 13º Salário</h4>
                     <p className="text-sm text-slate-500 mb-4">Adiantamento e parcela final.</p>
                     <button className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors">
                        Calcular 13º
                     </button>
                  </div>
               </div>
            </div>
         )}

         {/* --- TIME KEEPING TAB --- */}
         {hrTab === 'ponto' && (
            <div className="space-y-6">
               <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2"><Clock size={20} /> Ponto Eletrônico</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <h4 className="font-bold text-slate-700 mb-2">Importação de Arquivos (AFD/AFDT)</h4>
                        <p className="text-sm text-slate-500 mb-4">Importe as marcações dos relógios biométricos.</p>
                        <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium flex items-center gap-2">
                           <UploadCloud size={16} /> Selecionar Arquivo
                        </button>
                     </div>
                     <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <h4 className="font-bold text-slate-700 mb-2">Espelho de Ponto</h4>
                        <p className="text-sm text-slate-500 mb-4">Visualizar, corrigir e abonar faltas.</p>
                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
                           Acessar Espelho
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         )}

         {/* --- PENSION / RPPS TAB --- */}
         {hrTab === 'previdencia' && (
            <div className="space-y-6">
               <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2"><Umbrella size={24} className="text-indigo-600" /> Fundo de Previdência (RPPS)</h3>
                     <button className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900">
                        Simular Aposentadoria
                     </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="p-4 border rounded-xl hover:bg-slate-50 cursor-pointer">
                        <h4 className="font-bold text-slate-700">CTC - Certidão de Tempo</h4>
                        <p className="text-sm text-slate-500 mt-1">Emissão de certidão de tempo de contribuição para o INSS.</p>
                     </div>
                     <div className="p-4 border rounded-xl hover:bg-slate-50 cursor-pointer">
                        <h4 className="font-bold text-slate-700">Censo Previdenciário</h4>
                        <p className="text-sm text-slate-500 mt-1">Atualização cadastral dos beneficiários.</p>
                     </div>
                     <div className="p-4 border rounded-xl hover:bg-slate-50 cursor-pointer">
                        <h4 className="font-bold text-slate-700">Benefícios Concedidos</h4>
                        <p className="text-sm text-slate-500 mt-1">Gestão de aposentadorias e pensões ativas.</p>
                     </div>
                  </div>
               </div>
            </div>
         )}

         {/* --- E-SOCIAL TAB --- */}
         {hrTab === 'esocial' && (
            <div className="bg-white p-8 rounded-xl border border-slate-200">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-xl text-slate-800 flex items-center gap-2"><SirenIcon size={24} className="text-orange-500" /> Central E-Social</h3>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Ambiente: Produção</span>
               </div>
               
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                     <h4 className="text-sm font-bold text-slate-600 mb-2">Eventos de Tabela (S-1000)</h4>
                     <p className="text-2xl font-bold text-slate-800">100% <span className="text-sm font-normal text-slate-500">Sincronizado</span></p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                     <h4 className="text-sm font-bold text-slate-600 mb-2">Eventos Não Periódicos</h4>
                     <p className="text-2xl font-bold text-orange-600">3 <span className="text-sm font-normal text-slate-500">Pendentes</span></p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                     <h4 className="text-sm font-bold text-slate-600 mb-2">Eventos Periódicos (Folha)</h4>
                     <p className="text-2xl font-bold text-slate-800">Aberto <span className="text-sm font-normal text-slate-500">Competência 05/2024</span></p>
                  </div>
               </div>

               <div className="border rounded-xl overflow-hidden">
                  <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 font-semibold text-sm text-slate-700">Fila de Envio</div>
                  <table className="w-full text-left text-sm">
                     <thead className="bg-white text-slate-600 font-medium">
                        <tr>
                           <th className="p-3">Evento</th>
                           <th className="p-3">Descrição</th>
                           <th className="p-3">Referência</th>
                           <th className="p-3">Status</th>
                           <th className="p-3 text-right">Ação</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        <tr>
                           <td className="p-3 font-mono">S-2200</td>
                           <td className="p-3">Admissão de Trabalhador</td>
                           <td className="p-3">Mat. 5502-1</td>
                           <td className="p-3"><span className="text-orange-600 font-bold text-xs">Pendente</span></td>
                           <td className="p-3 text-right"><button className="text-blue-600 hover:underline">Enviar</button></td>
                        </tr>
                        <tr>
                           <td className="p-3 font-mono">S-1200</td>
                           <td className="p-3">Remuneração</td>
                           <td className="p-3">Folha 05/2024</td>
                           <td className="p-3"><span className="text-slate-400 text-xs">Aguardando Fechamento</span></td>
                           <td className="p-3 text-right text-slate-300">-</td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>
         )}
         
         {/* --- HEALTH & SAFETY (SESMT) TAB --- */}
         {hrTab === 'sesmt' && (
            <div className="space-y-6">
               <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2"><HeartPulse size={20} className="text-red-600" /> Saúde e Segurança do Trabalho</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <h4 className="font-bold text-slate-700 mb-2">PPP (Perfil Profissiográfico)</h4>
                        <p className="text-sm text-slate-500 mb-4">Gestão de laudos, riscos ambientais e EPIs.</p>
                        <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium">
                           Gerenciar PPP
                        </button>
                     </div>
                     <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <h4 className="font-bold text-slate-700 mb-2">Exames Periódicos (ASO)</h4>
                        <p className="text-sm text-slate-500 mb-4">Controle de vencimento de exames admissionais e periódicos.</p>
                        <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium">
                           Agenda de Exames
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </div>
    );
  };

  const renderPurchasingModule = () => {
    const licitacoes = [
      { id: '001/2024', obj: 'Aquisição de Medicamentos', mod: 'Pregão Presencial', status: 'Em Andamento', phase: 'Abertura de Lances' },
      { id: '002/2024', obj: 'Reforma da Escola Central', mod: 'Tomada de Preços', status: 'Homologado', phase: 'Concluído' },
      { id: '003/2024', obj: 'Serviço de Limpeza Urbana', mod: 'Concorrência', status: 'Em Análise Jurídica', phase: 'Fase Interna' },
    ];

    const contratos = [
      { id: '100/2023', fornecedor: 'Construções LTDA', obj: 'Manutenção Predial', vigencia: '31/12/2024', status: 'Ativo' },
      { id: '102/2023', fornecedor: 'Papelaria Central', obj: 'Material Expediente', vigencia: '15/06/2024', status: 'A Vencer' },
    ];

    const fornecedores = [
      { nome: 'Tech Soluções', cnpj: '00.000.000/0001-00', crc: 'Válido', status: 'Regular' },
      { nome: 'Serviços Gerais SA', cnpj: '11.111.111/0001-11', crc: 'Vencido', status: 'Pendente Doc.' },
    ];

    return (
      <div className="animate-in fade-in duration-300">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
             <button onClick={() => setSelectedModule(null)} className="flex items-center text-slate-500 hover:text-slate-800 transition-colors">
               <ChevronLeft size={20} />
             </button>
             <div>
               <h2 className="text-2xl font-bold text-slate-800">Compras e Licitações</h2>
               <p className="text-sm text-slate-500">Gestão completa de aquisições, contratos e fornecedores</p>
             </div>
          </div>
          <div className="flex gap-2">
             <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2">
                <FileSignature size={16} /> Novo Processo
             </button>
             <button className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 flex items-center gap-2">
                <ShoppingBag size={16} /> Nova Requisição
             </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-xl w-fit overflow-x-auto max-w-full">
           {[
              { id: 'dashboard', label: 'Visão Geral' },
              { id: 'licitacoes', label: 'Processos Licitatórios' },
              { id: 'compras', label: 'Compras e Pedidos' },
              { id: 'contratos', label: 'Gestão de Contratos' },
              { id: 'cadastros', label: 'Cadastros Auxiliares' }
           ].map(tab => (
              <button 
                 key={tab.id}
                 onClick={() => setPurchasingTab(tab.id as any)}
                 className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap capitalize ${
                    purchasingTab === tab.id ? 'bg-white text-orange-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                 }`}
              >
                 {tab.label}
              </button>
           ))}
        </div>

        {/* Content */}
        {purchasingTab === 'dashboard' && (
           <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                 <div className="bg-white p-6 rounded-xl border border-orange-200 shadow-sm">
                    <p className="text-sm text-slate-500 font-medium">Processos em Andamento</p>
                    <h3 className="text-2xl font-bold text-orange-700 mt-1">12</h3>
                    <p className="text-xs text-orange-600 mt-2 flex items-center gap-1"><Gavel size={12} /> 3 Pregões hoje</p>
                 </div>
                 <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-sm">
                    <p className="text-sm text-slate-500 font-medium">Contratos Ativos</p>
                    <h3 className="text-2xl font-bold text-blue-700 mt-1">45</h3>
                    <p className="text-xs text-blue-600 mt-2">Valor Total: R$ 12.5M</p>
                 </div>
                 <div className="bg-white p-6 rounded-xl border border-red-200 shadow-sm">
                    <p className="text-sm text-slate-500 font-medium">Contratos a Vencer (30d)</p>
                    <h3 className="text-2xl font-bold text-red-700 mt-1">3</h3>
                    <p className="text-xs text-red-600 mt-2 flex items-center gap-1"><AlertTriangle size={12} /> Requer atenção</p>
                 </div>
                 <div className="bg-white p-6 rounded-xl border border-emerald-200 shadow-sm">
                    <p className="text-sm text-slate-500 font-medium">Economia Gerada</p>
                    <h3 className="text-2xl font-bold text-emerald-700 mt-1">R$ 1.2M</h3>
                    <p className="text-xs text-emerald-600 mt-2">No exercício atual</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex justify-between items-center mb-4">
                       <h3 className="font-bold text-slate-800">Alertas de Irregularidades (Fornecedores)</h3>
                       <button className="text-xs text-blue-600 hover:underline">Ver todos</button>
                    </div>
                    <div className="space-y-3">
                       <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-3">
                          <AlertOctagon size={20} className="text-red-600" />
                          <div>
                             <p className="text-sm font-bold text-slate-800">Fornecedor X - Documentação Vencida</p>
                             <p className="text-xs text-slate-500">Impedido de contratar. Processo 002/2024 afetado.</p>
                          </div>
                       </div>
                       <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg flex items-center gap-3">
                          <AlertTriangle size={20} className="text-amber-600" />
                          <div>
                             <p className="text-sm font-bold text-slate-800">Certidão Negativa a Vencer - Construtora Y</p>
                             <p className="text-xs text-slate-500">Vence em 5 dias. Notificar fornecedor.</p>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-4">Integrações Externas</h3>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-4 border rounded-xl flex flex-col items-center justify-center text-center hover:bg-slate-50 cursor-pointer">
                          <UploadCloud size={24} className="text-blue-600 mb-2" />
                          <span className="font-bold text-sm text-slate-700">TCE / LICITACON</span>
                          <span className="text-xs text-green-600 font-bold mt-1">Online</span>
                       </div>
                       <div className="p-4 border rounded-xl flex flex-col items-center justify-center text-center hover:bg-slate-50 cursor-pointer">
                          <GlobeLock size={24} className="text-orange-600 mb-2" />
                          <span className="font-bold text-sm text-slate-700">Portal Transparência</span>
                          <span className="text-xs text-slate-500 mt-1">Sincronizado há 10m</span>
                       </div>
                       <div className="p-4 border rounded-xl flex flex-col items-center justify-center text-center hover:bg-slate-50 cursor-pointer">
                          <Gavel size={24} className="text-purple-600 mb-2" />
                          <span className="font-bold text-sm text-slate-700">BLL Compras</span>
                          <span className="text-xs text-slate-500 mt-1">Conectado</span>
                       </div>
                       <div className="p-4 border rounded-xl flex flex-col items-center justify-center text-center hover:bg-slate-50 cursor-pointer">
                          <Users size={24} className="text-emerald-600 mb-2" />
                          <span className="font-bold text-sm text-slate-700">Portal do Fornecedor</span>
                          <span className="text-xs text-slate-500 mt-1">12 acessos hoje</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {purchasingTab === 'licitacoes' && (
           <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-800">Processos Licitatórios</h3>
                    <div className="flex gap-2">
                       <input type="text" placeholder="Buscar processo..." className="border border-slate-300 rounded-lg px-3 py-1 text-sm" />
                       <button className="bg-orange-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-orange-700">Filtrar</button>
                    </div>
                 </div>
                 <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                       <tr>
                          <th className="p-3">Processo</th>
                          <th className="p-3">Objeto</th>
                          <th className="p-3">Modalidade</th>
                          <th className="p-3">Fase Atual</th>
                          <th className="p-3 text-center">Status</th>
                          <th className="p-3 text-right">Ações</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {licitacoes.map((l, i) => (
                          <tr key={i} className="hover:bg-slate-50">
                             <td className="p-3 font-medium">{l.id}</td>
                             <td className="p-3">{l.obj}</td>
                             <td className="p-3">{l.mod}</td>
                             <td className="p-3 text-blue-600 font-medium">{l.phase}</td>
                             <td className="p-3 text-center">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${l.status === 'Concluído' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                   {l.status}
                                </span>
                             </td>
                             <td className="p-3 text-right flex justify-end gap-2">
                                <button className="text-slate-500 hover:text-blue-600"><Eye size={18} /></button>
                                {l.mod.includes('Pregão') && <button className="text-orange-600 hover:text-orange-800 font-bold text-xs border border-orange-200 px-2 py-1 rounded hover:bg-orange-50">Painel de Lances</button>}
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>

              {/* Workflow Visualizer Mockup */}
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                 <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><Layers size={20} /> Workflow do Processo (Exemplo)</h4>
                 <div className="flex items-center justify-between relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10 -translate-y-1/2"></div>
                    {['Abertura', 'Parecer Jurídico', 'Publicação', 'Julgamento', 'Homologação', 'Adjudicação'].map((step, i) => (
                       <div key={i} className="flex flex-col items-center gap-2 bg-slate-50 p-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${i < 3 ? 'bg-green-600 text-white' : i === 3 ? 'bg-orange-500 text-white' : 'bg-slate-300 text-slate-600'}`}>
                             {i + 1}
                          </div>
                          <span className={`text-xs font-medium ${i === 3 ? 'text-orange-700' : 'text-slate-500'}`}>{step}</span>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        )}

        {purchasingTab === 'compras' && (
           <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-white p-6 rounded-xl border border-slate-200">
                    <h4 className="font-bold text-slate-800 mb-4">Requisições de Compra</h4>
                    <p className="text-sm text-slate-500 mb-4">Solicitações pendentes de aprovação e cotação.</p>
                    <button className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors">
                       Gerenciar Requisições
                    </button>
                 </div>
                 <div className="bg-white p-6 rounded-xl border border-slate-200">
                    <h4 className="font-bold text-slate-800 mb-4">Mapa de Preços / Cotação</h4>
                    <p className="text-sm text-slate-500 mb-4">Comparativo de fornecedores e geração de médias.</p>
                    <button className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors">
                       Acessar Cotações Online
                    </button>
                 </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-800">Ordens de Compra Emitidas</h3>
                    <button className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">+ Nova Ordem</button>
                 </div>
                 <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-600">
                       <tr>
                          <th className="p-3">Nº Ordem</th>
                          <th className="p-3">Fornecedor</th>
                          <th className="p-3">Valor Total</th>
                          <th className="p-3">Data Entrega</th>
                          <th className="p-3 text-center">Status</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       <tr>
                          <td className="p-3 font-mono">2024/0550</td>
                          <td className="p-3">Papelaria Central</td>
                          <td className="p-3">R$ 1.500,00</td>
                          <td className="p-3">25/05/2024</td>
                          <td className="p-3 text-center"><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">Enviado</span></td>
                       </tr>
                    </tbody>
                 </table>
              </div>
           </div>
        )}

        {purchasingTab === 'contratos' && (
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-slate-800">Gestão de Contratos</h3>
                 <div className="flex gap-2">
                    <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-sm font-medium flex items-center gap-1">
                       <FileAxis3D size={14} /> Aditivos
                    </button>
                    <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-sm font-medium flex items-center gap-1">
                       <TrendingDown size={14} /> Reajustes
                    </button>
                 </div>
              </div>
              <table className="w-full text-left text-sm">
                 <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                       <th className="p-3">Contrato</th>
                       <th className="p-3">Objeto</th>
                       <th className="p-3">Fornecedor</th>
                       <th className="p-3 text-center">Vigência</th>
                       <th className="p-3 text-center">Status</th>
                       <th className="p-3 text-right">Ações</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {contratos.map((c, i) => (
                       <tr key={i} className="hover:bg-slate-50">
                          <td className="p-3 font-medium">{c.id}</td>
                          <td className="p-3">{c.obj}</td>
                          <td className="p-3">{c.fornecedor}</td>
                          <td className="p-3 text-center text-slate-600">{c.vigencia}</td>
                          <td className="p-3 text-center">
                             <span className={`px-2 py-1 rounded-full text-xs font-bold ${c.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {c.status}
                             </span>
                          </td>
                          <td className="p-3 text-right">
                             <button className="text-blue-600 hover:underline">Detalhes</button>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        )}

        {purchasingTab === 'cadastros' && (
           <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-white p-6 rounded-xl border border-slate-200">
                    <div className="flex justify-between items-start mb-4">
                       <div>
                          <h4 className="font-bold text-slate-800">Catálogo de Materiais</h4>
                          <p className="text-sm text-slate-500">Padronização e descrição detalhada.</p>
                       </div>
                       <button className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 text-slate-600"><Archive size={20} /></button>
                    </div>
                    <button className="w-full py-2 bg-orange-50 text-orange-700 rounded-lg text-sm font-medium hover:bg-orange-100 border border-orange-200 mb-2">
                       + Novo Item
                    </button>
                    <button className="w-full py-2 bg-white text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 border border-slate-200">
                       Consultar Catálogo
                    </button>
                 </div>
                 <div className="bg-white p-6 rounded-xl border border-slate-200">
                    <div className="flex justify-between items-start mb-4">
                       <div>
                          <h4 className="font-bold text-slate-800">Registro de Fornecedores (CRC)</h4>
                          <p className="text-sm text-slate-500">Gestão de documentos e certificação.</p>
                       </div>
                       <button className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 text-slate-600"><Users size={20} /></button>
                    </div>
                    <button className="w-full py-2 bg-white text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 border border-slate-200">
                       Gerenciar Fornecedores
                    </button>
                 </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                 <h4 className="font-bold text-slate-800 mb-4">Lista de Fornecedores Recentes</h4>
                 <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-600">
                       <tr>
                          <th className="p-3">Razão Social</th>
                          <th className="p-3">CNPJ</th>
                          <th className="p-3 text-center">CRC</th>
                          <th className="p-3 text-center">Situação</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {fornecedores.map((f, i) => (
                          <tr key={i}>
                             <td className="p-3 font-medium">{f.nome}</td>
                             <td className="p-3 font-mono">{f.cnpj}</td>
                             <td className="p-3 text-center">
                                <span className={`text-xs px-2 py-1 rounded font-bold ${f.crc === 'Válido' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}>{f.crc}</span>
                             </td>
                             <td className="p-3 text-center">{f.status}</td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        )}
      </div>
    );
  };

  return (
    <PortalLayout title="Portal Administrativo" type={PortalType.ADMIN} onBack={onBack} colorTheme="bg-slate-900">
      
      {selectedModule ? (
        // Module View (Takes full width)
        selectedModule === 'Sistema de Senhas' ? renderQueueSystem() : 
        selectedModule === 'Almoxarifado' ? renderWarehouseModule() :
        selectedModule === 'Gestão de Usuários' ? renderUserManagement() :
        selectedModule === 'Planejamento e Orçamento' ? renderPlanningBudget() :
        selectedModule === 'Contabilidade Pública' ? renderPublicAccounting() :
        selectedModule === 'Recursos Humanos' ? renderHRManagement() :
        selectedModule === 'Compras e Licitações' ? renderPurchasingModule() :
        selectedModule === 'Gestão de Leitos' || selectedModule === 'Pronto Socorro' ? renderHospitalManagement() :
        renderGenericModule(selectedModule)
      ) : (
        // Main Dashboard Layout with Sidebar
        <div className="flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-12rem)] animate-in fade-in duration-500">
           
           {/* Sidebar Navigation */}
           <aside className="w-full lg:w-64 flex-shrink-0 lg:border-r lg:border-slate-200 lg:pr-6 space-y-2">
              <div className="mb-6 px-2">
                 <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Navegação</h2>
                 {categories.map(cat => (
                    <button 
                       key={cat.id}
                       onClick={() => setActiveCategory(cat.id)}
                       className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-sm
                          ${activeCategory === cat.id 
                             ? 'bg-slate-800 text-white shadow-md' 
                             : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
                    >
                       {cat.icon} {cat.label}
                    </button>
                 ))}
              </div>
              
              <div className="px-2">
                 <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Acesso Rápido</h2>
                 <button onClick={() => handleOpenUserModal()} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 text-sm mb-1 transition-colors">
                    <UserPlus size={18} /> Novo Usuário
                 </button>
                 <button onClick={() => setSelectedModule('Sistema de Senhas')} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 text-sm transition-colors">
                    <Monitor size={18} /> Painel de Senhas
                 </button>
              </div>
           </aside>

           {/* Main Content Area */}
           <main className="flex-1">
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                 <div>
                    <h2 className="text-2xl font-bold text-slate-800">
                       {categories.find(c => c.id === activeCategory)?.label}
                    </h2>
                    <p className="text-slate-500 text-sm">
                       Gerencie os módulos e serviços desta categoria.
                    </p>
                 </div>
                 <div className="relative w-full md:w-80">
                    <input 
                       type="text" 
                       placeholder="Buscar módulo..." 
                       className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-800 shadow-sm text-sm transition-shadow"
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                 </div>
              </div>

              {/* Content Switching */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2">
                {getActiveModules().filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase())).map((module, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => setSelectedModule(module.name)}
                      className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer group flex items-start gap-4 h-full"
                    >
                      <div className={`p-3 rounded-xl transition-colors shrink-0
                          ${activeCategory === 'health' ? 'bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white' :
                            activeCategory === 'hospital' ? 'bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white' :
                            activeCategory === 'social' ? 'bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white' :
                            activeCategory === 'environment' ? 'bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white' :
                            activeCategory === 'education' ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white' :
                            activeCategory === 'tech' ? 'bg-cyan-50 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white' :
                            'bg-slate-100 text-slate-600 group-hover:bg-slate-800 group-hover:text-white'}
                      `}>
                          {module.icon}
                      </div>
                      <div>
                          <h4 className="font-bold text-slate-800 text-sm mb-1 group-hover:text-blue-700 transition-colors">{module.name}</h4>
                          <p className="text-xs text-slate-500 leading-relaxed">{module.desc}</p>
                      </div>
                    </div>
                ))}
              </div>
           </main>
        </div>
      )}

      {/* User Management Modal */}
      {showUserModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
               <div className="bg-slate-800 p-6 text-white flex justify-between items-center rounded-t-2xl">
                  <div>
                    <h3 className="font-bold text-xl flex items-center gap-2"><UserCog size={24} /> Gestão de Usuários e Acessos</h3>
                    <p className="text-slate-400 text-sm">Controle de permissões do sistema</p>
                  </div>
                  <button onClick={() => setShowUserModal(false)} className="hover:bg-white/20 p-2 rounded-lg transition-colors"><X size={20} /></button>
               </div>
               
               <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                  {/* List */}
                  <div className="w-full md:w-1/3 border-r border-slate-200 flex flex-col bg-slate-50">
                     <div className="p-4 border-b border-slate-200">
                        <div className="relative">
                           <input 
                             type="text" 
                             placeholder="Buscar usuário..." 
                             className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm"
                             value={userSearchTerm}
                             onChange={(e) => setUserSearchTerm(e.target.value)}
                           />
                           <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                        </div>
                        <button 
                           onClick={() => handleOpenUserModal()}
                           className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center justify-center gap-2"
                        >
                           <UserPlus size={16} /> Novo Usuário
                        </button>
                     </div>
                     <div className="flex-1 overflow-y-auto">
                        {usersList.filter(u => u.name.toLowerCase().includes(userSearchTerm.toLowerCase())).map(user => (
                           <div 
                              key={user.id} 
                              onClick={() => { setEditingUser(user); setTempUser(user); }}
                              className={`p-4 border-b border-slate-200 cursor-pointer hover:bg-white transition-colors ${editingUser?.id === user.id ? 'bg-white border-l-4 border-l-blue-600' : ''}`}
                           >
                              <div className="flex justify-between items-start">
                                 <div>
                                    <h4 className="font-bold text-slate-800 text-sm">{user.name}</h4>
                                    <p className="text-xs text-slate-500">{user.email}</p>
                                 </div>
                                 <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${user.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>
                                    {user.status}
                                 </span>
                              </div>
                              <p className="text-xs text-slate-400 mt-2 flex items-center gap-1"><Briefcase size={12} /> {user.department}</p>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Form */}
                  <div className="flex-1 p-8 overflow-y-auto">
                     <h4 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-2">
                        {editingUser && editingUser.id !== 0 ? 'Editar Usuário' : 'Novo Cadastro'}
                     </h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                           <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
                           <input 
                              type="text" 
                              className="w-full border border-slate-300 rounded-lg p-2.5" 
                              value={tempUser.name}
                              onChange={(e) => setTempUser({...tempUser, name: e.target.value})}
                           />
                        </div>
                        <div className="md:col-span-2">
                           <label className="block text-sm font-medium text-slate-700 mb-1">E-mail Corporativo</label>
                           <input 
                              type="email" 
                              className="w-full border border-slate-300 rounded-lg p-2.5" 
                              value={tempUser.email}
                              onChange={(e) => setTempUser({...tempUser, email: e.target.value})}
                           />
                        </div>
                        <div className="md:col-span-1">
                           <label className="block text-sm font-medium text-slate-700 mb-1">Departamento</label>
                           <select 
                              className="w-full border border-slate-300 rounded-lg p-2.5"
                              value={tempUser.department}
                              onChange={(e) => setTempUser({...tempUser, department: e.target.value})}
                           >
                              <option>Administrativo</option>
                              <option>Financeiro</option>
                              <option>Recursos Humanos</option>
                              <option>Tecnologia</option>
                              <option>Saúde</option>
                              <option>Educação</option>
                              <option>Obras</option>
                              <option>Assistência Social</option>
                           </select>
                        </div>
                        <div className="md:col-span-1">
                           <label className="block text-sm font-medium text-slate-700 mb-1">Perfil</label>
                           <select 
                              className="w-full border border-slate-300 rounded-lg p-2.5"
                              value={tempUser.role}
                              onChange={(e) => setTempUser({...tempUser, role: e.target.value})}
                           >
                              <option>Administrador</option>
                              <option>Gerente</option>
                              <option>Operador</option>
                              <option>Auditor</option>
                           </select>
                        </div>
                        <div className="md:col-span-2">
                           <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                           <div className="flex gap-4 pt-2">
                              <label className="flex items-center gap-2 cursor-pointer">
                                 <input 
                                    type="radio" 
                                    name="status" 
                                    checked={tempUser.status === 'Ativo'}
                                    onChange={() => setTempUser({...tempUser, status: 'Ativo'})}
                                 />
                                 <span>Ativo</span>
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer">
                                 <input 
                                    type="radio" 
                                    name="status" 
                                    checked={tempUser.status === 'Inativo'}
                                    onChange={() => setTempUser({...tempUser, status: 'Inativo'})}
                                 />
                                 <span>Inativo</span>
                              </label>
                           </div>
                        </div>
                     </div>
                     <div className="mt-8 flex justify-between pt-6 border-t border-slate-100">
                        {editingUser && (
                           <button 
                              onClick={() => handleDeleteUser(editingUser.id)}
                              className="text-red-500 hover:text-red-700 font-medium text-sm flex items-center gap-1"
                           >
                              <Trash size={16} /> Excluir
                           </button>
                        )}
                        <div className="flex gap-3 ml-auto">
                           <button 
                              onClick={() => setShowUserModal(false)}
                              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50"
                           >
                              Cancelar
                           </button>
                           <button 
                              onClick={handleSaveUser}
                              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-md"
                           >
                              Salvar
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      )}
    </PortalLayout>
  );
};

export default AdminPortal;