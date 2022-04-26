//Mint when contract owner write contract

const { ethers } = require("ethers");
const abi = require("./abi.json");
require("dotenv").config("./env");

const provider = new ethers.providers.WebSocketProvider(
  process.env.RINKEBY_PROVIDER_URI
);

const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS_RINKEBY,
  abi,
  signer
);

const filter = { address: process.env.CONTRACT_ADDRESS_RINKEBY, pending: true };

const listen = async function () {
  provider.on(filter, async (txhash) => {
    const tx = await provider.getTransaction(txhash.transactionHash);
    console.log(tx.data);
    try {
      if (
        `0x${txhash.topics[2].slice(26)}` ==
        process.env.OWNER_ADDRESS.toLowerCase()
      ) {
        const transaction = await contract.safeCum69420(1, {
          value: ethers.utils.parseEther("0.005"),
          gasPrice: ethers.utils.parseUnits("20", "gwei"),
        });
        console.log(txhash);
        console.log(transaction);
        console.log("Done Minting");
      } else {
        console.log("Not Owner");
      }
    } catch (err) {
      console.log("err");
    }
  });
};

listen();
