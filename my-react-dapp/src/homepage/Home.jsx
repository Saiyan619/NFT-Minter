import React from 'react'
import WalletConnect from '../components/WalletConnect'
import { useReadContract, useSimulateContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, formatEther, isAddress } from 'viem';
import { contractAddress, contractAbi } from '../Constants/constant'

const Home = () => {



    const { data: contractName } = useReadContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: "name"
    });

//  function and status from the hook
const { writeContract, isPending, isSuccess, error } = useWriteContract()

const handleMint = () => {
  writeContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'publicMint',
    value: mintPrice // The ETH amount to send with the transaction
  })
}

    const { data: maxSupply,  isLoading,  // Now properly destructured
        isError  } = useReadContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: 'MAX_SUPPLY'
    });

  
    console.log(contractName)
    console.log(contractAddress)
    console.log('Max Supply:', maxSupply);

    console.log(maxSupply)

    const { data: mintPrice } = useReadContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: 'mintPrice'
    })

    const { data: maxMintPerAddress } = useReadContract({
        address: contractAddress,
        abi: contractAbi,
        functionName:'maxMintPerAddress'
    })


    const { data: nftMintRemaining } = useReadContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: 'mintCount',
        args:['0xAd8915BDBa1F3fe2dbb2aFEb2da04B05313Cf9Ac']
    })
    console.log(nftMintRemaining)




  const ownerMint = () => {
   writeContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: 'ownerMint',
      args: ['0xAd8915BDBa1F3fe2dbb2aFEb2da04B05313Cf9Ac']
    });
  }


  const withdraw = () => {
    writeContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: 'withdraw',
      args: ['0xAd8915BDBa1F3fe2dbb2aFEb2da04B05313Cf9Ac']
    });
  }

  return (
      <div>
          <h1>Nft minting dapp</h1>
          <WalletConnect />
          <span>Total NFTs available:{maxSupply}</span>
          <button className='btn'>Mint for {mintPrice} </button>
           <button className='btn btn-primary' onClick={handleMint} disabled={isPending}>
    {isPending ? 'Minting...' : `Mint for ${mintPrice}`}
  </button>
          <span>Max mint per address: {maxMintPerAddress}</span>
      <span>NFTs minted: {nftMintRemaining}</span>

      <button className='btn' onClick={ownerMint}>Mint for free</button>
      <button className='btn' onClick={withdraw}>Withdraw Mint</button>

    </div>
  )
}

export default Home