export interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
  vipLevel: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  loyaltyPoints: number;
  location: {
    country: string;
    city: string;
  };
}

export interface Bet {
  id: string;
  matchId: string;
  userId: string;
  amount: number;
  odds: number;
  type: 'P2P' | 'Standard';
  status: 'Pending' | 'Won' | 'Lost';
  timestamp: string;
}

export interface Match {
  id: string;
  sport: string;
  homeTeam: string;
  awayTeam: string;
  startTime: string;
  league: string;
  poolAmount: number;
  participants: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  seller: string;
  shopId: string;
  image: string;
  category: string;
  description: string;
  isPromoted: boolean;
  promotionExpiry?: string;
}

export interface Shop {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  logo: string;
  commissionRate: number;
  totalSales: number;
  createdAt: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  reward: number;
  progress: number;
  total: number;
  type: 'Betting' | 'Social' | 'Marketplace';
}

export interface Service {
  id: string;
  title: string;
  provider: string;
  price: number;
  rating: number;
  category: string;
}
