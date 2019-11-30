export interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
  group: string;
  currentAuthority: string;
  remember_token: string;
  phone: string;
  created_at: Date;
  updated_at: Date;
}

export interface Paginate {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
} 
