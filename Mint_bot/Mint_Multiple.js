//Use multiple wallet to mint once contract owner write contract

const { ethers } = require("ethers");
const abi = require("./abi.json");
require("dotenv").config("./env");

const provider = new ethers.providers.WebSocketProvider(
  process.env.RINKEBY_PROVIDER_URI
);

let walletList = process.env.PRIVATE_KEY_ARRAY.split(", ");

const mintMultiple = () => {
  walletList.map(async (key) => {
    const signer = new ethers.Wallet(key, provider);
    const contract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS_RINKEBY,
      abi,
      signer
    );
    const transaction = await contract.mint(1, {
      value: ethers.utils.parseEther("0.005"),
      gasPrice: ethers.utils.parseUnits("20", "gwei"),
    });
    console.log(`Submitted: ${signer.address}`);
    console.log(transaction);
  });
};

const filter = { address: process.env.CONTRACT_ADDRESS_RINKEBY, pending: true };

const listen = async function () {
  provider.on(filter, async (txhash) => {
    try {
      if (
        `0x${txhash.topics[2].slice(26)}` ==
        process.env.OWNER_ADDRESS.toLowerCase()
      ) {
        mintMultiple();
      } else {
        console.log("Not Owner");
      }
    } catch (err) {
      console.log("err");
    }
  });
};

listen();
