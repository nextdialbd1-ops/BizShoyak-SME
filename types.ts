
export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense'
}

export interface RecurringConfig {
  frequency: 'daily' | 'weekly' | 'monthly';
  endDate: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  vendor: string;
  date: string;
  description: string;
  receiptUrl?: string;
  recurring?: RecurringConfig;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  minStock: number;
  price: number;
}

export interface WhatsAppMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  category: 'price_inquiry' | 'order' | 'complaint' | 'general' | 'greeting';
  suggestedReply: string;
  status: 'pending' | 'replied' | 'converted';
}

export interface BusinessProfile {
  name: string;
  ownerName: string;
  type: string;
  phone: string;
  email: string;
  pageName: string;
  address: string;
  currency: string;
  isOnboarded: boolean;
}

export type AppTab = 'dashboard' | 'whatsapp' | 'cashflow' | 'inventory' | 'marketing' | 'profile';
