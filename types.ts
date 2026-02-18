
export interface Article {
  id: string;
  name: string;
  qty: number;
  gross: number;
  stone: number;
  touchValue: string | number; // e.g., "22krt" or 85
  isKarat: boolean;
  net: number;
}

export interface AppraiserDetails {
  name: string;
  bank: string;
  branch: string;
  code: string;
}

export interface CustomerDetails {
  name: string;
  mobile: string;
  village: string;
  address: string;
}

export interface LoanDetails {
  loanNumber: string;
  date: string;
  dueDate: string;
  sanctionAmount: number;
}

export enum TabType {
  Appraiser = 'appraiser',
  Customer = 'customer',
  Valuation = 'valuation'
}
