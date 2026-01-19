export type CustomerType = 'new' | 'existing' | 'unknown';
export type ShoppingContext = 'app' | 'browser' | 'unknown';
export type PriceContext = 'sale' | 'fullprice' | 'unknown';

export interface UserContext {
  customerType: CustomerType;
  shoppingContext: ShoppingContext;
  priceContext: PriceContext;
  isStudent: boolean;
}

export type TrustLevel = 'high' | 'medium' | 'low';

export interface DiscountCode {
  id: string;
  code: string;
  description: string;
  probability: number; // 0-100
  trustLevel: TrustLevel;
  context: string[]; // e.g., ['Ny kunde', 'Kun i app']
  validUntil?: string;
  lastVerified: string;
  savings?: string; // e.g., '10%' or '100 kr'
  affiliateUrl?: string; // Optional affiliate link - only shown when code is best choice for user
}

export interface Store {
  id: string;
  name: string;
  logo?: string;
  category: string;
  codes: DiscountCode[];
  alternatives?: Alternative[];
  lastUpdated: string;
}

export interface Alternative {
  type: 'cheaper-store' | 'newsletter' | 'student' | 'wait-for-sale' | 'cashback';
  title: string;
  description: string;
  actionLabel?: string;
  actionUrl?: string;
}
