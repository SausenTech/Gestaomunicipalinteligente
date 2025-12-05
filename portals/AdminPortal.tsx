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
  FileSignature, ShoppingBag, Archive, TrendingDown, Hammer, FileAxis3D, RefreshCcw, Gauge, Fuel, Wrench, Navigation, Car,
  Tag, Box, RefreshCw, ClipboardCheck, ArrowLeftRight, Lock as LockIcon, Unlock, Check
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
  permissions: string[]; // IDs of allowed modules (names)
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
    { name: 'Frotas', icon: <Truck size={24} />, desc: 'Gestão de Veículos', highlight: true },
    { name: 'IPTU', icon: <MapPin size={24} />, desc: 'Imposto Territorial' },
    { name: 'ISSQN', icon: <Percent size={24} />, desc: 'Imposto Sobre Serviços' },
    { name: 'Nota Fiscal Eletrônica', icon: <Receipt size={24} />, desc: 'Emissão e Consulta' },
    { name: 'Obras e Posturas', icon: <HardHat size={24} />, desc: 'Fiscalização Urbana' },
    { name: 'Ouvidoria', icon: <MessageCircle size={24} />, desc: 'Atendimento ao Cidadão' },
    { name: 'Patrimônio', icon: <Landmark size={24} />, desc: 'Gestão de Bens', highlight: true },
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

  // Fleet Management State
  const [fleetTab, setFleetTab] = useState<'dashboard' | 'veiculos' | 'motoristas' | 'abastecimento' | 'manutencao' | 'trafego' | 'multas'>('dashboard');

  // Patrimony Management State
  const [patrimonyTab, setPatrimonyTab] = useState<'dashboard' | 'bens' | 'movimentacoes' | 'inventario' | 'relatorios'>('dashboard');

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
    { id: 1, name: 'Ana Pereira', email: 'ana.pereira@sausen.tech', role: 'Administrador', status: 'Ativo', department: 'Tecnologia', permissions: ['Patrimônio', 'Frotas', 'Recursos Humanos'] },
    { id: 2, name: 'Carlos Silva', email: 'carlos.silva@sausen.tech', role: 'Gerente', status: 'Ativo', department: 'Recursos Humanos', permissions: ['Recursos Humanos', 'Folha de Pagamento'] },
    { id: 3, name: 'Beatriz Costa', email: 'beatriz.costa@sausen.tech', role: 'Operador', status: 'Inativo', department: 'Financeiro', permissions: ['Contabilidade Pública', 'Tesouraria'] },
    { id: 4, name: 'João Santos', email: 'joao.santos@sausen.tech', role: 'Auditor', status: 'Ativo', department: 'Controladoria', permissions: ['Controle Interno'] },
    { id: 5, name: 'Fernanda Lima', email: 'fernanda.lima@sausen.tech', role: 'Operador', status: 'Pendente', department: 'Saúde', permissions: ['Agendamento e Cadastros', 'Farmácia'] },
  ]);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [tempUser, setTempUser] = useState<UserData>({
    id: 0, name: '', email: '', role: 'Operador', status: 'Ativo', department: 'Administrativo', permissions: []
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
      setTempUser({ id: 0, name: '', email: '', role: 'Operador', status: 'Ativo', department: 'Administrativo', permissions: [] });
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

  const handleTogglePermission = (moduleName: string) => {
    setTempUser(prev => {
      const current = prev.permissions || [];
      if (current.includes(moduleName)) {
        return { ...prev, permissions: current.filter(p => p !== moduleName) };
      } else {
        return { ...prev, permissions: [...current, moduleName] };
      }
    });
  };

  const handleToggleCategory = (categoryModules: any[]) => {
     const allModuleNames = categoryModules.map(m => m.name);
     setTempUser(prev => {
        const current = prev.permissions || [];
        const allSelected = allModuleNames.every(name => current.includes(name));
        
        if (allSelected) {
           // Deselect all
           return { ...prev, permissions: current.filter(p => !allModuleNames.includes(p)) };
        } else {
           // Select all (add missing ones)
           const newPerms = [...current];
           allModuleNames.forEach(name => {
              if (!newPerms.includes(name)) newPerms.push(name);
           });
           return { ...prev, permissions: newPerms };
        }
     });
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

  // Map category IDs to their module arrays for the modal loop
  const moduleMap: Record<string, any[]> = {
     admin: adminModules,
     social: socialModules,
     education: educationModules,
     hospital: hospitalModules,
     environment: environmentModules,
     health: healthModules,
     tech: technologyModules,
  };

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

  const renderGenericModule = (moduleName: string) => {
    const config = getModuleConfig(moduleName);
    const themeColor = config.theme === 'blue' ? 'text-blue-600' : config.theme === 'red' ? 'text-red-600' : config.theme === 'green' ? 'text-emerald-600' : 'text-slate-600';
    const btnColor = config.theme === 'blue' ? 'bg-blue-600 hover:bg-blue-700' : config.theme === 'red' ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-800 hover:bg-slate-900';

    return (
      <div className="animate-in fade-in duration-300">
        <div className="flex items-center gap-2 mb-6">
          <button onClick={() => setSelectedModule(null)} className="flex items-center text-slate-500 hover:text-slate-800 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{moduleName}</h2>
            <p className="text-sm text-slate-500">Módulo Administrativo</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           {config.kpis.map((kpi, i) => (
             <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                   <p className="text-sm text-slate-500 font-medium">{kpi.title}</p>
                   <div className="p-2 bg-slate-50 text-slate-600 rounded-lg">{kpi.icon}</div>
                </div>
                <h3 className={`text-2xl font-bold ${themeColor}`}>{kpi.value}</h3>
                <p className="text-xs mt-1 text-slate-400">{kpi.change} vs mês anterior</p>
             </div>
           ))}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h3 className="font-bold text-slate-800">Registros</h3>
              <div className="flex flex-wrap gap-2">
                 {config.actions.map((action, i) => (
                    <button key={i} className={`px-4 py-2 rounded-lg text-sm font-medium ${i===0 ? `${btnColor} text-white` : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                       {action}
                    </button>
                 ))}
              </div>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                   <tr>
                      {config.tableHeaders.map((h, i) => <th key={i} className="p-3">{h}</th>)}
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {config.tableData.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                         <td className="p-3 font-medium">{row.c1}</td>
                         <td className="p-3">{row.c2}</td>
                         <td className="p-3">{row.c3}</td>
                         <td className="p-3">{row.c4}</td>
                         <td className="p-3">{row.c5}</td>
                      </tr>
                   ))}
                </tbody>
             </table>
           </div>
        </div>
      </div>
    );
  }

  const renderQueueSystem = () => (
    <div className="animate-in fade-in duration-300">
       <div className="flex items-center gap-2 mb-6">
          <button onClick={() => setSelectedModule(null)} className="flex items-center text-slate-500 hover:text-slate-800 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-2xl font-bold text-slate-800">Sistema de Senhas</h2>
       </div>
       
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="space-y-6">
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4">Controle de Atendimento</h3>
                <div className="grid grid-cols-2 gap-4">
                   <button onClick={handleCallNext} className="col-span-2 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 shadow-md">
                      Chamar Próximo
                   </button>
                   <button onClick={handleRepeatCall} className="py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200">
                      Repetir Chamada
                   </button>
                   <button onClick={handleManualEntryClick} className="py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200">
                      Chamar Manual
                   </button>
                   <button onClick={handleFinish} className="py-3 bg-green-100 text-green-700 rounded-xl font-medium hover:bg-green-200">
                      Finalizar Atend.
                   </button>
                   <button onClick={handleAbsent} className="py-3 bg-red-100 text-red-700 rounded-xl font-medium hover:bg-red-200">
                      Ausente
                   </button>
                </div>
             </div>
             
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4">Emissão de Senhas (Totem)</h3>
                <div className="grid grid-cols-3 gap-3">
                   <button onClick={() => handleIssueTicket('Geral')} className="p-3 bg-slate-50 border border-slate-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-all text-center">
                      <span className="block font-bold text-slate-700">Geral</span>
                   </button>
                   <button onClick={() => handleIssueTicket('Prioritário')} className="p-3 bg-slate-50 border border-slate-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-all text-center">
                      <span className="block font-bold text-slate-700">Prioritário</span>
                   </button>
                   <button onClick={() => handleIssueTicket('Exames')} className="p-3 bg-slate-50 border border-slate-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-all text-center">
                      <span className="block font-bold text-slate-700">Exames</span>
                   </button>
                </div>
             </div>
          </div>

          {/* Display View */}
          <div className="space-y-6">
             <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl text-center">
                <p className="text-slate-400 text-lg uppercase tracking-widest mb-2">Senha Atual</p>
                <div className="text-7xl font-bold font-mono tracking-tighter mb-4">{currentTicket.number}</div>
                <div className="inline-block bg-white/10 px-6 py-2 rounded-full text-xl font-medium">
                   Guichê {currentTicket.desk}
                </div>
             </div>

             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4">Fila de Espera ({waitingQueue.length})</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                   {waitingQueue.length === 0 && <p className="text-slate-400 text-center py-4">Fila vazia</p>}
                   {waitingQueue.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                         <span className="font-bold text-slate-700">{item.number}</span>
                         <span className={`text-xs px-2 py-1 rounded font-bold ${item.type === 'Prioritário' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                            {item.type}
                         </span>
                      </div>
                   ))}
                </div>
             </div>
          </div>
       </div>

       {showManualModal && (
         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-80">
               <h3 className="font-bold text-lg mb-4">Entrada Manual</h3>
               <input 
                  type="text" 
                  value={manualInput} 
                  onChange={e => setManualInput(e.target.value)} 
                  className="w-full border p-2 rounded mb-4" 
                  placeholder="Ex: A-999"
                  autoFocus
               />
               <select 
                  value={manualType} 
                  // @ts-ignore
                  onChange={e => setManualType(e.target.value)} 
                  className="w-full border p-2 rounded mb-4"
               >
                  <option value="Geral">Geral</option>
                  <option value="Prioritário">Prioritário</option>
                  <option value="Exames">Exames</option>
               </select>
               <div className="flex gap-2">
                  <button onClick={() => setShowManualModal(false)} className="flex-1 py-2 bg-slate-100 rounded">Cancelar</button>
                  <button onClick={confirmManualEntry} className="flex-1 py-2 bg-blue-600 text-white rounded">Chamar</button>
               </div>
            </div>
         </div>
       )}
    </div>
  );

  const renderWarehouseModule = () => (
    <div className="animate-in fade-in duration-300">
       <div className="flex items-center gap-2 mb-6">
          <button onClick={() => setSelectedModule(null)} className="flex items-center text-slate-500 hover:text-slate-800 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-2xl font-bold text-slate-800">Almoxarifado Central</h2>
       </div>

       <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-xl w-fit overflow-x-auto">
          {['dashboard', 'kardex', 'financeiro', 'validade', 'anual'].map(tab => (
             <button 
                key={tab}
                onClick={() => setActiveReport(tab === 'dashboard' ? null : tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${(!activeReport && tab === 'dashboard') || activeReport === tab ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
             >
                {tab}
             </button>
          ))}
       </div>

       {activeReport ? renderReportView() : (
          <div className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-sm">
                   <p className="text-sm text-slate-500">Itens em Estoque</p>
                   <h3 className="text-2xl font-bold text-blue-700">1,240</h3>
                </div>
                <div className="bg-white p-6 rounded-xl border border-red-200 shadow-sm">
                   <p className="text-sm text-slate-500">Estoque Crítico</p>
                   <h3 className="text-2xl font-bold text-red-700">15</h3>
                </div>
                <div className="bg-white p-6 rounded-xl border border-green-200 shadow-sm">
                   <p className="text-sm text-slate-500">Valor Total</p>
                   <h3 className="text-2xl font-bold text-green-700">R$ 450k</h3>
                </div>
                <div className="bg-white p-6 rounded-xl border border-orange-200 shadow-sm">
                   <p className="text-sm text-slate-500">Requisições (Dia)</p>
                   <h3 className="text-2xl font-bold text-orange-700">24</h3>
                </div>
             </div>

             <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="font-bold text-slate-800">Estoque Atual</h3>
                   <div className="flex gap-2">
                      <button onClick={() => setShowEntryModal(true)} className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Nova Entrada</button>
                      <button onClick={() => setShowReqModal(true)} className="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200">Nova Requisição</button>
                   </div>
                </div>
                <table className="w-full text-left text-sm">
                   <thead className="bg-slate-50 text-slate-600">
                      <tr>
                         <th className="p-3">Item</th>
                         <th className="p-3">Unid.</th>
                         <th className="p-3 text-right">Estoque</th>
                         <th className="p-3 text-right">Mínimo</th>
                         <th className="p-3 text-center">Status</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      {warehouseItems.map(item => (
                         <tr key={item.id} className="hover:bg-slate-50">
                            <td className="p-3 font-medium">{item.name}</td>
                            <td className="p-3 text-slate-500">{item.unit}</td>
                            <td className="p-3 text-right font-bold">{item.stock}</td>
                            <td className="p-3 text-right text-slate-500">{item.min}</td>
                            <td className="p-3 text-center">
                               <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.status === 'Normal' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                  {item.status}
                               </span>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
       )}
    </div>
  );

  const renderPlanningBudget = () => (
    <div className="animate-in fade-in duration-300">
       <div className="flex items-center gap-2 mb-6">
          <button onClick={() => setSelectedModule(null)} className="flex items-center text-slate-500 hover:text-slate-800 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-2xl font-bold text-slate-800">Planejamento e Orçamento</h2>
       </div>
       <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm text-center">
          <IconPieChart size={48} className="mx-auto text-emerald-600 mb-4" />
          <h3 className="text-xl font-bold text-slate-800 mb-2">Painel de Planejamento (PPA, LDO, LOA)</h3>
          <p className="text-slate-500 mb-6">Gestão orçamentária integrada.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
             <div className="p-4 border rounded-xl hover:bg-emerald-50 cursor-pointer transition-colors border-emerald-100">
                <h4 className="font-bold text-emerald-800">PPA 2022-2025</h4>
                <p className="text-sm text-emerald-600">Plano Plurianual vigente.</p>
             </div>
             <div className="p-4 border rounded-xl hover:bg-emerald-50 cursor-pointer transition-colors border-emerald-100">
                <h4 className="font-bold text-emerald-800">LDO 2025</h4>
                <p className="text-sm text-emerald-600">Lei de Diretrizes Orçamentárias em elaboração.</p>
             </div>
             <div className="p-4 border rounded-xl hover:bg-emerald-50 cursor-pointer transition-colors border-emerald-100">
                <h4 className="font-bold text-emerald-800">LOA 2024</h4>
                <p className="text-sm text-emerald-600">Orçamento em execução.</p>
             </div>
          </div>
       </div>
    </div>
  );

  const renderPublicAccounting = () => (
    <div className="animate-in fade-in duration-300">
       <div className="flex items-center gap-2 mb-6">
          <button onClick={() => setSelectedModule(null)} className="flex items-center text-slate-500 hover:text-slate-800 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-2xl font-bold text-slate-800">Contabilidade Pública</h2>
       </div>
       <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
             <div className="p-6 bg-slate-50 rounded-xl">
                <p className="text-sm text-slate-500 mb-1">Receita Arrecadada</p>
                <h3 className="text-2xl font-bold text-green-600">R$ 15.4M</h3>
             </div>
             <div className="p-6 bg-slate-50 rounded-xl">
                <p className="text-sm text-slate-500 mb-1">Despesa Empenhada</p>
                <h3 className="text-2xl font-bold text-orange-600">R$ 12.1M</h3>
             </div>
             <div className="p-6 bg-slate-50 rounded-xl">
                <p className="text-sm text-slate-500 mb-1">Superávit/Déficit</p>
                <h3 className="text-2xl font-bold text-blue-600">+ R$ 3.3M</h3>
             </div>
          </div>
          <h3 className="font-bold text-slate-800 mb-4">Execução Orçamentária por Secretaria</h3>
          <table className="w-full text-left text-sm">
             <thead className="bg-slate-50 text-slate-600">
                <tr>
                   <th className="p-3">Unidade Gestora</th>
                   <th className="p-3 text-right">Orçamento Inicial</th>
                   <th className="p-3 text-right">Empenhado</th>
                   <th className="p-3 text-right">Liquidado</th>
                   <th className="p-3 text-right">Pago</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
                {[
                   { u: 'Secretaria de Saúde', o: '12.0M', e: '8.5M', l: '8.0M', p: '7.8M' },
                   { u: 'Secretaria de Educação', o: '15.0M', e: '10.2M', l: '9.8M', p: '9.5M' },
                   { u: 'Secretaria de Obras', o: '8.0M', e: '5.5M', l: '4.2M', p: '4.0M' },
                ].map((row, i) => (
                   <tr key={i} className="hover:bg-slate-50">
                      <td className="p-3 font-medium">{row.u}</td>
                      <td className="p-3 text-right">R$ {row.o}</td>
                      <td className="p-3 text-right">R$ {row.e}</td>
                      <td className="p-3 text-right">R$ {row.l}</td>
                      <td className="p-3 text-right">R$ {row.p}</td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>
    </div>
  );

  const renderFleetManagement = () => {
    const vehicles = [
      { id: 'V001', plate: 'ABC-1234', model: 'Fiat Uno', type: 'Carro', status: 'Disponível', km: 45000, consumption: 'Normal', dept: 'Saúde' },
      { id: 'V002', plate: 'XYZ-9876', model: 'Caminhão Pipa', type: 'Caminhão', status: 'Em Manutenção', km: 89000, consumption: 'Alto', dept: 'Obras' },
      { id: 'V003', plate: 'DEF-5678', model: 'Ambulância UTI', type: 'Ambulância', status: 'Em Uso', km: 12000, consumption: 'Baixo', dept: 'Hospital' },
    ];

    const drivers = [
      { name: 'João Silva', cnh: '12345678900', category: 'AD', expiry: '2025-10-10', points: 5, status: 'Regular' },
      { name: 'Carlos Souza', cnh: '09876543211', category: 'B', expiry: '2023-12-01', points: 22, status: 'Irregular' },
    ];

    const fuelLogs = [
      { id: 1, vehicle: 'ABC-1234', date: '2024-05-20', liters: 40, cost: 220.00, driver: 'João Silva' },
      { id: 2, vehicle: 'DEF-5678', date: '2024-05-21', liters: 55, cost: 310.00, driver: 'Pedro Santos' },
    ];

    return (
      <div className="animate-in fade-in duration-300">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
             <button onClick={() => setSelectedModule(null)} className="flex items-center text-slate-500 hover:text-slate-800 transition-colors">
               <ChevronLeft size={20} />
             </button>
             <div>
               <h2 className="text-2xl font-bold text-slate-800">Gestão de Frotas</h2>
               <p className="text-sm text-slate-500">Controle de veículos, motoristas e abastecimento</p>
             </div>
          </div>
          <div className="flex gap-2">
             <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2">
                <Fuel size={16} /> Autorizar Abastecimento
             </button>
             <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
                <Navigation size={16} /> Nova Saída
             </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-xl w-fit overflow-x-auto max-w-full">
           {[
              { id: 'dashboard', label: 'Visão Geral' },
              { id: 'veiculos', label: 'Veículos' },
              { id: 'motoristas', label: 'Motoristas' },
              { id: 'abastecimento', label: 'Abastecimento' },
              { id: 'manutencao', label: 'Manutenção' },
              { id: 'trafego', label: 'Tráfego/Portaria' },
              { id: 'multas', label: 'Multas' }
           ].map(tab => (
              <button 
                 key={tab.id}
                 onClick={() => setFleetTab(tab.id as any)}
                 className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap capitalize ${
                    fleetTab === tab.id ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                 }`}
              >
                 {tab.label}
              </button>
           ))}
        </div>

        {/* Content */}
        {fleetTab === 'dashboard' && (
           <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                 <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-sm">
                    <p className="text-sm text-slate-500 font-medium">Veículos Ativos</p>
                    <h3 className="text-2xl font-bold text-blue-700 mt-1">45</h3>
                    <p className="text-xs text-blue-600 mt-2 flex items-center gap-1"><Car size={12} /> 90% da frota</p>
                 </div>
                 <div className="bg-white p-6 rounded-xl border border-orange-200 shadow-sm">
                    <p className="text-sm text-slate-500 font-medium">Em Manutenção</p>
                    <h3 className="text-2xl font-bold text-orange-700 mt-1">5</h3>
                    <p className="text-xs text-orange-600 mt-2">Oficina externa</p>
                 </div>
                 <div className="bg-white p-6 rounded-xl border border-red-200 shadow-sm">
                    <p className="text-sm text-slate-500 font-medium">CNH Vencida</p>
                    <h3 className="text-2xl font-bold text-red-700 mt-1">2</h3>
                    <p className="text-xs text-red-600 mt-2 flex items-center gap-1"><AlertTriangle size={12} /> Bloqueados</p>
                 </div>
                 <div className="bg-white p-6 rounded-xl border border-emerald-200 shadow-sm">
                    <p className="text-sm text-slate-500 font-medium">Gasto Combustível (Mês)</p>
                    <h3 className="text-2xl font-bold text-emerald-700 mt-1">R$ 45.2k</h3>
                    <p className="text-xs text-emerald-600 mt-2">Média: R$ 5.50/L</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-4">Alertas de Manutenção</h3>
                    <div className="space-y-3">
                       <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-3">
                          <Wrench size={20} className="text-red-600" />
                          <div>
                             <p className="text-sm font-bold text-slate-800">Caminhão Pipa (XYZ-9876)</p>
                             <p className="text-xs text-slate-500">Troca de Óleo Atrasada (500km)</p>
                          </div>
                       </div>
                       <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg flex items-center gap-3">
                          <Gauge size={20} className="text-amber-600" />
                          <div>
                             <p className="text-sm font-bold text-slate-800">Fiat Uno (ABC-1234)</p>
                             <p className="text-xs text-slate-500">Revisão Preventiva em 1000km</p>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-4">Próximos Vencimentos (IPVA/Licenciamento)</h3>
                    <table className="w-full text-left text-sm">
                       <thead className="bg-slate-50 text-slate-600">
                          <tr>
                             <th className="p-2">Veículo</th>
                             <th className="p-2">Tipo</th>
                             <th className="p-2">Vencimento</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100">
                          <tr>
                             <td className="p-2">ABC-1234</td>
                             <td className="p-2">Licenciamento</td>
                             <td className="p-2 text-red-600 font-bold">15/06/2024</td>
                          </tr>
                          <tr>
                             <td className="p-2">DEF-5678</td>
                             <td className="p-2">Seguro</td>
                             <td className="p-2 text-amber-600">20/07/2024</td>
                          </tr>
                       </tbody>
                    </table>
                 </div>
              </div>
           </div>
        )}

        {fleetTab === 'veiculos' && (
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-slate-800">Frota Municipal</h3>
                 <div className="flex gap-2">
                    <button className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1 rounded text-sm flex items-center gap-2">
                       <Search size={14} /> Consultar FIPE
                    </button>
                    <button className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-700">+ Veículo</button>
                 </div>
              </div>
              <table className="w-full text-left text-sm">
                 <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                       <th className="p-3">Placa/ID</th>
                       <th className="p-3">Modelo</th>
                       <th className="p-3">Departamento</th>
                       <th className="p-3">KM Atual</th>
                       <th className="p-3 text-center">Consumo</th>
                       <th className="p-3 text-center">Status</th>
                       <th className="p-3 text-right">Ações</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {vehicles.map((v, i) => (
                       <tr key={i} className="hover:bg-slate-50">
                          <td className="p-3 font-medium">{v.plate}</td>
                          <td className="p-3">{v.model}</td>
                          <td className="p-3 text-slate-500">{v.dept}</td>
                          <td className="p-3 font-mono">{v.km.toLocaleString()}</td>
                          <td className="p-3 text-center">
                             <span className={`px-2 py-1 rounded text-xs font-bold ${v.consumption === 'Alto' ? 'text-red-600 bg-red-50' : 'text-green-600 bg-green-50'}`}>
                                {v.consumption}
                             </span>
                          </td>
                          <td className="p-3 text-center">
                             <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                v.status === 'Disponível' ? 'bg-green-100 text-green-700' : 
                                v.status === 'Em Manutenção' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                             }`}>
                                {v.status}
                             </span>
                          </td>
                          <td className="p-3 text-right flex justify-end gap-2">
                             <button className="text-slate-500 hover:text-blue-600" title="Ver Detalhes"><Eye size={18} /></button>
                             <button className="text-slate-500 hover:text-orange-600" title="Anexos"><Paperclip size={18} /></button>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        )}

        {fleetTab === 'motoristas' && (
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4">Controle de Motoristas e CNH</h3>
              <table className="w-full text-left text-sm">
                 <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                       <th className="p-3">Nome</th>
                       <th className="p-3">CNH</th>
                       <th className="p-3 text-center">Categoria</th>
                       <th className="p-3 text-center">Validade</th>
                       <th className="p-3 text-center">Pontos</th>
                       <th className="p-3 text-center">Status</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {drivers.map((d, i) => (
                       <tr key={i} className="hover:bg-slate-50">
                          <td className="p-3 font-medium">{d.name}</td>
                          <td className="p-3 font-mono">{d.cnh}</td>
                          <td className="p-3 text-center">{d.category}</td>
                          <td className={`p-3 text-center font-bold ${new Date(d.expiry) < new Date() ? 'text-red-600' : 'text-slate-600'}`}>
                             {d.expiry}
                          </td>
                          <td className={`p-3 text-center font-bold ${d.points >= 20 ? 'text-red-600' : 'text-green-600'}`}>
                             {d.points}
                          </td>
                          <td className="p-3 text-center">
                             <span className={`px-2 py-1 rounded-full text-xs font-bold ${d.status === 'Regular' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {d.status}
                             </span>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        )}

        {fleetTab === 'abastecimento' && (
           <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-white p-6 rounded-xl border border-slate-200">
                    <h4 className="font-bold text-slate-800 mb-4">Novo Abastecimento</h4>
                    <div className="space-y-4">
                       <select className="w-full border border-slate-300 rounded p-2 text-sm">
                          <option>Selecione o Veículo...</option>
                          {vehicles.map(v => <option key={v.id}>{v.plate} - {v.model}</option>)}
                       </select>
                       <div className="flex gap-4">
                          <input type="number" placeholder="Litros" className="w-full border border-slate-300 rounded p-2 text-sm" />
                          <input type="text" placeholder="Valor Total (R$)" className="w-full border border-slate-300 rounded p-2 text-sm" />
                       </div>
                       <div className="p-3 bg-blue-50 border border-blue-100 rounded text-xs text-blue-700">
                          <p className="font-bold">Saldo Disponível (Licitação): R$ 12.500,00</p>
                          <p>Fornecedor: Posto Central Ltda</p>
                       </div>
                       <button className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700">Gerar Autorização</button>
                    </div>
                 </div>
                 <div className="bg-white p-6 rounded-xl border border-slate-200">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-slate-800">Últimos Abastecimentos</h4>
                        <button className="text-xs text-blue-600 hover:underline">Portal do Posto (Externo)</button>
                    </div>
                    <table className="w-full text-left text-xs">
                       <thead className="text-slate-500">
                          <tr>
                             <th className="pb-2">Veículo</th>
                             <th className="pb-2">Litros</th>
                             <th className="pb-2 text-right">Valor</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100">
                          {fuelLogs.map(l => (
                             <tr key={l.id}>
                                <td className="py-2">{l.vehicle}</td>
                                <td className="py-2">{l.liters} L</td>
                                <td className="py-2 text-right">R$ {l.cost.toFixed(2)}</td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
           </div>
        )}

        {fleetTab === 'trafego' && (
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><MapPin size={20} /> Controle de Portaria / Tráfego</h3>
              <div className="flex flex-col md:flex-row gap-6">
                 <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <h4 className="font-bold text-green-700 mb-4 uppercase text-sm">Registrar Saída</h4>
                    <div className="space-y-3">
                       <input type="text" placeholder="Placa do Veículo" className="w-full border border-slate-300 rounded p-2 text-sm" />
                       <input type="text" placeholder="Motorista (Busca por nome/CNH)" className="w-full border border-slate-300 rounded p-2 text-sm" />
                       <input type="number" placeholder="KM Saída" className="w-full border border-slate-300 rounded p-2 text-sm" />
                       <input type="text" placeholder="Destino / Rota" className="w-full border border-slate-300 rounded p-2 text-sm" />
                       <button className="w-full bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700">Confirmar Saída</button>
                    </div>
                 </div>
                 <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <h4 className="font-bold text-blue-700 mb-4 uppercase text-sm">Registrar Retorno</h4>
                    <div className="space-y-3">
                       <select className="w-full border border-slate-300 rounded p-2 text-sm">
                          <option>Selecione Veículo em Trânsito...</option>
                          <option>ABC-1234 (Saiu às 08:00)</option>
                       </select>
                       <input type="number" placeholder="KM Chegada" className="w-full border border-slate-300 rounded p-2 text-sm" />
                       <textarea placeholder="Ocorrências / Observações" className="w-full border border-slate-300 rounded p-2 text-sm h-20"></textarea>
                       <button className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700">Registrar Chegada</button>
                    </div>
                 </div>
              </div>
           </div>
        )}
      </div>
    );
  };

  const renderPatrimonyModule = () => {
    const patrimonyAssets = [
      { id: 'TB-001052', desc: 'Mesa Escritório em L', value: 450.00, location: 'Secretaria de Saúde', status: 'Ativo', conservation: 'Bom', purchaseDate: '10/02/2023' },
      { id: 'TB-001053', desc: 'Cadeira Giratória Executiva', value: 380.00, location: 'Gabinete Prefeito', status: 'Ativo', conservation: 'Ótimo', purchaseDate: '15/03/2023' },
      { id: 'TB-000800', desc: 'Computador Desktop Dell', value: 3200.00, location: 'Escola Municipal Central', status: 'Em Manutenção', conservation: 'Regular', purchaseDate: '20/05/2022' },
      { id: 'TB-000500', desc: 'Armário de Aço', value: 200.00, location: 'Almoxarifado', status: 'Baixado', conservation: 'Ruim', purchaseDate: '10/01/2018' },
    ];

    const patrimonyMovements = [
      { id: 'MOV-550', date: '25/05/2024', type: 'Transferência', asset: 'TB-001052', origin: 'Compras', dest: 'Saúde', user: 'Ana P.' },
      { id: 'MOV-549', date: '20/05/2024', type: 'Depreciação', asset: 'Lote 05/24', origin: 'Mensal', dest: '-', user: 'Sistema' },
    ];

    return (
      <div className="animate-in fade-in duration-300">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
             <button onClick={() => setSelectedModule(null)} className="flex items-center text-slate-500 hover:text-slate-800 transition-colors">
               <ChevronLeft size={20} />
             </button>
             <div>
               <h2 className="text-2xl font-bold text-slate-800">Gestão de Patrimônio</h2>
               <p className="text-sm text-slate-500">Controle de bens móveis e imóveis (NBCASP)</p>
             </div>
          </div>
          <div className="flex gap-2">
             <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2">
                <Download size={16} /> Importar Empenho
             </button>
             <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
                <Plus size={16} /> Novo Bem
             </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-xl w-fit overflow-x-auto max-w-full">
           {[
              { id: 'dashboard', label: 'Visão Geral' },
              { id: 'bens', label: 'Bens Patrimoniais' },
              { id: 'movimentacoes', label: 'Movimentações e Baixas' },
              { id: 'inventario', label: 'Inventário e Comissões' },
              { id: 'relatorios', label: 'Relatórios e Etiquetas' }
           ].map(tab => (
              <button 
                 key={tab.id}
                 onClick={() => setPatrimonyTab(tab.id as any)}
                 className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap capitalize ${
                    patrimonyTab === tab.id ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                 }`}
              >
                 {tab.label}
              </button>
           ))}
        </div>

        {/* --- DASHBOARD TAB --- */}
        {patrimonyTab === 'dashboard' && (
           <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                 <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-sm">
                    <p className="text-sm text-slate-500 font-medium">Total de Bens Ativos</p>
                    <h3 className="text-2xl font-bold text-blue-700 mt-1">15,420</h3>
                    <p className="text-xs text-blue-600 mt-2 flex items-center gap-1"><Box size={12} /> Móveis e Imóveis</p>
                 </div>
                 <div className="bg-white p-6 rounded-xl border border-emerald-200 shadow-sm">
                    <p className="text-sm text-slate-500 font-medium">Valor Contábil Atual</p>
                    <h3 className="text-2xl font-bold text-emerald-700 mt-1">R$ 45.2M</h3>
                    <p className="text-xs text-emerald-600 mt-2">Atualizado Depreciação</p>
                 </div>
                 <div className="bg-white p-6 rounded-xl border border-orange-200 shadow-sm">
                    <p className="text-sm text-slate-500 font-medium">Bens em Transferência</p>
                    <h3 className="text-2xl font-bold text-orange-700 mt-1">12</h3>
                    <p className="text-xs text-orange-600 mt-2">Aguardando Aceite</p>
                 </div>
                 <div className="bg-white p-6 rounded-xl border border-red-200 shadow-sm">
                    <p className="text-sm text-slate-500 font-medium">Valor Residual Atingido</p>
                    <h3 className="text-2xl font-bold text-red-700 mt-1">340</h3>
                    <p className="text-xs text-red-600 mt-2">Totalmente depreciados</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-4">Evolução Patrimonial (Valor Líquido)</h3>
                    <div className="h-64">
                       <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={[
                             {name: 'Jan', val: 44.5}, {name: 'Fev', val: 44.8}, {name: 'Mar', val: 45.0},
                             {name: 'Abr', val: 45.1}, {name: 'Mai', val: 45.2},
                          ]}>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} />
                             <XAxis dataKey="name" />
                             <YAxis />
                             <Tooltip formatter={(value) => `R$ ${value}M`} />
                             <Area type="monotone" dataKey="val" stroke="#3b82f6" fill="#eff6ff" />
                          </AreaChart>
                       </ResponsiveContainer>
                    </div>
                 </div>
                 
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-4">Status de Conservação</h3>
                    <div className="h-64 flex items-center justify-center">
                       <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                             <Pie data={[
                                {name: 'Ótimo', value: 40},
                                {name: 'Bom', value: 35},
                                {name: 'Regular', value: 20},
                                {name: 'Ruim/Inservível', value: 5},
                             ]} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                <Cell fill="#10b981" />
                                <Cell fill="#3b82f6" />
                                <Cell fill="#f59e0b" />
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

        {/* --- BENS TAB --- */}
        {patrimonyTab === 'bens' && (
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                 <h3 className="font-bold text-slate-800 text-lg">Cadastro de Bens</h3>
                 <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1">
                       <input type="text" placeholder="Buscar por Tombo, Descrição..." className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm" />
                       <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                    </div>
                    <button className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600"><Filter size={18} /></button>
                 </div>
              </div>
              
              <table className="w-full text-left text-sm">
                 <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                       <th className="p-3">Tombo</th>
                       <th className="p-3">Descrição</th>
                       <th className="p-3 text-right">Valor Histórico</th>
                       <th className="p-3">Localização</th>
                       <th className="p-3">Estado</th>
                       <th className="p-3 text-center">Situação</th>
                       <th className="p-3 text-right">Ações</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {patrimonyAssets.map((asset, i) => (
                       <tr key={i} className="hover:bg-slate-50 group">
                          <td className="p-3 font-mono font-bold text-slate-700">{asset.id}</td>
                          <td className="p-3 font-medium text-slate-700">{asset.desc}</td>
                          <td className="p-3 text-right">R$ {asset.value.toFixed(2)}</td>
                          <td className="p-3 text-slate-600">{asset.location}</td>
                          <td className="p-3 text-slate-600">{asset.conservation}</td>
                          <td className="p-3 text-center">
                             <span className={`px-2 py-1 rounded-full text-xs font-bold ${asset.status === 'Ativo' ? 'bg-green-100 text-green-700' : asset.status === 'Baixado' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                                {asset.status}
                             </span>
                          </td>
                          <td className="p-3 text-right flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button className="text-slate-500 hover:text-blue-600" title="Editar"><Edit size={16} /></button>
                             <button className="text-slate-500 hover:text-orange-600" title="Histórico"><History size={16} /></button>
                             <button className="text-slate-500 hover:text-indigo-600" title="Etiqueta"><Tag size={16} /></button>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        )}

        {/* --- MOVIMENTACOES TAB --- */}
        {patrimonyTab === 'movimentacoes' && (
           <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="bg-white p-6 rounded-xl border border-slate-200">
                    <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><RefreshCw size={20} className="text-blue-600" /> Virada Mensal (Depreciação)</h4>
                    <p className="text-sm text-slate-500 mb-4">Calcular depreciação automática de todos os bens ativos conforme NBCASP.</p>
                    <button className="w-full py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 border border-blue-200 mb-2">
                       Executar Depreciação (Mês Atual)
                    </button>
                    <button className="w-full py-1 text-slate-400 text-xs hover:text-red-500 hover:underline">
                       Estornar Mês Anterior
                    </button>
                 </div>
                 <div className="bg-white p-6 rounded-xl border border-slate-200">
                    <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><ArrowLeftRight size={20} className="text-orange-600" /> Transferência</h4>
                    <p className="text-sm text-slate-500 mb-4">Mover bens entre departamentos, setores ou unidades gestoras.</p>
                    <button className="w-full py-2 bg-orange-50 text-orange-700 rounded-lg text-sm font-medium hover:bg-orange-100 border border-orange-200">
                       Nova Transferência
                    </button>
                 </div>
                 <div className="bg-white p-6 rounded-xl border border-slate-200">
                    <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><Trash size={20} className="text-red-600" /> Baixa Patrimonial</h4>
                    <p className="text-sm text-slate-500 mb-4">Registrar saída definitiva (leilão, roubo, inservível) e gerar termo.</p>
                    <button className="w-full py-2 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 border border-red-200">
                       Registrar Baixa
                    </button>
                 </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                 <h3 className="font-bold text-slate-800 mb-4">Histórico de Movimentações Recentes</h3>
                 <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-600">
                       <tr>
                          <th className="p-3">Data</th>
                          <th className="p-3">Tipo</th>
                          <th className="p-3">Bem / Lote</th>
                          <th className="p-3">Origem</th>
                          <th className="p-3">Destino</th>
                          <th className="p-3">Usuário</th>
                          <th className="p-3 text-right">Doc</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {patrimonyMovements.map((mov, i) => (
                          <tr key={i} className="hover:bg-slate-50">
                             <td className="p-3 text-slate-500">{mov.date}</td>
                             <td className="p-3 font-medium text-slate-700">{mov.type}</td>
                             <td className="p-3 text-blue-600 font-mono text-xs">{mov.asset}</td>
                             <td className="p-3 text-slate-500">{mov.origin}</td>
                             <td className="p-3 text-slate-500">{mov.dest}</td>
                             <td className="p-3 text-slate-500">{mov.user}</td>
                             <td className="p-3 text-right">
                                <button className="text-slate-400 hover:text-blue-600"><FileText size={16} /></button>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        )}

        {/* --- INVENTARIO TAB --- */}
        {patrimonyTab === 'inventario' && (
           <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2"><ClipboardCheck size={20} /> Inventários Físicos</h3>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                       Abrir Novo Inventário
                    </button>
                 </div>
                 
                 <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg mb-6 flex justify-between items-center">
                    <div>
                       <h4 className="font-bold text-amber-800">Inventário Anual 2024 - Em Andamento</h4>
                       <p className="text-sm text-amber-700">Iniciado em 01/05/2024 • Comissão: Portaria 092/24</p>
                    </div>
                    <div className="text-right">
                       <p className="text-xs text-amber-600 font-bold uppercase">Progresso</p>
                       <p className="text-2xl font-bold text-amber-800">65%</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 border rounded-xl">
                       <h4 className="font-bold text-slate-700 mb-2">Comissões de Inventário</h4>
                       <p className="text-sm text-slate-500 mb-4">Gerenciar membros e portarias de designação.</p>
                       <button className="text-blue-600 text-sm hover:underline font-medium">Gerenciar Membros</button>
                    </div>
                    <div className="p-4 border rounded-xl">
                       <h4 className="font-bold text-slate-700 mb-2">Divergências e Inconsistências</h4>
                       <p className="text-sm text-slate-500 mb-4">Bens não localizados ou em setor incorreto.</p>
                       <button className="text-red-600 text-sm hover:underline font-medium">Ver Relatório de Divergências (12)</button>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* --- RELATORIOS TAB --- */}
        {patrimonyTab === 'relatorios' && (
           <div className="bg-white p-8 rounded-xl border border-slate-200">
              <h3 className="font-bold text-xl text-slate-800 mb-6">Central de Relatórios e Etiquetas</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div>
                    <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><Printer size={18} /> Relatórios Operacionais</h4>
                    <div className="space-y-2">
                       {['Listagem Geral por Setor', 'Termo de Responsabilidade (Carga)', 'Relatório de Depreciação Mensal', 'Bens Totalmente Depreciados', 'Relatório de Baixas no Período'].map((rep, i) => (
                          <button key={i} className="w-full text-left p-3 border border-slate-100 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors text-sm text-slate-600 flex justify-between items-center group">
                             {rep} <Download size={16} className="opacity-0 group-hover:opacity-100 text-blue-600 transition-opacity" />
                          </button>
                       ))}
                    </div>
                 </div>
                 <div>
                    <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><Tag size={18} /> Etiquetas Patrimoniais</h4>
                    <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-center">
                       <div className="w-full max-w-[200px] h-24 mx-auto bg-white border border-slate-300 rounded mb-4 flex flex-col items-center justify-center shadow-sm relative overflow-hidden">
                          <div className="w-full bg-slate-800 h-2 absolute top-0"></div>
                          <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">Município de Exemplo</span>
                          <div className="flex items-center gap-2 my-1">
                             <div className="w-8 h-8 bg-black"></div> {/* Fake QR */}
                             <div className="flex flex-col items-start">
                                <span className="font-mono font-bold text-sm">TB-001052</span>
                                <div className="h-2 w-16 bg-black mt-1"></div> {/* Fake Barcode */}
                             </div>
                          </div>
                       </div>
                       <p className="text-xs text-slate-500 mb-4">Modelo padrão com Código de Barras e QR Code</p>
                       <div className="flex gap-2 justify-center">
                          <button className="px-4 py-2 bg-slate-800 text-white text-sm rounded hover:bg-slate-900">Imprimir Sequência</button>
                          <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm rounded hover:bg-slate-50">Configurar</button>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        )}
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
                     <th className="px-6 py-4">Acessos</th>
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
                        <td className="px-6 py-4">
                           <div className="flex -space-x-2 overflow-hidden">
                              {user.permissions && user.permissions.length > 0 ? (
                                user.permissions.slice(0, 3).map((perm, idx) => (
                                  <div key={idx} className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-slate-100 flex items-center justify-center text-[10px] text-slate-600 uppercase font-bold" title={perm}>
                                    {perm.charAt(0)}
                                  </div>
                                ))
                              ) : (
                                <span className="text-xs text-slate-400">Sem acessos</span>
                              )}
                              {user.permissions && user.permissions.length > 3 && (
                                <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-slate-100 flex items-center justify-center text-[8px] text-slate-600 font-bold">
                                  +{user.permissions.length - 3}
                                </div>
                              )}
                           </div>
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
        selectedModule === 'Frotas' ? renderFleetManagement() :
        selectedModule === 'Patrimônio' ? renderPatrimonyModule() :
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

                        {/* Permission Selection - Granular */}
                        <div className="md:col-span-2 border rounded-xl overflow-hidden mt-2">
                           <div className="bg-slate-100 p-3 border-b border-slate-200 font-medium text-slate-700 text-sm flex justify-between items-center">
                              <span>Permissões de Acesso por Módulo</span>
                              <span className="text-xs text-slate-500 bg-white px-2 py-1 rounded border">
                                 {tempUser.permissions?.length || 0} módulos selecionados
                              </span>
                           </div>
                           <div className="h-64 overflow-y-auto p-4 bg-slate-50 space-y-6">
                              {categories.map(cat => {
                                 const catModules = moduleMap[cat.id] || [];
                                 const allModuleNames = catModules.map(m => m.name);
                                 const selectedCount = catModules.filter(m => tempUser.permissions?.includes(m.name)).length;
                                 const allSelected = catModules.length > 0 && selectedCount === catModules.length;
                                 const someSelected = selectedCount > 0 && selectedCount < catModules.length;

                                 return (
                                    <div key={cat.id} className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm">
                                       <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                                          <div className="relative flex items-center">
                                             <input 
                                                type="checkbox" 
                                                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                                                checked={allSelected}
                                                ref={input => {
                                                   if (input) input.indeterminate = someSelected;
                                                }}
                                                onChange={() => handleToggleCategory(catModules)}
                                             />
                                          </div>
                                          <span className="font-bold text-slate-700 text-sm flex items-center gap-2">
                                             <span className="text-slate-400">{cat.icon}</span>
                                             {cat.label}
                                          </span>
                                       </div>
                                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-6">
                                          {catModules.map((mod: any) => (
                                             <label key={mod.name} className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer hover:text-blue-600 transition-colors">
                                                <input 
                                                   type="checkbox" 
                                                   className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                                                   checked={tempUser.permissions?.includes(mod.name) || false}
                                                   onChange={() => handleTogglePermission(mod.name)}
                                                />
                                                {mod.name}
                                             </label>
                                          ))}
                                       </div>
                                    </div>
                                 )
                              })}
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