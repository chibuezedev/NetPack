import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Sparkles, Zap } from 'lucide-react';

const PresaleTiers = () => {
  const [hoveredTier, setHoveredTier] = useState(null);

  const tiers = [
    {
      name: "Silver Access",
      icon: Zap,
      price: "0.1 SOL",
      originalPrice: "0.15 SOL",
      discount: "33%",
      features: [
        "Minimum Buy: 0.1 SOL",
        "10% Bonus Tokens",
        "Standard Support",
        "Public Sale Access"
      ],
      color: "from-gray-400 to-slate-500",
      shadowColor: "rgba(148, 163, 184, 0.4)"
    },
    {
      name: "Gold Access",
      icon: Star,
      price: "0.5 SOL",
      originalPrice: "0.75 SOL",
      discount: "33%",
      features: [
        "Minimum Buy: 0.5 SOL",
        "25% Bonus Tokens",
        "Priority Support",
        "Early Access",
        "Exclusive NFT Drop"
      ],
      recommended: true,
      color: "from-yellow-400 to-orange-500",
      shadowColor: "rgba(234, 179, 8, 0.4)"
    },
    {
      name: "Diamond Access",
      icon: Sparkles,
      price: "2 SOL",
      originalPrice: "3 SOL",
      discount: "33%",
      features: [
        "Minimum Buy: 2 SOL",
        "40% Bonus Tokens",
        "VIP Support",
        "Earliest Access",
        "Exclusive NFT Collection",
        "Private Community Access"
      ],
      color: "from-cyan-400 to-blue-500",
      shadowColor: "rgba(56, 189, 248, 0.4)"
    }
  ];

  return (
    <div className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400"
          >
            Choose Your Tier
          </motion.h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Join the future of DeFi with our exclusive presale tiers. 
            Early supporters get special benefits and bonus tokens.
          </p>
        </motion.div>

        {/* Tiers Grid */}
        <div className="grid md:grid-cols-3 gap-8 px-4">
          {tiers.map((tier, index) => (
            <motion.div
              key={index}
              className={`relative ${
                tier.recommended ? 'md:-mt-8' : ''
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              onHoverStart={() => setHoveredTier(index)}
              onHoverEnd={() => setHoveredTier(null)}
            >
              {/* Recommended Badge */}
              {/* {tier.recommended && (
                <div className="absolute -top-4 inset-x-0 flex justify-center">
                  <motion.div
                    className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-4 py-1 rounded-full text-sm font-semibold"
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  >
                    Most Popular
                  </motion.div>
                </div>
              )} */}

              {/* Card */}
              <motion.div
                className={`relative h-full rounded-2xl p-10 ${
                  tier.recommended 
                    ? 'bg-gradient-to-b from-purple-900/40 to-cyan-900/40' 
                    : 'bg-gray-900/40'
                } backdrop-blur-xl border border-gray-700 overflow-hidden`}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: `0 0 40px ${tier.shadowColor}`,
                }}
              >
                {/* Background Gradient */}
                <motion.div
                  className="absolute inset-0 opacity-0"
                  animate={{
                    opacity: hoveredTier === index ? 0.1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={`w-full h-full bg-gradient-to-br ${tier.color}`} />
                </motion.div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <motion.div
                    className={`inline-block p-3 rounded-xl bg-gradient-to-br ${tier.color} mb-6`}
                    animate={{
                      rotate: hoveredTier === index ? 360 : 0,
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <tier.icon size={24} className="text-white" />
                  </motion.div>

                  {/* Tier Name */}
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-end gap-2 mb-1">
                      <span className="text-4xl font-bold">{tier.price}</span>
                      <span className="text-gray-400 line-through mb-1">{tier.originalPrice}</span>
                    </div>
                    <div className="inline-block bg-green-500/20 text-green-400 text-sm px-2 py-1 rounded-full">
                      Save {tier.discount}
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-4 mb-8">
                    {tier.features.map((feature, fIndex) => (
                      <motion.li
                        key={fIndex}
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + fIndex * 0.1 }}
                      >
                        <Check className="text-green-400 mt-1 flex-shrink-0" size={16} />
                        <span className="text-gray-300">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <motion.button
                    className={`w-full py-3 px-6 rounded-xl font-semibold 
                      ${tier.recommended 
                        ? 'bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600' 
                        : 'bg-gray-800 hover:bg-gray-700'
                      } transition-all duration-200`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Get Started
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Notice */}
        <motion.div 
          className="text-center mt-12 text-gray-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p>Prices shown are in SOL. Additional network fees may apply.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default PresaleTiers;