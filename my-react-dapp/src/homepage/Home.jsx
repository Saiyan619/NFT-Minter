import React from 'react';
import { useReadContract, useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { contractAddress, contractAbi} from '../Constants/constant'
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import NftStats from '../components/NftStats';
import MintForm from '../components/MintForm';

const Home = () => {

  const {address} = useAccount()

  // Read contract hooks
  const { data: maxSupply } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'MAX_SUPPLY'
  });

  //Mint Price
  // The price is in wei, but it was convert in the component to ether using formatEther
  const { data: mintPrice } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'mintPrice'
  })

  //Maximum NFTs that can be minted per address
  const { data: maxMintPerAddress } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'maxMintPerAddress'
  })

  //Nfts Minted By a Specific Address
  const { data: nftMintedByAddress } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'mintCount',
    args: [address]
  })
  
  // Get total minted count from different addresses
  const { data: totalMinted } = useReadContract({
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
      <NftStats maxSupply ={maxSupply} maxMintPerAddress={maxMintPerAddress} nftMintedByAddress={nftMintedByAddress} totalMinted={totalMinted} />
        {/* <MintForm image={image} name={name} desc={desc} handleMint={handleMint} /> */}
        <MintForm mintPrice={mintPrice} handleWithdraw={handleWithdraw} />
        <footer>
        <div className='text-white mt-20 mb:mt-20 text-center'>
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