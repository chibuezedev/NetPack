/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Shield, Eye, Network, Bot, GitBranch } from "lucide-react";
import { Card } from "./ui/card";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-indigo-600" />
            <span className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-transparent bg-clip-text">
              ChainGuard
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <a href="#features" className="text-gray-600 hover:text-gray-900">
              Features
            </a>
            <a href="#solutions" className="text-gray-600 hover:text-gray-900">
              Solutions
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900">
              Pricing
            </a>
            <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Hero = () => {
  return (
    <div className="pt-24 pb-16 text-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6">
          <span className="bg-gradient-to-r from-indigo-600 to-blue-600 text-transparent bg-clip-text">
            Secure Your Web3 Future
          </span>
        </h1>
        <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
          Advanced blockchain security monitoring powered by ML. Protect your
          smart contracts and dApps across multiple chains in real-time.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <button className="px-8 py-3 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
            Start Monitoring
          </button>
          <button className="px-8 py-3 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50">
            View Demo
          </button>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <Card className="flex flex-col items-center text-center p-6">
      <div className="rounded-full bg-indigo-100 p-3 mb-4">
        <Icon className="w-6 h-6 text-indigo-600" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </Card>
  );
};

const Features = () => {
  const features = [
    {
      icon: Eye,
      title: "Real-Time Detection",
      description: "ML-powered anomaly detection across multiple chains",
    },
    {
      icon: Network,
      title: "Attack Surface Mapping",
      description: "Comprehensive vulnerability assessment and scoring",
    },
    {
      icon: Bot,
      title: "Smart Analysis",
      description: "Behavioral fingerprinting and pattern recognition",
    },
    {
      icon: GitBranch,
      title: "Multi-Chain Support",
      description: "Monitor and analyze across different blockchains",
    },
  ];

  return (
    <div className="py-16 bg-gray-50" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">
          Advanced Security Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="w-6 h-6 text-indigo-400" />
              <span className="font-bold text-lg">ChainGuard</span>
            </div>
            <p className="text-gray-400">
              Securing the future of Web3 with advanced AI-powered protection
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Documentation
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Careers
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Security
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      <Footer />
    </div>
  );
};

export default Home;
