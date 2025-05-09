import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { useReadContract, useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, formatEther } from 'viem';
import { contractAddress, contractAbi } from '../Constants/constant'
import { Upload, Image as ImageIcon } from 'lucide-react';
import NftPreview from './NftPReview';

const MintForm = ({mintPrice,handleWithdraw}) => {
  const [image, setImage] = useState("")
  const [name, setName] = useState("")
  const [desc, setDesc] = useState("")
  const [isLoading, setIsLoading] = useState(false);
   const [mintSuccess, setMintSuccess] = useState(false)
    // const [mintedTokenId, setMintedTokenId] = useState(null)
  const [mintError, setMintError] = useState("")


    // Get connected wallet address
    const { address } = useAccount()
  
  
  
  const handleImageChange = (e) => {
    setImage(e.target.files[0])
    console.log(e.target.files[0])
  }


    // Contract write hook for minting the NFT
    const { 
      data: hash,
      error: writeError,
      isPending,
      writeContract 
    } = useWriteContract()

   // Hook for transaction step processing
    const { 
      isLoading: isConfirming, 
      isSuccess: isConfirmed,
      error: confirmError 
    } = useWaitForTransactionReceipt({
      hash,
    })

  console.log(isLoading, isConfirming, isConfirmed, hash, writeError, confirmError)
    // Monitor transaction states
useEffect(() => {
  console.log({
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    writeError,
    confirmError
  })
  
  if (writeError) {
    setMintError(writeError.message || "Error sending transaction")
  }
  
  if (confirmError) {
    setMintError(confirmError.message || "Error confirming transaction")
  }
  
  if (isConfirmed) {
    setMintSuccess(true)
  }
}, [isPending, isConfirming, isConfirmed, hash, writeError, confirmError])
  const { data: ownerAddress } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'owner',
  })

  const isOwner = ownerAddress === address
console.log("isOwner", isOwner)  

  const handleMint = async () => {
      if (!image || !name || !desc) {
        console.error("Please upload an image and enter a name and description.");
        setMintError("Please upload an image and enter a name and description.");
        return;
      }
      
      // Reset states
      setMintError("");
      setMintSuccess(false);
    
      try {
        console.log("Starting mint process...");
        
        // Upload image to IPFS
        const formData = new FormData();
        formData.append("file", image);
        console.log("Uploading image to IPFS...");
        const fileResponse = await axios.post(
          'https://api.pinata.cloud/pinning/pinFileToIPFS',
          formData,
          {
            maxBodyLength: Infinity,
            headers: {
              'Content-Type': 'multipart/form-data',
              pinata_api_key: import.meta.env.VITE_PINATA_API_KEY,
              pinata_secret_api_key: import.meta.env.VITE_PINATA_SECRET_KEY,
            },
          }
        );
    
        const imageHash = fileResponse.data.IpfsHash;
        console.log("Image uploaded:", imageHash);
    
        // Upload metadata to IPFS
        const metadata = {
          name,
          description: desc,
          image: `ipfs://${imageHash}`,
        };
    
        console.log("Uploading metadata to IPFS...");
        const metadataResponse = await axios.post(
          'https://api.pinata.cloud/pinning/pinJSONToIPFS',
          metadata,
          {
            headers: {
              pinata_api_key: import.meta.env.VITE_PINATA_API_KEY,
              pinata_secret_api_key: import.meta.env.VITE_PINATA_SECRET_KEY,
            },
          }
        );
    
        const metadataHash = metadataResponse.data.IpfsHash;
        const tokenURI = `ipfs://${metadataHash}`;
        console.log("Metadata uploaded. TokenURI:", tokenURI);
    
        // Call the mint function using wagmi's writeContract hook
        console.log("Sending mint transaction to contract...");
        writeContract({
          address: contractAddress,
          abi: contractAbi,
          functionName: 'mintNFT',
          args: [tokenURI],
          value: mintPrice  // Make sure to include the value for payable functions
        });
        
        // The transaction hash will be available in the 'hash' variable
        // and handled by the useWaitForTransactionReceipt hook
        console.log("Mint transaction submitted, waiting for confirmation...");
      } catch (err) {
        console.error("Minting failed:", err);
        setMintError(err.message || "Error during minting process");
      }
    };

  
    // Prepare contract write for owner mint
  const { writeContract: writeOwnerMint } = useWriteContract()
  
    const handleOwnerMint = async () => {
      setMintError("");
      setMintSuccess(false);
      
      try {
        if (!image || !name || !desc) {
          console.error("Please upload an image and enter a name and description.");
          setMintError("Please upload an image and enter a name and description.");
          return;
        }
        
        console.log("Starting owner mint process...");
        setIsLoading(isPending)
        
        // Upload image and metadata to IPFS (similar to handleMint)
        const formData = new FormData();
        formData.append("file", image);
    
        const fileResponse = await axios.post(
          'https://api.pinata.cloud/pinning/pinFileToIPFS',
          formData,
          {
            maxBodyLength: Infinity,
            headers: {
              'Content-Type': 'multipart/form-data',
              pinata_api_key: import.meta.env.VITE_PINATA_API_KEY,
              pinata_secret_api_key: import.meta.env.VITE_PINATA_SECRET_KEY,
            },
          }
        );
    
        const imageHash = fileResponse.data.IpfsHash;
        console.log("Image uploaded:", imageHash);
        
        const metadata = {
          name,
          description: desc,
          image: `ipfs://${imageHash}`,
        };
    
        const metadataResponse = await axios.post(
          'https://api.pinata.cloud/pinning/pinJSONToIPFS',
          metadata,
          {
            headers: {
              pinata_api_key: import.meta.env.VITE_PINATA_API_KEY,
              pinata_secret_api_key: import.meta.env.VITE_PINATA_SECRET_KEY,
            },
          }
        );
    
        const metadataHash = metadataResponse.data.IpfsHash;
        const tokenURI = `ipfs://${metadataHash}`;
        console.log("Metadata uploaded. TokenURI:", tokenURI);
        
        // Call the ownerMint function with the correct arguments
        console.log("Sending owner mint transaction...");
        writeOwnerMint({
          address: contractAddress,
          abi: contractAbi,
          functionName: 'ownerMint',
          args: [address || '0xAd8915BDBa1F3fe2dbb2aFEb2da04B05313Cf9Ac', tokenURI]
        });
        
        console.log("Owner mint transaction submitted, waiting for confirmation...");
      } catch (err) {
        console.error("Owner mint failed:", err);
        setMintError(err.message || "Error during owner minting process");
      }
    };


  return (
    <div id='nft_section' className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className=" border border-gray-600 rounded-lg p-6">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white mb-6">Create Your NFT</h2>

          <div className="space-y-2">
            <label htmlFor="nftImage" className="text-white block">Upload Image</label>
            <div className="relative border-2 border-dashed border-gray-500 rounded-lg p-4 flex flex-col items-center justify-center h-48 bg-gray-700 hover:bg-gray-600 transition-colors cursor-pointer">
              <input
                id="nftImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {!image ? (
                <div className="flex flex-col items-center justify-center text-gray-300">
                  <Upload size={40} className="mb-2" />
                  <p className="text-sm">Click or drag to upload image</p>
                  <p className="text-xs mt-1">PNG, JPG, GIF up to 5MB</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-white">
                  <ImageIcon size={40} className="mb-2 text-blue-400" />
                  <p className="text-sm">Image uploaded successfully</p>
                  <p className="text-xs mt-1 text-blue-400">Click to change</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="nftName" className="text-white block">Name</label>
            <input
              id="nftName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter NFT name"
              className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="nftDescription" className="text-white block">Description</label>
            <textarea
              id="nftDescription"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Describe your NFT..."
              className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-500 text-white h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleMint}
            disabled={isPending || isConfirming}
            className="btn w-full py-3 px-6 rounded bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:opacity-90 transition-opacity"
          >
          {isPending ? 'Preparing Mint...' : isConfirming ? 'Confirming Mint...' : `Mint for ${mintPrice ? formatEther(mintPrice) : '0.0005'} ETH`}
          </button>  

          {isOwner && (
             <button
             onClick={handleOwnerMint}
             disabled={isLoading}
             className="w-full py-3 px-6 rounded bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:opacity-90 transition-opacity"
           >
             {isLoading ? 'Minting...' : 'Mint NFT Free(Owner Privildge)'}
           </button>
          )}
          
          {isOwner && (
             <button
             onClick={handleWithdraw}
             disabled={isPending || isConfirming}
             className="w-full py-3 px-6 rounded bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:opacity-90 transition-opacity"
           >
             {isPending || isConfirming ? 'Withdrawing Funds...' : 'Withdraw NFT Fee(Owner Privildge)'}
           </button>
          )}
        </div>
      </div>
      
{/* Component for the NFT preview */}
      <NftPreview
        name={name || 'NFT Name'}
        description={desc || 'NFT Description'}
        image={image}
      />
    </div>
  );
};

export default MintForm;
