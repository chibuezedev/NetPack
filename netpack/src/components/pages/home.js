import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, Twitter, MessageCircle, ChevronDown, 
  BarChart3, Lock, Zap, Globe, Users, Coins,
  ArrowRight, ChevronUp
} from 'lucide-react';
import PresaleTiers from './presale';

const TokenLaunch = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });
  const [activeTab, setActiveTab] = useState('tokenomics');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [hoveredPrice, setHoveredPrice] = useState(null);

  // Scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Countdown timer logic
  useEffect(() => {
    const launchDate = new Date();
    launchDate.setDate(launchDate.getDate() + 30);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate.getTime() - now;

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Enhanced animation variants
  const heroVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const glowVariants = {
    animate: {
      boxShadow: [
        "0 0 20px rgba(56, 189, 248, 0.3)",
        "0 0 40px rgba(56, 189, 248, 0.5)",
        "0 0 20px rgba(56, 189, 248, 0.3)"
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const tokenomicsData = [
    { label: "Presale", value: "40%" },
    { label: "Liquidity", value: "30%" },
    { label: "Development", value: "20%" },
    { label: "Marketing", value: "10%" }
  ];

  const roadmapData = [
    { quarter: "Q1 2025", title: "Launch Phase", items: ["Token Launch", "Exchange Listings", "Marketing Campaign"] },
    { quarter: "Q2 2025", title: "Growth Phase", items: ["Mobile App", "Partnership Program", "Community Expansion"] },
    { quarter: "Q3 2025", title: "Ecosystem Phase", items: ["DeFi Products", "NFT Integration", "Cross-chain Bridge"] },
    { quarter: "Q4 2025", title: "Scale Phase", items: ["Global Expansion", "Enterprise Solutions", "DAO Governance"] }
  ];

  const pricingTiers = [
    { name: "Early Bird", price: "0.001 ETH", features: ["Minimum 0.1 ETH", "25% Bonus Tokens", "Early Access"] },
    { name: "Premium", price: "0.002 ETH", features: ["Minimum 0.5 ETH", "15% Bonus Tokens", "Premium Support"] },
    { name: "Standard", price: "0.003 ETH", features: ["No Minimum", "5% Bonus Tokens", "Regular Support"] }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-black text-white overflow-hidden">
      {/* Hero Section - Enhanced with particle effect background */}
      <motion.div 
        className="relative container mx-auto px-4 pt-20 pb-32 text-center"
        initial="hidden"
        animate="visible"
        variants={heroVariants}
      >
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            background: [
              "radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.25) 0%, transparent 50%)",
              "radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)"
            ]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="inline-block mb-8"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Rocket size={64} className="text-cyan-400" />
          </motion.div>
        </motion.div>
        
        <h1 className="text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
          COSMIC TOKEN
        </h1>
        <motion.p 
          className="text-2xl mb-12 text-gray-300"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          Revolutionizing DeFi with Next-Gen Technology
        </motion.p>

        {/* Enhanced Countdown Timer */}
        <motion.div 
          className="grid grid-cols-4 gap-4 max-w-2xl mx-auto mb-12"
          variants={glowVariants}
          animate="animate"
        >
          {Object.entries(timeLeft).map(([unit, value]) => (
            <motion.div 
              key={unit}
              className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-purple-500/30"
              whileHover={{ scale: 1.05, borderColor: "rgba(168, 85, 247, 0.5)" }}
            >
              <motion.div 
                className="text-4xl font-bold"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {value}
              </motion.div>
              <div className="text-sm text-gray-400">{unit.toUpperCase()}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced CTA Button */}
        <motion.button
          className="bg-gradient-to-r from-cyan-500 to-purple-500 px-8 py-4 rounded-full text-lg font-bold hover:from-cyan-600 hover:to-purple-600 transition-all shadow-lg"
          whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(139, 92, 246, 0.5)" }}
          whileTap={{ scale: 0.95 }}
        >
          Join Presale Now
        </motion.button>
      </motion.div>

          {/* New Pricing Tiers Section */}
          <PresaleTiers />
      {/* <div className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
          Presale Tiers
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={index}
              className="relative bg-gradient-to-b from-gray-800/50 to-purple-900/30 backdrop-blur-lg rounded-xl p-6 border border-purple-500/30"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ scale: 1.02 }}
              onHoverStart={() => setHoveredPrice(index)}
              onHoverEnd={() => setHoveredPrice(null)}
            >
              <motion.div
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20"
                animate={{
                  opacity: hoveredPrice === index ? 1 : 0
                }}
                transition={{ duration: 0.3 }}
              />
              <h3 className="text-2xl font-bold mb-4">{tier.name}</h3>
              <p className="text-3xl font-bold mb-6 text-cyan-400">{tier.price}</p>
              <ul className="space-y-3">
                {tier.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-center gap-2">
                    <ArrowRight size={16} className="text-purple-400" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div> */}

      {/* New Interactive Tabs Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="flex justify-center mb-8 space-x-4">
          {['tokenomics', 'roadmap'].map((tab) => (
            <motion.button
              key={tab}
              className={`px-6 py-2 rounded-full text-lg font-semibold ${
                activeTab === tab 
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white' 
                  : 'bg-white/10 text-gray-300'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'tokenomics' ? (
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {tokenomicsData.map((item, index) => (
                    <motion.div
                      key={index}
                      className="bg-white/5 backdrop-blur-lg rounded-lg p-4"
                      initial={{ width: "0%" }}
                      whileInView={{
                        width: "100%",
                        transition: { duration: 1, delay: index * 0.2 }
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <span>{item.label}</span>
                        <span className="text-cyan-400 font-bold">{item.value}</span>
                      </div>
                      <motion.div
                        className="mt-2 h-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                        initial={{ width: "0%" }}
                        whileInView={{
                          width: item.value,
                          transition: { duration: 1, delay: index * 0.2 }
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
                <div className="bg-white/5 backdrop-blur-lg rounded-lg p-6">
                  <h3 className="text-2xl font-bold mb-4">Token Details</h3>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-2">
                      <Coins className="text-cyan-400" />
                      <span>Total Supply: 1,000,000,000 COSMIC</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Lock className="text-cyan-400" />
                      <span>Liquidity Lock: 2 Years</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <BarChart3 className="text-cyan-400" />
                      <span>Anti-Whale Mechanism</span>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {roadmapData.map((phase, index) => (
                  <motion.div
                    key={index}
                    className="bg-white/5 backdrop-blur-lg rounded-lg p-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="text-cyan-400 font-bold mb-2">{phase.quarter}</div>
                    <h3 className="text-xl font-bold mb-4">{phase.title}</h3>
                    <ul className="space-y-2">
                      {phase.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-center gap-2">
                          <ArrowRight size={16} className="text-purple-400" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Enhanced Features Section */}
      <div className="container mx-auto px-4 py-20">
              <div className="grid md:grid-cols-3 gap-8">
              {[
            { 
              icon: Globe, 
              title: "Global Ecosystem", 
              desc: "Seamlessly connect with users worldwide through our cross-chain infrastructure" 
            },
            { 
              icon: Lock, 
              title: "Maximum Security", 
              desc: "Advanced encryption and multi-signature protection for your assets" 
            },
            { 
              icon: Zap, 
              title: "Lightning Fast", 
              desc: "Near-instant transactions with minimal gas fees" 
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="group relative bg-gradient-to-b from-gray-800/50 to-purple-900/30 backdrop-blur-lg rounded-xl p-8 border border-purple-500/30"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100"
                transition={{ duration: 0.3 }}
              />
              <motion.div
                className="mb-6 text-cyan-400"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <feature.icon size={40} />
              </motion.div>
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* New Statistics Section */}
      <div className="container mx-auto px-4 py-20">
        <motion.div 
          className="grid md:grid-cols-4 gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {[
            { label: "Total Users", value: "50K+", icon: Users },
            { label: "Daily Volume", value: "$2.5M", icon: BarChart3 },
            { label: "Secure Wallets", value: "35K+", icon: Lock },
            { label: "Countries", value: "150+", icon: Globe }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white/5 backdrop-blur-lg rounded-lg p-6 text-center"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.div
                className="text-cyan-400 mx-auto mb-4"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <stat.icon size={32} />
              </motion.div>
              <div className="text-3xl font-bold mb-2">{stat.value}</div>
              <div className="text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* New FAQ Section with Accordion */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {[
            {
              q: "What is COSMIC Token?",
              a: "COSMIC Token is a next-generation cryptocurrency designed to revolutionize decentralized finance with advanced features and sustainable tokenomics."
            },
            {
              q: "How can I participate in the presale?",
              a: "You can participate in the presale by connecting your wallet and choosing one of our three tier options. Each tier offers unique benefits and bonus tokens."
            },
            {
              q: "Is there a vesting period?",
              a: "Yes, tokens are subject to a strategic vesting schedule to ensure long-term project stability and prevent market manipulation."
            }
          ].map((faq, index) => (
            <motion.div
              key={index}
              className="bg-white/5 backdrop-blur-lg rounded-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.div
                className="p-6 cursor-pointer"
                whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              >
                <h3 className="text-xl font-semibold">{faq.q}</h3>
                <p className="mt-2 text-gray-400">{faq.a}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Enhanced Social Links Section */}
      <div className="container mx-auto px-4 py-12 text-center">
        <motion.div 
          className="flex justify-center gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          {[
            { Icon: Twitter, label: "Twitter", color: "text-cyan-400" },
            { Icon: ChevronDown, label: "Discord", color: "text-purple-400" },
            { Icon: MessageCircle, label: "Telegram", color: "text-blue-400" }
          ].map(({ Icon, label, color }, index) => (
            <motion.a
              key={label}
              href="#"
              className={`${color} hover:text-white transition-colors`}
              whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Icon size={32} />
            </motion.a>
          ))}
        </motion.div>
      </div>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            className="fixed bottom-8 right-8 bg-gradient-to-r from-cyan-500 to-purple-500 p-3 rounded-full shadow-lg"
            onClick={scrollToTop}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            whileHover={{ scale: 1.1 }}
          >
            <ChevronUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TokenLaunch;