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
  
  // Hook for transaction step processing
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
      }, 2000);
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

  
  // Prepare contract write for withdraw
  const { writeContract: writeWithdraw } = useWriteContract()
  

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
      <NftStats maxSupply ={maxSupply} maxMintPerAddress={maxMintPerAddress} nftMintRemaining={nftMintRemaining} totalMinted={totalMinted} />
        {/* <MintForm image={image} name={name} desc={desc} handleMint={handleMint} /> */}
        <MintForm mintPrice={mintPrice} handleWithdraw={handleWithdraw} />
        <footer>
        <div className='text-white mt-10 text-center'>
            <p className='text-sm'>Powered By</p>
            <span className='text-2xl font-bold'>NiyiToken</span>
            <p className='text-sm'>Copyright © 2025 NiyiToken</p>
            <p className='text-sm'>All rights reserved</p>

          
          <span>Built By NIYI</span>
        </div>
      </footer>
      </div>      
      
      
    </div>
  )
}

export default Home