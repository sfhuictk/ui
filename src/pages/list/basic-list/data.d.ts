export interface Member {
  avatar: string;
  name: string;
  id: string;
}

export interface BasicListItemDataType {
  id: string;
  construction_team: string;
  customer: string;
  contacter: string;
  phone: string;
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
  address: string;
  activeUser: number;
  newUser: number;
  star: number;
  like: number;
  message: number;
  content: string;
  members: Member[];
}
