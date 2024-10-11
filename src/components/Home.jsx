import React from 'react'
import Ar from "../assets/Ar.svg"
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className='text-white flex justify-around items-center pt-32'>

      <div className='mb-16 mx-10'>
      <h1 className='font-semibold xl:text-6xl md:text-4xl text-2xl'>View and Create<br></br><span className='font-thin text-sky-400'>Video NFTs</span> (Non Fungible Tokens)</h1>
      <p className='pt-8 xl:text-xl font-thin md:text-lg text-sm'> Video NFTs are unique digital assets that represent ownership of a specific video file.<br></br> They ensure authenticity and provenance by recording ownership on the blockchain.<br /> Each NFT has a unique identifier, ensuring its uniqueness and non-interchangeability.</p>
        <Link to="/all-nft" as={Link}>
          <button type="button" class="text-white mt-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Explore All</button>
        </Link>
      </div>
      <div className=''>
        <img src={Ar} alt="" className='h-[490px]' />
      </div>
    </div>
  )
}

export default Home