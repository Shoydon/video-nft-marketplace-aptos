import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useWallet } from '@aptos-labs/wallet-adapter-react';

function Create({ moduleName, moduleAddress, connected, account, client }) {

  const { signAndSubmitTransaction } = useWallet();

  const [transactionInProgress, setTransactionInProgress] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  // let thumbnail = null;
  const [thumbnail, setThumbnail] = useState(null);

  const [forminfo, setFormInfo] = useState({
    title: "",
    thumbnail: "",
    video: "",
    price: 0,
    owner: "",
  });

  useEffect(() => {
    document.title = "Create"
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormInfo((prevState) => ({ ...prevState, [name]: value }));
  };

  const changeHandler = (event) => {
    setVideoFile(event.target.files[0]);
  };

  const createThumbnail = () => {
    return new Promise((resolve, reject) => {
      const allowedTypes = ["video/mp4", "video/webm", "video/ogg"];
      if (allowedTypes.includes(videoFile.type)) {
        const videoElement = document.createElement('video');
        videoElement.preload = 'metadata';

        const url = URL.createObjectURL(videoFile);
        videoElement.src = url;

        videoElement.addEventListener('loadeddata', () => {
          videoElement.currentTime = 0;

          videoElement.addEventListener('seeked', async () => {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            if (!context) {
              reject(new Error("Unable to get canvas context"));
              return;
            }

            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;

            context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

            const dataURL = canvas.toDataURL('image/jpeg');
            const blob = await (await fetch(dataURL)).blob();
            setThumbnail(blob);

            URL.revokeObjectURL(url);
            resolve(blob);
          });
        });

      } else {
        reject(new Error("Invalid video file type"));
      }
    });
  }

  const handleEvent = async (e) => {
    e.preventDefault();
    forminfo.owner = account.address;
    if (!videoFile) {
      toast.error("Upload video!", {
        position: "top-center"
      })
      return
    }
    setTransactionInProgress(true)

    const thumbnailBlob = await createThumbnail();

    console.log(thumbnail);
    console.log(forminfo);

    const formData = new FormData();
    const jsonformData = new FormData();

    formData.append('file', thumbnailBlob);
    console.log(thumbnailBlob);
    

    const metadata = JSON.stringify({
      name: forminfo.title,
    });
    jsonformData.append('pinataMetadata', metadata);

    const options = JSON.stringify({
      cidVersion: 0,
    })
    jsonformData.append('pinataOptions', options);

    const formData2 = new FormData();
    const jsonformData2 = new FormData();

    formData2.append('file', videoFile);

    const metadata2 = JSON.stringify({
      name: forminfo.title,
    });
    jsonformData2.append('pinataMetadata', metadata2);

    const options2 = JSON.stringify({
      cidVersion: 0,
    })
    jsonformData2.append('pinataOptions', options2);

    try {
      toast.info("Uploading thumbnail to IPFS", {
        position: "top-center"
      })
      const resFile = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: formData,
        headers: {
          pinata_api_key: `0a13ef76fb9e01561e05`,
          pinata_secret_api_key: `f0a2d096004e4f0483a64d06236ddc252b8d8acf612cde6465bc78f013a08ab0`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("thumbnail: ", resFile.data);
      const thumbnailHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
      toast.info("Uploading video to IPFS", {
        position: "top-center"
      })

      const resFile2 = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: formData2,
        headers: {
          pinata_api_key: `0a13ef76fb9e01561e05`,
          pinata_secret_api_key: `f0a2d096004e4f0483a64d06236ddc252b8d8acf612cde6465bc78f013a08ab0`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("video: ", resFile2.data);
      const videoHash = `https://gateway.pinata.cloud/ipfs/${resFile2.data.IpfsHash}`;

      const info = {
        name: forminfo.title,
        description: forminfo.description,
        thumbnail: thumbnailHash,
        video: videoHash,
        owner: forminfo.owner,
        price: forminfo.price,
      }
      toast.info("Pinning metadata to IPFS", {
        position: "top-center"
      })
      // forminfo.thumbnail = thumbnailHash;

      async function pinJSONToPinata(info) {
        const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';
        const headers = {
          'Content-Type': 'application/json',
          'pinata_api_key': `0a13ef76fb9e01561e05`,
          'pinata_secret_api_key': `f0a2d096004e4f0483a64d06236ddc252b8d8acf612cde6465bc78f013a08ab0`
        };

        try {
          const res = await axios.post(url, info, { headers });
          const meta = `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`
          console.log("meta: ", meta);
          console.log("minting...");
          mintThenList(meta);

        } catch (error) {
          toast.error("Error minting NFT", {
            position: "top-center"
          })
          setTransactionInProgress(false);
          console.error(error);
        }

      }

      pinJSONToPinata(info)

    } catch (error) {
      toast.error("Error minting NFT", {
        position: "top-center"
      })
      setTransactionInProgress(false);
      console.log(error);
    }

  };

  // const pay = async () => {
  //   console.log(account);
  //   const method1 = async () => {
  //     const transferCoinTransaction = await client.transferCoinTransaction({
  //       sender: account.address,  //0x22f04441cbc69fc0010e9b16f548153469279ae2b92e2ac14a96e6eeae9c7550
  //       recipient:"0x02891f57ef32a6b9f2b78070a6ca475f9c59954e2eb86e97f5d428c195cb4425",
  //       amount: 1,
  //     })
  //     console.log(transferCoinTransaction);
  //   }

  //   const method2 = async () => {
  //     const transaction = await client.transaction.build.simple({
  //       sender: "0x22f04441cbc69fc0010e9b16f548153469279ae2b92e2ac14a96e6eeae9c7550",
  //       // sender: account.address,
  //       data: {
  //         // All transactions on Aptos are implemented via smart contracts.
  //         function: "0x1::aptos_account::transfer",
  //         functionArguments: ["0x02891f57ef32a6b9f2b78070a6ca475f9c59954e2eb86e97f5d428c195cb4425", 1],
  //       },
  //       // feePa
  //     });

  //     // 2. Simulate to see what would happen if we execute this transaction
  //     const [userTransactionResponse] = await client.transaction.simulate.simple({
  //       signerPublicKey: account.publicKey,
  //       transaction,
  //     });
  //     console.log(userTransactionResponse)
  //   }

  //   const method3 = async () => {
  //     const transaction = await client.transaction.build.simple({
  //       sender: account.address,
  //       data: {
  //         // All transactions on Aptos are implemented via smart contracts.
  //         function: "0x1::aptos_account::transfer",
  //         functionArguments: [moduleAddress, 1],
  //         // functionArguments: ["0x02891f57ef32a6b9f2b78070a6ca475f9c59954e2eb86e97f5d428c195cb4425", 1],
  //       },
  //     });
  //     console.log("built: ", transaction);
  //     const [userTransactionResponse] = await client.transaction.simulate.simple({
  //       signerPublicKey: account.publicKey,
  //       transaction,
  //     });
  //     console.log(userTransactionResponse)
  //     const senderAuthenticator = client.transaction.sign({
  //       signer: account,
  //       transaction,
  //     });
  //     const committedTransaction = await client.transaction.submit.simple({
  //       transaction,
  //       senderAuthenticator,
  //     }); 
  //     const executedTransaction = await client.waitForTransaction({ transactionHash: committedTransaction.hash });
  //     console.log(executedTransaction)
  //   }
  //   method2()
  // }

  const mintThenList = async (uri) => {
    toast.info("Confirm to Mint the NFT", {
      position: "top-center"
    })

    try {
      console.log(forminfo.thumbnail);

      const listingPrice = Math.round(10 ** 8 * forminfo.price);
      // console.log(listingPrice);

      const payload = {
        data: {
          function: `${moduleAddress}::${moduleName}::add_nft`,
          functionArguments: [uri, listingPrice]
        }
      }
      const response = await signAndSubmitTransaction(payload);
      console.log(response);
      // await tx1.wait()
      toast.success("NFT minted successfully", { position: "top-center" })
    } catch (error) {
      console.log(error);
      toast.error(error, {
        position: "top-center"
      })
    }
    // const listingPrice = ethers.utils.parseEther(forminfo.price.toString())
    // const tx1 = await (await marketplace.mint(uri, listingPrice))


    setTransactionInProgress(false)

  }


  return (
    <div className='h-screen pt-24'>
      <div className="container-fluid mt-5 text-left">
        <div className="content mx-auto">

          <form class="max-w-sm mx-auto">

            <div className='max-w-lg mx-auto'>
              <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="file">Upload Video</label>
              <input onChange={changeHandler} name="file" class="block w-full mb-4 h-8 text-m  text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" type="file" accept='video/*' />
            </div>


            <div class="mb-4">
              <label for="title" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">NFT Name</label>
              <input onChange={handleChange} type="text" id="title" name='title' class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="Enter NFT name" required />
            </div>

            <div class="mb-4">
              <label for="price" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price</label>
              <input onChange={handleChange} type="number" id="price" name='price' class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="Enter price in APT" required />
            </div>

            {/* <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
            <textarea onChange={handleChange} name="description" id="description" rows="4" class="block p-2.5 w-full text-sm  mb-4 text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Describe the NFT..."></textarea> */}
            <div className='text-center'>
              <button onClick={handleEvent} className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" disabled={!connected || transactionInProgress}>
                Mint NFT
              </button>
            </div>
          </form>
          {/* <button onClick={pay} className='text-white'>Pay</button> */}
        </div>
      </div>
    </div>
  )
}

export default Create