import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { http, createConfig } from 'wagmi';
import { sepolia, mainnet } from 'wagmi/chains';

// Create wagmi config

// Define the chains you want to support
const chains = [mainnet, sepolia];

// Create http transports
const transports = {
  [mainnet.id]: http(
    `https://mainnet.infura.io/v3/${import.meta.env.VITE_PUBLIC_RPC_URL}`
  ),
  [sepolia.id]: http(
    `https://sepolia.infura.io/v3/${import.meta.env.VITE_PUBLIC_RPC_URL}`
  ),
  // Fallback to public transport for other chains
  fallback: http(),
};

 // Set up connectors
const { connectors } = getDefaultWallets({
  appName: "NFT-MINT",
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
  chains
})
 
// // Create wagmi config
export const wagmiConfig = createConfig({
  chains: [mainnet, sepolia],
  transports,
  connectors,
});




// import { useState, useEffect } from 'react';
// import { useAccount, useBalance, useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi';
// import { parseEther, formatEther } from 'viem';
// import { ethers } from 'ethers';
// import { NFT_ABI, NFT_CONTRACT_ADDRESS } from '../contract/nftAbi';
// import { useToast, ToastContainer } from './Toast';

// function NFTMinter() {
//   const { address, isConnected } = useAccount();
//   const { toasts, addToast, removeToast } = useToast();
//   const [isOwner, setIsOwner] = useState(false);
//   const [ownerMintTo, setOwnerMintTo] = useState('');
//   const [mintingInProgress, setMintingInProgress] = useState(false);
  
//   // Read contract data
//   const { data: contractName } = useContractRead({
//     address: NFT_CONTRACT_ADDRESS,
//     abi: NFT_ABI,
//     functionName: 'name',
//     watch: true,
//   });
  
//   const { data: maxSupply } = useContractRead({
//     address: NFT_CONTRACT_ADDRESS,
//     abi: NFT_ABI,
//     functionName: 'MAX_SUPPLY',
//     watch: true,
//   });
  
//   const { data: mintPrice } = useContractRead({
//     address: NFT_CONTRACT_ADDRESS,
//     abi: NFT_ABI,
//     functionName: 'mintPrice',
//     watch: true,
//   });
  
//   const { data: maxMintPerAddress } = useContractRead({
//     address: NFT_CONTRACT_ADDRESS,
//     abi: NFT_ABI,
//     functionName: 'maxMintPerAddress',
//     watch: true,
//   });
  
//   const { data: ownerAddress } = useContractRead({
//     address: NFT_CONTRACT_ADDRESS,
//     abi: NFT_ABI,
//     functionName: 'owner',
//     watch: true,
//   });
  
//   const { data: userMintCount } = useContractRead({
//     address: NFT_CONTRACT_ADDRESS,
//     abi: NFT_ABI,
//     functionName: 'mintCount',
//     args: [address],
//     enabled: !!address,
//     watch: true,
//   });
  
//   const { data: userNFTBalance } = useContractRead({
//     address: NFT_CONTRACT_ADDRESS,
//     abi: NFT_ABI,
//     functionName: 'balanceOf',
//     args: [address],
//     enabled: !!address,
//     watch: true,
//   });
  
//   // Check if current user is the contract owner
//   useEffect(() => {
//     if (address && ownerAddress) {
//       setIsOwner(address.toLowerCase() === ownerAddress.toLowerCase());
//     } else {
//       setIsOwner(false);
//     }
//   }, [address, ownerAddress]);
  
//   // Public mint configuration
//   const { config: publicMintConfig } = usePrepareContractWrite({
//     address: NFT_CONTRACT_ADDRESS,
//     abi: NFT_ABI,
//     functionName: 'publicMint',
//     value: mintPrice,
//     enabled: !!mintPrice && isConnected && Number(userMintCount || 0) < Number(maxMintPerAddress || 0),
//   });
  
//   const { 
//     write: publicMint,
//     isLoading: isPublicMintLoading,
//     isSuccess: isPublicMintSuccess,
//     isError: isPublicMintError,
//     error: publicMintError
//   } = useContractWrite(publicMintConfig);
  
//   // Owner mint configuration
//   const { config: ownerMintConfig } = usePrepareContractWrite({
//     address: NFT_CONTRACT_ADDRESS,
//     abi: NFT_ABI,
//     functionName: 'ownerMint',
//     args: [ownerMintTo || address],
//     enabled: isOwner && ethers.isAddress(ownerMintTo || address),
//   });
  
//   const { 
//     write: executeOwnerMint,
//     isLoading: isOwnerMintLoading,
//     isSuccess: isOwnerMintSuccess,
//     isError: isOwnerMintError,
//     error: ownerMintError
//   } = useContractWrite(ownerMintConfig);
  
//   // Withdraw configuration
//   const { config: withdrawConfig } = usePrepareContractWrite({
//     address: NFT_CONTRACT_ADDRESS,
//     abi: NFT_ABI,
//     functionName: 'withdraw',
//     enabled: isOwner,
//   });
  
//   const { 
//     write: executeWithdraw,
//     isLoading: isWithdrawLoading,
//     isSuccess: isWithdrawSuccess,
//     isError: isWithdrawError,
//     error: withdrawError
//   } = useContractWrite(withdrawConfig);
  
//   // Handle transaction status updates
//   useEffect(() => {
//     if (isPublicMintSuccess) {
//       addToast('NFT minted successfully!', 'success');
//       setMintingInProgress(false);
//     }
//     if (isPublicMintError) {
//       addToast(`Minting failed: ${publicMintError?.message || 'Unknown error'}`, 'error');
//       setMintingInProgress(false);
//     }
//     if (isOwnerMintSuccess) {
//       addToast('Owner mint successful!', 'success');
//       setMintingInProgress(false);
//     }
//     if (isOwnerMintError) {
//       addToast(`Owner mint failed: ${ownerMintError?.message || 'Unknown error'}`, 'error');
//       setMintingInProgress(false);
//     }
//     if (isWithdrawSuccess) {
//       addToast('Funds withdrawn successfully!', 'success');
//     }
//     if (isWithdrawError) {
//       addToast(`Withdrawal failed: ${withdrawError?.message || 'Unknown error'}`, 'error');
//     }
//   }, [
//     isPublicMintSuccess, isPublicMintError, publicMintError,
//     isOwnerMintSuccess, isOwnerMintError, ownerMintError,
//     isWithdrawSuccess, isWithdrawError, withdrawError
//   ]);
  
//   // Handle public mint button click
//   const handlePublicMint = async () => {
//     if (!isConnected) {
//       addToast('Please connect your wallet first', 'error');
//       return;
//     }
    
//     if (userMintCount >= maxMintPerAddress) {
//       addToast(`You've reached the maximum mint limit of ${maxMintPerAddress} NFTs`, 'error');
//       return;
//     }
    
//     try {
//       setMintingInProgress(true);
//       publicMint?.();
//     } catch (error) {
//       console.error('Minting error:', error);
//       addToast(`Error: ${error.message}`, 'error');
//       setMintingInProgress(false);
//     }
//   };
  
//   // Handle owner mint button click
//   const handleOwnerMint = async () => {
//     if (!isOwner) {
//       addToast('Only the contract owner can use this function', 'error');
//       return;
//     }
    
//     if (!ethers.isAddress(ownerMintTo)) {
//       addToast('Please enter a valid Ethereum address', 'error');
//       return;
//     }
    
//     try {
//       setMintingInProgress(true);
//       executeOwnerMint?.();
//     } catch (error) {
//       console.error('Owner mint error:', error);
//       addToast(`Error: ${error.message}`, 'error');
//       setMintingInProgress(false);
//     }
//   };
  
//   // Handle withdraw button click
//   const handleWithdraw = async () => {
//     if (!isOwner) {
//       addToast('Only the contract owner can withdraw funds', 'error');
//       return;
//     }
    
//     try {
//       executeWithdraw?.();
//     } catch (error) {
//       console.error('Withdraw error:', error);
//       addToast(`Error: ${error.message}`, 'error');
//     }
//   };
  
//   // Format price for display
//   const formattedPrice = mintPrice ? formatEther(mintPrice) : '0';
  
//   return (
//     <div className="max-w-3xl mx-auto">
//       {/* Contract Information */}
//       <div className="bg-gray-800 rounded-lg p-6 mb-8 shadow-lg">
//         <h2 className="text-xl font-bold mb-4">{contractName || 'NiyiToken'} NFT</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="bg-gray-700 p-4 rounded-lg">
//             <p className="text-gray-400">Price</p>
//             <p className="text-xl font-bold">{formattedPrice} ETH</p>
//           </div>
//           <div className="bg-gray-700 p-4 rounded-lg">
//             <p className="text-gray-400">Max Supply</p>
//             <p className="text-xl font-bold">{maxSupply?.toString() || '10000'}</p>
//           </div>
//           <div className="bg-gray-700 p-4 rounded-lg">
//             <p className="text-gray-400">Max Mint Per Address</p>
//             <p className="text-xl font-bold">{maxMintPerAddress?.toString() || '20'}</p>
//           </div>
//           <div className="bg-gray-700 p-4 rounded-lg">
//             <p className="text-gray-400">Your NFT Balance</p>
//             <p className="text-xl font-bold">{userNFTBalance?.toString() || '0'}</p>
//           </div>
//         </div>
//       </div>
      
//       {/* Public Mint Section */}
//       <div className="bg-gray-800 rounded-lg p-6 mb-8 shadow-lg">
//         <h2 className="text-xl font-bold mb-4">Mint Your NFT</h2>
        
//         {isConnected ? (
//           <div>
//             <p className="mb-4">
//               You have minted {userMintCount?.toString() || '0'} out of {maxMintPerAddress?.toString() || '20'} NFTs.
//             </p>
            
//             <button
//               onClick={handlePublicMint}
//               disabled={!publicMint || isPublicMintLoading || mintingInProgress || Number(userMintCount || 0) >= Number(maxMintPerAddress || 0)}
//               className={`w-full py-3 px-6 rounded-lg font-bold transition-colors ${
//                 !publicMint || isPublicMintLoading || mintingInProgress || Number(userMintCount || 0) >= Number(maxMintPerAddress || 0)
//                   ? 'bg-gray-600 cursor-not-allowed'
//                   : 'bg-blue-600 hover:bg-blue-700'
//               }`}
//             >
//               {isPublicMintLoading || mintingInProgress
//                 ? 'Minting...'
//                 : Number(userMintCount || 0) >= Number(maxMintPerAddress || 0)
//                 ? 'Mint Limit Reached'
//                 : `Mint NFT for ${formattedPrice} ETH`}
//             </button>
//           </div>
//         ) : (
//           <p className="text-center">Connect your wallet to mint NFTs</p>
//         )}
//       </div>
      
//       {/* Owner Controls - Only visible to contract owner */}
//       {isOwner && (
//         <div className="bg-gray-800 rounded-lg p-6 mb-8 shadow-lg border border-yellow-600">
//           <h2 className="text-xl font-bold mb-4 text-yellow-400">Owner Controls</h2>
          
//           <div className="mb-6">
//             <h3 className="text-lg font-semibold mb-2 text-yellow-400">Owner Mint</h3>
//             <div className="flex gap-4">
//               <input
//                 type="text"
//                 value={ownerMintTo}
//                 onChange={(e) => setOwnerMintTo(e.target.value)}
//                 placeholder="Enter address to mint to"
//                 className="flex-1 p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-400 focus:outline-none"
//               />
//               <button
//                 onClick={handleOwnerMint}
//                 disabled={!executeOwnerMint || isOwnerMintLoading || mintingInProgress}
//                 className={`py-2 px-4 rounded font-bold ${
//                   !executeOwnerMint || isOwnerMintLoading || mintingInProgress
//                     ? 'bg-gray-600 cursor-not-allowed'
//                     : 'bg-yellow-600 hover:bg-yellow-700'
//                 }`}
//               >
//                 {isOwnerMintLoading ? 'Minting...' : 'Owner Mint'}
//               </button>
//             </div>
//           </div>
          
//           <div>
//             <h3 className="text-lg font-semibold mb-2 text-yellow-400">Withdraw Funds</h3>
//             <button
//               onClick={handleWithdraw}
//               disabled={!executeWithdraw || isWithdrawLoading}
//               className={`w-full py-2 px-4 rounded font-bold ${
//                 !executeWithdraw || isWithdrawLoading
//                   ? 'bg-gray-600 cursor-not-allowed'
//                   : 'bg-yellow-600 hover:bg-yellow-700'
//               }`}
//             >
//               {isWithdrawLoading ? 'Withdrawing...' : 'Withdraw Contract Balance'}
//             </button>
//           </div>
//         </div>
//       )}
      
//       {/* Toast notifications */}
//       <ToastContainer toasts={toasts} removeToast={removeToast} />
//     </div>
//   );
// }

// export default NFTMinter;


