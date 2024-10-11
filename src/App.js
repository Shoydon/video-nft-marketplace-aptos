import './App.css';
import Nav from './components/Nav';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import Home from './components/Home';
import NFTs from './components/NFTs';
import Create from './components/Create';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import 'react-toastify/dist/ReactToastify.css';

import { Account, Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import { useWallet } from '@aptos-labs/wallet-adapter-react';

function App() {

  const aptosConfig = new AptosConfig({ network: Network.TESTNET });
  const client = new Aptos(aptosConfig);

  const moduleName = "video_nft_2";
  const moduleAddress = "0x22f04441cbc69fc0010e9b16f548153469279ae2b92e2ac14a96e6eeae9c7550"

  const [loading, setLoading] = useState(true);
  const [userAccount, setUserAccount] = useState("");
  const [nftitem, setNFTitem] = useState({})
  const { connected } = useWallet()
  const [account, setAccount] = useState("")
  const [currNft, setCurrNft] = useState(null);
  const [player, setPlayer] = useState(false);

  return (
    <BrowserRouter>
      <ToastContainer />
      <div className="App min-h-screen">
        <div className='gradient-bg-welcome h-screen w-screen'>
          <Nav setUserAccount={setUserAccount} setAccount={setAccount} />
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/all-nft" element={<NFTs moduleAddress={moduleAddress} moduleName={moduleName} setNFTitem={setNFTitem} player={player} setPlayer={setPlayer} nftitem={nftitem} />}></Route>
            <Route path="/create" element={<Create moduleAddress={moduleAddress} moduleName={moduleName} connected={connected} account={account} client={client} />}></Route>
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
