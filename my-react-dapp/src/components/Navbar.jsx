import React, { useState } from 'react';
import WalletConnect from './WalletConnect';
// If you want to use the Wallet icon, uncomment:
// import { Wallet, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Explore', href: '#explore' },
    { name: 'Collections', href: '#collections' },
    { name: 'Create', href: '#create' }
  ];

  return (
    <nav className="sticky top-0 z-50 w-full px-4 py-3 md:py-4 bg-gray-900/90 backdrop-blur-sm border-b border-blue-500/20">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-white font-bold text-xl">N</span>
          </div>
          <div>
            <span className="font-bold text-xl text-white">NiyiToken</span>
            <span className="block text-xs text-blue-300/70">NTK</span>
          </div>
        </div>

      

        {/* Wallet Connect Button */}
          <WalletConnect />

      </div>

      
    </nav>
  );
};

export default Navbar;