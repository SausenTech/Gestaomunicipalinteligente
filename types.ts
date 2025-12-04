export enum PortalType {
  LANDING = 'LANDING',
  CITIZEN = 'CITIZEN',
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE',
  COUNCIL = 'COUNCIL'
}

export interface ServiceRequest {
  id: string;
  type: string;
  status: 'Pendente' | 'Em Análise' | 'Concluído';
  date: string;
  description: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  date: string;
  imageUrl: string;
  category: string;
}

export interface LawProject {
  id: string;
  number: string;
  title: string;
  author: string;
  status: 'Em Tramitação' | 'Aprovado' | 'Vetado';
  date: string;
}

export interface ChartData {
  name: string;
  value: number;
}
