// ── Order Types ──────────────────────────────────────────────────────────────
export type OrderStatus = "SHIPPED" | "DELIVERED" | "PROCESSING" | "CANCELLED";

export interface Order {
  id: string;
  orderNumber: string;
  placedAt: string;
  totalAmount: number;
  estimatedDelivery?: string;
  deliveryDate?: string;
  status: OrderStatus;
}

// ── Loyalty Types ─────────────────────────────────────────────────────────────
export type LoyaltyTier = "SILVER" | "GOLD" | "PLATINUM";

export interface Reward {
  id: string;
  title: string;
  description: string;
  points: number;
  type: "discount" | "shipping" | "voucher" | "aroma";
}

export interface PointHistory {
  id: string;
  description: string;
  points: number;
  date: string;
  type: "earn" | "redeem";
}

export interface LoyaltyData {
  tier: LoyaltyTier;
  activeSince: string;
  availablePoints: number;
  progressToNext: number;
  nextTier: string;
  benefits: string[];
  rewards: Reward[];
  pointHistory: PointHistory[];
}

// ── User Types ────────────────────────────────────────────────────────────────
export interface User {
  name: string;
  email: string;
  tier: LoyaltyTier;
  avatar?: string;
}

// ── Address Types ─────────────────────────────────────────────────────────────
export interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  isDefault: boolean;
}