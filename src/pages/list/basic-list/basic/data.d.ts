export interface BasicGood {
  id: string;
  name?: string;
  barcode?: string;
  price?: string;
  num?: string | number;
  amount?: string | number;
}
export interface Dispatch {
  id: string | number;
  customer: string | number;
  contacter: string | number;
  phone: number;
  address: string;
  type: string;
}

export interface BasicProgress {
  key: string;
  time: string;
  rate: string;
  status: string;
  operator: string;
  cost: string;
}

export interface BasicProfileDataType {
  basicGoods: BasicGood[];
  dispatch: Dispatch;
  basicProgress: BasicProgress[];
}
