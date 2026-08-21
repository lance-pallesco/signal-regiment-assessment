export type PersonnelStatus = 'Active' | 'Reserve' | 'AWOL' | 'Retired';

export type Gender = 'Male' | 'Female';

export type CivilStatus = 'Single' | 'Married' | 'Widowed' | 'Separated' | 'Divorced';

export type Rank = string;

export interface RankItem {
  id: number;
  code: Rank;
  name: string;
  category: string;
  order: number;
}

export interface Personnel {
  id: number;
  serial_number: string;
  first_name: string;
  last_name: string;
  full_name?: string;
  rank: Rank;
  birthday: string;
  gender: Gender;
  civil_status: CivilStatus;
  phone: string;
  email: string | null;
  address: string;
  unit: string;
  position: string;
  date_of_enlistment: string;
  status: PersonnelStatus;
  photo_path: string | null;
  photo_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PersonnelFormData {
  serial_number: string;
  first_name: string;
  last_name: string;
  rank: Rank;
  birthday: string;
  gender: Gender;
  civil_status: CivilStatus;
  phone: string;
  email: string;
  address: string;
  unit: string;
  position: string;
  date_of_enlistment: string;
  status: PersonnelStatus;
  photo?: File | null;
}

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface DashboardMetrics {
  total: number;
  active: number;
  reserve: number;
  awol: number;
  retired: number;
}

export interface ChartDataItem {
  [key: string]: string | number;
}

export interface DashboardCharts {
  rank_distribution: Array<{ rank: string; count: number }>;
  status_breakdown: Array<{ status: string; count: number }>;
  enlistment_trends: Array<{ year: number | string; count: number }>;
  gender_civil_status: Array<{ gender: string; civil_status: string; count: number }>;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from?: number;
  to?: number;
  links: PaginationLink[];
}

export interface ApiResponse<T> {
  message?: string;
  data: T;
  user?: User;
  token?: string;
}

export interface PersonnelFilters {
  search?: string;
  status?: PersonnelStatus | '';
  rank?: Rank | '';
  unit?: string;
  per_page?: number;
  page?: number;
}
