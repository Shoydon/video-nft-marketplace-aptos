import { WalletSelector } from '@aptos-labs/wallet-adapter-ant-design';
import { WalletName, useWallet } from '@aptos-labs/wallet-adapter-react';
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components';


const WalletWrapper = styled.div`
  position: absolute;
  align-items: right;
  right: 10px;
  top: 10px;
  background-color: #f0f0f0;
`;

function Nav({ setUserAccount, setAccount }) {
  const { account, connected, changeNetwork, connect, isLoading } = useWallet();

  const handleConnect = async () => {
    try {
      // Change below to the desired wallet name instead of "Petra"
      connect("Petra"); 
      console.log('Connected to wallet:', account);
    } catch (error) {
      console.error('Failed to connect to wallet:', error);
    }
  };

  useEffect(() => {
    if (connected) {
      setUserAccount(account.address);
      console.log(account.address);
      setAccount(account)
    }
  }, [account, connected])

  useEffect(() => {
    if(!connected){
      handleConnect();
    }
  }, [])

  return (
    <>
      <div class="fixed z-10 backdrop-blur-sm">
        <section class="relative mx-auto">

          <nav class="flex justify-between text-white w-screen px-10">
            <div class="px-5 xl:px-12 py-6 flex w-full items-center">
              <a class="text-3xl font-bold font-heading">
                Ignitus Networks
              </a>

              <ul class="md:flex px-4 mx-auto font-semibold font-heading space-x-8">
                <Link className='no-underline text-gray-200' as={Link} to="/">
                  <li>Home</li>   </Link>
                <Link className='no-underline text-gray-200' as={Link} to="/all-nft">
                  <li>All NFTs</li>   </Link>
                <Link className='no-underline text-gray-200' as={Link} to="/create">
                  <li>Mint NFT</li>   </Link>
              </ul>

              <div class="flex space-x-5 items-center">
                <button type="button" class="inline-flex items-center justify-center border-[0.5px] p-2 w-22  h-9 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-hamburger" aria-expanded="false" disabled={connected} onClick={handleConnect}>
                {/* {connected && isLoading && "Connecting..." } */}
                {connected ? ( 
                  account.address.slice(0, 5) + '...' + account.address.slice(-4)
                ) : "Connect to Petra Wallet"}
                </button>

              </div>
            </div>


          </nav>

        </section>
      </div>


    </>
  )
}

export default Nav