import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from "wagmi";


export default function WalletConnect() {
  const { address, isConnected } = useAccount();

  console.log(isConnected)
  console.log(address)

  return (
    <div>
      <ConnectButton />
    </div>
  );
}