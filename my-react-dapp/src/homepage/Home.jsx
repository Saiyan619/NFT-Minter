import React, {useState, useEffect} from 'react'
import axios from 'axios'
import WalletConnect from '../components/WalletConnect'
import { useReadContract, useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, formatEther, isAddress } from 'viem';
import { contractAddress, contractAbi, APIKey, APISecret } from '../Constants/constant'
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import NftStats from '../components/NftStats';
import MintForm from '../components/MintForm';

const Home = () => {
  const [image, setImage] = useState("")
  const [name, setName] = useState("")
  const [desc, setDesc] = useState("")
  const [mintSuccess, setMintSuccess] = useState(false)
  const [mintedTokenId, setMintedTokenId] = useState(null)
  const [mintError, setMintError] = useState("")
  
  // Get connected wallet address
  const { address } = useAccount()

  const handleName = (e) => {
    setName(e.target.value)
    console.log(e.target.value)
  }

  const handleDesc = (e) => {
    setDesc(e.target.value)
    console.log(e.target.value)
  }

  const handleImage = (e) => {
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
  
  const { 
    isLoading: isConfirming, 
    isSuccess: isConfirmed,
    error: confirmError 
  } = useWaitForTransactionReceipt({
    hash,
  })

  // Reset success message after 5 seconds
  useEffect(() => {
    if (mintSuccess) {
      const timer = setTimeout(() => {
        setMintSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [mintSuccess]);

  // Update state when transaction is confirmed
  useEffect(() => {
    if (isConfirmed) {
      console.log("✅ NFT MINTED SUCCESSFULLY!");
      console.log("Transaction hash:", hash);
      setMintSuccess(true);
      // Clear form after successful mint
      setName("");
      setDesc("");
      setImage("");
      
      // Refetch mint count to update UI
      refetchMintCount();
      
      // We would ideally get the tokenId from the event logs
      // For now, we'll just log that it was successful
    }
  }, [isConfirmed]);

  // Log errors
  useEffect(() => {
    if (writeError) {
      console.error("Mint transaction error:", writeError);
      setMintError(writeError.message || "Error submitting transaction");
    }
    if (confirmError) {
      console.error("Transaction confirmation error:", confirmError);
      setMintError(confirmError.message || "Error confirming transaction");
    }
  }, [writeError, confirmError]);

  // Read contract hooks
  const { data: maxSupply } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'MAX_SUPPLY'
  });

  const { data: mintPrice } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'mintPrice'
  })

  const { data: maxMintPerAddress } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'maxMintPerAddress'
  })

  const { data: nftMintRemaining, refetch: refetchMintCount } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'mintCount',
    args: [address || '0xAd8915BDBa1F3fe2dbb2aFEb2da04B05313Cf9Ac']
  })
  
  // Get total minted count
  const { data: totalMinted, refetch: refetchTotalMinted } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'totalMinted'
  })

  // Prepare contract write for owner mint
  const { writeContract: writeOwnerMint } = useWriteContract()
  
  // Prepare contract write for withdraw
  const { writeContract: writeWithdraw } = useWriteContract()
  
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

  const handleWithdraw = () => {
    console.log("Initiating withdraw transaction...");
    writeWithdraw({
      address: contractAddress,
      abi: contractAbi,
      functionName: 'withdraw'
    });
  };

  return (
    <div className="">
      <Navbar />
      <Hero />
      <div className='bg-[#1A1F2C] p-4'>
      <NftStats />
      <MintForm />
      </div>

      <WalletConnect />
      
      <div className="stats bg-gray-100 p-4 rounded-lg mb-6 mt-4">
        <h2 className="text-xl font-semibold mb-2">Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="stat-card">
            <span className="block">Total NFTs available: {maxSupply ? maxSupply.toString() : "loading..."}</span>
          </div>
          <div className="stat-card">
            <span className="block">Max mint per address: {maxMintPerAddress ? maxMintPerAddress.toString() : "loading..."}</span>
          </div>
          <div className="stat-card">
            <span className="block">NFTs minted by you: {nftMintRemaining !== undefined ? nftMintRemaining.toString() : "loading..."}</span>
          </div>
          <div className="stat-card">
            <span className="block">Total NFTs minted: {totalMinted !== undefined ? totalMinted.toString() : "loading..."}</span>
          </div>
        </div>
      </div>
      
      {/* Mint Form */}
      <div className="mint-form bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Mint a New NFT</h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-1">Image</label>
            <input onChange={handleImage} type='file' className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block mb-1">Name</label>
            <input onChange={handleName} value={name} type='text' className="w-full p-2 border rounded" placeholder='NFT Name' />
          </div>
          <div>
            <label className="block mb-1">Description</label>
            <textarea onChange={handleDesc} value={desc} className="w-full p-2 border rounded" rows="3" placeholder='NFT Description'></textarea>
          </div>
        </div>
      </div>
      
      {/* Mint Actions */}
      <div className="mint-actions space-y-4">
        <button 
          className='btn btn-primary w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400' 
          onClick={handleMint} 
          disabled={isPending || isConfirming}
        >
          {isPending ? 'Preparing Mint...' : isConfirming ? 'Confirming Mint...' : `Mint for ${mintPrice ? formatEther(mintPrice) : '0.0005'} ETH`}
        </button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            className='btn w-full p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700' 
            onClick={handleOwnerMint}
            disabled={isPending || isConfirming}
          >
            Owner Mint (Free)
          </button>
          
          <button 
            className='btn w-full p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700' 
            onClick={handleWithdraw}
            disabled={isPending || isConfirming}
          >
            Withdraw Funds
          </button>
        </div>
      </div>
      
      {/* Status Messages */}
      <div className="status-messages mt-6">
        {hash && (
          <div className="bg-blue-100 border-l-4 border-blue-500 p-4 mb-4">
            <p className="font-medium">Transaction sent!</p>
            <p className="text-sm break-all">Hash: {hash}</p>
          </div>
        )}
        
        {isConfirming && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
            <p>Transaction confirming... This may take a moment.</p>
          </div>
        )}
        
        {mintSuccess && (
          <div className="bg-green-100 border-l-4 border-green-500 p-4 mb-4">
            <p className="font-bold">✅ NFT MINTED SUCCESSFULLY!</p>
            <p>Your NFT has been minted and is now in your wallet.</p>
            {hash && <p className="text-sm mt-2">Transaction: {hash}</p>}
          </div>
        )}
        
        {mintError && (
          <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-4">
            <p className="font-bold">Error:</p>
            <p>{mintError}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home