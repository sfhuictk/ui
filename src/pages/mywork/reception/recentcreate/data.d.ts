export interface Member {
  avatar: string;
  name: string;
  id: string;
}

export interface TagType {
  key: string;
  label: string;
}

export interface NoticeType {
  id: string;
  title: string;
  logo: string;
  description: string;
  updatedAt: string;
  member: string;
  href: string;
  memberLink: string;
}

export interface GeographicType {
  province: {
    label: string;
    key: string;
  };
  city: {
    label: string;
    key: string;
  };
}


export interface BasicListItemDataType {
  id: string;
  customer: string;
  construction_team: string;
  contacter: string;
  address: string;
  receipt: string;
  completed_date: number;
  created_at: number;
  phone: string;
  prepayments: number;
  page: number;
  remark: string;
  avatar: string;
  original_account: string;
  // status: 'normal' | 'exception' | 'active' | 'success';
  status: number;
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

export interface Paginate {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
} 
