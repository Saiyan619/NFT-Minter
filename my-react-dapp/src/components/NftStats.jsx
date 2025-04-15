import React from 'react'

const NftStats = () => {
    const stats = [
        { title: "Total Minted", value: 1000 },
        { title: "Total NFTs", value: 2 },
        { title: "NFTs Remaining", value: 3 },
        { title: "Max Mint Per Wallet", value: 4 },
      ];
    
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto py-10 px-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-gray-900 border border-gray-700 rounded-2xl p-6 shadow-md text-center"
            >
              <h3 className="text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">
                {stat.title}
              </h3>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>
  )
}

export default NftStats