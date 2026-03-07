import React, { useState, useRef, useEffect } from 'react';
import { 
  HelpCircle, MessageSquare, Search, ChevronRight, 
  Trophy, ShoppingBag, HardHat, Activity, Navigation, 
  Truck, Megaphone, Wallet, GraduationCap, Shield, Send, Bot, Sparkles, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { geminiService } from '../services/geminiService';

const FEATURES = [
  {
    id: 'betting',
    title: 'Sports & P2P Betting',
    icon: Trophy,
    color: 'amber',
    description: 'Participez à des pools de paris transparents et sécurisés. Défiez la communauté sur des événements sportifs ou créez vos propres paris personnalisés (P2P).',
    details: [
      'Paris en direct sur le Football, Basketball, Tennis, E-Sports.',
      'Pools P2P : Créez des paris sur n\'importe quel sujet.',
      'Gaming Arena : Salles de jeux multijoueurs avec chat vocal intégré.'
    ]
  },
  {
    id: 'marketplace',
    title: 'Marketplace Global',
    icon: ShoppingBag,
    color: 'emerald',
    description: 'Accédez à notre marketplace B2B et B2C. Achetez et vendez des produits avec une logistique intégrée et des paiements sécurisés.',
    details: [
      'B2B : Achat en gros pour les entreprises avec MOQ.',
      'B2C : Shopping direct pour les particuliers.',
      'Optimisation IA : Outils pour les vendeurs pour booster leurs ventes.'
    ]
  },
  {
    id: 'servisecur',
    title: 'Servisécur (Services à Domicile)',
    icon: HardHat,
    color: 'blue',
    description: 'Connectez-vous à des techniciens certifiés pour tous vos besoins domestiques, en toute sécurité.',
    details: [
      'Plomberie, Électricité, Informatique, Maçonnerie.',
      'Techniciens vérifiés et notés par la communauté.',
      'Paiement sécurisé via le portefeuille MJ NEXUS.'
    ]
  },
  {
    id: 'health',
    title: 'MJ Health (Télémédecine)',
    icon: Activity,
    color: 'rose',
    description: 'Consultez des médecins certifiés depuis chez vous. Un accès rapide et abordable aux soins de santé.',
    details: [
      'Consultations vidéo avec des généralistes et spécialistes.',
      'Suivi médical et conseils personnalisés.',
      'Disponibilité 24/7 pour les urgences mineures.'
    ]
  },
  {
    id: 'mobility',
    title: 'Mobilité & Transport',
    icon: Navigation,
    color: 'purple',
    description: 'Déplacez-vous facilement en ville ou entre les régions avec nos services de transport innovants.',
    details: [
      'Ride Hailing : Commandez une moto ou une voiture en un clic.',
      'Covoiturage : Partagez vos trajets interurbains pour réduire les frais.',
      'Suivi en temps réel de votre chauffeur.'
    ]
  },
  {
    id: 'logistics',
    title: 'Logistique & Livraison',
    icon: Truck,
    color: 'orange',
    description: 'Expédiez vos colis ou organisez votre déménagement avec une efficacité maximale.',
    details: [
      'Livraison Express : Coursiers rapides pour vos documents et colis.',
      'Déménagement Intelligent : Service complet avec suivi en temps réel.',
      'Drones : Surveillance et livraison par drone pour les zones difficiles.'
    ]
  },
  {
    id: 'marketing',
    title: 'Marketing Hub',
    icon: Megaphone,
    color: 'indigo',
    description: 'Boostez votre entreprise avec nos outils de marketing de masse et d\'automatisation IA.',
    details: [
      'Bulk WhatsApp/SMS/Email : Touchez des milliers de clients.',
      'IA Auto-Pilot : Automatisation intelligente de votre WhatsApp Business.',
      'Mode Furtif : Évitez les blocages grâce à l\'imitation du comportement humain.'
    ]
  },
  {
    id: 'finance',
    title: 'Finance & Crypto',
    icon: Wallet,
    color: 'cyan',
    description: 'Gérez votre argent, vos cryptos et accédez à des micro-crédits dans un seul portefeuille.',
    details: [
      'Portefeuille multi-devises (XAF, EUR, USD).',
      'Trading Crypto : Achetez et vendez des actifs numériques.',
      'Micro-crédits : Prêts instantanés basés sur votre activité.'
    ]
  },
  {
    id: 'education',
    title: 'Education & Formation',
    icon: GraduationCap,
    color: 'slate',
    description: 'Apprenez de nouvelles compétences professionnelles avec nos cours certifiants.',
    details: [
      'Formations techniques (Drones, Solaire, Développement Web).',
      'Livraison gratuite du matériel pédagogique.',
      'Accès à vie aux ressources et à la communauté.'
    ]
  },
  {
    id: 'security',
    title: 'Sécurité Hiérarchique',
    icon: Shield,
    color: 'red',
    description: 'Un système de gestion robuste avec différents niveaux d\'accès pour assurer la sécurité de l\'écosystème.',
    details: [
      'Niveaux L1 à L6 : De l\'utilisateur basique au Directeur Général.',
      'Audit Logs : Traçabilité complète de toutes les actions administratives.',
      'Protection Anti-Fraude : Surveillance IA en temps réel.'
    ]
  }
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: 'Bonjour ! Je suis l\'assistant MJ NEXUS. Comment puis-je vous aider aujourd\'hui ?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMsg = inputMessage;
    setInputMessage('');
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const response = await geminiService.getHelpAssistant(userMsg, chatMessages);
      setChatMessages(prev => [...prev, { role: 'ai', text: response || "Désolé, je n'ai pas pu traiter votre demande." }]);
    } catch (error) {
      console.error("Chat error:", error);
      setChatMessages(prev => [...prev, { role: 'ai', text: "Une erreur est survenue. Veuillez réessayer." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const filteredFeatures = FEATURES.filter(f => 
    f.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-16">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black uppercase tracking-widest mb-6"
        >
          <HelpCircle size={14} />
          Centre d'Aide MJ NEXUS
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-black italic uppercase text-slate-900 mb-6 tracking-tighter">
          Comment pouvons-nous <span className="text-emerald-500">vous aider ?</span>
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg">
          Découvrez toutes les fonctionnalités de notre écosystème unifié ou posez vos questions à notre IA spécialisée.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-16 relative">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400">
          <Search size={24} />
        </div>
        <input 
          type="text"
          placeholder="Rechercher une fonctionnalité (ex: paris, marketplace, marketing...)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-16 pr-6 py-6 bg-white border-2 border-slate-100 rounded-3xl shadow-xl focus:outline-none focus:border-emerald-500 text-lg transition-all"
        />
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        {filteredFeatures.map((feature, idx) => (
          <motion.div 
            key={feature.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-lg hover:shadow-2xl transition-all group"
          >
            <div className="flex items-start gap-6">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform bg-${feature.color}-50 text-${feature.color}-600`}>
                <feature.icon size={32} />
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-black italic uppercase text-slate-900 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
                <div className="space-y-2">
                  {feature.details.map((detail, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-bold text-slate-700">
                      <ChevronRight size={14} className="text-emerald-500" />
                      {detail}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI Assistant CTA */}
      <div className="bg-slate-900 rounded-[3rem] p-12 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-emerald-500 rounded-full blur-[100px]" />
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-blue-500 rounded-full blur-[100px]" />
        </div>
        
        <div className="relative z-10">
          <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/20">
            <Bot size={40} className="text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black italic uppercase mb-6">
            Vous avez encore <span className="text-emerald-400">des questions ?</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-10">
            Notre IA experte est disponible 24/7 pour répondre à toutes vos interrogations sur le fonctionnement de l'application.
          </p>
          <button 
            onClick={() => setIsChatOpen(true)}
            className="px-10 py-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-emerald-500/20 flex items-center gap-3 mx-auto"
          >
            <MessageSquare size={20} />
            Lancer l'Assistant IA
          </button>
        </div>
      </div>

      {/* Chat Modal */}
      <AnimatePresence>
        {isChatOpen && (
          <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, y: 100, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.9 }}
              className="bg-white w-full max-w-2xl h-[80vh] rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Chat Header */}
              <div className="px-8 py-6 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Bot size={24} />
                  </div>
                  <div>
                    <h3 className="font-black italic uppercase text-sm tracking-widest">Expert MJ NEXUS</h3>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-[10px] font-bold text-emerald-400 uppercase">En ligne</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setIsChatOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-5 rounded-3xl ${
                      msg.role === 'user' 
                        ? 'bg-emerald-500 text-white rounded-tr-none shadow-lg shadow-emerald-500/10' 
                        : 'bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100'
                    }`}>
                      <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-strong:text-inherit">
                        <Markdown>{msg.text}</Markdown>
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-slate-50 p-5 rounded-3xl rounded-tl-none border border-slate-100 flex gap-1">
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="Posez votre question ici..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="w-full pl-6 pr-16 py-5 bg-white border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-emerald-500 shadow-sm transition-all"
                  />
                  <button 
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={20} />
                  </button>
                </div>
                <p className="text-[10px] text-center text-slate-400 mt-4 font-bold uppercase tracking-widest">
                  Propulsé par MJ NEXUS AI Engine
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
