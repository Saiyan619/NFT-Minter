import React from 'react';
import { ChevronDown } from 'lucide-react';

const Hero = () => {
  // Function to smooth scroll to create mint form section
  const scrollToExplore = () => {
    const exploreSection = document.getElementById('nft_section');
    if (exploreSection) {
      exploreSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Featured NFT data
  const featuredNFTs = [
    {
      id: 'nft-1',
      image: 'https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?q=80&w=1000',
      name: 'Quantum Edge #28',
      creator: '0x8e4d...3f2a',
      price: '0.85 ETH'
    },
    {
      id: 'nft-2',
      image: '/original-217e9072b56cdda8160ad5f4a5b2ff6d.webp',
      name: 'Neo Genesis #17',
      creator: '0x2c7b...9e4f',
      price: '1.2 ETH'
    },
    {
      id: 'nft-3',
      image: '/original-2cd98136c561ef9e74c1810e95017475.webp',
      name: 'Digital Soul #53',
      creator: '0x6f1e...7b3c',
      price: '0.95 ETH'
    }
  ];

  return (
    <div className="relative min-h-screen py-12 md:py-24 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-2/3 left-1/2 w-72 h-72 bg-teal-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBtLTMwIDBhMzAgMzAgMCAxIDAgNjAgMCAzMCAzMCAwIDEgMC02MCAwIiBzdHJva2Utb3BhY2l0eT0iLjA1IiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iLjUiLz48cGF0aCBkPSJNMzAgMzBtLTI1IDBhMjUgMjUgMCAxIDAgNTAgMCAyNSAyNSAwIDEgMC01MCAwIiBzdHJva2Utb3BhY2l0eT0iLjA1IiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iLjUiLz48cGF0aCBkPSJNMzAgMzBtLTIwIDBhMjAgMjAgMCAxIDAgNDAgMCAyMCAyMCAwIDEgMC00MCAwIiBzdHJva2Utb3BhY2l0eT0iLjA1IiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iLjUiLz48L2c+PC9zdmc+')]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-12">
          {/* Hero Text Content */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <div className="inline-block px-3 py-1 mb-6 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
              <span className="text-xs md:text-sm font-medium text-blue-400">Empowering Digital Creators</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Create & Mint
              </span>
              <br />
              Extraordinary NFTs Under One Token
            </h1>
            
            <p className="text-lg text-gray-300 mb-8 max-w-lg">
              Easily mint your digital creations into NFTs with just a few clicks. No coding required, just your creativity. </p>
            
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <button 
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
                onClick={scrollToExplore}
              >
                Create NFT
                </button>
          
            </div>
            
          </div>
          
          {/* Featured NFT Card */}
          <div className="w-full md:w-1/2 perspective-1000">
            <div className="relative w-full aspect-square max-w-md mx-auto transform transition-transform hover:rotate-y-6 hover:scale-105 duration-700">
              {/* Main featured NFT */}
              <div className="relative z-20 w-full h-full rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 shadow-xl overflow-hidden group">
                <div className="absolute inset-0.5 rounded-2xl overflow-hidden">
                  <img 
                    src={featuredNFTs[0].image} 
                    alt={featuredNFTs[0].name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                
                {/* NFT Info */}
                <div className="absolute left-0 right-0 bottom-0 bg-gradient-to-t from-gray-900 via-gray-900/90 to-transparent p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">NT</span>
                      </div>
                      <span className="text-gray-400 text-sm">{featuredNFTs[0].creator}</span>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-gray-800/80 text-xs font-medium text-white">
                      Current Bid
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-1">{featuredNFTs[0].name}</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400">Current Bid</p>
                      <p className="text-lg font-bold text-white">{featuredNFTs[0].price}</p>
                    </div>
                    <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white text-sm font-medium transition-colors">
                      Place Bid
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Background small NFTs */}
              <div className="absolute top-8 -right-4 md:-right-8 w-32 h-32 md:w-40 md:h-40 rotate-6 z-10 rounded-xl bg-gray-800 border border-gray-700 overflow-hidden shadow-lg">
                <img 
                  src={featuredNFTs[1].image}
                  alt={featuredNFTs[1].name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="absolute -bottom-4 -left-4 md:-left-8 w-28 h-28 md:w-36 md:h-36 -rotate-3 z-10 rounded-xl bg-gray-800 border border-gray-700 overflow-hidden shadow-lg">
                <img 
                  src={featuredNFTs[2].image}
                  alt={featuredNFTs[2].name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll down indicator */}
        <div className="mt-12 flex justify-center">
          <button 
            onClick={scrollToExplore}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Scroll down"
          >
            <ChevronDown className="h-6 w-6 animate-bounce" />
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default Hero;