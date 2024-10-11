import React, { useEffect, useState } from 'react'
import Cards from './Cards'
// import { toast } from 'react-toastify';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Account, Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import PlayerCard from './PlayerCard';

const aptosConfig = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(aptosConfig);

function NFTs({ moduleName, moduleAddress, setNFTitem, player, setPlayer, nftitem }) {
  const { account, signAndSubmitTransaction } = useWallet();

  useEffect(() => {
    document.title = "Video NFT Marketplace"
  }, []);

  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])

  useEffect(() => {
    const loadMarketplaceItems = async () => {
      // console.log(aptos);
      // console.log(account);

      const resultData = await aptos.getAccountResources({
        accountAddress: moduleAddress,
        resourceType: `${moduleAddress}::${moduleName}::State`
      });
      // let fetchedItems = resultData;  
      let fetchedItems = resultData["1"]["data"]["nfts"];
      // console.log(fetchedItems);
      const length = fetchedItems.length;
      // console.log(length);
      
      let tempItems = []
      for(let i = 0; i < length; i++) {
        // console.log("fetched item ", fetchedItems[i]);
        
        let uri = fetchedItems[i]["ipfs_hash"];
        const response = await fetch(uri)
        const metadata = await response.json()
        // console.log("metadata", metadata);
        const itemToPush = {
          id: i,
          name: metadata.name,
          thumbnail: metadata.thumbnail,
          video: metadata.video,
          owner: metadata.owner,
          price: metadata.price,
        }
        tempItems.push(itemToPush)
      }

      setLoading(false);
      setItems(tempItems);
    }
    loadMarketplaceItems()
  }, [])


  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2 className='text-white font-bold pt-24 text-2xl text-center'>Loading...</h2>
    </main>
  )
  return (
    <div className='flex flex-wrap gradient-bg-welcome gap-10 justify-center pt-24 pb-5 px-16'>
      {player && (
              // <div className='flex flex-wrap gradient-bg-welcome   gap-10 justify-center pt-24 pb-5 px-16'>

              // </div>
              <div style={{
                width: '650px',
                height: 'auto',
                // backgroundColor: "#ddd",
                margin: '0 auto',
                display: 'block',
                // justifyContent:'center'
              }}>
                {/* <PlayerCard item={currNft} player={player}/> */}
                <div className='audio-outer'>
                  <div className='audio-inner'>
                    <PlayerCard item={nftitem} player={player} setPlayer={setPlayer} setCurrNft={setNFTitem} currNft={nftitem} />
                  </div>
                </div>
              </div>
            )}
      {
        (items.length > 0 ?
          items.map((item, idx) => (
            <Cards item={item} setNFTitem={setNFTitem} setPlayer={setPlayer} player={player} moduleAddress={moduleAddress} moduleName={moduleName}/>
          ))
          : (
            <main style={{ padding: "1rem 0" }}>
              <h2 className='text-white font-bold text-2xl text-center'>No listed assets</h2>
            </main>
          ))}
    </div>
  )

}

export default NFTs
