import React, { useState } from 'react'
import '../App.css';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { toast } from 'react-toastify';


function Cards({ item, setNFTitem, player, setPlayer, moduleName, moduleAddress }) {
  // console.log("card ", item);

  const { signAndSubmitTransaction } = useWallet();

  const handlePay = async () => {

    try {
      const payload = {
        data: {
          function: `${moduleAddress}::${moduleName}::pay_for_watch`,
          functionArguments: [item.id]
        }
      }
      const response = await signAndSubmitTransaction(payload);
      console.log(response);
      setPlayer(true)
      setNFTitem(item)
    } catch (error) {
      console.log(error);
      toast.error("Some error occurred during transaction", {
        position: "top-center"
      })
    }

  }

  return (
    <div className='card-div md:mt-10 mt-20'>
      <div className='card-inner p-2 flex flex-wrap items-center justify-center'>
        <img src={item.thumbnail} alt="" className='object-cover w-[230px] h-[230px] rounded overflow-hidden' />
        <div className='flex flex-col justify-center items-center'>
          <h3 className='text-white text-2xl font-thin mt-3'>{item.name}</h3>
          <h5 className='text-white'>Price: <span className='text-green-400'><strong>{item.price} </strong></span> APT</h5>
          <div className='flex text-white justify-between items-center mb-3 gap-4 mt-3'>
            {!player && <button type="button" class="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded text-sm px-5 py-1.5 text-center me-2 " onClick={handlePay}>Watch</button>}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Cards