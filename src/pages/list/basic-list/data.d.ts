export interface Member {
  avatar: string;
  name: string;
  id: string;
}

export interface BasicListItemDataType {
  id: string;
  customer: string;
  construction_team: string;
  contacter: string;
  address: string;
  completed_date: number;
  created_at: number;
  phone: string;
  prepayments: number;
  remark: string;
  avatar: string;
  cover: string;
  status: 'normal' | 'exception' | 'active' | 'success';
  percent: number;
  logo: string;
  href: string;
  body?: any;
  updatedAt: number;
  start_date: number;
  subDescription: string;
  type: string;
  activeUser: number;
  newUser: number;
  star: number;
  like: number;
  message: number;
  content: string;
  members: Member[];
}
