import React, { useState, useEffect } from 'react';
import { 
  Trophy, Users, ShoppingBag, Wallet, MessageSquare, 
  Shield, TrendingUp, Globe, Settings, Bell, Search,
  Menu, X, ChevronRight, ChevronDown, ChevronUp, Star, Zap, CreditCard, ShieldAlert,
  BarChart3, LayoutDashboard, UserCircle, LogOut,
  MapPin, Cpu, Lock, Store, Plus, Sparkles, Megaphone,
  Award, Target, Coins, Languages, Briefcase, LineChart as LineChartIcon,
  ArrowUpRight, ArrowDownRight, RefreshCw, Bitcoin, CheckCircle, Send,
  Smartphone, Landmark, Banknote, Handshake,
  Wrench, Navigation, Video, FileText, Camera, HardHat, PlaneTakeoff,
  Activity, Eye, Image as ImageIcon, Paperclip, Car, Bike, PhoneCall, AlertTriangle,
  Truck, Package, Gamepad2, ShieldCheck, Mic, Mail, Download, Upload, History, Crown, XCircle, ArrowRight,
  Heart, Check, AlertCircle, User, HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { Helmet } from 'react-helmet-async';
import TechnicianMap from './components/TechnicianMap';
import { GoogleGenAI } from "@google/genai";
import { geminiService } from './services/geminiService';
import { Logo } from './components/Logo';
import { paymentService } from './services/paymentService';
import HelpPage from './components/HelpPage';
import ReactGA from 'react-ga4';
import { translations, Language } from './i18n';
import { SEO } from './components/SEO';
import { SystemHealth } from './components/SystemHealth';
import { PrivacyCenter } from './components/PrivacyCenter';
import { InternationalPaymentGateway } from './components/InternationalPaymentGateway';
import { Bot, MessageCircle } from 'lucide-react';

// --- Mock Data ---
const MOCK_MATCHES = [
  { id: '1', sport: 'Football', league: 'Champions League', homeTeam: 'Real Madrid', awayTeam: 'Man City', poolAmount: 125000, participants: 1420, startTime: '20:45', status: 'Live', minute: 65, odds: { h: 2.45, d: 3.10, a: 1.95 } },
  { id: '2', sport: 'Basketball', league: 'NBA', homeTeam: 'Lakers', awayTeam: 'Warriors', poolAmount: 85000, participants: 890, startTime: '02:00', status: 'Upcoming', odds: { h: 1.85, d: null, a: 2.05 } },
  { id: '3', sport: 'Tennis', league: 'Wimbledon', homeTeam: 'Alcaraz', awayTeam: 'Djokovic', poolAmount: 45000, participants: 560, startTime: '15:00', status: 'Upcoming', odds: { h: 2.10, d: null, a: 1.75 } },
  { id: '4', sport: 'Football', league: 'Premier League', homeTeam: 'Liverpool', awayTeam: 'Arsenal', poolAmount: 95000, participants: 1100, startTime: '17:30', status: 'Upcoming', odds: { h: 2.20, d: 3.40, a: 2.80 } },
  { id: '5', sport: 'E-Sports', league: 'Dota 2 TI', homeTeam: 'Team Spirit', awayTeam: 'Gaimin Gladiators', poolAmount: 250000, participants: 5400, startTime: '19:00', status: 'Live', minute: 15, odds: { h: 1.65, d: null, a: 2.25 } },
  { id: '6', sport: 'MMA', league: 'UFC 300', homeTeam: 'Pereira', awayTeam: 'Hill', poolAmount: 150000, participants: 3200, startTime: '04:00', status: 'Upcoming', odds: { h: 1.70, d: null, a: 2.15 } },
  { id: '7', sport: 'Football', league: 'Serie A', homeTeam: 'Inter Milan', awayTeam: 'AC Milan', poolAmount: 110000, participants: 1250, startTime: '20:45', status: 'Upcoming', odds: { h: 2.05, d: 3.25, a: 3.40 } },
  { id: '8', sport: 'Cricket', league: 'IPL', homeTeam: 'Mumbai Indians', awayTeam: 'CSK', poolAmount: 300000, participants: 8500, startTime: '15:30', status: 'Upcoming', odds: { h: 1.90, d: null, a: 1.90 } },
  { id: '9', sport: 'Cricket', league: 'T20 World Cup', homeTeam: 'India', awayTeam: 'Australia', poolAmount: 500000, participants: 12000, startTime: '18:00', status: 'Upcoming', odds: { h: 1.75, d: null, a: 2.10 } },
];

const MOCK_PRODUCTS = [
  { 
    id: '1', 
    name: 'Pro Betting Guide 2026', 
    price: 49.99, 
    seller: 'EliteTips', 
    image: 'https://picsum.photos/seed/book/400/300', 
    category: 'Digital',
    moq: 1,
    isVerified: true,
    rating: 4.8,
    type: 'B2C'
  },
  { 
    id: '2', 
    name: 'Premium Sports Jersey (Bulk)', 
    price: 15.00, 
    seller: 'SportStore Global', 
    image: 'https://picsum.photos/seed/jersey/400/300', 
    category: 'Apparel',
    moq: 50,
    isVerified: true,
    rating: 4.5,
    type: 'B2B'
  },
  { 
    id: '3', 
    name: 'Smart Training Cones (Set of 20)', 
    price: 25.00, 
    seller: 'TechSport Mfg', 
    image: 'https://picsum.photos/seed/cones/400/300', 
    category: 'Equipment',
    moq: 10,
    isVerified: true,
    rating: 4.9,
    type: 'B2B'
  },
  { 
    id: '4', 
    name: 'Wireless Heart Rate Monitor', 
    price: 59.99, 
    seller: 'HealthTrack', 
    image: 'https://picsum.photos/seed/heart/400/300', 
    category: 'Electronics',
    moq: 1,
    isVerified: false,
    rating: 4.2,
    type: 'B2C'
  },
];

const MOCK_POSTS = [
  { id: '1', user: 'Joël Mikam', text: 'Just won a huge P2P pool on the Madrid game! MJ NEXUS is truly transparent. 🚀', likes: 245, comments: 12, timestamp: '2 hours ago', image: null },
  { id: '2', user: 'Sarah K.', text: 'Looking for a betting partner for the NBA finals. DM me!', likes: 89, comments: 45, timestamp: '5 hours ago', image: null },
];

const MOCK_CRYPTO = [
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', price: 64250.50, change: +2.4, color: '#F7931A' },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', price: 3450.20, change: -1.2, color: '#627EEA' },
  { id: 'usdt', name: 'Tether', symbol: 'USDT', price: 1.00, change: 0.0, color: '#26A17B' },
  { id: 'world', name: 'World Token', symbol: 'WORLD', price: 0.85, change: +15.8, color: '#10B981' },
];

const MOCK_CHART_DATA = Array.from({ length: 20 }, (_, i) => ({
  time: `${i}:00`,
  price: 60000 + Math.random() * 5000,
}));

const MOCK_TECHNICIANS = [
  { id: '1', name: 'Moussa T.', skill: 'Master Plumber', rating: 4.9, status: 'Available', location: 'Douala - Akwa', image: 'https://picsum.photos/seed/tech1/200/200', verified: true, coords: { lat: 4.051, lng: 9.702 } },
  { id: '2', name: 'Jean-Paul K.', skill: 'Electrician', rating: 4.7, status: 'On Mission', location: 'Douala - Bonapriso', image: 'https://picsum.photos/seed/tech2/200/200', verified: true, coords: { lat: 4.048, lng: 9.698 } },
  { id: '3', name: 'Alice M.', skill: 'IT Specialist', rating: 4.8, status: 'Available', location: 'Yaoundé - Bastos', image: 'https://picsum.photos/seed/tech3/200/200', verified: true, coords: { lat: 4.055, lng: 9.710 } },
];

const MOCK_DRONE_MISSIONS = [
  { id: 'D1', project: 'Residence Horizon', status: 'Live', battery: 85, location: 'Douala Nord', altitude: '45m', coords: { lat: 4.060, lng: 9.715 } },
  { id: 'D2', project: 'Bridge Construction', status: 'Standby', battery: 100, location: 'Wouri', altitude: '0m', coords: { lat: 4.045, lng: 9.690 } },
  { id: 'D3', project: 'Solar Farm Check', status: 'Live', battery: 62, location: 'Douala East', altitude: '30m', coords: { lat: 4.052, lng: 9.720 } },
];

const MOCK_COUNTRIES = [
  { code: 'CM', name: 'Cameroon', flag: '🇨🇲', currency: 'XAF', symbol: 'FCFA', rate: 600 },
  { code: 'CI', name: 'Ivory Coast', flag: '🇨🇮', currency: 'XOF', symbol: 'FCFA', rate: 600 },
  { code: 'SN', name: 'Senegal', flag: '🇸🇳', currency: 'XOF', symbol: 'FCFA', rate: 600 },
  { code: 'FR', name: 'France', flag: '🇫🇷', currency: 'EUR', symbol: '€', rate: 0.92 },
  { code: 'US', name: 'USA', flag: '🇺🇸', currency: 'USD', symbol: '$', rate: 1 },
];

const MOCK_AUDIT_LOGS = [
  { id: 1, user: 'Admin_L7', action: 'Created Level 6 Admin for Senegal', timestamp: '2025-10-24 14:20', justification: 'Expansion to new region' },
  { id: 2, user: 'Dispatch_L4', action: 'Assigned Drone D1 to Order #452', timestamp: '2025-10-24 15:05', justification: 'Urgent delivery request' },
  { id: 3, user: 'Supplier_L3', action: 'Updated stock for Jersey (Bulk)', timestamp: '2025-10-24 16:12', justification: 'New shipment received' },
];

const MOCK_TRANSACTIONS = [
  { id: 'TX1001', type: 'Deposit', method: 'Mobile Money (Orange)', amount: 50000, status: 'Success', date: '2026-02-25 14:20', icon: ArrowDownRight, color: 'emerald', details: 'Wallet Top-up' },
  { id: 'TX1002', type: 'Withdrawal', method: 'Crypto (USDT)', amount: -25000, status: 'Pending', date: '2026-02-25 16:45', icon: ArrowUpRight, color: 'amber', details: 'External Wallet Transfer' },
  { id: 'TX1003', type: 'Bet Won', method: 'P2P Pool #452', amount: 12500, status: 'Success', date: '2026-02-24 20:15', icon: Trophy, color: 'emerald', details: 'Real Madrid vs Man City' },
  { id: 'TX1004', type: 'Purchase', method: 'Marketplace (EliteTips)', amount: -5000, status: 'Success', date: '2026-02-24 11:30', icon: ShoppingBag, color: 'rose', details: 'Pro Betting Guide 2026' },
  { id: 'TX1005', type: 'Deposit', method: 'Visa Card (**** 4290)', amount: 100000, status: 'Success', date: '2026-02-23 09:00', icon: ArrowDownRight, color: 'emerald', details: 'Direct Card Deposit' },
  { id: 'TX1006', type: 'Service Fee', method: 'Servisécur (Plumbing)', amount: -15000, status: 'Success', date: '2026-02-22 15:20', icon: Wrench, color: 'rose', details: 'Kitchen Sink Repair (Moussa T.)' },
  { id: 'TX1007', type: 'Bet Lost', method: 'P2P Pool #450', amount: -2000, status: 'Success', date: '2026-02-21 18:00', icon: Trophy, color: 'rose', details: 'Lakers vs Warriors' },
  { id: 'TX1008', type: 'Purchase', method: 'Marketplace (SportGear)', amount: -12000, status: 'Success', date: '2026-02-20 10:45', icon: ShoppingBag, color: 'rose', details: 'Premium Football Boots' },
  { id: 'TX1009', type: 'Service Fee', method: 'Servisécur (Electric)', amount: -8000, status: 'Success', date: '2026-02-19 14:10', icon: Zap, color: 'rose', details: 'Circuit Breaker Replacement' },
];

const MOCK_DOCTORS = [
  { id: 'doc1', name: 'Dr. Samuel Eto\'o', specialty: 'Médecine Générale', rating: 4.9, experience: '12 ans', price: 5000, image: 'https://picsum.photos/seed/doc1/200/200', availability: 'Disponible', bio: 'Expert en soins primaires et prévention.' },
  { id: 'doc2', name: 'Dr. Marie Ngo', specialty: 'Pédiatrie', rating: 4.8, experience: '8 ans', price: 7500, image: 'https://picsum.photos/seed/doc2/200/200', availability: 'En consultation', bio: 'Spécialiste de la santé infantile et du développement.' },
  { id: 'doc3', name: 'Dr. Jean-Marc Abena', specialty: 'Cardiologie', rating: 5.0, experience: '20 ans', price: 15000, image: 'https://picsum.photos/seed/doc3/200/200', availability: 'Disponible', bio: 'Ancien chef de service, expert en hypertension et arythmie.' },
  { id: 'doc4', name: 'Dr. Claire Atangana', specialty: 'Gynécologie', rating: 4.7, experience: '10 ans', price: 10000, image: 'https://picsum.photos/seed/doc4/200/200', availability: 'Disponible', bio: 'Accompagnement complet de la santé des femmes.' },
  { id: 'doc5', name: 'Dr. Paul Biya Jr.', specialty: 'Psychologie', rating: 4.6, experience: '5 ans', price: 8000, image: 'https://picsum.photos/seed/doc5/200/200', availability: 'Sur rendez-vous', bio: 'Soutien psychologique et thérapie comportementale.' },
];

const MOCK_BETS = [
  { id: 'B101', match: 'Liverpool vs Arsenal', pick: 'Home', odds: 2.20, stake: 1000, potentialWin: 2200, status: 'Pending', date: '2026-02-26 17:30' },
  { id: 'B102', match: 'Real Madrid vs Man City', pick: 'Draw', odds: 3.10, stake: 500, potentialWin: 1550, status: 'Won', date: '2026-02-24 20:45' },
  { id: 'B103', match: 'Lakers vs Warriors', pick: 'Away', odds: 2.05, stake: 2000, potentialWin: 4100, status: 'Lost', date: '2026-02-25 02:00' },
];

const MOCK_CHALLENGES = [
  { id: 'c1', category: 'Betting', title: 'The Winning Streak', desc: 'Win 3 P2P pools in a row', reward: 500, progress: 2, total: 3, icon: Trophy, color: 'emerald' },
  { id: 'c2', category: 'Social', title: 'Social Butterfly', desc: 'Get 50 likes on your posts', reward: 200, progress: 34, total: 50, icon: MessageSquare, color: 'blue' },
  { id: 'c3', category: 'Marketplace', title: 'Market Maker', desc: 'Sell your first product', reward: 1000, progress: 0, total: 1, icon: ShoppingBag, color: 'amber' },
  { id: 'c4', category: 'Home Services', title: 'Safe Home Hero', desc: 'Book 5 Servisécur interventions', reward: 750, progress: 1, total: 5, icon: Shield, color: 'indigo' },
  { id: 'c5', category: 'Betting', title: 'High Roller', desc: `Participate in a pool over ${MOCK_COUNTRIES.find(c => c.code === 'US')?.symbol}1000`, reward: 300, progress: 1, total: 1, icon: Target, color: 'rose' },
  { id: 'c6', category: 'Marketplace', title: 'Bulk Buyer', desc: 'Purchase 10 items in a single B2B order', reward: 400, progress: 4, total: 10, icon: Store, color: 'cyan' },
];

const MOCK_RIDES = [
  { id: 'R1', driver: 'Samuel E.', from: 'Douala (Akwa)', to: 'Yaoundé (Bastos)', date: '2026-03-05', time: '08:00', eta: '12:00', price: 5000, seats: 3, car: 'Toyota Prado', rating: 4.9, image: 'https://picsum.photos/seed/driver1/100/100' },
  { id: 'R2', driver: 'Marie L.', from: 'Yaoundé (Mvan)', to: 'Douala (Bonabéri)', date: '2026-03-05', time: '14:30', eta: '18:30', price: 4500, seats: 2, car: 'Hyundai Santa Fe', rating: 4.7, image: 'https://picsum.photos/seed/driver2/100/100' },
  { id: 'R3', driver: 'Paul B.', from: 'Douala (Logpom)', to: 'Kribi', date: '2026-03-06', time: '06:00', eta: '09:00', price: 7000, seats: 4, car: 'Mercedes ML', rating: 4.8, image: 'https://picsum.photos/seed/driver3/100/100' },
];

const MOCK_COURSES = [
  { 
    id: 'C1', 
    title: 'Maintenance de Drones Agricoles', 
    category: 'Technologie', 
    duration: '3 mois', 
    level: 'Débutant', 
    price: 75000,
    delivery: 'Gratuite', 
    image: 'https://picsum.photos/seed/drone-course/400/300',
    description: 'Apprenez à entretenir et réparer les drones utilisés dans l\'agriculture moderne. Kit de pièces livré gratuitement.'
  },
  { 
    id: 'C2', 
    title: 'Installation Solaire & Énergie Verte', 
    category: 'Énergie', 
    duration: '4 mois', 
    level: 'Intermédiaire', 
    price: 120000,
    delivery: 'Gratuite', 
    image: 'https://picsum.photos/seed/solar-course/400/300',
    description: 'Formation pratique sur l\'installation de panneaux solaires. Matériel pédagogique livré sans frais.'
  },
  { 
    id: 'C3', 
    title: 'Développement Web MJ NEXUS', 
    category: 'Informatique', 
    duration: '6 mois', 
    level: 'Débutant', 
    price: 250000,
    delivery: 'Numérique', 
    image: 'https://picsum.photos/seed/code-course/400/300',
    description: 'Devenez développeur full-stack et rejoignez l\'écosystème MJ NEXUS. Accès illimité aux ressources.'
  },
];

const MOCK_MARKETING_SERVICES = [
  {
    id: 'M1',
    title: 'Bulk WhatsApp Marketing',
    description: 'Envoyez des milliers de messages WhatsApp à vos clients potentiels avec MJ NEXUS.',
    pricePerUnit: 15,
    unit: 'message',
    minUnits: 1000,
    icon: 'Smartphone',
    features: ['AI Auto-Pilot', 'Anti-Ban v4.0', 'Group Extraction']
  },
  {
    id: 'M2',
    title: 'Bulk SMS Premium',
    description: 'Service SMS haute priorité pour vos campagnes marketing et alertes transactionnelles.',
    pricePerUnit: 10,
    unit: 'SMS',
    minUnits: 500,
    icon: 'MessageSquare',
    features: ['Sender ID personnalisé', 'Vitesse d\'envoi élevée', 'API disponible']
  },
  {
    id: 'M3',
    title: 'Email Marketing Pro',
    description: 'Campagnes d\'emailing ciblées avec un taux de délivrabilité exceptionnel.',
    pricePerUnit: 5,
    unit: 'Email',
    minUnits: 2000,
    icon: 'Mail',
    features: ['Drag & Drop Builder', 'Automation avancée', 'Tracking en temps réel']
  }
];

const MOCK_LOGISTICS_SERVICES = [
  {
    id: 'L1',
    title: 'Livraison de Colis Express',
    description: 'Service de coursier rapide pour vos documents et petits colis en ville.',
    basePrice: 1500,
    pricePerKm: 200,
    icon: 'Package',
    type: 'delivery'
  },
  {
    id: 'L2',
    title: 'Déménagement Innovant',
    description: 'Service complet de déménagement avec emballage intelligent et suivi en temps réel.',
    basePrice: 50000,
    pricePerKm: 1500,
    icon: 'Truck',
    type: 'moving'
  }
];

// Re-adding the rest of MOCK_COURSES correctly
MOCK_COURSES.push(
  { 
    id: 'C4', 
    title: 'Mécanique Moto Électrique', 
    category: 'Mécanique', 
    duration: '2 mois', 
    level: 'Débutant', 
    price: 45000,
    delivery: 'Gratuite', 
    image: 'https://picsum.photos/seed/moto-course/400/300',
    description: 'Apprenez à réparer les nouveaux moteurs électriques qui envahissent nos villes.'
  }
);

const MOCK_DRIVERS_NEARBY = [
  { id: 'D1', name: 'Alain K.', type: 'Moto', vehicle: 'KTM Eco-Electric', rating: 4.9, distance: '0.8 km', price: 500, status: 'Available', coords: { lat: 4.052, lng: 9.705 }, image: 'https://picsum.photos/seed/moto1/100/100' },
  { id: 'D2', name: 'Francis N.', type: 'Car', vehicle: 'Toyota Yaris', rating: 4.7, distance: '1.2 km', price: 1500, status: 'Available', coords: { lat: 4.049, lng: 9.701 }, image: 'https://picsum.photos/seed/car1/100/100' },
  { id: 'D3', name: 'Saliou M.', type: 'Moto', vehicle: 'Bajaj Boxer', rating: 4.5, distance: '0.3 km', price: 400, status: 'Available', coords: { lat: 4.054, lng: 9.708 }, image: 'https://picsum.photos/seed/moto2/100/100' },
  { id: 'D4', name: 'Christian T.', type: 'Premium', vehicle: 'Lexus RX', rating: 5.0, distance: '2.5 km', price: 5000, status: 'Available', coords: { lat: 4.058, lng: 9.712 }, image: 'https://picsum.photos/seed/car2/100/100' },
];

const ONBOARDING_STEPS = [
  {
    title: "Bienvenue sur MJ NEXUS",
    description: "L'écosystème unifié qui révolutionne votre quotidien. Découvrez comment tirer le meilleur parti de nos services.",
    icon: <Sparkles size={48} />,
    color: 'emerald'
  },
  {
    title: "Sports & P2P Betting",
    description: "Participez à des pools de paris transparents et sécurisés. Défiez la communauté et gagnez ensemble.",
    icon: <Trophy size={48} />,
    color: 'amber'
  },
  {
    title: "Commerce Global",
    description: "Accédez à notre marketplace B2B et B2C. Achetez et vendez des produits avec une logistique intégrée.",
    icon: <ShoppingBag size={48} />,
    color: 'blue'
  },
  {
    title: "Services à Domicile",
    description: "Servisécur vous connecte à des techniciens certifiés pour tous vos besoins domestiques, en toute sécurité.",
    icon: <HardHat size={48} />,
    color: 'orange'
  },
  {
    title: "Finance & Trading",
    description: "Gérez vos fonds, cartes virtuelles et investissements cryptos dans un seul portefeuille sécurisé.",
    icon: <Wallet size={48} />,
    color: 'indigo'
  }
];

const VIP_LEVELS = ['Basic', 'Silver', 'Gold', 'Platinum', 'Diamond'];

// --- Components ---

const OnboardingModal = ({ step, onNext, onSkip, totalSteps }: any) => {
  const currentStep = ONBOARDING_STEPS[step];
  
  const getColorClasses = (color: string) => {
    switch(color) {
      case 'emerald': return { bg: 'bg-emerald-500', text: 'text-emerald-500', light: 'bg-emerald-50', hover: 'hover:bg-emerald-500' };
      case 'amber': return { bg: 'bg-amber-500', text: 'text-amber-500', light: 'bg-amber-50', hover: 'hover:bg-amber-500' };
      case 'blue': return { bg: 'bg-blue-500', text: 'text-blue-500', light: 'bg-blue-50', hover: 'hover:bg-blue-500' };
      case 'orange': return { bg: 'bg-orange-500', text: 'text-orange-500', light: 'bg-orange-50', hover: 'hover:bg-orange-500' };
      case 'indigo': return { bg: 'bg-indigo-500', text: 'text-indigo-500', light: 'bg-indigo-50', hover: 'hover:bg-indigo-500' };
      default: return { bg: 'bg-slate-500', text: 'text-slate-500', light: 'bg-slate-50', hover: 'hover:bg-slate-500' };
    }
  };

  const colors = getColorClasses(currentStep.color);
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
      >
        <div className="h-2 bg-slate-100">
          <motion.div 
            className={`h-full ${colors.bg}`}
            initial={{ width: 0 }}
            animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
          />
        </div>
        
        <div className="p-8 text-center">
          <div className={`w-24 h-24 ${colors.light} rounded-3xl flex items-center justify-center mx-auto mb-6 ${colors.text} shadow-inner`}>
            {currentStep.icon}
          </div>
          
          <h2 className="text-2xl font-black italic uppercase text-slate-900 mb-4 tracking-tight">
            {currentStep.title}
          </h2>
          
          <p className="text-slate-500 text-sm leading-relaxed mb-8">
            {currentStep.description}
          </p>
          
          <div className="flex items-center justify-between gap-4">
            <button 
              onClick={onSkip}
              className="text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-slate-600 transition-colors"
            >
              Passer
            </button>
            <button 
              onClick={onNext}
              className={`px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest ${colors.hover} transition-all shadow-xl shadow-slate-200 flex items-center gap-2`}
            >
              {step === totalSteps - 1 ? "Commencer" : "Suivant"}
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        
        <div className="px-8 py-4 bg-slate-50 flex justify-center gap-2">
          {ONBOARDING_STEPS.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1.5 rounded-full transition-all ${idx === step ? `w-8 ${colors.bg}` : 'w-2 bg-slate-200'}`}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const OnboardingTooltip = ({ children, content, visible }: any) => {
  if (!visible) return children;
  return (
    <div className="relative">
      {children}
      <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 z-[60] pointer-events-none hidden lg:block">
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-900 text-white text-[10px] font-bold px-3 py-2 rounded-lg shadow-2xl whitespace-nowrap flex items-center gap-2 border border-white/10"
        >
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
          {content}
          <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45" />
        </motion.div>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon: Icon, label, active, onClick, badge, onboardingHighlight }: any) => (
  <OnboardingTooltip content={`Découvrez ${label}`} visible={onboardingHighlight}>
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
        active ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'text-slate-500 hover:bg-slate-100'
      } ${onboardingHighlight ? 'ring-2 ring-emerald-500 ring-offset-2 animate-pulse' : ''}`}
    >
      <div className="flex items-center gap-3">
        <Icon size={20} className={active ? 'text-white' : 'text-slate-400 group-hover:text-emerald-500'} />
        <span className="font-medium text-sm">{label}</span>
      </div>
      {badge && (
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${active ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-600'}`}>
          {badge}
        </span>
      )}
    </button>
  </OnboardingTooltip>
);

const SecurityGate = ({ children, requiredLevel, currentLevel, isSessionVerified, onVerify }: any) => {
  const [password, setPassword] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');

  // Hierarchy: 1: Basic, 2: Intermediate, 3: Supervisor, 4: Country, 5: Region, 6: Director General
  if (currentLevel < requiredLevel) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-rose-50/30 rounded-3xl border border-rose-100">
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
          <ShieldAlert size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Restricted Access</h3>
        <p className="text-sm text-slate-500 max-w-xs mx-auto">
          This space requires Level {requiredLevel} authorization. Your current access level is L{currentLevel}.
        </p>
        <div className="mt-6 p-3 bg-white rounded-xl border border-rose-100 text-[10px] text-rose-500 font-bold uppercase tracking-widest">
          Security Protocol Active
        </div>
      </div>
    );
  }

  // L1/L2 don't usually need extra gate for their own spaces, but L3+ always does for admin areas
  if (isVerified || isSessionVerified || requiredLevel <= 2) return children;

  const handleVerify = () => {
    // Hierarchical password logic - in a real app these would be unique per user/level
    const masterPasswords: Record<number, string> = {
      3: "nexus-sup-2025",
      4: "nexus-country-2025",
      5: "nexus-region-2025",
      6: "nexus-dg-2025"
    };

    // Director General (L6) can access any level with their key
    const dgKey = "nexus-dg-2025";
    
    if (password === masterPasswords[requiredLevel] || password === dgKey) {
      setIsVerified(true);
      onVerify?.();
    } else {
      setError('Invalid security key for this authorization level.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-slate-100 shadow-xl max-w-md mx-auto mt-20">
      <div className="w-16 h-16 bg-slate-900 text-emerald-400 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
        <Lock size={32} />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">Security Access Required</h3>
      <p className="text-sm text-slate-500 text-center mb-8">
        You are attempting to access a Level {requiredLevel} space. Please enter your security key.
      </p>
      <div className="w-full space-y-4">
        <input 
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter Security Key"
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
          onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
        />
        {error && <p className="text-xs text-rose-500 font-bold">{error}</p>}
        <button 
          onClick={handleVerify}
          className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
        >
          Verify & Access
        </button>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, trend, icon: Icon }: any) => (
  <div className="data-card">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
        <Icon size={20} />
      </div>
      {trend && (
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend > 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <div className="text-2xl font-bold text-slate-900">{value}</div>
    <div className="text-sm text-slate-500 mt-1">{label}</div>
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [marketingSubTab, setMarketingSubTab] = useState('overview');
  const [whatsappSubTab, setWhatsappSubTab] = useState('campaign');
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro'>('free');
  const [language, setLanguage] = useState<Language>('fr');
  
  const t = translations[language];
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userLocation, setUserLocation] = useState({ city: 'Douala', country: 'Cameroon' });
  const [balance, setBalance] = useState(2540.50);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showShopManager, setShowShopManager] = useState(false);
  const [myShop, setMyShop] = useState<any>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showMoMoModal, setShowMoMoModal] = useState(false);
  const [momoType, setMomoType] = useState<'deposit' | 'withdraw'>('deposit');
  const [momoAmount, setMomoAmount] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    service: '',
    date: '',
    time: '',
    address: '',
    paymentMethod: 'wallet'
  });
  const [momoPhone, setMomoPhone] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');
  const [wireDetails, setWireDetails] = useState({ bankName: '', accountName: '', accountNumber: '', swift: '' });
  const [cryptoAddress, setCryptoAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'MoMo' | 'Bank' | 'Card' | 'Crypto' | 'PayPal' | 'Wire'>('MoMo');
  const [savedPaymentMethods, setSavedPaymentMethods] = useState<any[]>([
    { id: '1', type: 'MoMo', label: 'Orange Money', value: '690123456', icon: Smartphone, color: 'orange' },
    { id: '2', type: 'PayPal', label: 'Personal PayPal', value: 'joel@example.com', icon: Send, color: 'blue' }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [newPaymentType, setNewPaymentType] = useState<'MoMo' | 'Bank' | 'Crypto' | 'PayPal'>('MoMo');
  const [newPaymentLabel, setNewPaymentLabel] = useState('');
  const [newPaymentValue, setNewPaymentValue] = useState('');
  const [newBankDetails, setNewBankDetails] = useState({ bankName: '', accountName: '', accountNumber: '', swift: '' });
  const [newCryptoDetails, setNewCryptoDetails] = useState({ network: 'Ethereum', address: '' });
  const [selectedSavedMethodId, setSelectedSavedMethodId] = useState<string | null>(null);
  const [showRideModal, setShowRideModal] = useState(false);
  const [selectedRide, setSelectedRide] = useState<any>(null);
  const [selectedSeats, setSelectedSeats] = useState(1);
  const [mobilityMode, setMobilityMode] = useState<'hailing' | 'covoiturage'>('hailing');
  const [selectedVehicleType, setSelectedVehicleType] = useState<'Moto' | 'Car' | 'Premium'>('Moto');
  const [isSearchingDriver, setIsSearchingDriver] = useState(false);
  const [activeRide, setActiveRide] = useState<any>(null);
  
  // Betting States
  const [matches, setMatches] = useState<any[]>(MOCK_MATCHES);
  const [isRefreshingMatches, setIsRefreshingMatches] = useState(false);
  const [lastMatchUpdate, setLastMatchUpdate] = useState<Date>(new Date());
  
  // Fraud Detection States
  const [isAccountRestricted, setIsAccountRestricted] = useState(false);
  const [restrictionReason, setRestrictionReason] = useState('');
  const [fraudLogs, setFraudLogs] = useState<any[]>([]);
  const [lastActionTime, setLastActionTime] = useState(0);
  const [actionCount, setActionCount] = useState(0);

  // Auth & Role States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userRole, setUserRole] = useState(1); // L1: Basic, L2: Intermediate, L3: Supervisor, L4: Country, L5: Region, L6: Director General
  const [userVipLevel, setUserVipLevel] = useState('Silver');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [referralInfo, setReferralInfo] = useState<any>(null);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('mj_nexus_onboarding_seen');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn && currentUser) {
      fetchReferralInfo();
    }
  }, [isLoggedIn, currentUser]);

  const fetchReferralInfo = async () => {
    if (!currentUser) return;
    try {
      const response = await fetch(`/api/user/referral-info/${currentUser.id}`);
      const data = await response.json();
      if (data.status === 'success') {
        setReferralInfo(data);
      }
    } catch (error) {
      console.error("Error fetching referral info:", error);
    }
  };

  const handleNextOnboarding = () => {
    if (onboardingStep < ONBOARDING_STEPS.length - 1) {
      setOnboardingStep(prev => prev + 1);
    } else {
      handleCompleteOnboarding();
    }
  };

  const handleCompleteOnboarding = () => {
    localStorage.setItem('mj_nexus_onboarding_seen', 'true');
    setShowOnboarding(false);
  };
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  const [selectedChallengeCategory, setSelectedChallengeCategory] = useState('All');
  const [isSecurityVerified, setIsSecurityVerified] = useState(false);
  
  // Marketplace & Country States
  const [selectedCountry, setSelectedCountry] = useState('CM');
  
  const currentCurrency = MOCK_COUNTRIES.find(c => c.code === selectedCountry) || MOCK_COUNTRIES[0];

  // Google Analytics Initialization
  useEffect(() => {
    const measurementId = (import.meta as any).env.VITE_GA_MEASUREMENT_ID;
    if (measurementId) {
      ReactGA.initialize(measurementId);
    }
  }, []);

  // Track Page Views on Tab Change
  useEffect(() => {
    ReactGA.send({ 
      hitType: "pageview", 
      page: `/${activeTab}`, 
      title: activeTab.charAt(0).toUpperCase() + activeTab.slice(1) 
    });
  }, [activeTab]);

  const formatPrice = (amount: number) => {
    const converted = amount * currentCurrency.rate;
    return `${currentCurrency.symbol}${converted.toLocaleString(undefined, { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 0 
    })}`;
  };

  const formatPriceWithDecimals = (amount: number) => {
    const converted = amount * currentCurrency.rate;
    return `${currentCurrency.symbol}${converted.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedSport, setSelectedSport] = useState('All');
  const [betSlip, setBetSlip] = useState<any[]>([]);
  const [matchInsights, setMatchInsights] = useState<Record<string, any>>({
    '4': {
      prediction: 'Home Win (Liverpool)',
      confidence: 0.78,
      riskLevel: 'Low',
      keyFactors: ['Strong home record', 'Arsenal defensive injuries', 'Recent head-to-head dominance']
    }
  });
  const [bettingSubTab, setBettingSubTab] = useState<'matches' | 'p2p' | 'gaming'>('matches');
  const [customBets, setCustomBets] = useState<any[]>([
    { id: 1, creator: 'NexusAlpha', title: 'MJ Nexus reach 100k users by June?', odds: 2.5, pool: 1250000, category: 'Milestone', status: 'Open' },
    { id: 2, creator: 'CryptoKing', title: 'Bitcoin price > $100k by end of month?', odds: 1.8, pool: 4500000, category: 'Crypto', status: 'Open' },
  ]);
  const [isCreatingBet, setIsCreatingBet] = useState(false);
  const [newBet, setNewBet] = useState({ title: '', category: 'General', odds: 2.0 });
  
  const [gamingRooms, setGamingRooms] = useState<any[]>([
    { id: 1, game: 'Nexus Strike', players: 8, maxPlayers: 10, status: 'Live', host: 'ProGamer_237', voiceActive: true },
    { id: 2, game: 'FIFA 26 Mobile', players: 2, maxPlayers: 2, status: 'Waiting', host: 'SoccerFan_Douala', voiceActive: false },
  ]);
  const [smartGroups, setSmartGroups] = useState<any[]>([
    { name: 'The Quant Syndicate', sport: 'Football', strategy: 'Uses statistical models to find value in Asian handicap markets.' },
    { name: 'NBA Alpha', sport: 'Basketball', strategy: 'Focuses on player performance metrics and team fatigue factors.' },
  ]);
  const [isGeneratingGroups, setIsGeneratingGroups] = useState(false);
  const [isAnalyzingMatch, setIsAnalyzingMatch] = useState<string | null>(null);
  const [productInsights, setProductInsights] = useState<Record<string, any>>({});
  const [isAnalyzingProduct, setIsAnalyzingProduct] = useState<string | null>(null);

  // Automatic Country Detection
  useEffect(() => {
    const detectCountry = async () => {
      // In a real app, use an IP geolocation API
      // For this demo, we'll use browser language or a simulated delay
      try {
        const lang = navigator.language.split('-')[1] || 'CM';
        const supported = MOCK_COUNTRIES.find(c => c.code === lang);
        if (supported) {
          setSelectedCountry(supported.code);
          setUserLocation({ city: supported.name === 'Cameroon' ? 'Douala' : 'Capital', country: supported.name });
        }
      } catch (e) {
        console.error("Country detection failed", e);
      }
    };
    detectCountry();
  }, []);

  // Automatic Fraud Detection Monitoring
  const logFraudActivity = (type: string, severity: 'Low' | 'Medium' | 'High', details: string) => {
    const newLog = {
      id: Date.now(),
      type,
      severity,
      details,
      timestamp: new Date().toLocaleTimeString(),
      status: 'Flagged'
    };
    setFraudLogs(prev => [newLog, ...prev]);

    if (severity === 'High') {
      setIsAccountRestricted(true);
      setRestrictionReason(details);
      alert(`ALERTE SÉCURITÉ : Votre compte a été restreint immédiatement pour comportement suspect : ${details}`);
    }
  };

  // Monitor rapid actions (Spam protection)
  useEffect(() => {
    const now = Date.now();
    if (now - lastActionTime < 500) { // Less than 500ms between actions
      setActionCount(prev => {
        const newCount = prev + 1;
        if (newCount > 5) {
          logFraudActivity('Spam / Bot Behavior', 'High', 'Actions trop rapides détectées (Bot suspecté)');
        }
        return newCount;
      });
    } else {
      setActionCount(0);
    }
    setLastActionTime(now);
  }, [activeTab, searchQuery, globalSearchQuery]);

  // Social States
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [newPostText, setNewPostText] = useState('');
  const [newPostImage, setNewPostImage] = useState<string | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [isBetSlipCollapsed, setIsBetSlipCollapsed] = useState(false);
  
  // Loan States
  const [loanAmount, setLoanAmount] = useState(50000);
  const [loanDuration, setLoanDuration] = useState(4); // weeks
  const [loanType, setLoanType] = useState<'weekly' | 'monthly'>('weekly');
  const [isApplyingLoan, setIsApplyingLoan] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: 'MJ NEXUS | The Unified World',
      text: 'Découvrez MJ NEXUS : L\'écosystème unifié qui révolutionne votre quotidien. Paris P2P, Marketplace, Services à domicile et Finance en un seul endroit !',
      url: window.location.origin
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.origin);
        alert('Lien copié dans le presse-papier ! Partagez-le avec vos amis.');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  // Video Generation States
  const [videoPrompt, setVideoPrompt] = useState('');
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [isVideoGenerating, setIsVideoGenerating] = useState(false);
  const [videoGenerationStatus, setVideoGenerationStatus] = useState('');

  const getPageMetadata = (tab: string) => {
    const baseTitle = "MJ NEXUS | The Unified World Ecosystem";
    const baseDesc = "MJ NEXUS is the world's premier unified ecosystem integrating P2P Betting, Global B2B/B2C Commerce, Secure Home Services (Servisécur), Telemedicine, and AI-Driven Marketing.";
    const baseImage = "https://picsum.photos/seed/mjnexus/1200/630";
    const baseKeywords = "MJ NEXUS, Unified Ecosystem, P2P Betting, Global Marketplace, Servisécur, Telemedicine, AI Marketing, Fintech, Africa Tech, Global Commerce";

    switch (tab) {
      case 'betting':
        return {
          title: `Sports Betting & P2P Pools | ${baseTitle}`,
          description: "Global P2P betting pool. Join thousands of participants in the most transparent betting ecosystem with real-time odds and secure payouts.",
          image: "https://picsum.photos/seed/betting/1200/630",
          keywords: `Betting, P2P Betting, Sports Odds, Champions League, NBA, ${baseKeywords}`
        };
      case 'marketplace':
        return {
          title: `Global Marketplace B2B/B2C | ${baseTitle}`,
          description: "Premium marketplace for global trade. Buy and sell products with secure escrow payments and worldwide logistics tracking.",
          image: "https://picsum.photos/seed/marketplace/1200/630",
          keywords: `E-commerce, B2B, B2C, Global Trade, Online Shopping, ${baseKeywords}`
        };
      case 'social':
        return {
          title: `Professional Social Network | ${baseTitle}`,
          description: "Connect with industry experts, share insights, and build your professional reputation in our verified social ecosystem.",
          image: "https://picsum.photos/seed/social/1200/630",
          keywords: `Networking, Professional Social, Business Community, ${baseKeywords}`
        };
      case 'servisecur':
        return {
          title: `Servisécur: Secure Home Services | ${baseTitle}`,
          description: "Traceable and certified home services. From plumbing to drone security, get professional help with full insurance coverage.",
          image: "https://picsum.photos/seed/services/1200/630",
          keywords: `Home Services, Plumber, Electrician, Security, Servisécur, ${baseKeywords}`
        };
      case 'wallet':
        return {
          title: `Secure Digital Wallet & Finance | ${baseTitle}`,
          description: "Manage your WORLD tokens, virtual cards, and international transfers with bank-grade security and instant processing.",
          image: "https://picsum.photos/seed/wallet/1200/630",
          keywords: `Digital Wallet, Fintech, Crypto, Payments, ${baseKeywords}`
        };
      case 'health':
        return {
          title: `MJ Health: Telemedicine & Wellness | ${baseTitle}`,
          description: "Private medical consultations with global specialists. Secure health records and AI-driven wellness tracking for you and your family.",
          image: "https://picsum.photos/seed/health/1200/630",
          keywords: `Telemedicine, Health, Online Doctor, Wellness, ${baseKeywords}`
        };
      case 'marketing':
        return {
          title: `Digital Marketing AI | ${baseTitle}`,
          description: "Innovative bulk WhatsApp and SMS marketing services for your business growth. AI-driven campaign optimization.",
          image: "https://picsum.photos/seed/marketing/1200/630",
          keywords: `Marketing, WhatsApp Marketing, SMS Marketing, AI Marketing, ${baseKeywords}`
        };
      case 'logistics':
        return {
          title: `Logistics & Smart Moving | ${baseTitle}`,
          description: "Innovative parcel delivery and moving services with real-time tracking and secure handling.",
          image: "https://picsum.photos/seed/logistics/1200/630",
          keywords: `Logistics, Moving, Delivery, Tracking, ${baseKeywords}`
        };
      case 'academy':
        return {
          title: `MJ Academy: Professional Training | ${baseTitle}`,
          description: "Professional training for future-proof careers. Paid certifications and equipment delivery for students.",
          image: "https://picsum.photos/seed/academy/1200/630",
          keywords: `Academy, Training, Certification, Education, ${baseKeywords}`
        };
      case 'help':
        return {
          title: `Help Center & AI Support | ${baseTitle}`,
          description: "Get instant answers about MJ NEXUS functionalities. Our AI assistant is available 24/7 to guide you through our ecosystem.",
          image: "https://picsum.photos/seed/help/1200/630",
          keywords: `Support, Help, AI Assistant, Documentation, ${baseKeywords}`
        };
      case 'privacy':
        return {
          title: `Privacy & Security Center | ${baseTitle}`,
          description: "Take control of your data. Manage your privacy settings, security keys, and data export options in compliance with global standards.",
          image: "https://picsum.photos/seed/privacy/1200/630",
          keywords: `Privacy, Security, GDPR, Data Management, ${baseKeywords}`
        };
      default:
        return {
          title: baseTitle,
          description: baseDesc,
          image: baseImage,
          keywords: baseKeywords
        };
    }
  };

  const metadata = getPageMetadata(activeTab);

  const initiateBooking = (service: string) => {
    setBookingData({ ...bookingData, service });
    setBookingStep(1);
    setShowBookingModal(true);

    // Track Service Booking Initiation
    ReactGA.event({
      category: 'Services',
      action: 'Initiate Booking',
      label: service
    });
  };

  const handleGenerateVideo = async () => {
    if (!videoPrompt.trim()) return;

    setIsVideoGenerating(true);
    setVideoGenerationStatus('Vérification de la clé API...');

    try {
      const aistudio = (window as any).aistudio;
      if (aistudio && !(await aistudio.hasSelectedApiKey())) {
        await aistudio.openSelectKey();
      }

      setVideoGenerationStatus('Initialisation de la génération Veo...');
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: videoPrompt,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      setVideoGenerationStatus('Génération de la vidéo en cours (cela peut prendre quelques minutes)...');
      
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        setVideoGenerationStatus('Téléchargement de la vidéo...');
        const response = await fetch(downloadLink, {
          method: 'GET',
          headers: {
            'x-goog-api-key': process.env.GEMINI_API_KEY as string,
          },
        });
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setGeneratedVideoUrl(url);
        setVideoGenerationStatus('Vidéo générée avec succès !');
      } else {
        throw new Error('Aucun lien de téléchargement reçu.');
      }
    } catch (error: any) {
      console.error("Video generation failed:", error);
      setVideoGenerationStatus(`Erreur: ${error.message || 'Échec de la génération'}`);
      if (error.message?.includes("Requested entity was not found")) {
        const aistudio = (window as any).aistudio;
        if (aistudio) await aistudio.openSelectKey();
      }
    } finally {
      setIsVideoGenerating(false);
    }
  };

  const fetchMatchInsights = async (match: any) => {
    setIsAnalyzingMatch(match.id);
    try {
      const details = `${match.homeTeam} vs ${match.awayTeam} in ${match.league}. Odds: Home ${match.odds.h}, Draw ${match.odds.d}, Away ${match.odds.a}`;
      const insights = await geminiService.getBettingInsights(details);
      setMatchInsights(prev => ({ ...prev, [match.id]: insights }));
    } catch (error) {
      console.error("Failed to fetch match insights:", error);
    } finally {
      setIsAnalyzingMatch(null);
    }
  };

  useEffect(() => {
    const fetchLiveMatches = async () => {
      setIsRefreshingMatches(true);
      try {
        const liveMatches = await geminiService.getLiveMatches(new Date().toLocaleDateString());
        if (liveMatches && liveMatches.length > 0) {
          setMatches(liveMatches);
          setLastMatchUpdate(new Date());
        }
      } catch (error) {
        console.error("Failed to fetch live matches:", error);
      } finally {
        setIsRefreshingMatches(false);
      }
    };

    fetchLiveMatches();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchLiveMatches, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Live Simulation Effect
  useEffect(() => {
    const simulationInterval = setInterval(() => {
      setMatches(prevMatches => prevMatches.map(match => {
        // Randomly update pool and participants
        const poolChange = Math.floor(Math.random() * 100) - 20;
        const participantsChange = Math.floor(Math.random() * 5);
        
        // Small odds fluctuation (±0.01 to ±0.05)
        const updateOdd = (odd: number | null) => {
          if (odd === null) return null;
          const fluctuation = (Math.random() * 0.1 - 0.05);
          return Math.max(1.01, parseFloat((odd + fluctuation).toFixed(2)));
        };

        // Increment minute if Live
        let newMinute = match.minute;
        if (match.status === 'Live' && match.minute !== undefined) {
          newMinute = match.minute < 90 ? match.minute + 1 : match.minute;
        }

        return {
          ...match,
          poolAmount: Math.max(1000, match.poolAmount + poolChange),
          participants: Math.max(10, match.participants + participantsChange),
          minute: newMinute,
          odds: {
            ...match.odds,
            h: updateOdd(match.odds.h),
            d: match.odds.d ? updateOdd(match.odds.d) : null,
            a: updateOdd(match.odds.a)
          }
        };
      }));
    }, 10000); // Every 10 seconds

    return () => clearInterval(simulationInterval);
  }, []);

  useEffect(() => {
    const featuredMatch = matches.find(m => m.id === '1') || matches[0];
    if (featuredMatch) {
      fetchMatchInsights(featuredMatch);
    }
  }, [matches[0]?.id]);

  useEffect(() => {
    if (globalSearchQuery.trim().length > 1) {
      const results = [
        ...matches.filter(m => 
          m.homeTeam.toLowerCase().includes(globalSearchQuery.toLowerCase()) || 
          m.awayTeam.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
          m.league.toLowerCase().includes(globalSearchQuery.toLowerCase())
        ).map(m => ({ ...m, type: 'betting', title: `${m.homeTeam} vs ${m.awayTeam}`, subtitle: m.league, icon: Trophy })),
        
        ...MOCK_PRODUCTS.filter(p => 
          p.name.toLowerCase().includes(globalSearchQuery.toLowerCase()) || 
          p.seller.toLowerCase().includes(globalSearchQuery.toLowerCase())
        ).map(p => ({ ...p, type: 'marketplace', title: p.name, subtitle: p.seller, icon: ShoppingBag })),
        
        ...MOCK_TECHNICIANS.filter(t => 
          t.name.toLowerCase().includes(globalSearchQuery.toLowerCase()) || 
          t.skill.toLowerCase().includes(globalSearchQuery.toLowerCase())
        ).map(t => ({ ...t, type: 'service', title: t.name, subtitle: t.skill, icon: HardHat })),

        ...MOCK_POSTS.filter(p => 
          p.user.toLowerCase().includes(globalSearchQuery.toLowerCase()) || 
          p.text.toLowerCase().includes(globalSearchQuery.toLowerCase())
        ).map(p => ({ ...p, type: 'social', title: p.user, subtitle: p.text, icon: MessageSquare }))
      ];
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [globalSearchQuery]);

  // New Auth States
  const [authForm, setAuthForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    username: '',
    password: '',
    email: '',
    referralCode: ''
  });

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authForm.phone, password: authForm.password })
      });
      const data = await response.json();
      if (data.status === 'success') {
        setIsLoggedIn(true);
        setCurrentUser(data.user);
        setBalance(data.user.balance);
        setShowAuthModal(false);
        setActiveTab('dashboard');
        
        // Track Login
        ReactGA.event({ category: 'User', action: 'Login' });
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Failed to login. Please try again.");
    }
  };

  const handleRegister = async () => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: authForm.phone, 
          email: authForm.email || `${authForm.phone}@mjnexus.com`, 
          password: authForm.password,
          referralCode: authForm.referralCode
        })
      });
      const data = await response.json();
      if (data.status === 'success') {
        setIsLoggedIn(true);
        setCurrentUser(data.user);
        setBalance(data.user.balance);
        setShowAuthModal(false);
        setActiveTab('dashboard');
        
        if (data.message.includes('Referral')) {
          alert(data.message);
        }

        // Track Registration
        ReactGA.event({ category: 'User', action: 'Signup' });
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Failed to register. Please try again.");
    }
  };

  const renderAuditLog = () => (
    <div className="data-card">
      <h3 className="font-bold mb-4 flex items-center gap-2">
        <FileText size={18} className="text-slate-400" /> Audit & Traceability Logs
      </h3>
      <div className="space-y-3">
        {MOCK_AUDIT_LOGS.map(log => (
          <div key={log.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
            <div className="flex justify-between mb-1">
              <span className="font-bold text-slate-700">{log.user}</span>
              <span className="text-slate-400">{log.timestamp}</span>
            </div>
            <div className="text-slate-600 font-medium">{log.action}</div>
            <div className="mt-1 text-[10px] text-slate-400 italic">Justification: {log.justification}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const handleWalletAction = async () => {
    if (isAccountRestricted) {
      alert('Action bloquée : Votre compte est restreint pour fraude suspectée.');
      return;
    }
    if (!momoAmount) {
      alert('Please enter an amount');
      return;
    }
    
    if (paymentMethod === 'MoMo' && !momoPhone) {
      alert('Please enter a phone number');
      return;
    }

    if (paymentMethod === 'PayPal' && !paypalEmail) {
      alert('Please enter your PayPal email');
      return;
    }

    if (paymentMethod === 'Wire' || paymentMethod === 'Bank') {
      if (!wireDetails.bankName || !wireDetails.accountName || !wireDetails.accountNumber) {
        alert('Please fill in all required bank details');
        return;
      }
    }

    if (paymentMethod === 'Crypto' && !cryptoAddress) {
      alert('Please enter a crypto wallet address');
      return;
    }
    
    if (momoType === 'withdraw' && parseFloat(momoAmount) > 1000) {
      logFraudActivity('Large Withdrawal Request', 'Medium', `Retrait inhabituel de ${formatPrice(parseFloat(momoAmount))} détecté.`);
    }
    
    setIsProcessing(true);
    try {
      if (momoType === 'deposit') {
        let res;
        if (paymentMethod === 'MoMo') {
          res = await paymentService.initiateMoMoCollection({
            amount: parseFloat(momoAmount),
            phoneNumber: momoPhone,
            country: userLocation.country,
            currency: 'XAF',
            email: 'joelmikamd@gmail.com',
            name: 'Joël Mikam'
          });
        } else {
          // Mocking other methods
          await new Promise(resolve => setTimeout(resolve, 1500));
          res = { message: `Deposit of $${momoAmount} via ${paymentMethod} initiated successfully.` };
          setBalance(prev => prev + parseFloat(momoAmount));
        }
        alert(res.message);
      } else {
        let res;
        if (paymentMethod === 'MoMo') {
          res = await paymentService.initiateMoMoPayout({
            amount: parseFloat(momoAmount),
            phoneNumber: momoPhone,
            country: userLocation.country,
            currency: 'XAF'
          });
        } else {
          // Mocking other methods
          if (balance < parseFloat(momoAmount)) {
            alert('Insufficient balance');
            setIsProcessing(false);
            return;
          }
          await new Promise(resolve => setTimeout(resolve, 1500));
          res = { message: `Withdrawal of $${momoAmount} via ${paymentMethod} initiated successfully.` };
          setBalance(prev => prev - parseFloat(momoAmount));
        }
        alert(res.message);
      }
      setShowMoMoModal(false);
      setMomoAmount('');
      setMomoPhone('');
    } catch (err) {
      alert('Transaction failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        // In a real app, we'd reverse geocode here
        console.log('Location:', pos.coords.latitude, pos.coords.longitude);
      });
    }
  }, []);

  const handleAddPaymentMethod = () => {
    let newMethod: any = {
      id: Date.now().toString(),
      type: newPaymentType,
      label: newPaymentLabel || `${newPaymentType} Account`,
    };

    if (newPaymentType === 'MoMo') {
      newMethod = { ...newMethod, value: newPaymentValue, icon: Smartphone, color: 'orange' };
    } else if (newPaymentType === 'PayPal') {
      newMethod = { ...newMethod, value: newPaymentValue, icon: Send, color: 'blue' };
    } else if (newPaymentType === 'Bank') {
      newMethod = { ...newMethod, value: `${newBankDetails.bankName} - ${newBankDetails.accountNumber}`, icon: Landmark, color: 'emerald', details: newBankDetails };
    } else if (newPaymentType === 'Crypto') {
      newMethod = { ...newMethod, value: `${newCryptoDetails.network}: ${newCryptoDetails.address.slice(0, 6)}...${newCryptoDetails.address.slice(-4)}`, icon: Bitcoin, color: 'amber', details: newCryptoDetails };
    }

    setSavedPaymentMethods([...savedPaymentMethods, newMethod]);
    setShowAddPaymentModal(false);
    setNewPaymentLabel('');
    setNewPaymentValue('');
    setNewBankDetails({ bankName: '', accountName: '', accountNumber: '', swift: '' });
    setNewCryptoDetails({ network: 'Ethereum', address: '' });
  };

  const removePaymentMethod = (id: string) => {
    setSavedPaymentMethods(savedPaymentMethods.filter(m => m.id !== id));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black italic uppercase text-slate-900 tracking-tight">Tableau de Bord</h2>
              <button 
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100"
              >
                <Megaphone size={14} />
                Partager
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard label="Total Balance" value={formatPrice(balance)} trend={12.5} icon={Wallet} />
              <StatCard label="Active Bets" value="14" trend={5.2} icon={TrendingUp} />
              <StatCard label="P2P Pools" value="128" trend={-2.1} icon={Users} />
              <StatCard label="Loyalty Points" value="4,250" trend={24} icon={Star} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button onClick={() => setActiveTab('betting')} className="p-4 bg-white rounded-2xl border border-slate-100 hover:border-emerald-500 transition-all text-center group">
                <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <Trophy size={20} />
                </div>
                <div className="text-xs font-bold">Parier</div>
              </button>
              <button onClick={() => setActiveTab('marketplace')} className="p-4 bg-white rounded-2xl border border-slate-100 hover:border-emerald-500 transition-all text-center group">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <ShoppingBag size={20} />
                </div>
                <div className="text-xs font-bold">Acheter</div>
              </button>
              <button onClick={() => setActiveTab('servisecur')} className="p-4 bg-white rounded-2xl border border-slate-100 hover:border-emerald-500 transition-all text-center group">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <HardHat size={20} />
                </div>
                <div className="text-xs font-bold">Services</div>
              </button>
              <button onClick={() => setActiveTab('covoiturage')} className="p-4 bg-white rounded-2xl border border-slate-100 hover:border-emerald-500 transition-all text-center group">
                <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <Navigation size={20} />
                </div>
                <div className="text-xs font-bold">Covoiturage</div>
              </button>
              <button onClick={() => setActiveTab('health')} className="p-4 bg-white rounded-2xl border border-slate-100 hover:border-emerald-500 transition-all text-center group">
                <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <Activity size={20} />
                </div>
                <div className="text-xs font-bold">MJ Health</div>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 data-card min-h-[400px]">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold">Earnings Overview</h3>
                  <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1 text-sm">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                  </select>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[
                      { name: 'Mon', val: 400 }, { name: 'Tue', val: 700 }, { name: 'Wed', val: 500 },
                      { name: 'Thu', val: 900 }, { name: 'Fri', val: 1200 }, { name: 'Sat', val: 1500 },
                      { name: 'Sun', val: 1300 }
                    ]}>
                      <defs>
                        <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                      <Area type="monotone" dataKey="val" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-6">
                <div className="data-card bg-slate-900 text-white border-none">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold flex items-center gap-2">
                      <Star size={18} className="text-amber-400" /> Loyalty Program
                    </h3>
                    <span className="text-[10px] font-black bg-white/20 px-2 py-1 rounded uppercase tracking-widest">VIP {userVipLevel}</span>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1.5 font-bold">
                        <span className="opacity-80">Progress to Gold</span>
                        <span>65%</span>
                      </div>
                      <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '65%' }}
                          className="bg-white h-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                        <div className="text-[10px] opacity-60 uppercase font-black mb-1">World Points</div>
                        <div className="text-lg font-black">12,450</div>
                      </div>
                      <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                        <div className="text-[10px] opacity-60 uppercase font-black mb-1">Next Reward</div>
                        <div className="text-lg font-black">$50</div>
                      </div>
                    </div>
                    <button className="w-full py-2 bg-emerald-500 text-white rounded-xl text-xs font-black hover:bg-emerald-600 transition-colors shadow-lg">
                      Redeem Points
                    </button>
                  </div>
                </div>

                <div className="data-card bg-emerald-600 text-white border-none">
                  <div className="flex items-center gap-2 mb-4">
                    <Users size={20} />
                    <h3 className="font-bold">Referral Program</h3>
                  </div>
                  <p className="text-sm opacity-90 mb-6">
                    Invite your friends and earn instant rewards for every successful signup!
                  </p>
                  <div className="bg-white/10 p-3 rounded-xl flex items-center justify-between mb-4">
                    <code className="text-xs font-mono">{referralInfo?.referralCode || 'LOGIN_REQUIRED'}</code>
                    <button 
                      onClick={() => {
                        if (referralInfo?.referralCode) {
                          navigator.clipboard.writeText(referralInfo.referralCode);
                          alert('Code copied!');
                        } else {
                          setShowAuthModal(true);
                        }
                      }}
                      className="text-xs font-bold hover:text-emerald-200"
                    >
                      COPY
                    </button>
                  </div>
                  <button 
                    onClick={() => setActiveTab('rewards')}
                    className="w-full py-3 bg-white text-emerald-600 rounded-xl font-bold text-sm"
                  >
                    Manage Referrals
                  </button>
                </div>

                <div className="data-card">
                  <h3 className="text-lg font-bold mb-4">Live P2P Pools</h3>
                <div className="space-y-4">
                  {matches.slice(0, 4).map(match => (
                    <div key={match.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-emerald-200 transition-colors cursor-pointer">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{match.sport}</span>
                          {match.status === 'Live' && (
                            <span className="flex items-center gap-1 text-[10px] font-black text-rose-500 animate-pulse">
                              <div className="w-1 h-1 bg-rose-500 rounded-full" />
                              LIVE {match.minute}'
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">{match.startTime}</span>
                      </div>
                      <div className="font-bold text-slate-800 mb-2 truncate">{match.homeTeam} vs {match.awayTeam}</div>
                      <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-1 text-slate-500">
                          <Users size={12} />
                          {match.participants.toLocaleString()}
                        </div>
                        <div className="font-mono font-bold text-slate-900">{formatPrice(match.poolAmount)}</div>
                      </div>
                    </div>
                  ))}
                  <button className="w-full py-3 text-emerald-600 font-bold text-sm hover:bg-emerald-50 rounded-xl transition-colors">
                    View All Markets
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
      case 'betting':
        const filteredMatches = selectedSport === 'All' 
          ? matches 
          : matches.filter(m => m.sport === selectedSport);

        const addToSlip = (match: any, pick: string, odd: number) => {
          const betId = `${match.id}-${pick}`;
          if (betSlip.find(b => b.id === betId)) {
            setBetSlip(betSlip.filter(b => b.id !== betId));
          } else {
            setBetSlip([...betSlip, { id: betId, matchId: match.id, teams: `${match.homeTeam} vs ${match.awayTeam}`, pick, odd, stake: 100 }]);
            
            // Track Bet Selection
            ReactGA.event({
              category: 'Betting',
              action: 'Add to Slip',
              label: `${match.homeTeam} vs ${match.awayTeam} (${pick})`
            });
          }
        };

        const fetchMatchInsights = async (match: any) => {
          setIsAnalyzingMatch(match.id);
          try {
            const matchDetails = `${match.homeTeam} vs ${match.awayTeam} in ${match.league} (${match.sport}). Odds: H:${match.odds.h}${match.odds.d ? `, D:${match.odds.d}` : ''}, A:${match.odds.a}`;
            const insights = await geminiService.getBettingInsights(matchDetails);
            setMatchInsights(prev => ({
              ...prev,
              [match.id]: insights
            }));
            
            // Track AI Insight Fetch
            ReactGA.event({
              category: 'Betting',
              action: 'Fetch AI Insights',
              label: `${match.homeTeam} vs ${match.awayTeam}`
            });
          } catch (error) {
            console.error("Failed to fetch match insights:", error);
          } finally {
            setIsAnalyzingMatch(null);
          }
        };

        const fetchSmartGroups = async () => {
          setIsGeneratingGroups(true);
          try {
            const suggestions = await geminiService.getSmartGroupSuggestions("football, basketball, high-risk, data-driven");
            setSmartGroups(suggestions);
            ReactGA.event({ category: 'Betting', action: 'Generate Smart Groups' });
          } catch (error) {
            console.error("Failed to fetch smart groups:", error);
          } finally {
            setIsGeneratingGroups(false);
          }
        };

        const fetchProductInsights = async (product: any) => {
          setIsAnalyzingProduct(product.id);
          try {
            const productDetails = `${product.name} by ${product.seller}. Category: ${product.category}, Price: ${product.price}, Type: ${product.type}`;
            const insights = await geminiService.getCommerceInsights(productDetails);
            setProductInsights(prev => ({
              ...prev,
              [product.id]: insights
            }));
            
            ReactGA.event({
              category: 'Marketplace',
              action: 'Fetch AI Insights',
              label: product.name
            });
          } catch (error) {
            console.error("Failed to fetch product insights:", error);
          } finally {
            setIsAnalyzingProduct(null);
          }
        };

        return (
          <div className="space-y-6">
            {/* Betting Sub-Navigation */}
            <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm sticky top-0 z-30">
              <button 
                onClick={() => setBettingSubTab('matches')}
                className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${bettingSubTab === 'matches' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <Trophy size={16} />
                Live Matches
              </button>
              <button 
                onClick={() => setBettingSubTab('p2p')}
                className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${bettingSubTab === 'p2p' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <Zap size={16} />
                P2P Custom Bets
              </button>
              <button 
                onClick={() => setBettingSubTab('gaming')}
                className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${bettingSubTab === 'gaming' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <Gamepad2 size={16} />
                Gaming Arena
              </button>
            </div>

            {bettingSubTab === 'matches' && (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 space-y-6">
                  {/* Sport Categories */}
              <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                {[
                  { id: 'All', label: 'All Sports', icon: Globe },
                  { id: 'Football', label: 'Football', icon: Trophy },
                  { id: 'Basketball', label: 'Basketball', icon: Target },
                  { id: 'Tennis', label: 'Tennis', icon: Award },
                  { id: 'E-Sports', label: 'E-Sports', icon: Cpu },
                  { id: 'MMA', label: 'MMA', icon: ShieldAlert },
                  { id: 'Cricket', label: 'Cricket', icon: Zap },
                ].map(sport => (
                  <button 
                    key={sport.id} 
                    onClick={() => setSelectedSport(sport.id)}
                    className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 border shadow-sm ${
                      selectedSport === sport.id 
                        ? 'bg-slate-900 text-white border-slate-900 shadow-slate-200' 
                        : 'bg-white border-slate-200 text-slate-500 hover:border-emerald-500 hover:text-emerald-600'
                    }`}
                  >
                    <sport.icon size={14} className={selectedSport === sport.id ? 'text-emerald-400' : ''} />
                    {sport.label}
                  </button>
                ))}
              </div>

              {/* AI Betting Assistant Header */}
              <div className="data-card bg-gradient-to-r from-slate-900 to-slate-800 text-white border-none overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-emerald-500/20 transition-all duration-700" />
                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 p-2">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 shadow-inner">
                      <Sparkles size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black italic uppercase tracking-tight">AI Betting Assistant</h3>
                      <p className="text-xs text-slate-400">Analyse prédictive avancée propulsée par Gemini 3 Flash.</p>
                    </div>
                  </div>
                  <button 
                    onClick={async () => {
                      const matchesToAnalyze = filteredMatches.filter(m => !matchInsights[m.id]);
                      if (matchesToAnalyze.length === 0) {
                        alert("Tous les matchs visibles ont déjà été analysés !");
                        return;
                      }
                      
                      ReactGA.event({
                        category: 'Betting',
                        action: 'Bulk AI Analysis',
                        label: `${matchesToAnalyze.length} matches`
                      });

                      for (const match of matchesToAnalyze) {
                        await fetchMatchInsights(match);
                      }
                    }}
                    className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 group/btn active:scale-95"
                  >
                    <Cpu size={16} className="group-hover/btn:rotate-12 transition-transform" />
                    Analyser tous les matchs ({filteredMatches.length})
                  </button>
                </div>
              </div>

              {/* Matches Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredMatches.map(match => (
                  <div key={match.id} className="data-card group hover:border-emerald-500/30 transition-all">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                          <Trophy size={16} />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block leading-none">{match.league}</span>
                          <span className="text-[10px] text-slate-400 font-medium">{match.startTime} • {match.sport}</span>
                        </div>
                      </div>
                      {match.status === 'Live' ? (
                        <div className="flex items-center gap-1 text-rose-500 text-[10px] font-black animate-pulse">
                          <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                          LIVE {match.minute}'
                        </div>
                      ) : (
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Upcoming
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between items-center gap-4 mb-6">
                      <div className="text-center flex-1">
                        <div className="w-14 h-14 bg-slate-50 rounded-2xl mx-auto mb-2 border border-slate-100 flex items-center justify-center text-slate-300">
                          <Users size={24} />
                        </div>
                        <div className="font-bold text-sm text-slate-900">{match.homeTeam}</div>
                      </div>
                      <div className="text-xl font-black text-slate-200 italic">VS</div>
                      <div className="text-center flex-1">
                        <div className="w-14 h-14 bg-slate-50 rounded-2xl mx-auto mb-2 border border-slate-100 flex items-center justify-center text-slate-300">
                          <Users size={24} />
                        </div>
                        <div className="font-bold text-sm text-slate-900">{match.awayTeam}</div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mb-4 px-1">
                      <div className="flex items-center gap-1.5">
                        <Coins size={14} className="text-amber-500" />
                        <span className="text-[10px] font-bold text-slate-500">Pool: <span className="text-slate-900">{formatPrice(match.poolAmount)}</span></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users size={14} className="text-blue-500" />
                        <span className="text-[10px] font-bold text-slate-500">Participants: <span className="text-slate-900">{match.participants.toLocaleString()}</span></span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {[
                        { label: '1', pick: 'Home', odd: match.odds.h },
                        { label: 'X', pick: 'Draw', odd: match.odds.d },
                        { label: '2', pick: 'Away', odd: match.odds.a }
                      ].map((option, idx) => (
                        option.odd ? (
                          <button 
                            key={idx}
                            onClick={() => addToSlip(match, option.pick, option.odd!)}
                            className={`p-3 rounded-2xl border transition-all flex flex-col items-center ${
                              betSlip.find(b => b.id === `${match.id}-${option.pick}`)
                                ? 'bg-emerald-500 border-emerald-500 text-white shadow-md'
                                : 'bg-slate-50 border-slate-100 hover:border-emerald-500 hover:bg-white text-slate-900'
                            }`}
                          >
                            <div className="text-[10px] font-bold opacity-60 uppercase">{option.label}</div>
                            <div className="font-black text-lg">{option.odd.toFixed(2)}</div>
                          </button>
                        ) : (
                          <div key={idx} className="p-3 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center justify-center">
                            <Lock size={16} className="text-slate-300" />
                          </div>
                        )
                      ))}
                    </div>

                    {/* AI Insights Section */}
                    <div className="border-t border-slate-100 pt-4">
                      {matchInsights[match.id] ? (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-emerald-600">
                              <Sparkles size={14} />
                              <span className="text-[10px] font-black uppercase tracking-wider">AI Analysis</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => fetchMatchInsights(match)}
                                disabled={isAnalyzingMatch === match.id}
                                className="p-1 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded transition-colors disabled:opacity-50"
                                title="Re-analyze match"
                              >
                                <RefreshCw size={10} className={isAnalyzingMatch === match.id ? 'animate-spin' : ''} />
                              </button>
                              <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                matchInsights[match.id].riskLevel === 'Low' ? 'bg-emerald-100 text-emerald-700' :
                                matchInsights[match.id].riskLevel === 'Medium' ? 'bg-amber-100 text-amber-700' :
                                'bg-rose-100 text-rose-700'
                              }`}>
                                {matchInsights[match.id].riskLevel} Risk
                              </div>
                            </div>
                          </div>
                          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                            <div className="text-xs font-bold text-slate-900 mb-1">Prediction: {matchInsights[match.id].prediction}</div>
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-emerald-500 rounded-full" 
                                  style={{ width: `${matchInsights[match.id].confidence * 100}%` }}
                                />
                              </div>
                              <span className="text-[10px] font-black text-slate-500">{Math.round(matchInsights[match.id].confidence * 100)}% Confidence</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {matchInsights[match.id].keyFactors.slice(0, 2).map((factor: string, i: number) => (
                                <span key={i} className="text-[9px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-500 italic">
                                  • {factor}
                                </span>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <button 
                          onClick={() => fetchMatchInsights(match)}
                          disabled={isAnalyzingMatch === match.id}
                          className="w-full py-2 bg-slate-50 hover:bg-emerald-50 text-slate-500 hover:text-emerald-600 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-dashed border-slate-200 hover:border-emerald-200"
                        >
                          {isAnalyzingMatch === match.id ? (
                            <>
                              <RefreshCw size={12} className="animate-spin" />
                              Analyzing...
                            </>
                          ) : (
                            <>
                              <Sparkles size={12} />
                              Get AI Insights
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                </div>
                </div>

                {/* Sidebar: AI Groups & Bet Slip */}
                <div className="space-y-6">
              {/* Innovation: Top AI Predictions */}
              <div className="data-card bg-emerald-50 border-emerald-100">
                <div className="flex items-center gap-2 text-emerald-700 mb-4">
                  <Sparkles size={18} />
                  <h3 className="font-bold text-sm uppercase tracking-tight">Top AI Predictions</h3>
                </div>
                <div className="space-y-3">
                  {Object.entries(matchInsights)
                    .filter(([_, insight]) => insight.confidence > 0.7)
                    .slice(0, 3)
                    .map(([matchId, insight]) => {
                      const match = matches.find(m => m.id === matchId);
                      if (!match) return null;
                      return (
                        <div key={matchId} className="p-3 bg-white rounded-xl border border-emerald-100 shadow-sm">
                          <div className="text-[9px] font-black text-slate-400 uppercase mb-1">{match.homeTeam} vs {match.awayTeam}</div>
                          <div className="flex justify-between items-center">
                            <div className="text-xs font-bold text-emerald-700">{insight.prediction}</div>
                            <div className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                              {Math.round(insight.confidence * 100)}%
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  {Object.keys(matchInsights).length === 0 && (
                    <div className="text-center py-4 text-emerald-600/50 italic text-[10px]">
                      Analysez des matchs pour voir les meilleures prédictions ici.
                    </div>
                  )}
                </div>
              </div>

              {/* Innovation: Betting Leaderboard */}
              <div className="data-card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold flex items-center gap-2">
                    <Award size={18} className="text-amber-500" /> Top Winners
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Weekly</span>
                </div>
                <div className="space-y-3">
                  {[
                    { name: 'Alpha_Bettor', profit: '+12,450', avatar: 'AB', color: 'bg-indigo-500' },
                    { name: 'Kamer_King', profit: '+8,920', avatar: 'KK', color: 'bg-rose-500' },
                    { name: 'Predictor_X', profit: '+5,100', avatar: 'PX', color: 'bg-blue-500' },
                  ].map((winner, i) => (
                    <div key={i} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="text-xs font-black text-slate-300 w-4">{i + 1}</div>
                        <div className={`w-8 h-8 ${winner.color} rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm`}>
                          {winner.avatar}
                        </div>
                        <span className="text-xs font-bold text-slate-700">{winner.name}</span>
                      </div>
                      <div className="text-xs font-black text-emerald-600">{currentCurrency.symbol}{winner.profit}</div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 py-2 text-[10px] font-black text-slate-400 hover:text-emerald-600 uppercase tracking-widest transition-colors">
                  View Full Leaderboard
                </button>
              </div>

              <div className="data-card bg-slate-900 text-white border-none shadow-xl shadow-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Cpu size={20} />
                    <h3 className="font-bold">AI Smart Groups</h3>
                  </div>
                  <button 
                    onClick={fetchSmartGroups}
                    disabled={isGeneratingGroups}
                    className="p-1.5 hover:bg-white/10 text-slate-400 hover:text-emerald-400 rounded-lg transition-colors disabled:opacity-50"
                    title="Refresh AI suggestions"
                  >
                    <RefreshCw size={14} className={isGeneratingGroups ? 'animate-spin' : ''} />
                  </button>
                </div>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                  Join AI-curated syndicates that use collective intelligence and advanced algorithms to maximize returns.
                </p>
                <div className="space-y-3 mb-6">
                  {smartGroups.map((group, i) => (
                    <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <div className="text-sm font-bold group-hover:text-emerald-400 transition-colors">{group.name}</div>
                          <div className="text-[10px] text-slate-500">{group.sport}</div>
                        </div>
                        <div className="text-emerald-400 font-bold text-sm">+{Math.floor(Math.random() * 15) + 10}% ROI</div>
                      </div>
                      <p className="text-[9px] text-slate-500 italic line-clamp-2">{group.strategy}</p>
                    </div>
                  ))}
                </div>
                <button className="w-full py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20">
                  Explore Smart Groups
                </button>
              </div>

              <div className="data-card sticky top-6 overflow-hidden">
                <div 
                  className="flex justify-between items-center mb-6 cursor-pointer group"
                  onClick={() => setIsBetSlipCollapsed(!isBetSlipCollapsed)}
                >
                  <div className="flex items-center gap-2">
                    <ShoppingBag size={18} className="text-emerald-500" />
                    <h3 className="font-bold">Bet Slip</h3>
                    {betSlip.length > 0 && (
                      <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-1 rounded-full">
                        {betSlip.length}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {isBetSlipCollapsed && betSlip.length > 0 && (
                      <div className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg animate-in fade-in slide-in-from-right-2">
                        {betSlip.length} {betSlip.length === 1 ? 'Bet' : 'Bets'}
                      </div>
                    )}
                    <div className="text-slate-400 group-hover:text-emerald-500 transition-colors">
                      {isBetSlipCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                    </div>
                  </div>
                </div>
                
                <AnimatePresence initial={false}>
                  {!isBetSlipCollapsed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      {betSlip.length > 0 ? (
                        <div className="space-y-4">
                          <div className="max-h-[350px] overflow-y-auto space-y-3 pr-2 no-scrollbar">
                            <AnimatePresence initial={false}>
                              {betSlip.map((bet) => (
                                <motion.div 
                                  key={bet.id}
                                  initial={{ scale: 0.9, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0.9, opacity: 0, transition: { duration: 0.2 } }}
                                  layout
                                  className="p-3 bg-slate-50 rounded-xl border border-slate-100 relative group"
                                >
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setBetSlip(betSlip.filter((b) => b.id !== bet.id));
                                    }}
                                    className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
                                  >
                                    <X size={12} />
                                  </button>
                                  <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">{bet.teams}</div>
                                  <div className="flex justify-between items-center mb-2">
                                    <div className="text-sm font-bold text-slate-900">{bet.pick}</div>
                                    <div className="text-sm font-black text-emerald-600">@{bet.odd.toFixed(2)}</div>
                                  </div>
                                  
                                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200/50">
                                    <div className="relative flex-1">
                                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">{currentCurrency.symbol}</span>
                                      <input 
                                        type="number" 
                                        value={bet.stake}
                                        onChange={(e) => {
                                          const newStake = Math.max(0, parseInt(e.target.value) || 0);
                                          setBetSlip(betSlip.map((b) => b.id === bet.id ? { ...b, stake: newStake } : b));
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                        className="w-full bg-white border border-slate-200 rounded-lg py-1.5 pl-5 pr-2 text-xs font-bold focus:outline-none focus:border-emerald-500 transition-all"
                                        placeholder="Stake"
                                      />
                                    </div>
                                    <div className="text-right">
                                      <div className="text-[8px] text-slate-400 uppercase font-black">Est. Win</div>
                                      <div className="text-xs font-black text-emerald-600">
                                        {formatPriceWithDecimals(bet.stake * bet.odd)}
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </AnimatePresence>
                          </div>
                          <div className="pt-4 border-t border-slate-100 space-y-3">
                            <div className="flex justify-between items-center text-xs font-bold">
                              <span className="text-slate-500">Total Stake</span>
                              <span className="text-slate-900">
                                {formatPrice(betSlip.reduce((acc, curr) => acc + (curr.stake || 0), 0))}
                              </span>
                            </div>
                            
                            <div className="flex justify-between items-center text-sm font-black pt-2 border-t border-slate-50">
                              <span className="text-slate-500 uppercase text-[10px]">Total Potential Win</span>
                              <span className="text-emerald-600 text-lg">
                                {formatPriceWithDecimals(betSlip.reduce((acc, curr) => acc + ((curr.stake || 0) * curr.odd), 0))}
                              </span>
                            </div>
                            
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                if (isAccountRestricted) {
                                  alert('Action bloquée : Votre compte est restreint pour fraude suspectée.');
                                  return;
                                }
                                const totalStake = betSlip.reduce((acc, curr) => acc + (curr.stake || 0), 0);
                                if (balance < totalStake) {
                                  alert('Insufficient balance!');
                                  return;
                                }
                                
                                // Track Bet Placement
                                ReactGA.event({
                                  category: 'Betting',
                                  action: 'Place Bet',
                                  label: `${betSlip.length} bets`,
                                  value: Math.round(totalStake)
                                });

                                setBalance(prev => prev - totalStake);
                                setBetSlip([]);
                                alert('Bets placed successfully! Good luck.');
                              }}
                              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95 transform mt-2"
                            >
                              PLACE {betSlip.length} {betSlip.length === 1 ? 'BET' : 'BETS'}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-12 text-slate-400">
                          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                            <Target size={32} className="opacity-20" />
                          </div>
                          <p className="text-xs font-medium">Select odds to add to your slip</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
                </div>
              </div>
            </div>
          )}

            {bettingSubTab === 'p2p' && (
              <div className="space-y-8">
                {/* P2P Header */}
                <div className="data-card bg-white border-none shadow-2xl overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                  <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 p-4">
                    <div className="max-w-xl">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                        <Sparkles size={12} />
                        Nexus P2P Engine
                      </div>
                      <h2 className="text-4xl font-black text-slate-900 leading-tight mb-4 tracking-tighter">
                        Créez vos propres <span className="text-emerald-500 italic">Paris Nexus</span>.
                      </h2>
                      <p className="text-slate-500 text-sm leading-relaxed">
                        Transparence totale, créativité sans limites. Pariez sur n'importe quoi, n'importe quand. 
                        L'oracle communautaire garantit l'équité de chaque résultat.
                      </p>
                    </div>
                    <button 
                      onClick={() => setIsCreatingBet(true)}
                      className="px-8 py-5 bg-slate-900 text-white rounded-3xl font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-emerald-500 transition-all flex items-center gap-3 group"
                    >
                      <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                      Créer un Pari
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                  <div className="lg:col-span-3 space-y-6">
                    {/* Custom Bets Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {customBets.map(bet => (
                        <div key={bet.id} className="data-card group hover:shadow-2xl transition-all border-slate-100">
                          <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xs">
                                {bet.creator.substring(0, 2)}
                              </div>
                              <div>
                                <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{bet.category}</div>
                                <div className="text-xs font-bold text-slate-400">par {bet.creator}</div>
                              </div>
                            </div>
                            <div className="px-2 py-1 bg-slate-50 text-slate-500 rounded text-[10px] font-black">
                              {bet.status}
                            </div>
                          </div>
                          
                          <h3 className="text-lg font-black text-slate-900 leading-snug mb-6 group-hover:text-emerald-600 transition-colors">
                            {bet.title}
                          </h3>

                          <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                              <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Cote</div>
                              <div className="text-xl font-black text-slate-900">@{bet.odds}</div>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                              <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Pool Total</div>
                              <div className="text-xl font-black text-emerald-600">{bet.pool.toLocaleString()}</div>
                            </div>
                          </div>

                          <button className="w-full py-4 bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border border-slate-100">
                            Placer un Pari
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-1 space-y-6">
                    {/* Community Oracle Transparency */}
                    <div className="data-card bg-slate-900 text-white border-none">
                      <div className="flex items-center gap-2 text-emerald-400 mb-4">
                        <ShieldCheck size={20} />
                        <h3 className="font-bold">Oracle Nexus</h3>
                      </div>
                      <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                        Chaque pari P2P est validé par un vote décentralisé des utilisateurs MJ Nexus. 
                        La transparence est garantie par la blockchain Nexus.
                      </p>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-[10px] font-bold">
                          <span className="text-slate-500">Paris Validés</span>
                          <span className="text-emerald-400">1,420</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-bold">
                          <span className="text-slate-500">Taux de Litige</span>
                          <span className="text-rose-400">0.02%</span>
                        </div>
                        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div className="w-[99.98%] h-full bg-emerald-500" />
                        </div>
                      </div>
                    </div>

                    {/* Creative Categories */}
                    <div className="data-card">
                      <h3 className="font-bold text-sm mb-4">Catégories Créatives</h3>
                      <div className="flex flex-wrap gap-2">
                        {['Futur Tech', 'Climat', 'Espace', 'Social', 'Nexus Dev'].map(cat => (
                          <span key={cat} className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold hover:bg-emerald-50 hover:text-emerald-600 cursor-pointer transition-colors">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {bettingSubTab === 'gaming' && (
              <div className="space-y-8">
                {/* Gaming Header */}
                <div className="data-card bg-slate-900 text-white border-none shadow-2xl overflow-hidden relative">
                  <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/gaming/1920/1080')] opacity-20 grayscale" />
                  <div className="relative p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                      <h2 className="text-5xl font-black italic tracking-tighter mb-4">NEXUS ARENA</h2>
                      <p className="text-slate-400 max-w-md text-sm leading-relaxed">
                        Compétition en temps réel. Connectez-vous, parlez, gagnez. 
                        Défiez les meilleurs joueurs du continent sur vos jeux préférés.
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <div className="text-center">
                        <div className="text-3xl font-black text-emerald-400">1,240</div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Joueurs en ligne</div>
                      </div>
                      <div className="w-px h-12 bg-slate-800" />
                      <div className="text-center">
                        <div className="text-3xl font-black text-amber-400">42</div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tournois Live</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    {/* Gaming Rooms */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {gamingRooms.map(room => (
                        <div key={room.id} className="data-card bg-white border-slate-100 hover:border-emerald-500/30 transition-all group">
                          <div className="flex gap-4">
                            <div className="w-24 h-24 bg-slate-100 rounded-2xl overflow-hidden relative shrink-0">
                              <img 
                                src={`https://picsum.photos/seed/${room.game}/200/200`} 
                                alt={room.game} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-rose-500 text-white text-[7px] font-black rounded uppercase animate-pulse">
                                {room.status}
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-1">
                                <h3 className="text-sm font-black text-slate-900 truncate">{room.game}</h3>
                                <div className="flex items-center gap-1 text-emerald-500">
                                  <Users size={12} />
                                  <span className="text-[10px] font-bold">{room.players}/{room.maxPlayers}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 mb-3">
                                <div className="w-4 h-4 bg-slate-900 rounded-full flex items-center justify-center text-[7px] text-white font-bold">
                                  {room.host.substring(0, 1)}
                                </div>
                                <span className="text-[9px] font-bold text-slate-400 truncate">Host: {room.host}</span>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <button className="flex-1 py-2 bg-emerald-500 text-white rounded-lg font-bold text-[10px] shadow-lg shadow-emerald-100 hover:bg-emerald-600 transition-all flex items-center justify-center gap-1">
                                  Rejoindre
                                </button>
                                <button className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${room.voiceActive ? 'bg-rose-50 text-rose-500 border border-rose-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                                  <Mic size={14} className={room.voiceActive ? 'animate-bounce' : ''} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-1 space-y-6">
                    {/* Voice Battle Section */}
                    <div className="data-card bg-gradient-to-br from-indigo-900 to-slate-900 text-white border-none p-6 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Mic size={80} />
                      </div>
                      <div className="relative z-10">
                        <h3 className="text-xl font-black mb-3 uppercase tracking-tight">Battle Vocale</h3>
                        <p className="text-indigo-200 text-[10px] leading-relaxed mb-6">
                          Défiez vos adversaires en direct. Parlez stratégie ou faites du "trash talk" dans nos salons vocaux sécurisés.
                        </p>
                        <div className="space-y-3">
                          <button className="w-full py-3 bg-white text-indigo-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 transition-all">
                            Lancer un Défi Vocal
                          </button>
                          <div className="text-center text-[9px] text-indigo-300 font-bold">
                            12 Battles en cours
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Connected Games List */}
                    <div className="data-card">
                      <h3 className="font-bold text-sm mb-4">Jeux Connectés</h3>
                      <div className="space-y-3">
                        {['Nexus Strike', 'FIFA 26 Mobile', 'Call of Duty M', 'PUBG Nexus'].map(game => (
                          <div key={game} className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="text-xs font-bold text-slate-700">{game}</span>
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Create Bet Modal */}
            {isCreatingBet && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
                >
                  <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                      <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Nouveau Pari Nexus</h3>
                      <button onClick={() => setIsCreatingBet(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                        <X size={20} />
                      </button>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Titre du Pari</label>
                        <input 
                          type="text" 
                          placeholder="Ex: MJ Nexus aura 1M d'utilisateurs ?"
                          className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-emerald-500"
                          value={newBet.title}
                          onChange={e => setNewBet({...newBet, title: e.target.value})}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Catégorie</label>
                          <select 
                            className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-emerald-500"
                            value={newBet.category}
                            onChange={e => setNewBet({...newBet, category: e.target.value})}
                          >
                            <option>General</option>
                            <option>Crypto</option>
                            <option>Milestone</option>
                            <option>Politics</option>
                            <option>Entertainment</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Cote Proposée</label>
                          <input 
                            type="number" 
                            step="0.1"
                            className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-emerald-500"
                            value={newBet.odds}
                            onChange={e => setNewBet({...newBet, odds: parseFloat(e.target.value)})}
                          />
                        </div>
                      </div>

                      <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                        <div className="flex items-center gap-3 text-emerald-700 mb-2">
                          <ShieldCheck size={18} />
                          <span className="text-xs font-black uppercase tracking-widest">Oracle Communautaire</span>
                        </div>
                        <p className="text-[10px] text-emerald-600 font-medium leading-relaxed">
                          Ce pari sera validé par le vote de la communauté Nexus. 100% transparent, 0% manipulation.
                        </p>
                      </div>

                      <button 
                        onClick={() => {
                          if (!newBet.title) return;
                          setCustomBets([{
                            id: Date.now(),
                            creator: 'Moi',
                            title: newBet.title,
                            category: newBet.category,
                            odds: newBet.odds,
                            pool: 0,
                            status: 'Open'
                          }, ...customBets]);
                          setIsCreatingBet(false);
                          setNewBet({ title: '', category: 'General', odds: 2.0 });
                          alert("Votre pari a été créé et publié !");
                        }}
                        className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:bg-emerald-500 transition-all active:scale-95"
                      >
                        Publier le Pari
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        );
      case 'academy':
        return (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-3xl font-black italic uppercase text-slate-900">MJ Academy</h2>
                <p className="text-sm text-slate-500">Formations professionnelles certifiantes. Livraison du matériel pédagogique incluse.</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold">
                <Award size={16} /> CERTIFICATION PRO & MATÉRIEL INCLUS
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {MOCK_COURSES.map(course => (
                <div key={course.id} className="data-card group cursor-pointer flex flex-col h-full overflow-hidden p-0">
                  <div className="relative aspect-video overflow-hidden">
                    <img src={course.image} alt={course.title} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      <div className="px-2 py-1 bg-emerald-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-lg">
                        {course.category}
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-white/90 backdrop-blur text-slate-900 rounded-lg text-[10px] font-bold shadow-sm">
                      {course.duration}
                    </div>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] font-bold uppercase">{course.level}</span>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded text-[9px] font-bold uppercase flex items-center gap-1">
                        <PlaneTakeoff size={10} /> Livraison {course.delivery}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">{course.title}</h3>
                    <p className="text-xs text-slate-500 mb-6 line-clamp-3 leading-relaxed">{course.description}</p>
                    
                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-emerald-600 font-black text-lg uppercase tracking-tighter">{formatPrice(course.price)}</div>
                      <button 
                        onClick={() => {
                          if (balance < course.price) {
                            alert("Solde insuffisant pour s'inscrire à ce cours.");
                            return;
                          }
                          setBalance(prev => prev - course.price);
                          alert(`Félicitations ! Vous êtes inscrit au cours : ${course.title}. Votre matériel sera expédié sous 48h.`);
                          ReactGA.event({ category: 'Academy', action: 'Enroll', label: course.title });
                        }}
                        className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-emerald-500 transition-all shadow-lg shadow-slate-200"
                      >
                        S'inscrire
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Academy Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="data-card bg-slate-900 text-white border-none p-8">
                <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-6">
                  <HardHat size={24} />
                </div>
                <h4 className="text-lg font-bold mb-2">Métiers Pratiques</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Nos formations sont axées sur la pratique réelle pour une insertion immédiate dans l'écosystème MJ NEXUS.
                </p>
              </div>
              <div className="data-card bg-slate-900 text-white border-none p-8">
                <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-6">
                  <PlaneTakeoff size={24} />
                </div>
                <h4 className="text-lg font-bold mb-2">Logistique Offerte</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Tout le matériel pédagogique et les kits d'outils sont livrés gratuitement par nos drones ou coursiers.
                </p>
              </div>
              <div className="data-card bg-slate-900 text-white border-none p-8">
                <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center mb-6">
                  <Award size={24} />
                </div>
                <h4 className="text-lg font-bold mb-2">Certification MJ</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Obtenez un certificat reconnu par tous les partenaires de la plateforme et boostez votre carrière.
                </p>
              </div>
            </div>
          </div>
        );
      case 'health':
        return (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-3xl font-black italic uppercase text-slate-900">MJ Health</h2>
                <p className="text-sm text-slate-500">Téléconseil médical & Consultations en ligne avec des spécialistes certifiés.</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-rose-100 text-rose-700 rounded-xl text-xs font-bold">
                <Shield size={16} /> SÉCURISÉ & CONFIDENTIEL
              </div>
            </div>

            {/* AI Symptom Checker */}
            <div className="data-card bg-gradient-to-r from-rose-600 to-rose-500 text-white border-none overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
              <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 p-2">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white shadow-inner">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black italic uppercase tracking-tight">AI Symptom Checker</h3>
                    <p className="text-xs text-rose-100">Décrivez vos symptômes pour une orientation préliminaire intelligente.</p>
                  </div>
                </div>
                <button className="px-6 py-3 bg-white text-rose-600 rounded-xl font-bold text-xs transition-all shadow-lg hover:bg-rose-50 active:scale-95">
                  Démarrer l'analyse IA
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <Users size={18} className="text-rose-500" /> Nos Spécialistes Disponibles
                  </h3>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {['Tous', 'Générale', 'Pédiatrie', 'Cardio', 'Gynéco'].map(cat => (
                      <button key={cat} className="px-3 py-1 bg-slate-100 hover:bg-rose-500 hover:text-white rounded-lg text-[10px] font-bold transition-all uppercase tracking-wider whitespace-nowrap">
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {MOCK_DOCTORS.map(doc => (
                    <div key={doc.id} className="data-card hover:border-rose-200 transition-all group">
                      <div className="flex gap-4">
                        <div className="relative">
                          <img src={doc.image} alt={doc.name} className="w-20 h-20 rounded-2xl object-cover border border-slate-100" referrerPolicy="no-referrer" />
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${doc.availability === 'Disponible' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-slate-900 group-hover:text-rose-600 transition-colors">{doc.name}</h4>
                              <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wider">{doc.specialty}</p>
                            </div>
                            <div className="flex items-center gap-1 text-amber-500">
                              <Star size={12} fill="currentColor" />
                              <span className="text-[10px] font-bold">{doc.rating}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center gap-1 text-slate-400 text-[10px]">
                              <Briefcase size={10} /> {doc.experience} exp.
                            </div>
                            <div className="flex items-center gap-1 text-emerald-600 text-[10px] font-bold">
                              <Wallet size={10} /> {formatPrice(doc.price)}
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-3 line-clamp-2 italic">"{doc.bio}"</p>
                      <button 
                        onClick={() => {
                          if (balance < doc.price) {
                            alert("Solde insuffisant pour cette consultation.");
                            return;
                          }
                          alert(`Demande de consultation envoyée au ${doc.name}. Une commission de 10% (${formatPrice(doc.price * 0.1)}) sera prélevée.`);
                        }}
                        className="w-full mt-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-rose-600 transition-all"
                      >
                        Consulter Maintenant
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="data-card bg-slate-900 text-white border-none">
                  <h3 className="font-bold flex items-center gap-2 mb-4">
                    <Shield size={18} className="text-emerald-400" /> Sécurité & Innovation
                  </h3>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-emerald-400 shrink-0">
                        <Lock size={16} />
                      </div>
                      <div>
                        <div className="text-xs font-bold">Chiffrement de bout en bout</div>
                        <p className="text-[10px] text-slate-400">Vos données médicales sont cryptées et accessibles uniquement par vous et votre médecin.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-blue-400 shrink-0">
                        <Video size={16} />
                      </div>
                      <div>
                        <div className="text-xs font-bold">HD Tele-Consultation</div>
                        <p className="text-[10px] text-slate-400">Appels vidéo haute définition sécurisés pour un diagnostic précis.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-amber-400 shrink-0">
                        <Handshake size={16} />
                      </div>
                      <div>
                        <div className="text-xs font-bold">Transparence MJ</div>
                        <p className="text-[10px] text-slate-400">Seulement 10% de commission plateforme. 90% reviennent directement aux praticiens.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="data-card">
                  <h3 className="font-bold flex items-center gap-2 mb-4">
                    <AlertTriangle size={18} className="text-rose-500" /> Urgences
                  </h3>
                  <p className="text-[10px] text-slate-500 mb-4">En cas d'urgence vitale, contactez immédiatement les services de secours locaux ou utilisez notre bouton SOS.</p>
                  <button className="w-full py-3 bg-rose-500 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2">
                    <PhoneCall size={16} /> SOS URGENCE MJ
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'marketing':
        return (
          <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-3xl font-black italic uppercase text-slate-900">{t.marketing.hubTitle}</h2>
                <p className="text-sm text-slate-500">{t.marketing.hubSubtitle}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold">
                  <Megaphone size={16} /> MJ NEXUS OUTREACH
                </div>
                {selectedPlan === 'free' && (
                  <button 
                    onClick={() => setShowPricingModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-xl text-xs font-black shadow-lg shadow-amber-200 animate-pulse"
                  >
                    <Crown size={14} /> {t.marketing.upgradePro}
                  </button>
                )}
              </div>
            </div>

            {/* Sub-Navigation */}
            <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto scrollbar-hide">
              {[
                { id: 'overview', label: t.marketing.overview, icon: LayoutDashboard },
                { id: 'whatsapp', label: t.marketing.whatsapp, icon: Smartphone, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { id: 'sms', label: t.marketing.sms, icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-50' },
                { id: 'email', label: t.marketing.email, icon: Mail, color: 'text-purple-600', bg: 'bg-purple-50' },
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setMarketingSubTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    marketingSubTab === tab.id 
                      ? 'bg-slate-900 text-white shadow-lg' 
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <tab.icon size={16} className={marketingSubTab === tab.id ? 'text-indigo-400' : tab.color} />
                  {tab.label}
                </button>
              ))}
            </div>

            {marketingSubTab === 'overview' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: t.marketing.totalSent, value: '1.2M+', icon: Send, color: 'text-emerald-600' },
                    { label: t.marketing.openRate, value: '94.2%', icon: Eye, color: 'text-blue-600' },
                    { label: t.marketing.convRate, value: '12.8%', icon: Target, color: 'text-indigo-600' },
                  ].map((stat, idx) => (
                    <div key={idx} className="data-card p-6 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                        <h4 className="text-2xl font-black text-slate-900">{stat.value}</h4>
                      </div>
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color.replace('text', 'bg')}/10 ${stat.color}`}>
                        <stat.icon size={24} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {MOCK_MARKETING_SERVICES.map(service => (
                    <div key={service.id} className="data-card p-8 group hover:border-indigo-500 transition-all flex flex-col relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4">
                        <ArrowRight size={20} className="text-slate-200 group-hover:text-indigo-500 transition-all" />
                      </div>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                          {service.icon === 'Smartphone' ? <Smartphone size={32} /> : service.icon === 'Mail' ? <Mail size={32} /> : <MessageSquare size={32} />}
                        </div>
                        <div>
                          <h3 className="text-xl font-black italic uppercase tracking-tight text-slate-900">{service.title}</h3>
                          <p className="text-xs text-slate-500">{service.description}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        {service.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-[10px] font-bold text-slate-600 bg-slate-50 p-2 rounded-lg">
                            <CheckCircle size={12} className="text-emerald-500" /> {feature}
                          </div>
                        ))}
                      </div>

                      <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-slate-400 uppercase font-bold">À partir de</div>
                          <div className="text-2xl font-black text-indigo-600">{service.pricePerUnit} FCFA <span className="text-xs font-normal text-slate-400">/ {service.unit}</span></div>
                        </div>
                        <button 
                          onClick={() => setMarketingSubTab(service.id === 'M1' ? 'whatsapp' : service.id === 'M2' ? 'sms' : 'email')}
                          className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-indigo-600 transition-all shadow-lg"
                        >
                          Gérer le service
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {marketingSubTab === 'whatsapp' && (
              <div className="space-y-8">
                {/* WhatsApp Hero Section */}
                <div className="data-card bg-gradient-to-br from-emerald-600 to-teal-700 text-white border-none p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                  <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="max-w-2xl">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest">{t.marketing.proVersion}</div>
                        <div className="flex items-center gap-1 text-emerald-300 text-[10px] font-bold">
                          <ShieldCheck size={14} /> {t.marketing.antiBanActive}
                        </div>
                      </div>
                      <h3 className="text-4xl font-black italic uppercase mb-4 leading-tight">{t.marketing.whatsappHeroTitle}</h3>
                      <p className="text-emerald-50/80 text-sm leading-relaxed mb-6">
                        {t.marketing.whatsappHeroDesc}
                      </p>
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-200">
                          <Zap size={16} /> Envois Instantanés
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-200">
                          <Users size={16} /> Import de Groupes
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-200">
                          <Sparkles size={16} /> {t.marketing.aiAutoPilot}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative w-48 h-48 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-emerald-500/30" />
                          <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={552} strokeDashoffset={552 * (1 - 0.85)} className="text-white transition-all duration-1000" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-3xl font-black">1895</span>
                          <span className="text-[10px] font-bold uppercase opacity-70">Messages Sent</span>
                        </div>
                      </div>
                      <p className="text-xs font-bold">Success Rate: 99.8%</p>
                    </div>
                  </div>
                </div>

                {/* WhatsApp Sub-Tabs */}
                <div className="flex items-center gap-4 border-b border-slate-200">
                  <button 
                    onClick={() => setWhatsappSubTab('campaign')}
                    className={`pb-4 text-sm font-bold transition-all relative ${whatsappSubTab === 'campaign' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {t.marketing.newCampaign}
                    {whatsappSubTab === 'campaign' && <motion.div layoutId="wa-tab" className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500 rounded-full" />}
                  </button>
                  <button 
                    onClick={() => setWhatsappSubTab('ai-pilot')}
                    className={`pb-4 text-sm font-bold transition-all relative flex items-center gap-2 ${whatsappSubTab === 'ai-pilot' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    <Sparkles size={14} />
                    {t.marketing.aiAutoPilot}
                    {whatsappSubTab === 'ai-pilot' && <motion.div layoutId="wa-tab" className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500 rounded-full" />}
                  </button>
                </div>

                {/* WhatsApp Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Main Content Area */}
                  <div className="lg:col-span-2 space-y-6">
                    {whatsappSubTab === 'campaign' ? (
                      <div className="data-card p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h4 className="text-lg font-black italic uppercase text-slate-900">{t.marketing.newCampaign}</h4>
                          <div className="flex gap-2">
                            <button className="p-2 text-slate-400 hover:text-indigo-600 transition-all"><Settings size={18} /></button>
                            <button className="p-2 text-slate-400 hover:text-indigo-600 transition-all"><History size={18} /></button>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">{t.marketing.campaignName}</label>
                            <input type="text" placeholder="Ex: Relance Prospects Mars" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:border-emerald-500 transition-all" />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 border-2 border-dashed border-slate-200 rounded-2xl hover:border-emerald-500 transition-all cursor-pointer group">
                              <div className="flex flex-col items-center gap-2 py-4">
                                <Upload size={24} className="text-slate-300 group-hover:text-emerald-500 transition-all" />
                                <span className="text-xs font-bold text-slate-500">{t.marketing.importContacts}</span>
                              </div>
                            </div>
                            <div className="p-4 border-2 border-dashed border-slate-200 rounded-2xl hover:border-emerald-500 transition-all cursor-pointer group">
                              <div className="flex flex-col items-center gap-2 py-4">
                                <Users size={24} className="text-slate-300 group-hover:text-emerald-500 transition-all" />
                                <span className="text-xs font-bold text-slate-500">{t.marketing.extractGroups}</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">{t.marketing.messageLabel}</label>
                            <textarea 
                              placeholder="Bonjour {name}, nous avons une offre spéciale pour vous..." 
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm h-32 focus:outline-none focus:border-emerald-500 transition-all resize-none"
                            />
                          </div>

                          <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-200">
                                <ShieldCheck size={20} />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-emerald-900 uppercase">{t.marketing.antiBanTech}</p>
                                <p className="text-[10px] text-emerald-600">{t.marketing.antiBanDesc}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-emerald-700">ACTIVE</span>
                              <div className="w-10 h-5 bg-emerald-500 rounded-full relative">
                                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                              </div>
                            </div>
                          </div>

                          <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black italic uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3">
                            <Send size={18} /> {t.marketing.launchCampaign}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="data-card p-6 border-indigo-200 bg-indigo-50/20">
                          <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                                <Cpu size={24} />
                              </div>
                              <div>
                                <h4 className="text-lg font-black italic uppercase text-slate-900">{t.marketing.aiAutoPilot}</h4>
                                <p className="text-xs text-slate-500">{t.marketing.aiAutoPilotDesc}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">{t.marketing.aiStatus}</p>
                                <p className="text-xs font-black text-indigo-600">{t.marketing.aiActive}</p>
                              </div>
                              <div className="w-12 h-6 bg-indigo-600 rounded-full relative">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-6">
                            <div>
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">{t.marketing.aiKnowledgeBase}</label>
                              <textarea 
                                placeholder={t.marketing.aiKnowledgePlaceholder}
                                className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm h-48 focus:outline-none focus:border-indigo-500 transition-all resize-none shadow-sm"
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">{t.marketing.aiTone}</label>
                                <div className="grid grid-cols-3 gap-2">
                                  {[
                                    { id: 'prof', label: t.marketing.aiToneProfessional, icon: Briefcase },
                                    { id: 'friend', label: t.marketing.aiToneFriendly, icon: Heart },
                                    { id: 'persuade', label: t.marketing.aiTonePersuasive, icon: Target },
                                  ].map(tone => (
                                    <button key={tone.id} className="flex flex-col items-center gap-2 p-3 bg-white border border-slate-100 rounded-xl hover:border-indigo-500 transition-all group">
                                      <tone.icon size={16} className="text-slate-400 group-hover:text-indigo-600" />
                                      <span className="text-[9px] font-bold text-slate-600">{tone.label}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">{t.marketing.aiGoals}</label>
                                <div className="space-y-2">
                                  {['Lead Generation', 'Direct Sales', 'Support & FAQ'].map(goal => (
                                    <div key={goal} className="flex items-center justify-between p-2 bg-white border border-slate-100 rounded-lg">
                                      <span className="text-[10px] font-bold text-slate-600">{goal}</span>
                                      <div className="w-4 h-4 rounded border border-slate-300 flex items-center justify-center">
                                        <Check size={10} className="text-indigo-600" />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 bg-indigo-500/20 text-indigo-400 rounded-lg flex items-center justify-center">
                                    <Shield size={16} />
                                  </div>
                                  <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest">{t.marketing.aiStealth}</p>
                                    <p className="text-[9px] text-slate-400">{t.marketing.aiStealthDesc}</p>
                                  </div>
                                </div>
                                <div className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-[9px] font-black">SECURE</div>
                              </div>
                            </div>

                            {selectedPlan === 'free' && (
                              <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-center gap-3">
                                <AlertCircle size={20} className="text-amber-500" />
                                <p className="text-xs font-bold text-amber-900">{t.marketing.aiUpgradeRequired}</p>
                                <button 
                                  onClick={() => setShowPricingModal(true)}
                                  className="ml-auto px-4 py-2 bg-amber-500 text-white rounded-lg text-[10px] font-black hover:bg-amber-600 transition-all"
                                >
                                  UPGRADE
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="data-card p-6">
                            <h5 className="text-xs font-black uppercase text-slate-400 mb-4">{t.marketing.aiConversations}</h5>
                            <div className="space-y-4">
                              {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 border border-slate-100">
                                    <User size={20} />
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-xs font-bold text-slate-900">+237 678 901 23{i}</p>
                                    <p className="text-[10px] text-slate-500 italic">AI: "Sure, our pricing starts at..."</p>
                                  </div>
                                  <div className="text-[9px] font-bold text-emerald-600">Active</div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="data-card p-6 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-4">
                              <Target size={32} />
                            </div>
                            <h5 className="text-xl font-black text-slate-900">12</h5>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">{t.marketing.aiConversions}</p>
                            <p className="text-[9px] text-slate-500 mt-2">Last 24 hours</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sidebar Features & Pricing */}
                  <div className="space-y-6">
                    <div className="data-card p-6 border-indigo-100 bg-indigo-50/30">
                      <h4 className="text-sm font-black italic uppercase text-slate-900 mb-4 flex items-center gap-2">
                        <Crown size={16} className="text-amber-500" /> {t.marketing.proBenefits}
                      </h4>
                      <div className="space-y-3">
                        {[
                          { label: 'No. of campaign', free: '01', pro: 'Unlimited' },
                          { label: 'Export & copy', free: false, pro: true },
                          { label: 'Import CSV/Group', free: '10', pro: 'Unlimited' },
                          { label: 'Grab contacts', free: false, pro: true },
                          { label: 'Group sender', free: false, pro: true },
                          { label: 'Personalize Msg', free: '10', pro: 'Unlimited' },
                          { label: 'Anti-Ban Tech', free: 'Basic', pro: 'Advanced' },
                          { label: 'AI Auto-Pilot', free: false, pro: true },
                          { label: 'Cloud Backup', free: false, pro: true },
                        ].map((feat, idx) => (
                          <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                            <span className="text-[10px] font-bold text-slate-500">{feat.label}</span>
                            <div className="flex items-center gap-4">
                              <span className="text-[10px] text-slate-400">{feat.free === false ? <XCircle size={12} className="text-rose-400" /> : feat.free === true ? <CheckCircle size={12} className="text-emerald-400" /> : feat.free}</span>
                              <span className="text-[10px] font-bold text-indigo-600">{feat.pro === true ? <CheckCircle size={12} className="text-indigo-500" /> : feat.pro}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button 
                        onClick={() => setShowPricingModal(true)}
                        className="w-full mt-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-xs hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                      >
                        {t.marketing.upgradePro}
                      </button>
                    </div>

                    <div className="data-card p-6">
                      <h4 className="text-sm font-black italic uppercase text-slate-900 mb-4">{t.marketing.effortlessContacts}</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-slate-50 rounded-xl flex flex-col items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center"><PhoneCall size={16} /></div>
                          <span className="text-[10px] font-bold text-slate-500">Contacts</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl flex flex-col items-center gap-2">
                          <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center"><FileText size={16} /></div>
                          <span className="text-[10px] font-bold text-slate-500">Google Sheet</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl flex flex-col items-center gap-2">
                          <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center"><UserCircle size={16} /></div>
                          <span className="text-[10px] font-bold text-slate-500">Manual</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl flex flex-col items-center gap-2">
                          <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center"><Download size={16} /></div>
                          <span className="text-[10px] font-bold text-slate-500">CSV/VCF</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {marketingSubTab === 'sms' && (
              <div className="space-y-8">
                <div className="data-card bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-none p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                  <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="max-w-2xl">
                      <h3 className="text-4xl font-black italic uppercase mb-4 leading-tight">{t.marketing.smsHeroTitle}</h3>
                      <p className="text-blue-50/80 text-sm leading-relaxed mb-6">
                        {t.marketing.smsHeroDesc}
                      </p>
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-blue-200">
                          <CheckCircle size={16} /> Sender ID Personnalisé
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-blue-200">
                          <Globe size={16} /> Couverture Mondiale
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-blue-200">
                          <BarChart3 size={16} /> Analytics Temps Réel
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-md border border-white/20">
                      <div className="text-center">
                        <div className="text-4xl font-black mb-1">0.02€</div>
                        <div className="text-[10px] font-bold uppercase opacity-70">Par SMS Envoyé</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 data-card p-6">
                    <h4 className="text-lg font-black italic uppercase text-slate-900 mb-6">Configuration SMS</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">{t.marketing.smsSenderId}</label>
                          <input type="text" placeholder="MJNEXUS" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:border-blue-500 transition-all uppercase" maxLength={11} />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Type de Message</label>
                          <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:border-blue-500 transition-all">
                            <option>Marketing / Promotion</option>
                            <option>OTP / Transactionnel</option>
                            <option>Alerte / Notification</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">{t.marketing.smsContent}</label>
                        <textarea placeholder="Votre message ici..." className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm h-32 focus:outline-none focus:border-blue-500 transition-all resize-none" />
                        <div className="flex justify-end mt-2">
                          <span className="text-[10px] font-bold text-slate-400">0 / 160 (1 Segment)</span>
                        </div>
                      </div>
                      <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black italic uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3">
                        <Send size={18} /> {t.marketing.launchCampaign}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="data-card p-6 border-blue-100 bg-blue-50/30">
                      <h4 className="text-sm font-black italic uppercase text-slate-900 mb-4">Statistiques SMS</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500">Délivrés</span>
                          <span className="font-bold text-emerald-600">99.2%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500">Échecs</span>
                          <span className="font-bold text-rose-600">0.8%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full" style={{ width: '99.2%' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {marketingSubTab === 'email' && (
              <div className="space-y-8">
                <div className="data-card bg-gradient-to-br from-purple-600 to-fuchsia-700 text-white border-none p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                  <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="max-w-2xl">
                      <h3 className="text-4xl font-black italic uppercase mb-4 leading-tight">{t.marketing.emailHeroTitle}</h3>
                      <p className="text-purple-50/80 text-sm leading-relaxed mb-6">
                        {t.marketing.emailHeroDesc}
                      </p>
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-purple-200">
                          <LayoutDashboard size={16} /> Drag & Drop Editor
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-purple-200">
                          <RefreshCw size={16} /> Automation Flows
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-purple-200">
                          <Target size={16} /> A/B Testing
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-24 h-24 bg-white/10 rounded-3xl backdrop-blur-md border border-white/20 flex flex-col items-center justify-center">
                        <span className="text-2xl font-black">45k</span>
                        <span className="text-[8px] font-bold uppercase opacity-70">Subscribers</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                  <div className="lg:col-span-3 data-card p-6">
                    <div className="flex items-center justify-between mb-8">
                      <h4 className="text-lg font-black italic uppercase text-slate-900">{t.marketing.emailBuilder}</h4>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all">Preview</button>
                        <button className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-200">Save Template</button>
                      </div>
                    </div>
                    
                    <div className="aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-4 group cursor-pointer hover:border-purple-500 transition-all">
                      <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-purple-600 group-hover:scale-110 transition-all">
                        <Plus size={32} />
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-slate-900">{t.marketing.startScratch}</p>
                        <p className="text-xs text-slate-500">Or choose a pre-designed template</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="data-card p-6">
                      <h4 className="text-sm font-black italic uppercase text-slate-900 mb-4">Components</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {['Text', 'Image', 'Button', 'Divider', 'Social', 'Video'].map(comp => (
                          <div key={comp} className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-purple-500 transition-all cursor-move flex flex-col items-center gap-2">
                            <div className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center text-slate-400">
                              {comp === 'Text' ? <FileText size={16} /> : comp === 'Image' ? <ImageIcon size={16} /> : comp === 'Button' ? <Plus size={16} /> : <Settings size={16} />}
                            </div>
                            <span className="text-[10px] font-bold text-slate-500">{comp}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Pricing Modal */}
            <AnimatePresence>
              {showPricingModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowPricingModal(false)}
                    className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
                  />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
                  >
                    <div className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 text-white relative">
                      <button onClick={() => setShowPricingModal(false)} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-all">
                        <X size={20} />
                      </button>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                          <Crown size={24} />
                        </div>
                        <div>
                          <h3 className="text-2xl font-black italic uppercase">{t.marketing.plansTitle}</h3>
                          <p className="text-slate-400 text-xs">{t.marketing.plansSubtitle}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-8 space-y-6">
                      {/* Plan 1: 12 Months */}
                      <div 
                        onClick={() => setSelectedPlan('pro')}
                        className={`p-6 rounded-2xl border-2 transition-all cursor-pointer relative group ${
                          selectedPlan === 'pro' ? 'border-amber-500 bg-amber-50/30' : 'border-slate-100 hover:border-slate-200'
                        }`}
                      >
                        <div className="absolute -top-3 left-6 px-3 py-1 bg-amber-500 text-white text-[10px] font-black rounded-full shadow-lg">{t.marketing.bestDeal}</div>
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-xl font-black text-slate-900">12 Months PRO</h4>
                            <p className="text-xs text-slate-500">Accès illimité à toutes les fonctionnalités.</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-black text-amber-600">7 400 FCFA</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">FCFA 142.3 / WEEK</div>
                          </div>
                        </div>
                      </div>

                      {/* Plan 2: 1 Month */}
                      <div 
                        onClick={() => setSelectedPlan('pro')}
                        className="p-6 rounded-2xl border-2 border-slate-100 hover:border-slate-200 transition-all cursor-pointer group"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-xl font-black text-slate-900">1 Month PRO</h4>
                            <p className="text-xs text-slate-500">Idéal pour tester la puissance de MJ NEXUS.</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-black text-slate-900">2 200 FCFA</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">FCFA 506.3 / WEEK</div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4">
                        <button 
                          onClick={() => {
                            setSelectedPlan('pro');
                            setShowPricingModal(false);
                            alert("Félicitations ! Vous avez activé le forfait PRO. Votre compte est maintenant protégé par l'Anti-Ban MJ Nexus.");
                          }}
                          className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black italic uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-200"
                        >
                          {t.marketing.checkout}
                        </button>
                        <p className="text-center text-[10px] text-slate-400 mt-4">{t.marketing.billingNote}</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        );

      case 'logistics':
        return (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-3xl font-black italic uppercase text-slate-900">Logistics & Moving</h2>
                <p className="text-sm text-slate-500">Services de livraison et déménagement innovants, rapides et sécurisés.</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-xl text-xs font-bold">
                <Truck size={16} /> LOGISTIQUE INTELLIGENTE MJ NEXUS
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {MOCK_LOGISTICS_SERVICES.map(service => (
                <div key={service.id} className="data-card p-8 group hover:border-amber-500 transition-all flex flex-col">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-amber-600 group-hover:text-white transition-all">
                      {service.icon === 'Package' ? <Package size={32} /> : <Truck size={32} />}
                    </div>
                    <div>
                      <h3 className="text-xl font-black italic uppercase tracking-tight text-slate-900">{service.title}</h3>
                      <p className="text-xs text-slate-500">{service.description}</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <span className="text-xs text-slate-500">Prix de base</span>
                      <span className="font-bold text-slate-900">{formatPrice(service.basePrice)}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <span className="text-xs text-slate-500">Prix par Km</span>
                      <span className="font-bold text-slate-900">{formatPrice(service.pricePerKm)}</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-6 border-t border-slate-100">
                    <button 
                      onClick={() => alert(`Demande de devis pour ${service.title} envoyée. Un conseiller logistique vous contactera pour évaluer la distance et le volume.`)}
                      className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-amber-600 transition-all shadow-lg"
                    >
                      Obtenir un devis instantané
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="data-card p-6 border-amber-100 bg-amber-50/30">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-amber-600 mb-4 shadow-sm">
                  <Globe size={20} />
                </div>
                <h4 className="font-bold text-slate-900 mb-2">Suivi Temps Réel</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed">Suivez votre colis ou votre déménagement en direct sur la carte MJ NEXUS.</p>
              </div>
              <div className="data-card p-6 border-amber-100 bg-amber-50/30">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-amber-600 mb-4 shadow-sm">
                  <Shield size={20} />
                </div>
                <h4 className="font-bold text-slate-900 mb-2">Assurance MJ Protect</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed">Tous vos biens sont assurés à 100% pendant le transport par notre partenaire MJ Assurance.</p>
              </div>
              <div className="data-card p-6 border-amber-100 bg-amber-50/30">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-amber-600 mb-4 shadow-sm">
                  <Cpu size={20} />
                </div>
                <h4 className="font-bold text-slate-900 mb-2">Emballage Intelligent</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed">Utilisation de capteurs IoT pour surveiller la température et les chocs éventuels.</p>
              </div>
            </div>
          </div>
        );

      case 'social':
        const handlePublishPost = () => {
          if (newPostText.trim().length === 0) return;
          const newPost = {
            id: Date.now().toString(),
            user: 'Joël Mikam',
            text: newPostText,
            image: newPostImage,
            likes: 0,
            comments: 0,
            timestamp: 'Just now'
          };
          setPosts([newPost, ...posts]);
          setNewPostText('');
          setNewPostImage(null);
          setIsComposing(false);
        };

        const handleImageUpload = () => {
          // Simulate image upload
          setNewPostImage(`https://picsum.photos/seed/${Date.now()}/800/600`);
        };

        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Compose Section */}
              <div className="data-card overflow-hidden transition-all duration-300">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-100">JM</div>
                  <div className="flex-1 space-y-4">
                    <textarea 
                      value={newPostText}
                      onChange={(e) => setNewPostText(e.target.value.slice(0, 280))}
                      onFocus={() => setIsComposing(true)}
                      placeholder="Share your winning strategy or market insights..." 
                      className={`w-full bg-slate-50 border border-slate-200 rounded-xl p-4 focus:outline-none focus:border-emerald-500 transition-all resize-none ${isComposing ? 'h-32' : 'h-12'}`}
                    />
                    
                    <AnimatePresence>
                      {isComposing && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex items-center justify-between pt-2"
                        >
                          <div className="flex items-center gap-4">
                            <button 
                              onClick={handleImageUpload}
                              className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors text-xs font-bold"
                            >
                              <ImageIcon size={18} />
                              <span>Photo</span>
                            </button>
                            <button className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors text-xs font-bold">
                              <Paperclip size={18} />
                              <span>File</span>
                            </button>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <span className={`text-[10px] font-black ${newPostText.length >= 250 ? 'text-rose-500' : 'text-slate-400'}`}>
                              {newPostText.length} / 280
                            </span>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => { setIsComposing(false); setNewPostText(''); setNewPostImage(null); }}
                                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700"
                              >
                                Cancel
                              </button>
                              <button 
                                onClick={handlePublishPost}
                                disabled={newPostText.trim().length === 0}
                                className="bg-emerald-500 text-white px-6 py-2 rounded-xl font-bold text-xs hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100 disabled:opacity-50 disabled:shadow-none"
                              >
                                Publish
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {newPostImage && (
                      <div className="relative rounded-xl overflow-hidden group">
                        <img src={newPostImage} alt="Upload preview" className="w-full h-48 object-cover" />
                        <button 
                          onClick={() => setNewPostImage(null)}
                          className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Feed */}
              <div className="space-y-6">
                {posts.map(post => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={post.id} 
                    className="data-card hover:border-slate-300 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-bold border border-slate-200">
                          {post.user.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{post.user}</div>
                          <div className="text-[10px] text-slate-500 font-medium">{post.timestamp || '2 hours ago'}</div>
                        </div>
                      </div>
                      <button className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 rounded-lg transition-colors">
                        <Settings size={16} />
                      </button>
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed mb-4">{post.text}</p>
                    
                    {(post as any).image && (
                      <div className="mb-4 rounded-2xl overflow-hidden border border-slate-100">
                        <img src={(post as any).image} alt="Post content" className="w-full h-auto max-h-96 object-cover" />
                      </div>
                    )}

                    <div className="flex items-center gap-6 text-slate-500 pt-4 border-t border-slate-50">
                      <button className="flex items-center gap-2 hover:text-emerald-500 transition-colors group">
                        <Star size={18} className="group-hover:fill-emerald-500 transition-all" />
                        <span className="text-xs font-bold">{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-emerald-500 transition-colors group">
                        <MessageSquare size={18} className="group-hover:fill-emerald-500 transition-all" />
                        <span className="text-xs font-bold">{post.comments}</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-emerald-500 transition-colors ml-auto">
                        <Megaphone size={18} />
                        <span className="text-xs font-bold">Share</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="data-card">
                <h3 className="font-bold mb-4 text-sm uppercase tracking-wider text-slate-400">Trending Communities</h3>
                <div className="space-y-4">
                  {['Football Masters', 'NBA Strategy', 'Crypto Bettors'].map(group => (
                    <div key={group} className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                          <Users size={20} />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">{group}</div>
                          <div className="text-[10px] text-slate-500">1.2k members</div>
                        </div>
                      </div>
                      <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors">Join</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="data-card bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-none">
                <h3 className="font-bold mb-2">Verified Badge</h3>
                <p className="text-xs opacity-90 mb-4">Get the blue checkmark and increase your trust score in the marketplace.</p>
                <button className="w-full py-2 bg-white text-emerald-600 rounded-xl font-bold text-xs hover:bg-emerald-50 transition-colors">
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        );
      case 'rewards':
        const filteredChallenges = selectedChallengeCategory === 'All' 
          ? MOCK_CHALLENGES 
          : MOCK_CHALLENGES.filter(c => c.category === selectedChallengeCategory);

        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="data-card bg-gradient-to-br from-amber-400 to-amber-600 text-white border-none">
                <div className="flex justify-between items-start mb-4">
                  <Award size={32} />
                  <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full">LEVEL 14</span>
                </div>
                <h3 className="text-xl font-bold mb-1">Elite Challenger</h3>
                <p className="text-sm opacity-90 mb-4">250 XP to Level 15</p>
                <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                  <div className="bg-white h-full w-[75%]" />
                </div>
              </div>
              <div className="data-card bg-slate-900 text-white border-none">
                <div className="flex justify-between items-start mb-4">
                  <Target size={32} className="text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-400">DAILY</span>
                </div>
                <h3 className="text-xl font-bold mb-1">Daily Quests</h3>
                <p className="text-sm text-slate-400">Complete tasks to earn WORLD tokens.</p>
              </div>
              <div className="data-card">
                <div className="flex justify-between items-start mb-4">
                  <Coins size={32} className="text-amber-500" />
                  <button className="text-xs font-bold text-emerald-600">REDEEM</button>
                </div>
                <h3 className="text-xl font-bold mb-1 text-slate-900">1,240 WORLD</h3>
                <p className="text-sm text-slate-500">Platform loyalty tokens.</p>
              </div>
            </div>

            <div className="data-card">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 italic">ACTIVE CHALLENGES</h3>
                  <p className="text-sm text-slate-500">Participate and earn exclusive rewards across the ecosystem.</p>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                  {['All', 'Betting', 'Marketplace', 'Home Services', 'Social'].map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setSelectedChallengeCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${selectedChallengeCategory === cat ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredChallenges.map((challenge) => {
                  const isCompleted = challenge.progress === challenge.total;
                  const percentage = (challenge.progress / challenge.total) * 100;
                  
                  // Color mapping for reliability and specific shades
                  const colorMap: Record<string, { bg: string, text: string, bar: string, light: string }> = {
                    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', bar: 'bg-emerald-500', light: 'bg-emerald-500/10' },
                    blue: { bg: 'bg-blue-50', text: 'text-blue-600', bar: 'bg-blue-500', light: 'bg-blue-500/10' },
                    amber: { bg: 'bg-amber-50', text: 'text-amber-600', bar: 'bg-amber-500', light: 'bg-amber-500/10' },
                    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', bar: 'bg-indigo-500', light: 'bg-indigo-500/10' },
                    rose: { bg: 'bg-rose-50', text: 'text-rose-600', bar: 'bg-rose-500', light: 'bg-rose-500/10' },
                    cyan: { bg: 'bg-cyan-50', text: 'text-cyan-600', bar: 'bg-cyan-500', light: 'bg-cyan-500/10' },
                  };
                  
                  const colors = colorMap[challenge.color] || colorMap.emerald;

                  return (
                    <div key={challenge.id} className="group p-6 bg-white rounded-3xl border border-slate-100 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/5 transition-all relative overflow-hidden">
                      <div className={`absolute top-0 right-0 w-32 h-32 ${colors.light} rounded-full -mr-16 -mt-16 blur-2xl group-hover:opacity-100 opacity-50 transition-all`} />
                      
                      <div className="flex items-start gap-4 relative z-10">
                        <div className={`p-4 rounded-2xl ${colors.bg} ${colors.text} group-hover:scale-110 transition-transform shadow-sm`}>
                          <challenge.icon size={28} />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              <span className={`text-[10px] font-bold uppercase tracking-wider ${colors.text} mb-1 block`}>{challenge.category}</span>
                              <h4 className="font-bold text-slate-900 text-lg">{challenge.title}</h4>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-black text-emerald-600">+{challenge.reward}</div>
                              <div className="text-[10px] font-bold text-slate-400 uppercase">WORLD</div>
                            </div>
                          </div>
                          <p className="text-sm text-slate-500 mb-4 line-clamp-2">{challenge.desc}</p>
                          
                          <div className="space-y-3">
                            <div className="flex justify-between items-end">
                              <div className="text-xs font-bold text-slate-400">
                                Progress <span className="text-slate-900 ml-1">{challenge.progress} / {challenge.total}</span>
                              </div>
                              <div className={`text-xs font-black ${isCompleted ? 'text-emerald-500' : 'text-slate-400'}`}>
                                {Math.round(percentage)}%
                              </div>
                            </div>
                            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-50">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className={`${colors.bar} h-full rounded-full relative shadow-sm`}
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                              </motion.div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <button 
                        className={`w-full mt-6 py-4 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                          isCompleted 
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200 hover:bg-emerald-600' 
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {isCompleted ? (
                          <>
                            <CheckCircle size={16} />
                            Claim Reward
                          </>
                        ) : (
                          'View Details'
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>

              {filteredChallenges.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <Target size={32} />
                  </div>
                  <h4 className="font-bold text-slate-900">No challenges found</h4>
                  <p className="text-sm text-slate-500">Try selecting a different category.</p>
                </div>
              )}
            </div>

            {/* Referral Program Section */}
            <div className="data-card bg-slate-900 text-white border-none overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-32 -mt-32 blur-3xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-emerald-500 rounded-2xl text-white shadow-lg shadow-emerald-500/20">
                    <Users size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black italic uppercase tracking-tight">Referral Program</h3>
                    <p className="text-sm text-slate-400">Invite friends and earn rewards together.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Your Referral Code</div>
                        <div className="flex items-center justify-between gap-4">
                          <code className="text-xl font-black text-emerald-400 tracking-wider">
                            {referralInfo?.referralCode || 'LOGIN_REQUIRED'}
                          </code>
                          <button 
                            onClick={() => {
                              if (referralInfo?.referralCode) {
                                navigator.clipboard.writeText(referralInfo.referralCode);
                                alert('Code copied!');
                              } else {
                                setShowAuthModal(true);
                              }
                            }}
                            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                          >
                            <History size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Rewards Earned</div>
                        <div className="text-2xl font-black text-white">
                          {referralInfo ? formatPrice(referralInfo.totalRewards) : formatPrice(0)}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">How it works</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                          { step: '01', title: 'Share Code', desc: 'Send your unique code to friends.' },
                          { step: '02', title: 'They Join', desc: 'They enter your code during signup.' },
                          { step: '03', title: 'Get Paid', desc: 'You both receive instant bonuses!' }
                        ].map(item => (
                          <div key={item.step} className="space-y-1">
                            <div className="text-emerald-500 font-black text-lg">{item.step}</div>
                            <div className="font-bold text-sm">{item.title}</div>
                            <div className="text-xs text-slate-400 leading-relaxed">{item.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-3xl p-6 border border-white/10 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Referral Stats</h4>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-400">Successful Invites</span>
                          <span className="font-black text-lg">{referralInfo?.referralsCount || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-400">Pending Invites</span>
                          <span className="font-black text-lg">0</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-400">Conversion Rate</span>
                          <span className="font-black text-lg text-emerald-400">100%</span>
                        </div>
                      </div>
                    </div>
                    <button className="w-full mt-6 py-4 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20">
                      Invite Friends Now
                    </button>
                  </div>
                </div>

                {referralInfo?.referrals?.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-white/10">
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Recent Referrals</h4>
                    <div className="space-y-2">
                      {referralInfo.referrals.map((ref: any) => (
                        <div key={ref.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 font-bold text-xs">
                              {ref.referred_username[0].toUpperCase()}
                            </div>
                            <div>
                              <div className="text-sm font-bold">{ref.referred_username}</div>
                              <div className="text-[10px] text-slate-500">{new Date(ref.created_at).toLocaleDateString()}</div>
                            </div>
                          </div>
                          <div className="text-emerald-400 font-black text-sm">+{formatPrice(ref.reward_amount)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'crypto':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3 space-y-6">
                {/* Main Chart Area */}
                <div className="data-card p-6 min-h-[400px] flex flex-col">
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                        <Bitcoin size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold">Bitcoin / USDT</h3>
                          <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">+2.45%</span>
                        </div>
                        <div className="text-2xl font-black text-slate-900">{formatPriceWithDecimals(64250.50)}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {['1H', '1D', '1W', '1M', 'ALL'].map(t => (
                        <button key={t} className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${t === '1D' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex-1 w-full min-h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={MOCK_CHART_DATA}>
                        <defs>
                          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Tooltip 
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Area type="monotone" dataKey="price" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Market List */}
                <div className="data-card overflow-hidden p-0">
                  <div className="p-6 border-b border-slate-100">
                    <h3 className="font-bold">Market Overview</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50">
                          <th className="px-6 py-4">Asset</th>
                          <th className="px-6 py-4">Price</th>
                          <th className="px-6 py-4">24h Change</th>
                          <th className="px-6 py-4">Market Cap</th>
                          <th className="px-6 py-4">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {MOCK_CRYPTO.map(coin => (
                          <tr key={coin.id} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ backgroundColor: coin.color }}>
                                  {coin.symbol[0]}
                                </div>
                                <div>
                                  <div className="font-bold text-sm">{coin.name}</div>
                                  <div className="text-[10px] text-slate-400">{coin.symbol}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 font-mono text-sm font-bold">{formatPrice(coin.price)}</td>
                            <td className="px-6 py-4">
                              <div className={`flex items-center gap-1 text-xs font-bold ${coin.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {coin.change >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                {Math.abs(coin.change)}%
                              </div>
                            </td>
                            <td className="px-6 py-4 text-xs text-slate-500 font-medium">{formatPrice(1200000000000)}</td>
                            <td className="px-6 py-4">
                              <button className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-emerald-600 transition-all">Trade</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Trade Panel */}
                <div className="data-card">
                  <div className="flex gap-2 p-1 bg-slate-100 rounded-xl mb-6">
                    <button className="flex-1 py-2 text-xs font-bold rounded-lg bg-white shadow-sm text-emerald-600">BUY</button>
                    <button className="flex-1 py-2 text-xs font-bold rounded-lg text-slate-500 hover:bg-white/50">SELL</button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Amount to Spend</label>
                      <div className="relative">
                        <input type="number" placeholder="0.00" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 font-mono" />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-xs text-slate-400">USDT</span>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <div className="p-2 bg-slate-50 rounded-full text-slate-400">
                        <RefreshCw size={16} />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">You will receive</label>
                      <div className="relative">
                        <input type="number" placeholder="0.00" disabled className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono" />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-xs text-slate-400">BTC</span>
                      </div>
                    </div>
                    <div className="pt-4">
                      <button className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20">
                        Execute Trade
                      </button>
                    </div>
                  </div>
                </div>

                {/* AI Trading Signals */}
                <div className="data-card bg-slate-900 text-white border-none overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Cpu size={80} />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4 text-emerald-400">
                      <Sparkles size={18} />
                      <h3 className="font-bold">AI Signals</h3>
                    </div>
                    <div className="space-y-3">
                      {[
                        { pair: 'BTC/USDT', signal: 'STRONG BUY', confidence: 92 },
                        { pair: 'ETH/USDT', signal: 'HOLD', confidence: 64 },
                        { pair: 'WORLD/USDT', signal: 'BUY', confidence: 85 },
                      ].map((sig, i) => (
                        <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/10">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-bold">{sig.pair}</span>
                            <span className={`text-[10px] font-black ${sig.signal.includes('BUY') ? 'text-emerald-400' : 'text-amber-400'}`}>{sig.signal}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                              <div className="bg-emerald-500 h-full" style={{ width: `${sig.confidence}%` }} />
                            </div>
                            <span className="text-[10px] text-slate-500">{sig.confidence}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'marketplace':
        const filteredProducts = MOCK_PRODUCTS.filter(p => {
          const matchesCategory = selectedCategory === 'All Categories' || p.category === selectedCategory;
          const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                               p.seller.toLowerCase().includes(searchQuery.toLowerCase());
          return matchesCategory && matchesSearch;
        });

        return (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-3xl font-black italic">MJ Global Mall</h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold">
                    <Shield size={10} /> TRADE ASSURANCE
                  </div>
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-bold">
                    <CheckCircle size={10} /> VERIFIED SUPPLIERS
                  </div>
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-[10px] font-bold">
                    <PlaneTakeoff size={10} /> DRONE DELIVERY
                  </div>
                </div>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products or suppliers..." 
                    className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <button 
                  onClick={() => setActiveTab('my-shop')}
                  className="bg-emerald-500 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 whitespace-nowrap"
                >
                  <Store size={16} />
                  Sell on MJ NEXUS
                </button>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
              {['All Categories', 'Electronics', 'Apparel', 'Equipment', 'Digital', 'Groceries', 'Beauty'].map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 border rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-500'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <div key={product.id} className="data-card group cursor-pointer flex flex-col h-full">
                  <div className="relative aspect-square rounded-xl overflow-hidden mb-4">
                    <img src={product.image} alt={product.name} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      <div className={`px-2 py-1 rounded-lg text-[10px] font-bold text-white ${product.type === 'B2B' ? 'bg-blue-600' : 'bg-emerald-600'}`}>
                        {product.type}
                      </div>
                    </div>
                    {product.isVerified && (
                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur p-1 rounded-full text-blue-600 shadow-sm">
                        <CheckCircle size={14} />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500 mb-1">
                      <Star size={10} fill="currentColor" /> {product.rating}
                    </div>
                    <h3 className="font-bold text-slate-900 mb-1 line-clamp-2 leading-tight">{product.name}</h3>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-3">
                      <span className="font-bold text-slate-700">{product.seller}</span>
                      {product.isVerified && <span className="text-blue-500 font-bold">Verified</span>}
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-xl font-black text-slate-900">{formatPrice(product.price)}</span>
                      <span className="text-[10px] text-slate-400">/ piece</span>
                    </div>
                    <div className="text-[10px] font-bold text-slate-500 mb-4">
                      Min. Order: {product.moq} {product.moq > 1 ? 'pieces' : 'piece'}
                    </div>

                    {/* AI Product Insights */}
                    <div className="mb-4 border-t border-slate-100 pt-3">
                      {productInsights[product.id] ? (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="bg-emerald-50/50 rounded-xl p-2.5 border border-emerald-100/50"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1 text-emerald-600">
                              <Sparkles size={12} />
                              <span className="text-[9px] font-black uppercase tracking-wider">AI Insight</span>
                            </div>
                            <button 
                              onClick={() => fetchProductInsights(product)}
                              disabled={isAnalyzingProduct === product.id}
                              className="p-1 hover:bg-emerald-100 text-slate-400 hover:text-emerald-600 rounded transition-colors disabled:opacity-50"
                            >
                              <RefreshCw size={10} className={isAnalyzingProduct === product.id ? 'animate-spin' : ''} />
                            </button>
                          </div>
                          <div className="space-y-1.5">
                            <div className="text-[10px] leading-tight text-slate-700">
                              <span className="font-bold text-emerald-700">Demand:</span> {productInsights[product.id].marketDemand}
                            </div>
                            <div className="text-[10px] leading-tight text-slate-700">
                              <span className="font-bold text-emerald-700">AI Price:</span> {formatPrice(productInsights[product.id].suggestedPrice)}
                            </div>
                            <div className="text-[10px] leading-tight text-slate-700 italic">
                              "{productInsights[product.id].competitiveAdvantage}"
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <button 
                          onClick={() => fetchProductInsights(product)}
                          disabled={isAnalyzingProduct === product.id}
                          className="w-full py-1.5 bg-slate-50 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-dashed border-slate-200"
                        >
                          {isAnalyzingProduct === product.id ? (
                            <RefreshCw size={10} className="animate-spin" />
                          ) : (
                            <Sparkles size={10} />
                          )}
                          {isAnalyzingProduct === product.id ? 'Analyzing...' : 'Get AI Insights'}
                        </button>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          ReactGA.event({
                            category: 'Marketplace',
                            action: product.type === 'B2B' ? 'Contact Supplier' : 'Buy Now',
                            label: product.name,
                            value: Math.round(product.price)
                          });
                        }}
                        className="flex-1 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all"
                      >
                        {product.type === 'B2B' ? 'Contact Supplier' : 'Buy Now'}
                      </button>
                      <button 
                        onClick={() => {
                          ReactGA.event({
                            category: 'Marketplace',
                            action: 'Cotiser',
                            label: product.name
                          });
                        }}
                        className="px-3 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-bold hover:bg-emerald-100 transition-all flex flex-col items-center justify-center leading-none"
                      >
                        <Coins size={12} />
                        <span>Cotiser</span>
                      </button>
                      <button 
                        onClick={() => {
                          ReactGA.event({
                            category: 'Marketplace',
                            action: 'Add to Cart',
                            label: product.name
                          });
                        }}
                        className="p-2 bg-slate-100 rounded-xl text-slate-600 hover:bg-emerald-500 hover:text-white transition-all"
                      >
                        <ShoppingBag size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="data-card bg-slate-900 text-white border-none">
              <div className="flex items-center gap-3 mb-6">
                <Briefcase className="text-emerald-400" />
                <h3 className="text-xl font-bold">Professional Services</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: 'Personal Betting Coach', provider: 'Alex Pro', price: 25, rating: 4.9 },
                  { title: 'Data Analysis Report', provider: 'StatsMaster', price: 15, rating: 4.8 },
                  { title: 'Custom Prediction Bot', provider: 'CodeBet', price: 150, rating: 5.0 },
                ].map((service, i) => (
                  <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                    <div className="font-bold mb-1">{service.title}</div>
                    <div className="text-xs text-slate-400 mb-4">By {service.provider}</div>
                    <div className="flex justify-between items-center">
                      <div className="text-emerald-400 font-bold">{formatPrice(service.price)}/hr</div>
                      <div className="flex items-center gap-1 text-amber-400 text-xs">
                        <Star size={12} fill="currentColor" />
                        {service.rating}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Banner */}
            <div className="data-card bg-gradient-to-r from-slate-900 to-slate-800 text-white border-none p-8 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-emerald-400">
                  <Shield size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">MJ Trade Assurance</h3>
                  <p className="text-slate-400 text-sm max-w-md">Protect your MJ NEXUS orders from payment to delivery. Secure escrow payments and verified suppliers.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="text-2xl font-black text-emerald-400">100%</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Payment Protection</div>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="text-center">
                  <div className="text-2xl font-black text-emerald-400">24/7</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Support</div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'help':
        return <HelpPage />;
      case 'privacy':
        return (
          <div className="max-w-4xl mx-auto px-4 py-12">
            <PrivacyCenter />
          </div>
        );
      case 'my-shop':
        return (
          <div className="space-y-6">
            {!myShop ? (
              <div className="data-card text-center py-16">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Store size={40} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Start Your Professional Shop</h2>
                <p className="text-slate-500 max-w-md mx-auto mb-8">
                  Join the MJ NEXUS marketplace. Sell products, services, or betting insights to a global audience.
                </p>
                <button 
                  onClick={() => setMyShop({ name: 'Joël\'s Elite Store', sales: 0, products: [] })}
                  className="bg-emerald-500 text-white px-8 py-3 rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200"
                >
                  Create Shop Now
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-3xl font-black italic">{myShop.name}</h2>
                    <p className="text-slate-500">Shop Dashboard & Management</p>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all">
                      <Settings size={16} />
                      Shop Settings
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 transition-all">
                      <Plus size={16} />
                      Add Product
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatCard label="Total Sales" value={formatPrice(myShop.sales)} trend={0} icon={TrendingUp} />
                  <StatCard label="Platform Commission" value="12%" trend={0} icon={Shield} />
                  <StatCard label="Active Promotions" value="2" trend={0} icon={Megaphone} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="data-card">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold">Inventory Management</h3>
                      <span className="text-xs font-bold text-slate-400">3 PRODUCTS</span>
                    </div>
                    <div className="space-y-4">
                      {MOCK_PRODUCTS.map(p => (
                        <div key={p.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <img src={p.image} className="w-12 h-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
                          <div className="flex-1">
                            <div className="font-bold text-sm">{p.name}</div>
                            <div className="text-xs text-slate-500">{formatPrice(p.price)}</div>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={async () => {
                                setIsOptimizing(true);
                                const result = await geminiService.optimizeProductListing(p.name, "A great product for bettors.");
                                alert(`AI Optimization Suggestion:\nTitle: ${result.optimizedTitle}\nDescription: ${result.optimizedDescription}`);
                                setIsOptimizing(false);
                              }}
                              className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-all"
                              title="Optimize with AI"
                            >
                              <Sparkles size={16} />
                            </button>
                            <button className="p-2 text-slate-400 hover:bg-slate-200 rounded-lg transition-all">
                              <Settings size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="data-card">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold">Promotion & Ads</h3>
                      <span className="bg-amber-100 text-amber-600 text-[10px] font-bold px-2 py-1 rounded-full">FREE TRIAL AVAILABLE</span>
                    </div>
                    <div className="p-6 bg-slate-900 rounded-2xl text-white mb-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-emerald-500 rounded-lg">
                          <Megaphone size={20} />
                        </div>
                        <div>
                          <div className="font-bold">Boost Your Sales</div>
                          <div className="text-xs text-slate-400">Targeted AI Advertising</div>
                        </div>
                      </div>
                      <p className="text-sm text-slate-400 mb-6">
                        Reach 50,000+ active bettors in your region. Our AI targets users most likely to buy your products.
                      </p>
                      <div className="flex gap-3">
                        <button className="flex-1 py-3 bg-emerald-500 rounded-xl font-bold text-sm hover:bg-emerald-600 transition-all">
                          Start 7-Day Free Trial
                        </button>
                        <button className="flex-1 py-3 bg-white/10 rounded-xl font-bold text-sm hover:bg-white/20 transition-all">
                          View Plans
                        </button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Targeting Insights</h4>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm">
                        <div className="flex justify-between mb-1">
                          <span className="text-slate-500">Top Audience</span>
                          <span className="font-bold">European Football Fans</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Suggested Keywords</span>
                          <span className="font-bold">Champions League, Betting Tips</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case 'ecosystem':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="data-card bg-emerald-500 text-white border-none">
                <h3 className="text-xl font-bold mb-2">Development Partners</h3>
                <p className="text-sm opacity-90 mb-4">Core technical competencies required for MJ NEXUS scaling.</p>
                <ul className="space-y-2 text-sm font-medium">
                  <li className="flex items-center gap-2"><ChevronRight size={14} /> Full-Stack (Node.js/React)</li>
                  <li className="flex items-center gap-2"><ChevronRight size={14} /> Blockchain Engineers</li>
                  <li className="flex items-center gap-2"><ChevronRight size={14} /> AI/ML Specialists</li>
                </ul>
              </div>
              <div className="data-card bg-slate-900 text-white border-none">
                <h3 className="text-xl font-bold mb-2">Financial Network</h3>
                <p className="text-sm opacity-90 mb-4">Key institutions for global payment processing.</p>
                <ul className="space-y-2 text-sm font-medium">
                  <li className="flex items-center gap-2 text-emerald-400"><ChevronRight size={14} /> MTN / Airtel (Mobile Money)</li>
                  <li className="flex items-center gap-2 text-emerald-400"><ChevronRight size={14} /> Stripe / PayPal (International)</li>
                  <li className="flex items-center gap-2 text-emerald-400"><ChevronRight size={14} /> Binance / Coinbase (Crypto)</li>
                </ul>
              </div>
              <div className="data-card bg-white border-slate-200">
                <h3 className="text-xl font-bold mb-2 text-slate-900">Legal & Compliance</h3>
                <p className="text-sm text-slate-500 mb-4">Regulatory bodies and security standards.</p>
                <ul className="space-y-2 text-sm font-medium text-slate-700">
                  <li className="flex items-center gap-2"><ChevronRight size={14} className="text-emerald-500" /> Gaming Commissions</li>
                  <li className="flex items-center gap-2"><ChevronRight size={14} className="text-emerald-500" /> KYC/AML Providers</li>
                  <li className="flex items-center gap-2"><ChevronRight size={14} className="text-emerald-500" /> Cyber-Security Audits</li>
                </ul>
              </div>
            </div>

            <div className="data-card">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Video className="text-emerald-500" /> Services Vidéo IA (Veo)
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <p className="text-sm text-slate-500">
                    Utilisez la puissance de **Google Veo** pour générer des vidéos cinématiques à partir de simples descriptions textuelles. Idéal pour vos campagnes marketing ou présentations de produits.
                  </p>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Description de la vidéo</label>
                    <textarea 
                      value={videoPrompt}
                      onChange={(e) => setVideoPrompt(e.target.value)}
                      placeholder="Ex: Un drone survolant une ville futuriste au coucher du soleil, style cinématographique..."
                      className="w-full h-32 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:outline-none focus:border-emerald-500 resize-none"
                    />
                  </div>
                  <button 
                    onClick={handleGenerateVideo}
                    disabled={isVideoGenerating || !videoPrompt.trim()}
                    className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black text-sm hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isVideoGenerating ? <RefreshCw className="animate-spin" size={18} /> : <Sparkles size={18} />}
                    {isVideoGenerating ? 'GÉNÉRATION EN COURS...' : 'GÉNÉRER LA VIDÉO'}
                  </button>
                  {videoGenerationStatus && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[10px] font-bold text-slate-500 flex items-center gap-2">
                      <Activity size={12} className={isVideoGenerating ? 'animate-pulse text-emerald-500' : ''} />
                      {videoGenerationStatus}
                    </div>
                  )}
                </div>

                <div className="bg-slate-900 rounded-3xl aspect-video flex items-center justify-center overflow-hidden border-4 border-slate-800 shadow-2xl relative">
                  {generatedVideoUrl ? (
                    <video 
                      src={generatedVideoUrl} 
                      controls 
                      className="w-full h-full object-cover"
                      autoPlay
                      loop
                    />
                  ) : (
                    <div className="text-center p-8">
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Video size={32} className="text-slate-700" />
                      </div>
                      <p className="text-slate-500 text-xs font-medium">
                        {isVideoGenerating ? 'Votre chef-d\'œuvre est en cours de création...' : 'Votre vidéo apparaîtra ici après la génération.'}
                      </p>
                    </div>
                  )}
                  {isVideoGenerating && (
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Génération...</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="data-card">
              <h3 className="text-2xl font-bold mb-6">Project Roadmap 2026</h3>
              <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                {[
                  { q: 'Q1', title: 'Global Launch', desc: 'Deployment of the multi-lingual web and mobile platforms across 5 continents.' },
                  { q: 'Q2', title: 'AI Integration', desc: 'Launch of predictive betting tools and automated fraud detection systems.' },
                  { q: 'Q3', title: 'Marketplace Expansion', desc: 'Opening of the professional shop ecosystem for sports-related vendors.' },
                  { q: 'Q4', title: 'Banking License', desc: 'Integration of full online banking services and virtual card issuance.' },
                ].map((item, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-200 group-[.is-active]:bg-emerald-500 text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      <Zap size={16} />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[45%] p-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
                      <div className="flex items-center justify-between space-x-2 mb-1">
                        <div className="font-bold text-slate-900">{item.title}</div>
                        <time className="font-mono text-xs font-bold text-emerald-600">{item.q}</time>
                      </div>
                      <div className="text-slate-500 text-sm">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'servisecur':
        return (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-3xl font-black italic text-slate-900 flex items-center gap-2">
                  <Shield className="text-emerald-500" /> SERVISÉCUR
                </h2>
                <p className="text-slate-500 text-sm italic">"Sécurité, Traçabilité et Qualité des Services à Domicile"</p>
              </div>
              <div className="flex gap-3">
                {userRole >= 3 && (
                  <button 
                    onClick={() => setActiveTab('admin-levels')}
                    className="px-6 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all flex items-center gap-2"
                  >
                    <Settings size={18} /> Management
                  </button>
                )}
                <button 
                  onClick={() => setShowBookingModal(true)}
                  className="bg-emerald-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-200 flex items-center gap-2 hover:bg-emerald-600 transition-all"
                >
                  <Plus size={20} /> Commander une Intervention
                </button>
              </div>
            </div>

            {/* User's Active Interventions (L1, L2) */}
            {userRole <= 2 && (
              <div className="data-card bg-emerald-50 border-emerald-100">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-emerald-900 flex items-center gap-2">
                    <Activity size={18} /> Mes Interventions en Cours
                  </h3>
                  <span className="text-[10px] font-bold bg-emerald-500 text-white px-2 py-1 rounded-full">2 ACTIVES</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: 'INT-882', service: 'Plomberie', tech: 'Moussa T.', status: 'En route', time: '15 min' },
                    { id: 'INT-885', service: 'Électricité', tech: 'Jean-Paul K.', status: 'Planifié', time: 'Demain 10h' },
                  ].map(int => (
                    <div key={int.id} className="p-4 bg-white rounded-2xl border border-emerald-100 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                          <Wrench size={20} />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-slate-900">{int.service} - {int.id}</div>
                          <div className="text-[10px] text-slate-500">Technicien: {int.tech}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-bold text-emerald-600 uppercase">{int.status}</div>
                        <div className="text-[10px] text-slate-400">{int.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Executive Summary Section */}
            <div className="data-card bg-white border-slate-200">
              <h3 className="font-bold mb-4 text-slate-900">Résumé Exécutif</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Servisécur est une plateforme digitale innovante destinée à connecter des clients avec des techniciens qualifiés, tout en garantissant une sécurité, un suivi et une traçabilité optimale des interventions. Grâce à des outils technologiques avancés (géolocalisation, drones, identification rigoureuse, évaluation en temps réel), Servisécur assure la qualité, la fiabilité et la sécurité des services à domicile et de contrôle de projets.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><MapPin size={20} /></div>
                  <div>
                    <div className="text-xs font-bold">Villes Cibles</div>
                    <div className="text-[10px] text-slate-500">Douala, Yaoundé et extension prévue</div>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Shield size={20} /></div>
                  <div>
                    <div className="text-xs font-bold">Objectif Majeur</div>
                    <div className="text-[10px] text-slate-500">Réduire l'insécurité et le manque de transparence</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats / Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard label="Interventions Actives" value="12" trend={8} icon={Activity} />
              <StatCard label="Drones en Mission" value="3" trend={15} icon={PlaneTakeoff} />
              <StatCard label="Techniciens Vérifiés" value="145" trend={4} icon={CheckCircle} />
              <StatCard label="Documents Sécurisés" value="1,240" trend={12} icon={FileText} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Services & Tracking */}
              <div className="lg:col-span-2 space-y-8">
                {/* Service Categories */}
                <div className="data-card">
                  <h3 className="font-bold mb-6 flex items-center gap-2">
                    <Wrench size={18} className="text-slate-400" /> Catégories de Services
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { name: 'Plomberie', icon: Wrench, color: 'bg-blue-50 text-blue-600' },
                      { name: 'Électricité', icon: Zap, color: 'bg-amber-50 text-amber-600' },
                      { name: 'Informatique', icon: Cpu, color: 'bg-indigo-50 text-indigo-600' },
                      { name: 'Climatisation', icon: RefreshCw, color: 'bg-cyan-50 text-cyan-600' },
                      { name: 'Maçonnerie', icon: HardHat, color: 'bg-orange-50 text-orange-600' },
                      { name: 'Peinture', icon: Sparkles, color: 'bg-rose-50 text-rose-600' },
                      { name: 'Sécurité', icon: Shield, color: 'bg-slate-50 text-slate-600' },
                      { name: 'Drone Pro', icon: PlaneTakeoff, color: 'bg-emerald-50 text-emerald-600' },
                    ].map((cat, i) => (
                      <button key={i} className="flex flex-col items-center gap-3 p-4 rounded-2xl border border-slate-100 hover:border-emerald-500 transition-all group">
                        <div className={`p-3 rounded-xl ${cat.color} group-hover:scale-110 transition-transform`}>
                          <cat.icon size={24} />
                        </div>
                        <span className="text-xs font-bold text-slate-700">{cat.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Available Technicians */}
                <div className="data-card">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold flex items-center gap-2">
                      <Users size={18} className="text-slate-400" /> Techniciens Disponibles
                    </h3>
                    <button className="text-xs font-bold text-emerald-600 hover:underline">Voir Tout</button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {MOCK_TECHNICIANS.filter(t => t.status === 'Available').map(tech => (
                      <div key={tech.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4 group hover:border-emerald-500 transition-all">
                        <div className="relative">
                          <img src={tech.image} className="w-16 h-16 rounded-2xl object-cover" />
                          {tech.verified && (
                            <div className="absolute -top-2 -right-2 bg-emerald-500 text-white p-1 rounded-full border-2 border-white">
                              <CheckCircle size={10} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-sm text-slate-900 truncate">{tech.name}</div>
                          <div className="text-[10px] font-bold text-emerald-600 uppercase mb-1">{tech.skill}</div>
                          <div className="flex items-center gap-1 mb-2">
                            <Star size={10} className="text-amber-500 fill-amber-500" />
                            <span className="text-[10px] font-bold text-slate-700">{tech.rating}</span>
                            <span className="text-[10px] text-slate-400 ml-1">• {tech.location}</span>
                          </div>
                          <button 
                            onClick={() => {
                              const mapping: Record<string, string> = {
                                'Master Plumber': 'Plomberie',
                                'Electrician': 'Électricité',
                                'IT Specialist': 'Informatique',
                                'AC Technician': 'Climatisation'
                              };
                              initiateBooking(mapping[tech.skill] || tech.skill);
                            }}
                            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-bold text-slate-700 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all flex items-center gap-2"
                          >
                            <Plus size={12} /> Réserver Maintenant
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live Tracking Map (Interactive Google Maps) */}
                <div className="data-card bg-slate-900 text-white border-none min-h-[500px] relative overflow-hidden p-0">
                  <div className="absolute top-6 left-6 z-10 bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-2xl">
                    <div className="flex justify-between items-center mb-4 gap-8">
                      <h3 className="font-bold flex items-center gap-2">
                        <Navigation size={18} className="text-emerald-400" /> Suivi Géolocalisé Servisécur
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-xs font-bold text-emerald-400">LIVE</span>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full border border-white" />
                        <span className="text-[10px] font-bold text-slate-300">Techniciens</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full border border-white" />
                        <span className="text-[10px] font-bold text-slate-300">Drones</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full h-[500px]">
                    <TechnicianMap technicians={MOCK_TECHNICIANS} drones={MOCK_DRONE_MISSIONS} />
                  </div>

                  <div className="absolute bottom-6 left-6 right-6 z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {MOCK_TECHNICIANS.filter(t => t.status === 'On Mission').map(t => (
                        <div key={t.id} className="p-3 bg-slate-900/80 backdrop-blur-md rounded-xl border border-white/10 flex items-center gap-3 shadow-xl">
                          <img src={t.image} className="w-10 h-10 rounded-full object-cover border border-white/20" />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold truncate">{t.name}</div>
                            <div className="text-[10px] text-slate-400">En route vers {t.location.split(' - ')[1]}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-[10px] font-bold text-emerald-400">4 min</div>
                            <div className="text-[10px] text-slate-500 uppercase font-black">ETA</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Drones & Documents */}
              <div className="space-y-8">
                {/* Drone Monitoring */}
                <div className="data-card">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold flex items-center gap-2">
                      <PlaneTakeoff size={18} className="text-slate-400" /> Contrôle Drone
                    </h3>
                    <button className="text-xs font-bold text-emerald-600 hover:underline">Voir Tout</button>
                  </div>
                  <div className="space-y-4">
                    {MOCK_DRONE_MISSIONS.map(mission => (
                      <div key={mission.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="font-bold text-sm">{mission.project}</div>
                            <div className="text-[10px] text-slate-500">{mission.location}</div>
                          </div>
                          <div className={`px-2 py-1 rounded-lg text-[10px] font-bold ${mission.status === 'Live' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-600'}`}>
                            {mission.status}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <Zap size={14} className="text-amber-500" />
                            <span className="text-xs font-bold">{mission.battery}%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Activity size={14} className="text-blue-500" />
                            <span className="text-xs font-bold">{mission.altitude}</span>
                          </div>
                        </div>
                        <button className="w-full py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
                          <Eye size={14} /> Accéder au Flux Vidéo
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Document Vault */}
                <div className="data-card">
                  <h3 className="font-bold mb-6 flex items-center gap-2">
                    <FileText size={18} className="text-slate-400" /> Coffre-fort Numérique
                  </h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Rapport_Intervention_P1.pdf', date: 'Aujourd\'hui', size: '2.4 MB' },
                      { name: 'Facture_Electricite_Oct.pdf', date: 'Hier', size: '1.1 MB' },
                      { name: 'Photos_Chantier_Drone.zip', date: '22 Oct', size: '45 MB' },
                    ].map((doc, i) => (
                      <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-100 rounded-lg text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                            <FileText size={16} />
                          </div>
                          <div>
                            <div className="text-xs font-bold truncate max-w-[120px]">{doc.name}</div>
                            <div className="text-[10px] text-slate-400">{doc.date} • {doc.size}</div>
                          </div>
                        </div>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-6 py-3 border-2 border-dashed border-slate-200 rounded-2xl text-xs font-bold text-slate-400 hover:border-emerald-500 hover:text-emerald-600 transition-all flex items-center justify-center gap-2">
                    <Plus size={16} /> Téléverser un Document
                  </button>
                </div>

                {/* Economic Model Info */}
                <div className="data-card bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-none">
                  <h3 className="font-bold mb-2">Devenir Technicien</h3>
                  <p className="text-xs text-emerald-100 mb-4 opacity-80">Rejoignez le réseau Servisécur et boostez votre activité avec nos outils pro.</p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2 text-[10px] font-bold">
                      <CheckCircle size={12} /> Commission de 10% seulement
                    </li>
                    <li className="flex items-center gap-2 text-[10px] font-bold">
                      <CheckCircle size={12} /> Accès aux missions Drones
                    </li>
                    <li className="flex items-center gap-2 text-[10px] font-bold">
                      <CheckCircle size={12} /> Paiements sécurisés garantis
                    </li>
                  </ul>
                  <button className="w-full py-3 bg-white text-emerald-600 rounded-xl text-xs font-bold hover:bg-emerald-50 transition-all">
                    S'inscrire Maintenant
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'fraud-control':
        return (
          <SecurityGate requiredLevel={3} currentLevel={userRole} isSessionVerified={isSecurityVerified} onVerify={() => setIsSecurityVerified(true)}>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-black italic">FRAUD DETECTION CENTER</h2>
                  <p className="text-slate-500">Monitoring and restriction management</p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      setIsAccountRestricted(false);
                      setRestrictionReason('');
                      alert('Toutes les restrictions ont été levées.');
                    }}
                    className="px-6 py-3 bg-emerald-500 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100"
                  >
                    Lift All Restrictions
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard label="Total Flagged" value={fraudLogs.length} icon={ShieldAlert} />
                <StatCard label="High Severity" value={fraudLogs.filter(l => l.severity === 'High').length} icon={Zap} />
                <StatCard label="Account Status" value={isAccountRestricted ? 'RESTRICTED' : 'SECURE'} icon={Shield} />
              </div>

              <div className="data-card">
                <h3 className="font-bold mb-6 flex items-center gap-2 text-slate-900">
                  <Activity size={20} className="text-rose-500" /> Real-time Fraud Logs
                </h3>
                <div className="space-y-4">
                  {fraudLogs.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 italic">No suspicious activity detected yet.</div>
                  ) : (
                    fraudLogs.map(log => (
                      <div key={log.id} className={`p-4 rounded-2xl border flex justify-between items-center ${
                        log.severity === 'High' ? 'bg-rose-50 border-rose-100' : 'bg-slate-50 border-slate-100'
                      }`}>
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-xl ${
                            log.severity === 'High' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white'
                          }`}>
                            <ShieldAlert size={20} />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{log.type}</div>
                            <div className="text-xs text-slate-500">{log.details}</div>
                            <div className="text-[10px] font-black text-slate-400 mt-1">{log.timestamp}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest ${
                            log.severity === 'High' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                          }`}>
                            {log.severity} SEVERITY
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </SecurityGate>
        );
      case 'admin-levels':
        return (
          <SecurityGate 
            requiredLevel={3} 
            currentLevel={userRole} 
            isSessionVerified={isSecurityVerified}
            onVerify={() => setIsSecurityVerified(true)}
          >
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-3xl font-black italic text-slate-900">
                    {userRole === 6 ? 'DIRECTOR GENERAL CONSOLE' : 
                     userRole === 5 ? 'REGIONAL MANAGEMENT' :
                     userRole === 4 ? 'COUNTRY OVERSIGHT' : 'SUPERVISOR CONSOLE'}
                  </h2>
                  <p className="text-slate-500 text-sm">
                    {userRole === 6 ? 'Continent-wide ecosystem oversight and global strategy.' : 
                     userRole === 5 ? 'Multi-country coordination and regional logistics.' :
                     userRole === 4 ? 'National performance, compliance, and user management.' : 'Local operations, logistics, and technician supervision.'}
                  </p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-2xl">
                  {['Overview', 'Users', 'Logistics', 'Audit'].map(tab => (
                    <button 
                      key={tab}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-900 transition-all"
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* High Level Oversight (L4, L5, L6) */}
              {userRole >= 4 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard 
                    label={userRole === 6 ? "Total Continent Users" : userRole === 5 ? "Regional Users" : "Country Users"} 
                    value={userRole === 6 ? "1.2M" : userRole === 5 ? "450K" : "125K"} 
                    trend={12} 
                    icon={Users} 
                  />
                  <StatCard 
                    label="Active Hubs" 
                    value={userRole === 6 ? "142" : userRole === 5 ? "45" : "12"} 
                    trend={5} 
                    icon={Store} 
                  />
                  <StatCard 
                    label="Revenue (24h)" 
                    value={userRole === 6 ? formatPrice(2400000) : userRole === 5 ? formatPrice(850000) : formatPrice(120000)} 
                    trend={8} 
                    icon={TrendingUp} 
                  />
                  <StatCard 
                    label="System Health" 
                    value="99.9%" 
                    trend={0.1} 
                    icon={Cpu} 
                  />
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  {/* Operations View (L3, L4) */}
                  {(userRole === 3 || userRole === 4) && (
                    <div className="data-card">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold flex items-center gap-2">
                          <RefreshCw size={18} className="text-emerald-500" /> Local Operations & Dispatch
                        </h3>
                        <button className="text-xs font-bold text-emerald-600 hover:underline">View All</button>
                      </div>
                      <div className="space-y-3">
                        {[
                          { id: 'ORD-101', client: 'M. Sali', status: 'Pending Dispatch', country: 'CM', item: 'Pro Betting Guide', time: '12m ago' },
                          { id: 'ORD-102', client: 'Mme. Kouassi', status: 'In Transit', country: 'CI', item: 'Premium Sports Jersey', time: '45m ago' },
                          { id: 'ORD-103', client: 'Jean D.', status: 'Assigned', country: 'SN', item: 'IT Intervention', time: '1h ago' },
                        ].map(ord => (
                          <div key={ord.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-all group">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-200 group-hover:border-emerald-200 transition-all">
                                <ShoppingBag size={20} className="text-slate-400 group-hover:text-emerald-500" />
                              </div>
                              <div>
                                <div className="font-bold text-sm">{ord.id} - {ord.client}</div>
                                <div className="text-[10px] text-slate-500">{ord.item} • {ord.country} • <span className="text-emerald-600 font-bold">{ord.time}</span></div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${ord.status === 'In Transit' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'}`}>
                                {ord.status}
                              </span>
                              <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-emerald-600 hover:border-emerald-600 transition-all">
                                <ChevronRight size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Regional/Global View (L5, L6) */}
                  {(userRole === 5 || userRole === 6) && (
                    <div className="data-card">
                      <h3 className="font-bold mb-6 flex items-center gap-2">
                        <Globe size={18} className="text-emerald-500" /> {userRole === 6 ? 'Continental Network Status' : 'Regional Performance'}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { name: 'Central Africa', hubs: 42, growth: 15, status: 'Stable' },
                          { name: 'West Africa', hubs: 68, growth: 24, status: 'High Growth' },
                          { name: 'North Africa', hubs: 32, growth: 8, status: 'Stable' },
                          { name: 'South Africa', hubs: 25, growth: 12, status: 'Optimizing' },
                        ].map(reg => (
                          <div key={reg.name} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="flex justify-between items-start mb-2">
                              <div className="font-bold text-sm text-slate-900">{reg.name}</div>
                              <span className="text-[10px] font-bold text-emerald-600">+{reg.growth}%</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-slate-500">{reg.hubs} Active Hubs</span>
                              <span className="text-slate-400 italic">{reg.status}</span>
                            </div>
                            <div className="mt-3 w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                              <div className="bg-emerald-500 h-full" style={{ width: `${reg.growth * 3}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Audit Logs (L3+) */}
                  {renderAuditLog()}
                </div>

                <div className="space-y-6">
                  {/* Management Actions */}
                  <div className="data-card">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                      <Shield size={18} className="text-indigo-500" /> Administrative Actions
                    </h3>
                    <div className="space-y-3">
                      {userRole >= 3 && (
                        <button className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200">
                          <UserCircle size={16} /> Manage Technicians
                        </button>
                      )}
                      {userRole >= 4 && (
                        <button className="w-full py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100">
                          <Globe size={16} /> Country Config
                        </button>
                      )}
                      {userRole >= 5 && (
                        <button className="w-full py-3 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-100">
                          <Zap size={16} /> Regional Dispatch
                        </button>
                      )}
                      {userRole === 6 && (
                        <button className="w-full py-3 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-100">
                          <Star size={16} /> Global Strategy
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="data-card bg-slate-900 text-white border-none">
                    <h3 className="font-bold mb-4 text-sm flex items-center gap-2">
                      <Lock size={16} className="text-emerald-400" /> System Integrity
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-slate-400 uppercase tracking-wider font-bold">Encrypted DB</span>
                        <span className="text-emerald-400 font-bold">SECURE</span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-slate-400 uppercase tracking-wider font-bold">Audit Trail</span>
                        <span className="text-emerald-400 font-bold">ACTIVE</span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-slate-400 uppercase tracking-wider font-bold">Access Control</span>
                        <span className="text-emerald-400 font-bold">LEVEL {userRole}</span>
                      </div>
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="text-[10px] text-slate-400 italic">
                          Authorized session for {userRole === 6 ? 'Director General' : 'Administrator'}. All actions are logged and traceable.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SecurityGate>
        );
      case 'wallet':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="data-card bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none p-8">
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <div className="text-slate-400 text-sm mb-1">Total Balance</div>
                    <div className="text-4xl font-bold">{formatPrice(balance)}</div>
                  </div>
                  <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md">
                    <Shield className="text-emerald-400" />
                  </div>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => { setMomoType('deposit'); setShowMoMoModal(true); }}
                    className="flex-1 bg-emerald-500 py-3 rounded-xl font-bold hover:bg-emerald-600 transition-colors"
                  >
                    Deposit
                  </button>
                  <button 
                    onClick={() => { setMomoType('withdraw'); setShowMoMoModal(true); }}
                    className="flex-1 bg-white/10 py-3 rounded-xl font-bold hover:bg-white/20 transition-colors"
                  >
                    Withdraw
                  </button>
                </div>
              </div>

              {/* International Payment Gateway */}
              <InternationalPaymentGateway />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="data-card">
                  <div className="flex items-center gap-3 mb-4 text-emerald-600">
                    <CreditCard size={20} />
                    <h3 className="font-bold">Virtual Cards</h3>
                  </div>
                  <div className="aspect-[1.6/1] bg-gradient-to-tr from-emerald-600 to-emerald-400 rounded-2xl p-6 text-white relative overflow-hidden mb-4 shadow-lg">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                      <Globe size={120} />
                    </div>
                    <div className="flex justify-between items-start mb-8">
                      <div className="font-bold italic">WORLD CARD</div>
                      <Zap size={24} />
                    </div>
                    <div className="text-xl font-mono mb-4 tracking-widest">**** **** **** 4290</div>
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-[10px] opacity-60 uppercase">Card Holder</div>
                        <div className="text-sm font-bold">JOËL MIKAM</div>
                      </div>
                      <div>
                        <div className="text-[10px] opacity-60 uppercase">Expires</div>
                        <div className="text-sm font-bold">12/28</div>
                      </div>
                    </div>
                  </div>
                  <button className="w-full py-2 bg-slate-100 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all">
                    Generate New Card
                  </button>
                </div>

                <div className="data-card">
                  <div className="flex items-center gap-3 mb-4 text-emerald-600">
                    <Zap size={20} />
                    <h3 className="font-bold">Bill Payments</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      { name: 'Electricity (ENEO)', icon: Zap },
                      { name: 'Water (Camwater)', icon: Globe },
                      { name: 'TV (Canal+)', icon: LayoutDashboard },
                    ].map(bill => (
                      <button key={bill.name} className="w-full flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-emerald-500 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                            <bill.icon size={16} className="text-slate-600" />
                          </div>
                          <span className="text-sm font-medium">{bill.name}</span>
                        </div>
                        <ChevronRight size={16} className="text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="data-card">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg">Transaction History</h3>
                  <button className="text-xs font-bold text-emerald-600 hover:underline">View All</button>
                </div>
                
                <div className="overflow-x-auto -mx-6">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 border-y border-slate-100">
                        <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction</th>
                        <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Method</th>
                        <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Details</th>
                        <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                        <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                        <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {MOCK_TRANSACTIONS.map((tx) => (
                        <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${tx.color}-50 text-${tx.color}-600 group-hover:scale-110 transition-transform`}>
                                <tx.icon size={16} />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-slate-900">{tx.type}</div>
                                <div className="text-[10px] text-slate-400 font-mono">{tx.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-slate-600 font-medium">{tx.method}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-slate-500 italic">{(tx as any).details}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className={`text-sm font-black ${tx.amount > 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                              {tx.amount > 0 ? '+' : ''}{formatPrice(tx.amount)}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className={`inline-flex px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                              tx.status === 'Success' ? 'bg-emerald-100 text-emerald-700' :
                              tx.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                              'bg-rose-100 text-rose-700'
                            }`}>
                              {tx.status}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-xs text-slate-500 font-medium">{tx.date}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="data-card">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg">Funding History</h3>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase">Deposits</span>
                    <span className="px-2 py-1 bg-rose-100 text-rose-700 text-[10px] font-bold rounded uppercase">Withdrawals</span>
                  </div>
                </div>
                
                <div className="overflow-x-auto -mx-6">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 border-y border-slate-100">
                        <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                        <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Method</th>
                        <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Details</th>
                        <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                        <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                        <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {MOCK_TRANSACTIONS.filter(tx => tx.type === 'Deposit' || tx.type === 'Withdrawal').map((tx) => (
                        <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${tx.color}-50 text-${tx.color}-600`}>
                                {tx.type === 'Deposit' ? <ArrowDownRight size={16} /> : <ArrowUpRight size={16} />}
                              </div>
                              <span className="text-sm font-bold text-slate-900">{tx.type}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-slate-600 font-medium">{tx.method}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-slate-500 italic">{(tx as any).details}</div>
                          </td>
                          <td className="px-6 py-4 font-black">
                            <span className={tx.amount > 0 ? 'text-emerald-600' : 'text-rose-600'}>
                              {tx.amount > 0 ? '+' : ''}{formatPrice(tx.amount)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className={`inline-flex px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                              tx.status === 'Success' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {tx.status}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-500 font-medium whitespace-nowrap">
                            {tx.date}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="data-card border-l-4 border-l-emerald-500">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Trophy size={20} className="text-emerald-500" /> Betting History
                  </h3>
                  <button className="text-xs font-bold text-emerald-600 hover:underline">Download Report</button>
                </div>
                
                <div className="overflow-x-auto -mx-6">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 border-y border-slate-100">
                        <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Match</th>
                        <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pick</th>
                        <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Stake</th>
                        <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Odds</th>
                        <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pot. Win</th>
                        <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {MOCK_BETS.map((bet) => (
                        <tr key={bet.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="text-sm font-bold text-slate-900">{bet.match}</div>
                            <div className="text-[10px] text-slate-400 font-medium">{bet.date}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs font-bold px-2 py-1 bg-slate-100 rounded-lg text-slate-600">{bet.pick}</span>
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-slate-900">
                            ${bet.stake.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-sm font-black text-emerald-600">
                            {bet.odds.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-sm font-black text-slate-900">
                            ${bet.potentialWin.toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className={`inline-flex px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                              bet.status === 'Won' ? 'bg-emerald-100 text-emerald-700' :
                              bet.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                              'bg-rose-100 text-rose-700'
                            }`}>
                              {bet.status}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="data-card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold">Payment Methods</h3>
                  <button 
                    onClick={() => setShowAddPaymentModal(true)}
                    className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-all"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="space-y-3">
                  {savedPaymentMethods.map((method) => (
                    <div 
                      key={method.id} 
                      onClick={() => {
                        setSelectedSavedMethodId(method.id);
                        setPaymentMethod(method.type);
                        if (method.type === 'MoMo') setMomoPhone(method.value);
                        if (method.type === 'PayPal') setPaypalEmail(method.value);
                        if (method.type === 'Bank') setWireDetails(method.details);
                        if (method.type === 'Crypto') setCryptoAddress(method.details.address);
                        setMomoType('deposit');
                        setShowMoMoModal(true);
                      }}
                      className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 group hover:border-emerald-500 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white bg-${method.color}-500`}>
                          <method.icon size={16} />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">{method.label}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{method.value}</div>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          removePaymentMethod(method.id);
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  {savedPaymentMethods.length === 0 && (
                    <div className="text-center py-6 text-slate-400 text-xs italic">
                      No payment methods saved.
                    </div>
                  )}
                </div>
              </div>
              <div className="data-card bg-slate-50 border-slate-200">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <MapPin size={18} className="text-emerald-600" />
                  Official Cameroon Accounts
                </h3>
                <div className="space-y-4">
                  <div className="p-3 bg-white rounded-xl border border-slate-100">
                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">UBA Bank</div>
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-sm font-bold">14011000529</span>
                      <button className="text-[10px] font-bold text-emerald-600 hover:underline">COPY</button>
                    </div>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-100">
                    <div className="text-[10px] font-bold text-amber-500 uppercase mb-1">MTN Mobile Money</div>
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-sm font-bold">+237 699 932 926</span>
                      <button className="text-[10px] font-bold text-emerald-600 hover:underline">COPY</button>
                    </div>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-100">
                    <div className="text-[10px] font-bold text-orange-500 uppercase mb-1">Orange Money</div>
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-sm font-bold">+237 672 175 723</span>
                      <button className="text-[10px] font-bold text-emerald-600 hover:underline">COPY</button>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-[10px] text-slate-400 italic text-center">
                  Use these accounts for direct manual deposits. Send proof of payment to support.
                </p>
              </div>
              <div className="data-card bg-emerald-50 border-emerald-100">
                <h3 className="font-bold text-emerald-900 mb-2">VIP Cashback</h3>
                <p className="text-sm text-emerald-700 mb-4">You are eligible for 5% cashback on all losses this week.</p>
                <div className="w-full bg-emerald-200 h-2 rounded-full overflow-hidden mb-4">
                  <div className="bg-emerald-600 h-full w-[75%]" />
                </div>
                <button className="w-full py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold">Claim Now</button>
              </div>
            </div>
          </div>
        );
      case 'loans':
        const rates: Record<string, { weekly: number, monthly: number }> = {
          'CM': { weekly: 0.015, monthly: 0.05 },
          'NG': { weekly: 0.02, monthly: 0.07 },
          'CI': { weekly: 0.018, monthly: 0.06 },
        };
        const countryRates = rates[selectedCountry] || { weekly: 0.025, monthly: 0.10 };
        const currentRate = loanType === 'weekly' ? countryRates.weekly : countryRates.monthly;
        const totalInterest = loanAmount * currentRate * loanDuration;
        const totalRepayment = loanAmount + totalInterest;

        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="data-card">
                <div className="flex items-center gap-3 mb-6 text-emerald-600">
                  <Banknote size={24} />
                  <h3 className="text-xl font-bold">Demande de Prêt Instantané</h3>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-bold text-slate-700">Montant du Prêt ({currentCurrency.symbol})</label>
                      <span className="text-emerald-600 font-black">{formatPrice(loanAmount)}</span>
                    </div>
                    <input 
                      type="range" 
                      min="5000" 
                      max="500000" 
                      step="5000"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-wider">
                      <span>{formatPrice(5000)}</span>
                      <span>{formatPrice(500000)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Type de Remboursement</label>
                      <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                        <button 
                          onClick={() => { setLoanType('weekly'); setLoanDuration(4); }}
                          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${loanType === 'weekly' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                          Hebdomadaire
                        </button>
                        <button 
                          onClick={() => { setLoanType('monthly'); setLoanDuration(3); }}
                          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${loanType === 'monthly' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                          Mensuel
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Durée ({loanType === 'weekly' ? 'Semaines' : 'Mois'})</label>
                      <select 
                        value={loanDuration}
                        onChange={(e) => setLoanDuration(parseInt(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold focus:outline-none focus:border-emerald-500"
                      >
                        {loanType === 'weekly' ? [1, 2, 4, 8, 12].map(w => <option key={w} value={w}>{w} Semaines</option>) : [1, 3, 6, 12].map(m => <option key={m} value={m}>{m} Mois</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Taux d'intérêt ({selectedCountry})</span>
                      <span className="font-bold text-slate-900">{(currentRate * 100).toFixed(1)}% par {loanType === 'weekly' ? 'semaine' : 'mois'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Intérêt Total</span>
                      <span className="font-bold text-rose-500">+{formatPrice(totalInterest)}</span>
                    </div>
                    <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                      <span className="font-bold text-slate-900">Total à Rembourser</span>
                      <span className="text-xl font-black text-emerald-600">{formatPrice(totalRepayment)}</span>
                    </div>
                  </div>

                  {/* Loan Calculator Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <div className="text-[10px] font-black text-emerald-600 uppercase mb-1">Versement {loanType === 'weekly' ? 'Hebdomadaire' : 'Mensuel'}</div>
                      <div className="text-2xl font-black text-emerald-900">{formatPrice(totalRepayment / loanDuration)}</div>
                      <div className="text-[10px] text-emerald-600/60 mt-1 italic">Pendant {loanDuration} {loanType === 'weekly' ? 'semaines' : 'mois'}</div>
                    </div>
                    <div className="p-4 bg-slate-900 rounded-2xl text-white">
                      <div className="text-[10px] font-black text-slate-400 uppercase mb-2">Répartition du Prêt</div>
                      <div className="flex h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                        <div 
                          className="bg-emerald-500 h-full" 
                          style={{ width: `${(loanAmount / totalRepayment) * 100}%` }}
                        />
                        <div 
                          className="bg-rose-500 h-full" 
                          style={{ width: `${(totalInterest / totalRepayment) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[9px] font-bold">
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                          <span>Principal: {Math.round((loanAmount / totalRepayment) * 100)}%</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                          <span>Intérêt: {Math.round((totalInterest / totalRepayment) * 100)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      setIsApplyingLoan(true);
                      setTimeout(() => {
                        setIsApplyingLoan(false);
                        alert(`Votre demande de prêt de $${loanAmount.toLocaleString()} a été soumise avec succès. Analyse de solvabilité en cours...`);
                      }, 2000);
                    }}
                    disabled={isApplyingLoan}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2"
                  >
                    {isApplyingLoan ? <RefreshCw className="animate-spin" size={18} /> : <Handshake size={18} />}
                    {isApplyingLoan ? 'TRAITEMENT...' : 'DEMANDER LE PRÊT MAINTENANT'}
                  </button>
                </div>
              </div>

              <div className="data-card">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Shield size={18} className="text-emerald-500" /> Sécurité & Conformité
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    <Lock size={20} className="mx-auto mb-2 text-emerald-600" />
                    <div className="text-[10px] font-black uppercase mb-1">Cryptage AES-256</div>
                    <div className="text-[9px] text-slate-400">Vos données sont protégées par les plus hauts standards.</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    <ShieldAlert size={20} className="mx-auto mb-2 text-emerald-600" />
                    <div className="text-[10px] font-black uppercase mb-1">Vérification KYC</div>
                    <div className="text-[9px] text-slate-400">Processus de vérification d'identité instantané.</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    <CheckCircle size={20} className="mx-auto mb-2 text-emerald-600" />
                    <div className="text-[10px] font-black uppercase mb-1">Approbation Rapide</div>
                    <div className="text-[9px] text-slate-400">Réponse en moins de 5 minutes après soumission.</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="data-card bg-gradient-to-br from-indigo-600 to-purple-600 text-white border-none">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Sparkles size={18} /> Score de Crédit IA
                </h3>
                <div className="text-center py-6">
                  <div className="text-5xl font-black mb-2">742</div>
                  <div className="text-xs font-bold uppercase tracking-widest opacity-80">Excellent</div>
                </div>
                <p className="text-xs opacity-70 leading-relaxed mb-6">
                  Votre score est basé sur votre historique de transactions, vos paris et vos activités sur Nexus. Un score élevé réduit vos taux d'intérêt.
                </p>
                <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all border border-white/20">
                  Améliorer mon score
                </button>
              </div>

              <div className="data-card">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <BarChart3 size={18} className="text-emerald-500" /> Simulateur de Prêt Avancé
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-bold text-slate-500 uppercase">Projection de Remboursement</span>
                      <div className="flex items-center gap-1 text-emerald-600 font-black">
                        <TrendingUp size={14} />
                        <span className="text-sm">MJ NEXUS IA</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Montant Emprunté</span>
                        <span className="font-bold">{formatPrice(loanAmount)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Durée Totale</span>
                        <span className="font-bold">{loanDuration} {loanType === 'weekly' ? 'Semaines' : 'Mois'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Coût du Crédit</span>
                        <span className="font-bold text-rose-500">{formatPrice(totalInterest)}</span>
                      </div>
                      <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                        <span className="font-bold text-slate-900">Mensualité Estimée</span>
                        <span className="text-lg font-black text-emerald-600">{formatPrice(totalRepayment / loanDuration)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400 text-center italic">
                    * Les taux peuvent varier selon votre score de crédit et votre pays de résidence.
                  </div>
                </div>
              </div>

              <div className="data-card">
                <h3 className="font-bold mb-4">Historique des Prêts</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                    <div>
                      <div className="text-xs font-bold">Prêt Personnel</div>
                      <div className="text-[10px] text-slate-400">12 Jan 2026</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black text-emerald-600">Remboursé</div>
                      <div className="text-[10px] font-bold text-slate-900">{formatPrice(15000)}</div>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center opacity-60">
                    <div>
                      <div className="text-xs font-bold">Prêt Business</div>
                      <div className="text-[10px] text-slate-400">05 Nov 2025</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black text-emerald-600">Remboursé</div>
                      <div className="text-[10px] font-bold text-slate-900">{formatPrice(120000)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'covoiturage':
        return (
          <div className="space-y-6">
            {/* Mobility Header & Mode Toggle */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black italic uppercase text-slate-900 flex items-center gap-2">
                  <Navigation className="text-emerald-500" /> Nexus Mobility
                </h2>
                <p className="text-sm text-slate-500">Transport sécurisé, innovant et organisé.</p>
              </div>
              <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
                <button 
                  onClick={() => setMobilityMode('hailing')}
                  className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${mobilityMode === 'hailing' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Course Immédiate
                </button>
                <button 
                  onClick={() => setMobilityMode('covoiturage')}
                  className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${mobilityMode === 'covoiturage' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Covoiturage
                </button>
              </div>
            </div>

            {mobilityMode === 'hailing' ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Hailing Controls */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="data-card">
                    <h3 className="font-bold text-slate-900 mb-4">Où allez-vous ?</h3>
                    <div className="space-y-4">
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500" />
                        <input 
                          type="text" 
                          placeholder="Point de départ (Ma position)" 
                          className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-500" />
                        <input 
                          type="text" 
                          placeholder="Destination" 
                          className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="mt-8 space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Catégorie de véhicule</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'Moto', icon: Bike, label: 'Moto-Taxi', price: '400', desc: 'Rapide' },
                          { id: 'Car', icon: Car, label: 'Nexus Eco', price: '1500', desc: 'Confort' },
                          { id: 'Premium', icon: Shield, label: 'Premium', price: '5000', desc: 'Luxe' },
                        ].map(type => (
                          <button 
                            key={type.id}
                            onClick={() => setSelectedVehicleType(type.id as any)}
                            className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1 transition-all ${selectedVehicleType === type.id ? 'border-emerald-500 bg-emerald-50' : 'border-slate-50 hover:border-emerald-100'}`}
                          >
                            <type.icon size={20} className={selectedVehicleType === type.id ? 'text-emerald-600' : 'text-slate-400'} />
                            <span className="text-[10px] font-bold">{type.label}</span>
                            <span className="text-[9px] text-slate-400">{type.price} FCFA</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        setIsSearchingDriver(true);
                        setTimeout(() => {
                          setIsSearchingDriver(false);
                          setActiveRide(MOCK_DRIVERS_NEARBY.find(d => d.type === selectedVehicleType) || MOCK_DRIVERS_NEARBY[0]);
                          ReactGA.event({ category: 'Mobility', action: 'Order Ride', label: selectedVehicleType });
                        }, 3000);
                      }}
                      disabled={isSearchingDriver || activeRide}
                      className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl hover:bg-slate-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSearchingDriver ? (
                        <>
                          <RefreshCw size={18} className="animate-spin" />
                          Recherche de chauffeur...
                        </>
                      ) : activeRide ? (
                        'Course en cours'
                      ) : (
                        `Commander ${selectedVehicleType}`
                      )}
                    </button>
                  </div>

                  {/* Security & Innovation Panel */}
                  <div className="data-card bg-slate-900 text-white border-none">
                    <h4 className="font-bold text-sm mb-4 flex items-center gap-2">
                      <Shield size={16} className="text-emerald-400" /> Sécurité & Innovation
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                        <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
                          <Zap size={16} />
                        </div>
                        <div>
                          <div className="text-[10px] font-bold">Nexus Eco-Electric</div>
                          <div className="text-[9px] opacity-60">Motos électriques pour un trajet silencieux et écolo.</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                        <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
                          <Lock size={16} />
                        </div>
                        <div>
                          <div className="text-[10px] font-bold">Code de Sécurité</div>
                          <div className="text-[9px] opacity-60">Vérifiez votre chauffeur avec un code unique à 4 chiffres.</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Map & Active Ride View */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="data-card p-0 overflow-hidden h-[500px] relative">
                    <TechnicianMap technicians={MOCK_DRIVERS_NEARBY} drones={[]} />
                    
                    {/* Floating Security Controls */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <button className="p-3 bg-rose-500 text-white rounded-full shadow-lg hover:bg-rose-600 transition-all group relative">
                        <AlertTriangle size={20} />
                        <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-900 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">BOUTON SOS</span>
                      </button>
                      <button className="p-3 bg-white text-slate-900 rounded-full shadow-lg hover:bg-slate-50 transition-all group relative">
                        <Send size={20} />
                        <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-900 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">PARTAGER TRAJET</span>
                      </button>
                    </div>

                    {/* Active Ride Overlay */}
                    <AnimatePresence>
                      {activeRide && (
                        <motion.div 
                          initial={{ y: 100, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: 100, opacity: 0 }}
                          className="absolute bottom-4 left-4 right-4 bg-white rounded-3xl shadow-2xl p-6 border border-slate-100"
                        >
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                <img src={activeRide.image} alt={activeRide.name} className="w-16 h-16 rounded-full border-4 border-emerald-50 shadow-sm" referrerPolicy="no-referrer" />
                                <div className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 text-white rounded-full border-2 border-white">
                                  <CheckCircle size={12} />
                                </div>
                              </div>
                              <div>
                                <div className="font-bold text-slate-900 text-lg">{activeRide.name}</div>
                                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">{activeRide.vehicle}</div>
                                <div className="flex items-center gap-1 text-xs text-amber-500 mt-1">
                                  <Star size={12} className="fill-amber-500" />
                                  <span>{activeRide.rating} • 1,240 courses</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-black text-emerald-600">{formatPrice(activeRide.price)}</div>
                              <div className="text-[10px] font-bold text-slate-400 uppercase">Paiement Wallet</div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <button className="flex items-center justify-center gap-2 py-3 bg-slate-100 text-slate-900 rounded-xl font-bold text-xs hover:bg-slate-200 transition-all">
                              <PhoneCall size={16} /> Appeler
                            </button>
                            <button 
                              onClick={() => setActiveRide(null)}
                              className="flex items-center justify-center gap-2 py-3 bg-rose-50 text-rose-600 rounded-xl font-bold text-xs hover:bg-rose-100 transition-all"
                            >
                              Annuler la course
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="data-card border-l-4 border-emerald-500">
                      <h4 className="font-bold text-sm mb-1">Traçabilité Totale</h4>
                      <p className="text-[10px] text-slate-500">Chaque trajet est enregistré et surveillé par notre centre de contrôle 24/7.</p>
                    </div>
                    <div className="data-card border-l-4 border-blue-500">
                      <h4 className="font-bold text-sm mb-1">Assurance Nexus</h4>
                      <p className="text-[10px] text-slate-500">Vous êtes couvert par notre assurance partenaire durant toute la durée du trajet.</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="data-card bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-8">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-2xl font-black mb-2 italic uppercase">Nexus Covoiturage</h2>
                        <p className="text-emerald-50 opacity-90 text-sm max-w-md">
                          Voyagez en toute sécurité et à moindre coût. Partagez vos trajets avec la communauté MJ NEXUS.
                        </p>
                      </div>
                      <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                        <Navigation size={32} />
                      </div>
                    </div>
                    <div className="mt-8 flex gap-4">
                      <button className="px-6 py-3 bg-white text-emerald-600 rounded-xl font-bold text-sm shadow-lg">Rechercher un trajet</button>
                      <button className="px-6 py-3 bg-emerald-400/30 text-white border border-white/20 rounded-xl font-bold text-sm backdrop-blur-sm">Proposer un trajet</button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                      <TrendingUp size={18} className="text-emerald-500" /> Trajets Disponibles
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      {MOCK_RIDES.map(ride => (
                        <motion.div 
                          key={ride.id}
                          whileHover={{ y: -4 }}
                          className="data-card hover:border-emerald-500 transition-all cursor-pointer group"
                          onClick={() => { 
                            setSelectedRide(ride); 
                            setSelectedSeats(1);
                            setShowRideModal(true); 
                          }}
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                              <img src={ride.image} alt={ride.driver} className="w-12 h-12 rounded-full border-2 border-slate-100" referrerPolicy="no-referrer" />
                              <div>
                                <div className="font-bold text-slate-900">{ride.driver}</div>
                                <div className="flex items-center gap-1 text-[10px] text-amber-500">
                                  <Star size={10} className="fill-amber-500" />
                                  <span>{ride.rating} • {ride.car}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex-1 flex items-center justify-center gap-4">
                              <div className="text-center">
                                <div className="text-[10px] font-bold text-slate-400 uppercase">Départ</div>
                                <div className="font-bold text-sm">{ride.from}</div>
                              </div>
                              <div className="flex flex-col items-center gap-1 px-4">
                                <div className="w-16 h-px bg-slate-200 relative">
                                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-500 shadow-sm" />
                                </div>
                                <div className="text-[9px] font-bold text-emerald-600">{ride.time}</div>
                              </div>
                              <div className="text-center">
                                <div className="text-[10px] font-bold text-slate-400 uppercase">Arrivée</div>
                                <div className="font-bold text-sm">{ride.to}</div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between md:justify-end gap-6">
                              <div className="text-right">
                                <div className="text-lg font-black text-slate-900">{formatPrice(ride.price)}</div>
                                <div className="text-[10px] font-bold text-slate-500 uppercase">{ride.seats} places dispos</div>
                              </div>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedRide(ride);
                                  setSelectedSeats(1);
                                  setShowRideModal(true);
                                }}
                                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold group-hover:bg-emerald-500 transition-colors"
                              >
                                Réserver
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="data-card">
                    <h3 className="font-bold mb-4">Mes Réservations</h3>
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Navigation size={20} className="text-slate-300" />
                      </div>
                      <p className="text-xs text-slate-500">Vous n'avez pas encore de réservations.</p>
                    </div>
                  </div>

                  <div className="data-card bg-slate-900 text-white">
                    <h3 className="font-bold mb-2">Devenez Conducteur</h3>
                    <p className="text-xs text-slate-400 mb-4">Rentabilisez vos trajets quotidiens et gagnez des WORLD tokens.</p>
                    <ul className="space-y-2 mb-6">
                      {['Bonus de bienvenue', 'Assurance incluse', 'Paiements instantanés'].map(item => (
                        <li key={item} className="flex items-center gap-2 text-[10px] font-bold">
                          <CheckCircle size={12} className="text-emerald-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <button className="w-full py-3 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all">S'inscrire comme conducteur</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Onboarding Modal */}
      <AnimatePresence>
        {showOnboarding && (
          <OnboardingModal 
            step={onboardingStep}
            onNext={handleNextOnboarding}
            onSkip={handleCompleteOnboarding}
            totalSteps={ONBOARDING_STEPS.length}
          />
        )}
      </AnimatePresence>

      <SEO 
        title={getPageMetadata(activeTab).title}
        description={getPageMetadata(activeTab).description}
        keywords={getPageMetadata(activeTab).keywords}
        image={getPageMetadata(activeTab).image}
      />
      
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="bg-white border-r border-slate-200 flex flex-col z-50"
      >
        <div className="p-6">
          <Logo showText={isSidebarOpen} />
        </div>

        <nav className="flex-1 px-4 space-y-6 overflow-y-auto py-4 no-scrollbar">
          {/* Main Services - Visible to All */}
          <div className="space-y-1">
            <div className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Nexus Hub</div>
            <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
            <SidebarItem 
              icon={Trophy} 
              label="Sports & P2P" 
              active={activeTab === 'betting'} 
              onClick={() => setActiveTab('betting')} 
              onboardingHighlight={showOnboarding && onboardingStep === 1}
            />
            <SidebarItem 
              icon={ShoppingBag} 
              label="Marketplace" 
              active={activeTab === 'marketplace'} 
              onClick={() => setActiveTab('marketplace')} 
              onboardingHighlight={showOnboarding && onboardingStep === 2}
            />
            <SidebarItem 
              icon={HardHat} 
              label="Home Services" 
              active={activeTab === 'servisecur'} 
              onClick={() => setActiveTab('servisecur')} 
              onboardingHighlight={showOnboarding && onboardingStep === 3}
            />
            <SidebarItem icon={Navigation} label="Mobility" active={activeTab === 'covoiturage'} onClick={() => setActiveTab('covoiturage')} badge="NEW" />
            <SidebarItem icon={Award} label="MJ Academy" active={activeTab === 'academy'} onClick={() => setActiveTab('academy')} badge="PRO" />
            <SidebarItem icon={Megaphone} label="Digital Marketing" active={activeTab === 'marketing'} onClick={() => setActiveTab('marketing')} badge="NEW" />
            <SidebarItem icon={Truck} label="Logistics & Moving" active={activeTab === 'logistics'} onClick={() => setActiveTab('logistics')} badge="NEW" />
            <SidebarItem icon={Activity} label="MJ Health" active={activeTab === 'health'} onClick={() => setActiveTab('health')} badge="24/7" />
          </div>

          {/* Community & Finance - Secondary for Basic Users */}
          <div className="space-y-1">
            <div className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Social & Finance</div>
            <SidebarItem icon={Users} label="Social Network" active={activeTab === 'social'} onClick={() => setActiveTab('social')} />
            <SidebarItem icon={LineChartIcon} label="Crypto Trading" active={activeTab === 'crypto'} onClick={() => setActiveTab('crypto')} />
            <SidebarItem 
              icon={Wallet} 
              label="My Wallet" 
              active={activeTab === 'wallet'} 
              onClick={() => setActiveTab('wallet')} 
              onboardingHighlight={showOnboarding && onboardingStep === 4}
            />
            <SidebarItem icon={Banknote} label="Online Loans" active={activeTab === 'loans'} onClick={() => setActiveTab('loans')} badge="NEW" />
            <SidebarItem icon={Award} label="Challenges & Rewards" active={activeTab === 'rewards'} onClick={() => setActiveTab('rewards')} />
            <SidebarItem icon={HelpCircle} label="Centre d'Aide" active={activeTab === 'help'} onClick={() => setActiveTab('help')} />
            <SidebarItem icon={Shield} label="Confidentialité" active={activeTab === 'privacy'} onClick={() => setActiveTab('privacy')} />
          </div>

          {/* Professional Space - L2+ */}
          {userRole >= 2 && (
            <div className="space-y-1">
              <div className="px-4 text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-2">Professional</div>
              {VIP_LEVELS.indexOf(userVipLevel) >= VIP_LEVELS.indexOf('Platinum') && (
                <SidebarItem icon={Store} label="My Shop" active={activeTab === 'my-shop'} onClick={() => setActiveTab('my-shop')} badge="PRO" />
              )}
            </div>
          )}

          {/* Management & Admin - L3+ (Strictly Hidden from L1/L2) */}
          {userRole >= 3 && (
            <div className="space-y-1">
              <div className="px-4 text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-2">Administration</div>
              <SidebarItem 
                icon={Settings} 
                label="Control Center" 
                active={activeTab === 'admin-levels'} 
                onClick={() => setActiveTab('admin-levels')} 
                badge={userRole === 6 ? 'DG' : `L${userRole}`} 
              />
              <SidebarItem 
                icon={ShieldAlert} 
                label="Fraud Control" 
                active={activeTab === 'fraud-control'} 
                onClick={() => setActiveTab('fraud-control')} 
                badge={fraudLogs.length > 0 ? fraudLogs.length.toString() : undefined}
              />
              <SidebarItem icon={Globe} label="Network Map" active={activeTab === 'ecosystem'} onClick={() => setActiveTab('ecosystem')} />
            </div>
          )}

          <div className="pt-4 mt-4 border-t border-slate-100">
            <SidebarItem icon={Lock} label="Security Vault" active={activeTab === 'admin'} onClick={() => setShowAdmin(true)} />
          </div>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className={`flex items-center gap-3 p-3 rounded-xl bg-slate-50 ${!isSidebarOpen && 'justify-center'}`}>
            <div className="w-10 h-10 bg-slate-200 rounded-full flex-shrink-0" />
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm truncate">Joël Mikam</div>
                <div className="flex items-center gap-1.5">
                  <div className="text-xs text-slate-500">{userVipLevel} VIP</div>
                  {userRole >= 3 && (
                    <div className={`w-1.5 h-1.5 rounded-full ${isSecurityVerified ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} title={isSecurityVerified ? 'Security Verified' : 'Security Check Required'} />
                  )}
                </div>
              </div>
            )}
            {isSidebarOpen && <LogOut size={16} className="text-slate-400 cursor-pointer hover:text-rose-500" />}
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="h-20 bg-white border-bottom border-slate-200 px-8 flex items-center justify-between z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
              <Menu size={20} />
            </button>
            {isAccountRestricted && (
              <div className="bg-rose-500 text-white px-4 py-2 rounded-xl text-xs font-black animate-pulse flex items-center gap-2">
                <ShieldAlert size={16} />
                COMPTE RESTREINT : {restrictionReason}
              </div>
            )}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <MapPin size={16} className="text-emerald-500" />
                <span>{userLocation.city}, {userLocation.country}</span>
              </div>
              
              {/* Currency & Region Switcher */}
              <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-1.5 px-2 border-r border-slate-200 mr-1">
                  <Coins size={14} className="text-amber-500" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Currency</span>
                </div>
                <div className="flex items-center gap-1">
                  {MOCK_COUNTRIES.map(c => (
                    <button 
                      key={c.code}
                      onClick={() => {
                        setSelectedCountry(c.code);
                        setUserLocation({ city: c.name === 'Cameroon' ? 'Douala' : 'Capital', country: c.name });
                      }}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${selectedCountry === c.code ? 'bg-white shadow-md text-emerald-600 scale-105' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                      title={`${c.name} (${c.currency})`}
                    >
                      <span>{c.flag}</span>
                      <span className="hidden sm:inline">{c.symbol}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => { setOnboardingStep(0); setShowOnboarding(true); }}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-500 hover:text-emerald-600 rounded-xl text-[10px] font-bold transition-all border border-slate-200"
            >
              <Sparkles size={14} />
              GUIDE MJ
            </button>

            {!isLoggedIn ? (
              <button 
                onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
                className="bg-emerald-500 text-white px-6 py-2 rounded-xl font-bold text-sm shadow-lg shadow-emerald-100"
              >
                Login / Register
              </button>
            ) : (
              <>
                <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold border border-amber-100">
                  <Star size={14} className="fill-amber-500" />
                  <span>{userVipLevel} VIP</span>
                </div>
                <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold">
                  <div className="flex items-center gap-1">
                    <Shield size={12} />
                    <span>Level {userRole}</span>
                  </div>
                </div>
                <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold">
                  <Coins size={14} />
                  <span>1,240 WORLD</span>
                </div>
              </>
            )}
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                onFocus={() => globalSearchQuery.length > 1 && setShowSearchResults(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchResults.length > 0) {
                    const first = searchResults[0];
                    if (first.type === 'betting') setActiveTab('betting');
                    if (first.type === 'marketplace') setActiveTab('marketplace');
                    if (first.type === 'service') setActiveTab('servisecur');
                    if (first.type === 'social') setActiveTab('social');
                    setShowSearchResults(false);
                    setGlobalSearchQuery('');
                  }
                }}
                placeholder="Search products, services..." 
                className="bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm w-64 focus:outline-none focus:border-emerald-500"
              />
              
              {/* Global Search Results Dropdown */}
              <AnimatePresence>
                {showSearchResults && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowSearchResults(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 min-w-[320px]"
                    >
                      <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Search Results</span>
                        <button onClick={() => setShowSearchResults(false)} className="text-slate-400 hover:text-slate-600">
                          <X size={14} />
                        </button>
                      </div>
                      <div className="max-h-[400px] overflow-y-auto p-2">
                        {searchResults.length > 0 ? (
                          ['betting', 'marketplace', 'service', 'social'].map(type => {
                            const filteredResults = searchResults.filter(r => r.type === type);
                            if (filteredResults.length === 0) return null;
                            
                            return (
                              <div key={type} className="mb-2">
                                <div className="px-3 py-1 text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50 rounded-lg mb-1">
                                  {type === 'service' ? 'Services (Servisécur)' : type}
                                </div>
                                {filteredResults.map((result, idx) => (
                                  <button 
                                    key={`${result.type}-${result.id}-${idx}`}
                                    onClick={() => {
                                      if (result.type === 'betting') setActiveTab('betting');
                                      if (result.type === 'marketplace') setActiveTab('marketplace');
                                      if (result.type === 'service') setActiveTab('servisecur');
                                      if (result.type === 'social') setActiveTab('social');
                                      setShowSearchResults(false);
                                      setGlobalSearchQuery('');
                                    }}
                                    className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-all text-left group"
                                  >
                                    <div className={`p-2 rounded-lg ${
                                      result.type === 'betting' ? 'bg-amber-50 text-amber-600' :
                                      result.type === 'marketplace' ? 'bg-emerald-50 text-emerald-600' :
                                      result.type === 'service' ? 'bg-blue-50 text-blue-600' :
                                      'bg-purple-50 text-purple-600'
                                    }`}>
                                      <result.icon size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="font-bold text-sm text-slate-900 truncate group-hover:text-emerald-600 transition-colors">{result.title}</div>
                                      <div className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">{result.subtitle}</div>
                                    </div>
                                    {result.type === 'service' && (
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          const mapping: Record<string, string> = {
                                            'Master Plumber': 'Plomberie',
                                            'Electrician': 'Électricité',
                                            'IT Specialist': 'Informatique',
                                            'AC Technician': 'Climatisation'
                                          };
                                          initiateBooking(mapping[result.subtitle] || result.subtitle);
                                          setShowSearchResults(false);
                                        }}
                                        className="px-3 py-1 bg-emerald-500 text-white rounded-lg text-[10px] font-bold hover:bg-emerald-600 transition-all"
                                      >
                                        Book
                                      </button>
                                    )}
                                    <ChevronRight size={14} className="text-slate-300 group-hover:text-emerald-500 transition-all" />
                                  </button>
                                ))}
                              </div>
                            );
                          })
                        ) : (
                          <div className="p-8 text-center">
                            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                              <Search size={20} className="text-slate-300" />
                            </div>
                            <p className="text-sm text-slate-500 font-medium">No results found for "{globalSearchQuery}"</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
              {(['en', 'fr', 'es', 'pt'] as Language[]).map(lang => (
                <button 
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${language === lang ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {lang}
                </button>
              ))}
            </div>
            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 relative">
              <Bell size={20} />
              <div className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          {/* Innovation: AI Shopping Assistant Floating Button */}
          {activeTab === 'marketplace' && (
            <motion.button 
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="fixed bottom-8 right-8 w-16 h-16 bg-emerald-500 text-white rounded-full shadow-2xl shadow-emerald-500/40 z-[100] flex items-center justify-center border-4 border-white group"
              onClick={() => alert('Assistant Shopping IA : "Comment puis-je vous aider à trouver le produit parfait aujourd\'hui ?"')}
            >
              <Sparkles size={28} className="group-hover:animate-pulse" />
              <div className="absolute -top-12 right-0 bg-white text-slate-900 px-3 py-1.5 rounded-xl text-[10px] font-black shadow-xl border border-slate-100 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                ASSISTANT SHOPPING IA
              </div>
            </motion.button>
          )}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 capitalize italic">
                  {activeTab === 'dashboard' ? 'Welcome back, Joël' : activeTab.replace('-', ' ')}
                </h1>
                <p className="text-slate-500">"Gagnez avec le monde. Pariez autrement."</p>
              </div>
              {renderContent()}
            </motion.div>
          </AnimatePresence>

          {/* World Class Footer */}
          <footer className="mt-16 py-12 px-8 border-t border-slate-100 bg-white rounded-3xl">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
              <div className="space-y-4">
                <Logo showText={true} />
                <p className="text-xs text-slate-500 leading-relaxed">
                  MJ NEXUS est l'écosystème unifié leader mondial, intégrant paris P2P, commerce global, services à domicile sécurisés, télémédecine et marketing IA.
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 hover:text-emerald-500 transition-colors cursor-pointer"><Globe size={16} /></div>
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 hover:text-emerald-500 transition-colors cursor-pointer"><Shield size={16} /></div>
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 hover:text-emerald-500 transition-colors cursor-pointer"><Activity size={16} /></div>
                </div>
              </div>
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Plateforme</h4>
                <ul className="space-y-3 text-xs font-bold text-slate-600">
                  <li className="hover:text-emerald-500 cursor-pointer transition-colors" onClick={() => setActiveTab('betting')}>Sports & P2P</li>
                  <li className="hover:text-emerald-500 cursor-pointer transition-colors" onClick={() => setActiveTab('marketplace')}>Marketplace</li>
                  <li className="hover:text-emerald-500 cursor-pointer transition-colors" onClick={() => setActiveTab('servisecur')}>Servisécur</li>
                  <li className="hover:text-emerald-500 cursor-pointer transition-colors" onClick={() => setActiveTab('health')}>MJ Health</li>
                </ul>
              </div>
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Support</h4>
                <ul className="space-y-3 text-xs font-bold text-slate-600">
                  <li className="hover:text-emerald-500 cursor-pointer transition-colors" onClick={() => setActiveTab('help')}>Centre d'Aide</li>
                  <li className="hover:text-emerald-500 cursor-pointer transition-colors" onClick={() => setActiveTab('privacy')}>Confidentialité</li>
                  <li className="hover:text-emerald-500 cursor-pointer transition-colors">Termes & Conditions</li>
                  <li className="hover:text-emerald-500 cursor-pointer transition-colors">Contact Support</li>
                </ul>
              </div>
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Newsletter</h4>
                <p className="text-[10px] text-slate-500 mb-4">Recevez les dernières opportunités de l'écosystème MJ.</p>
                <div className="flex gap-2">
                  <input type="email" placeholder="Email" className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500" />
                  <button className="bg-slate-900 text-white p-2 rounded-lg hover:bg-emerald-500 transition-colors"><Send size={14} /></button>
                </div>
              </div>
            </div>
            <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                © 2025 MJ NEXUS GLOBAL ECOSYSTEM. TOUS DROITS RÉSERVÉS.
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  SECURE & VERIFIED
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <Globe size={14} className="text-blue-500" />
                  GLOBAL CONNECTIVITY
                </div>
              </div>
            </div>
          </footer>
        </div>

        {/* Auth Modal */}
        <AnimatePresence>
          {showAuthModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[120] flex items-center justify-center p-4"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
              >
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-emerald-500 text-white">
                  <h3 className="text-xl font-bold">{authMode === 'login' ? 'Welcome Back' : 'Create Account'}</h3>
                  <button onClick={() => setShowAuthModal(false)} className="text-white/80 hover:text-white">
                    <X size={20} />
                  </button>
                </div>
                <div className="p-8 space-y-4">
                  {authMode === 'register' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">First Name</label>
                        <input 
                          type="text" 
                          value={authForm.firstName}
                          onChange={(e) => setAuthForm({...authForm, firstName: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:border-emerald-500 outline-none" 
                          placeholder="John" 
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Last Name</label>
                        <input 
                          type="text" 
                          value={authForm.lastName}
                          onChange={(e) => setAuthForm({...authForm, lastName: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:border-emerald-500 outline-none" 
                          placeholder="Doe" 
                        />
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Phone Number (Username)</label>
                    <input 
                      type="text" 
                      value={authForm.phone}
                      onChange={(e) => setAuthForm({...authForm, phone: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 outline-none" 
                      placeholder="+237 6XX XXX XXX" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Password</label>
                    <input 
                      type="password" 
                      value={authForm.password}
                      onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 outline-none" 
                      placeholder="••••••••" 
                    />
                  </div>
                  {authMode === 'register' && (
                    <>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Email (Optional)</label>
                        <input 
                          type="email" 
                          value={authForm.email}
                          onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:border-emerald-500 outline-none" 
                          placeholder="john@example.com" 
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Referral Code (Optional)</label>
                        <input 
                          type="text" 
                          value={authForm.referralCode}
                          onChange={(e) => setAuthForm({...authForm, referralCode: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:border-emerald-500 outline-none" 
                          placeholder="CODE123" 
                        />
                      </div>
                    </>
                  )}
                  
                  <button 
                    onClick={authMode === 'login' ? handleLogin : handleRegister}
                    className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100"
                  >
                    {authMode === 'login' ? 'Login to MJ NEXUS' : 'Create My Account'}
                  </button>
                  
                  <div className="text-center">
                    <button 
                      onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                      className="text-xs font-bold text-slate-400 hover:text-emerald-600 transition-colors"
                    >
                      {authMode === 'login' ? "Don't have an account? Register" : "Already have an account? Login"}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Payment Method Modal */}
        <AnimatePresence>
          {showAddPaymentModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[130] flex items-center justify-center p-4"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
              >
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-xl font-bold">Add Payment Method</h3>
                  <button onClick={() => setShowAddPaymentModal(false)} className="text-slate-400 hover:text-slate-600">
                    <X size={20} />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Method Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'MoMo', label: 'Mobile Money', icon: Smartphone },
                        { id: 'Bank', label: 'Bank Transfer', icon: Landmark },
                        { id: 'Crypto', label: 'Crypto Wallet', icon: Bitcoin },
                        { id: 'PayPal', label: 'PayPal', icon: Send },
                      ].map(type => (
                        <button 
                          key={type.id}
                          onClick={() => setNewPaymentType(type.id as any)}
                          className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${
                            newPaymentType === type.id 
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-600' 
                              : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-emerald-200'
                          }`}
                        >
                          <type.icon size={16} />
                          <span className="text-[10px] font-bold">{type.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Account Label (e.g. "My Savings")</label>
                    <input 
                      type="text" 
                      value={newPaymentLabel}
                      onChange={(e) => setNewPaymentLabel(e.target.value)}
                      placeholder="Personal Account" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {newPaymentType === 'MoMo' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Phone Number</label>
                      <input 
                        type="tel" 
                        value={newPaymentValue}
                        onChange={(e) => setNewPaymentValue(e.target.value)}
                        placeholder="+237 6XX XXX XXX" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500"
                      />
                    </motion.div>
                  )}

                  {newPaymentType === 'PayPal' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">PayPal Email</label>
                      <input 
                        type="email" 
                        value={newPaymentValue}
                        onChange={(e) => setNewPaymentValue(e.target.value)}
                        placeholder="your-email@example.com" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500"
                      />
                    </motion.div>
                  )}

                  {newPaymentType === 'Bank' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Bank Name</label>
                          <input 
                            type="text" 
                            value={newBankDetails.bankName}
                            onChange={(e) => setNewBankDetails({...newBankDetails, bankName: e.target.value})}
                            placeholder="e.g. UBA" 
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Account Name</label>
                          <input 
                            type="text" 
                            value={newBankDetails.accountName}
                            onChange={(e) => setNewBankDetails({...newBankDetails, accountName: e.target.value})}
                            placeholder="Full Name" 
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Account Number / IBAN</label>
                        <input 
                          type="text" 
                          value={newBankDetails.accountNumber}
                          onChange={(e) => setNewBankDetails({...newBankDetails, accountNumber: e.target.value})}
                          placeholder="Account Number" 
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </motion.div>
                  )}

                  {newPaymentType === 'Crypto' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Network</label>
                        <select 
                          value={newCryptoDetails.network}
                          onChange={(e) => setNewCryptoDetails({...newCryptoDetails, network: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500"
                        >
                          <option value="Ethereum">Ethereum (ERC20)</option>
                          <option value="Bitcoin">Bitcoin</option>
                          <option value="Tron">Tron (TRC20)</option>
                          <option value="Solana">Solana</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Wallet Address</label>
                        <input 
                          type="text" 
                          value={newCryptoDetails.address}
                          onChange={(e) => setNewCryptoDetails({...newCryptoDetails, address: e.target.value})}
                          placeholder="0x... or Wallet Address" 
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </motion.div>
                  )}

                  <button 
                    onClick={handleAddPaymentMethod}
                    className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100"
                  >
                    Save Payment Method
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MoMo Modal */}
        <AnimatePresence>
          {showMoMoModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
              >
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-xl font-bold capitalize">{momoType} Funds</h3>
                  <button onClick={() => setShowMoMoModal(false)} className="text-slate-400 hover:text-slate-600">
                    <X size={20} />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  {savedPaymentMethods.length > 0 && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Saved Methods</label>
                      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {savedPaymentMethods.map(method => (
                          <button 
                            key={method.id}
                            onClick={() => {
                              setSelectedSavedMethodId(method.id);
                              setPaymentMethod(method.type);
                              if (method.type === 'MoMo') setMomoPhone(method.value);
                              if (method.type === 'PayPal') setPaypalEmail(method.value);
                              if (method.type === 'Bank') setWireDetails(method.details);
                              if (method.type === 'Crypto') setCryptoAddress(method.details.address);
                            }}
                            className={`flex-shrink-0 flex items-center gap-2 p-3 rounded-xl border transition-all ${
                              selectedSavedMethodId === method.id 
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-600' 
                                : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-emerald-200'
                            }`}
                          >
                            <method.icon size={16} />
                            <div className="text-left">
                              <div className="text-[10px] font-bold whitespace-nowrap">{method.label}</div>
                              <div className="text-[8px] opacity-60 truncate w-20">{method.value}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">New Method</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'MoMo', label: 'Mobile Money', icon: Smartphone },
                        { id: 'Bank', label: 'Bank Transfer', icon: Landmark },
                        { id: 'Card', label: 'Credit Card', icon: CreditCard },
                        { id: 'Crypto', label: 'Crypto', icon: Bitcoin },
                        { id: 'PayPal', label: 'PayPal', icon: Send },
                        { id: 'Wire', label: 'Wire Transfer', icon: Globe },
                      ].map(method => (
                        <button 
                          key={method.id}
                          onClick={() => {
                            setPaymentMethod(method.id as any);
                            setSelectedSavedMethodId(null);
                          }}
                          className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${
                            paymentMethod === method.id && !selectedSavedMethodId
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-600' 
                              : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-emerald-200'
                          }`}
                        >
                          <method.icon size={16} />
                          <span className="text-[10px] font-bold">{method.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {paymentMethod === 'MoMo' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <div className="flex gap-2 p-1 bg-slate-100 rounded-xl mb-3">
                        {['MTN', 'Orange', 'Airtel'].map(op => (
                          <button key={op} className="flex-1 py-2 text-xs font-bold rounded-lg bg-white shadow-sm">{op}</button>
                        ))}
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Phone Number</label>
                        <input 
                          type="tel" 
                          value={momoPhone}
                          onChange={(e) => setMomoPhone(e.target.value)}
                          placeholder="+237 6XX XXX XXX" 
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </motion.div>
                  )}

                  {paymentMethod === 'Card' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Card Number</label>
                        <input 
                          type="text" 
                          placeholder="**** **** **** ****" 
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Expiry</label>
                          <input 
                            type="text" 
                            placeholder="MM/YY" 
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">CVV</label>
                          <input 
                            type="text" 
                            placeholder="***" 
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {paymentMethod === 'Bank' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Bank Name</span>
                          <span className="font-bold">UBA Cameroon</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Account Name</span>
                          <span className="font-bold">JOËL MIKAM</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Account Number</span>
                          <span className="font-bold">14011000529</span>
                        </div>
                        <div className="pt-2 text-[10px] text-slate-400 italic">
                          Please include your User ID in the transfer reference.
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {paymentMethod === 'Crypto' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Wallet Address</label>
                        <input 
                          type="text" 
                          value={cryptoAddress}
                          onChange={(e) => setCryptoAddress(e.target.value)}
                          placeholder="0x... or Wallet Address" 
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 font-mono text-xs"
                        />
                      </div>
                      <div className="p-4 bg-slate-900 rounded-2xl text-white text-xs space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Official USDT (TRC20) Address</span>
                          <button className="text-emerald-400 font-bold" onClick={() => { navigator.clipboard.writeText('TX7n9V8qW2m5L1p4K3j6H9g8F7d6S5a4'); alert('Address copied!'); }}>Copy</button>
                        </div>
                        <div className="p-3 bg-white/5 rounded-xl break-all font-mono text-[10px]">
                          TX7n9V8qW2m5L1p4K3j6H9g8F7d6S5a4
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Only send USDT via TRC20 network to this address.
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {paymentMethod === 'PayPal' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">PayPal Email</label>
                        <input 
                          type="email" 
                          value={paypalEmail}
                          onChange={(e) => setPaypalEmail(e.target.value)}
                          placeholder="your-email@example.com" 
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 italic">
                        Transactions will be processed via PayPal Secure Checkout.
                      </p>
                    </motion.div>
                  )}

                  {paymentMethod === 'Wire' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Bank Name</label>
                        <input 
                          type="text" 
                          value={wireDetails.bankName}
                          onChange={(e) => setWireDetails({...wireDetails, bankName: e.target.value})}
                          placeholder="e.g. JP Morgan Chase" 
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Account Name</label>
                        <input 
                          type="text" 
                          value={wireDetails.accountName}
                          onChange={(e) => setWireDetails({...wireDetails, accountName: e.target.value})}
                          placeholder="Full Name on Account" 
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Account / IBAN</label>
                          <input 
                            type="text" 
                            value={wireDetails.accountNumber}
                            onChange={(e) => setWireDetails({...wireDetails, accountNumber: e.target.value})}
                            placeholder="Account Number" 
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">SWIFT / BIC</label>
                          <input 
                            type="text" 
                            value={wireDetails.swift}
                            onChange={(e) => setWireDetails({...wireDetails, swift: e.target.value})}
                            placeholder="SWIFT Code" 
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Amount ({currentCurrency.symbol})</label>
                    <input 
                      type="number" 
                      value={momoAmount}
                      onChange={(e) => setMomoAmount(e.target.value)}
                      placeholder="Min. 10" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 font-bold"
                    />
                  </div>
                  <button 
                    onClick={handleWalletAction}
                    disabled={isProcessing}
                    className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all disabled:opacity-50"
                  >
                    {isProcessing ? 'Processing...' : `Confirm ${momoType}`}
                  </button>
                  
                  <div className="pt-4 border-t border-slate-100">
                    <button className="text-[10px] font-bold text-slate-400 hover:text-emerald-600 flex items-center gap-1 mx-auto uppercase tracking-wider">
                      <Shield size={10} /> Direct Deposit Accounts
                    </button>
                    <div className="mt-2 grid grid-cols-1 gap-2">
                      <div className="bg-slate-50 p-2 rounded-lg text-[10px] flex justify-between items-center">
                        <span className="font-bold text-slate-500">UBA: 14011000529</span>
                        <span className="text-emerald-600">Joël Mikam</span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg text-[10px] flex justify-between items-center">
                        <span className="font-bold text-amber-500">MTN: +237 699 932 926</span>
                        <span className="text-emerald-600">Joël Mikam</span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg text-[10px] flex justify-between items-center">
                        <span className="font-bold text-orange-500">OM: +237 672 175 723</span>
                        <span className="text-emerald-600">Joël Mikam</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-center text-slate-400">
                    Secure transaction powered by MJ NEXUS Aggregator.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Servisécur Booking Modal */}
        <AnimatePresence>
          {showBookingModal && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowBookingModal(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
              >
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-emerald-500 text-white">
                  <div>
                    <h3 className="text-xl font-bold">Réserver une Intervention</h3>
                    <p className="text-xs opacity-80">Sécurisé par Servisécur & MJ NEXUS</p>
                  </div>
                  <button onClick={() => setShowBookingModal(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <div className="p-8">
                  {/* Progress Bar */}
                  <div className="flex justify-between mb-8 relative">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
                    {[1, 2, 3].map(step => (
                      <div 
                        key={step}
                        className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${bookingStep >= step ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-white border-2 border-slate-200 text-slate-400'}`}
                      >
                        {step}
                      </div>
                    ))}
                  </div>

                  {bookingStep === 1 && (
                    <div className="space-y-6">
                      <h4 className="font-bold text-slate-900">Quel service recherchez-vous ?</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {['Plomberie', 'Électricité', 'Climatisation', 'Informatique'].map(s => (
                          <button 
                            key={s}
                            onClick={() => setBookingData({...bookingData, service: s})}
                            className={`p-4 rounded-2xl border-2 text-left transition-all ${bookingData.service === s ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 hover:border-emerald-200'}`}
                          >
                            <div className="font-bold text-sm">{s}</div>
                            <div className="text-[10px] text-slate-500">À partir de 5,000 FCFA</div>
                          </button>
                        ))}
                      </div>
                      <button 
                        disabled={!bookingData.service}
                        onClick={() => setBookingStep(2)}
                        className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all disabled:opacity-50"
                      >
                        Continuer
                      </button>
                    </div>
                  )}

                  {bookingStep === 2 && (
                    <div className="space-y-6">
                      <h4 className="font-bold text-slate-900">Planification & Adresse</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Date de l'intervention</label>
                          <input 
                            type="date" 
                            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:border-emerald-500"
                            onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Heure</label>
                            <input 
                              type="time" 
                              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:border-emerald-500"
                              onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Quartier</label>
                            <select 
                              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:border-emerald-500"
                              onChange={(e) => setBookingData({...bookingData, address: e.target.value})}
                            >
                              <option value="">Sélectionner</option>
                              <option value="Akwa">Akwa</option>
                              <option value="Bonapriso">Bonapriso</option>
                              <option value="Deido">Deido</option>
                              <option value="Logpom">Logpom</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <button onClick={() => setBookingStep(1)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all">Retour</button>
                        <button 
                          disabled={!bookingData.date || !bookingData.time || !bookingData.address}
                          onClick={() => setBookingStep(3)}
                          className="flex-1 py-4 bg-emerald-500 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all disabled:opacity-50"
                        >
                          Paiement
                        </button>
                      </div>
                    </div>
                  )}

                  {bookingStep === 3 && (
                    <div className="space-y-6">
                      <h4 className="font-bold text-slate-900">Confirmation & Paiement</h4>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Service</span>
                          <span className="font-bold">{bookingData.service}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Date & Heure</span>
                          <span className="font-bold">{bookingData.date} à {bookingData.time}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Lieu</span>
                          <span className="font-bold">{bookingData.address}</span>
                        </div>
                        <div className="border-t border-slate-200 pt-2 flex justify-between text-lg font-bold text-emerald-600">
                          <span>Total</span>
                          <span>7,500 FCFA</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="block text-xs font-bold text-slate-500 uppercase">Mode de Paiement</label>
                        <div className="grid grid-cols-3 gap-2">
                          {['wallet', 'momo', 'card'].map(m => (
                            <button 
                              key={m}
                              onClick={() => setBookingData({...bookingData, paymentMethod: m})}
                              className={`py-3 rounded-xl text-[10px] font-bold border-2 transition-all ${bookingData.paymentMethod === m ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-slate-100 text-slate-500'}`}
                            >
                              {m.toUpperCase()}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button 
                        onClick={() => {
                          alert("Intervention réservée avec succès ! Un technicien vous contactera.");
                          setShowBookingModal(false);
                          setBookingStep(1);
                        }}
                        className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all"
                      >
                        Confirmer la Réservation
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Ride Booking Modal */}
        <AnimatePresence>
          {showRideModal && selectedRide && (
            <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowRideModal(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
              >
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-emerald-500 text-white">
                  <div>
                    <h3 className="text-xl font-bold">Réserver ce trajet</h3>
                    <p className="text-xs opacity-80">Douala ↔ Yaoundé ↔ Kribi</p>
                  </div>
                  <button onClick={() => setShowRideModal(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <div className="p-8 space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <img src={selectedRide.image} alt={selectedRide.driver} className="w-16 h-16 rounded-full border-4 border-white shadow-sm" referrerPolicy="no-referrer" />
                    <div>
                      <div className="font-bold text-slate-900 text-lg">{selectedRide.driver}</div>
                      <div className="flex items-center gap-1 text-xs text-amber-500">
                        <Star size={12} className="fill-amber-500" />
                        <span>{selectedRide.rating} • Conducteur Vérifié</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Trajet</span>
                      <span className="font-bold text-slate-900">{selectedRide.from} → {selectedRide.to}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Date & Heure</span>
                      <span className="font-bold text-slate-900">{selectedRide.date} à {selectedRide.time}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Arrivée Estimée</span>
                      <span className="font-bold text-emerald-600 italic">{selectedRide.eta}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Véhicule</span>
                      <span className="font-bold text-slate-900">{selectedRide.car}</span>
                    </div>
                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                      <span className="text-lg font-bold text-slate-900">Prix par place</span>
                      <span className="text-2xl font-black text-emerald-600">{formatPrice(selectedRide.price)}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-500 uppercase">Nombre de places</label>
                    <div className="flex items-center gap-4">
                      {[1, 2, 3].map(n => (
                        <button 
                          key={n}
                          disabled={n > selectedRide.seats}
                          onClick={() => setSelectedSeats(n)}
                          className={`flex-1 py-3 rounded-xl font-bold border-2 transition-all ${selectedSeats === n ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-slate-100 text-slate-400 hover:border-emerald-100'}`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      if (balance < selectedRide.price * selectedSeats) {
                        alert("Solde insuffisant pour cette réservation.");
                        return;
                      }
                      setBalance(prev => prev - (selectedRide.price * selectedSeats));
                      alert(`Réservation confirmée pour ${selectedSeats} place(s) ! Le conducteur a été notifié.`);
                      setShowRideModal(false);
                      ReactGA.event({ category: 'Mobility', action: 'Book Ride', label: selectedRide.driver });
                    }}
                    className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all"
                  >
                    Confirmer la Réservation ({formatPrice(selectedRide.price * selectedSeats)})
                  </button>
                  <p className="text-[10px] text-center text-slate-400">
                    En confirmant, vous acceptez les conditions de covoiturage de MJ NEXUS.
                  </p>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Admin Modal */}
        <AnimatePresence>
          {showAdmin && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl"
              >
                <div className="bg-slate-900 p-8 text-white relative">
                  <button onClick={() => setShowAdmin(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white">
                    <X size={24} />
                  </button>
                  <div className="flex items-center gap-4 mb-6">
                    <Logo size="lg" light />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="text-xs text-slate-500 uppercase font-bold mb-1">Owner</div>
                      <div className="font-bold">Joël Mikam Djeute</div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="text-xs text-slate-500 uppercase font-bold mb-1">Security Level</div>
                      <div className="font-bold text-emerald-400">Level 10 (Root)</div>
                    </div>
                  </div>
                </div>
                <div className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-bold text-slate-900 flex items-center gap-2">
                        <MessageSquare size={16} className="text-emerald-500" />
                        Contact Info
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                          <span className="text-slate-500">Phone 1</span>
                          <span className="font-mono">+237 672 175 723</span>
                        </div>
                        <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                          <span className="text-slate-500">Phone 2</span>
                          <span className="font-mono">+237 699 932 926</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-bold text-slate-900 flex items-center gap-2">
                        <Globe size={16} className="text-emerald-500" />
                        Emails
                      </h4>
                      <div className="space-y-2 text-xs">
                        {['joelmikamd@gmail.com', 'joelmikamd1@gmail.com', 'contact@groupetansaah.com', 'joellmikamm@gmail.com'].map(email => (
                          <div key={email} className="p-2 bg-slate-50 rounded-lg font-mono truncate">{email}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl">
                    <div className="flex items-center gap-3 text-rose-600 font-bold mb-2">
                      <Lock size={18} />
                      Emergency Protocol
                    </div>
                    <p className="text-sm text-rose-700">
                      In case of unauthorized access, use the master password <span className="font-mono font-bold">mtnjoel0M@</span> to trigger a global lockdown and data encryption.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
                        <Users size={16} className="text-blue-500" />
                        User Behavior Insights
                      </h4>
                      <div className="h-40 bg-slate-50 rounded-xl border border-slate-100 p-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={MOCK_CHART_DATA}>
                            <defs>
                              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <Area type="monotone" dataKey="price" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUsers)" />
                          </AreaChart>
                        </ResponsiveContainer>
                        <div className="flex justify-between mt-1 px-2">
                          <span className="text-[8px] font-bold text-slate-400 uppercase">Retention: 85%</span>
                          <span className="text-[8px] font-bold text-emerald-500 uppercase">Growth: +12.4%</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
                        <Target size={16} className="text-indigo-500" />
                        Conversion Funnel
                      </h4>
                      <div className="space-y-2">
                        {[
                          { label: 'Visits', value: '12.5k', width: '100%', color: 'bg-slate-200' },
                          { label: 'Register', value: '8.2k', width: '65%', color: 'bg-blue-200' },
                          { label: 'Deposit', value: '3.1k', width: '25%', color: 'bg-emerald-200' },
                          { label: 'Winner', value: '1.2k', width: '10%', color: 'bg-amber-200' },
                        ].map(step => (
                          <div key={step.label} className="space-y-1">
                            <div className="flex justify-between text-[8px] font-bold uppercase text-slate-500">
                              <span>{step.label}</span>
                              <span>{step.value}</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div className={`h-full ${step.color}`} style={{ width: step.width }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
                        <Users size={16} className="text-blue-500" />
                        User Behavior Insights
                      </h4>
                      <div className="h-40 bg-slate-50 rounded-xl border border-slate-100 p-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={MOCK_CHART_DATA}>
                            <defs>
                              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <Area type="monotone" dataKey="price" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUsers)" />
                          </AreaChart>
                        </ResponsiveContainer>
                        <div className="flex justify-between mt-1 px-2">
                          <span className="text-[8px] font-bold text-slate-400 uppercase">Retention: 85%</span>
                          <span className="text-[8px] font-bold text-emerald-500 uppercase">Growth: +12.4%</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
                        <Target size={16} className="text-indigo-500" />
                        Conversion Funnel
                      </h4>
                      <div className="space-y-2">
                        {[
                          { label: 'Visits', value: '12.5k', width: '100%', color: 'bg-slate-200' },
                          { label: 'Register', value: '8.2k', width: '65%', color: 'bg-blue-200' },
                          { label: 'Deposit', value: '3.1k', width: '25%', color: 'bg-emerald-200' },
                          { label: 'Winner', value: '1.2k', width: '10%', color: 'bg-amber-200' },
                        ].map(step => (
                          <div key={step.label} className="space-y-1">
                            <div className="flex justify-between text-[8px] font-bold uppercase text-slate-500">
                              <span>{step.label}</span>
                              <span>{step.value}</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div className={`h-full ${step.color}`} style={{ width: step.width }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
                        <Zap size={16} className="text-amber-500" />
                        Performance & SEO
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between p-2 bg-slate-50 rounded-lg text-xs">
                          <span className="text-slate-500">Page Load Time</span>
                          <span className="font-bold text-emerald-600">0.8s (Excellent)</span>
                        </div>
                        <div className="flex justify-between p-2 bg-slate-50 rounded-lg text-xs">
                          <span className="text-slate-500">SEO Score</span>
                          <span className="font-bold text-emerald-600">100/100</span>
                        </div>
                        <div className="flex justify-between p-2 bg-slate-50 rounded-lg text-xs">
                          <span className="text-slate-500">Auto-Update SEO</span>
                          <span className="font-bold text-emerald-600">Enabled</span>
                        </div>
                        <button 
                          onClick={() => {
                            setIsOptimizing(true);
                            setTimeout(() => {
                              setIsOptimizing(false);
                              alert("Système optimisé ! Cache vidé et SEO mis à jour.");
                            }, 2000);
                          }}
                          disabled={isOptimizing}
                          className="w-full py-2 bg-emerald-500 text-white rounded-lg text-xs font-bold hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                        >
                          {isOptimizing ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
                          {isOptimizing ? "Optimisation..." : "Optimiser Maintenant"}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
                        <Shield size={16} className="text-rose-500" />
                        Security Monitor
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between p-2 bg-slate-50 rounded-lg text-xs">
                          <span className="text-slate-500">Active Threats</span>
                          <span className="font-bold text-emerald-600">0 Detected</span>
                        </div>
                        <div className="flex justify-between p-2 bg-slate-50 rounded-lg text-xs">
                          <span className="text-slate-500">SSL Status</span>
                          <span className="font-bold text-emerald-600">Valid</span>
                        </div>
                        <div className="flex justify-between p-2 bg-slate-50 rounded-lg text-xs">
                          <span className="text-slate-500">Fraud Detection</span>
                          <span className="font-bold text-emerald-600">AI Active</span>
                        </div>
                        <button className="w-full py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                          <ShieldCheck size={14} /> Run Security Audit
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-slate-900 border-b pb-2">System Controls</h4>
                      <button className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                        <FileText size={16} /> Access System Logs
                      </button>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-slate-900 border-b pb-2">Demo: Switch User Role</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {[1, 2, 3, 4, 5, 6].map(level => (
                          <button 
                            key={level}
                            onClick={() => setUserRole(level)}
                            className={`py-2 rounded-lg text-xs font-bold transition-all ${userRole === level ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                          >
                            L{level}
                          </button>
                        ))}
                      </div>
                      <p className="text-[10px] text-slate-400 italic">Testing access levels (L1: Basic, L2: Intermediate, L3: Supervisor, L4: Country, L5: Region, L6: Director General)</p>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-slate-900 border-b pb-2">Demo: Switch VIP Level</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {VIP_LEVELS.map(level => (
                          <button 
                            key={level}
                            onClick={() => setUserVipLevel(level)}
                            className={`py-2 rounded-lg text-xs font-bold transition-all ${userVipLevel === level ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                      <p className="text-[10px] text-slate-400 italic">Testing VIP levels (Platinum+ required for My Shop)</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating AI Assistant Bubble */}
        <motion.button 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setActiveTab('help')}
          className="fixed bottom-8 right-8 z-[150] w-16 h-16 bg-slate-900 text-emerald-400 rounded-full shadow-2xl flex items-center justify-center border-4 border-white group"
        >
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-bounce">
            1
          </div>
          <MessageCircle size={28} className="group-hover:animate-pulse" />
          <div className="absolute right-full mr-4 bg-slate-900 text-white text-[10px] font-bold px-3 py-2 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none shadow-xl">
            Besoin d'aide ? Je suis là !
          </div>
        </motion.button>
      </main>
    </div>
  );
}
