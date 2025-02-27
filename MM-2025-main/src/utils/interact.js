import { ethers } from 'ethers';
import { useWeb3React } from "@web3-react/core";
import { BSC_TOKENS, BSC_TESTNET_TOKENS } from '../constants/tokens';

var Web3 = require('web3');
const useTokens = BSC_TOKENS;

export const signWallet = async (walletAddress, signCode) => {
  console.log(walletAddress)
  if (window.ethereum) {
    try {
      const result = await window.ethereum.request({
        "id": 56,
        "method": "personal_sign",
        "params":[signCode, walletAddress],
      })
      return result
      
      
    } catch (err) {
      return false
    }
  }
}

export const connectWallet = async (useChainID) => {
  if (window.ethereum) {
    try {
      const chain = await window.ethereum.request({ method: 'eth_chainId' })
      if (chain === useChainID) {
        const addressArray = await window.ethereum.request({
          method: 'eth_requestAccounts',
        })
        if (addressArray.length > 0) {
          return {
            address: addressArray[0],
            status: "👆🏽 Please Sign in/up now.",
          }
        } else {
          return {
            address: "",
            status: "😥 Connect your wallet account to the site.",
          }
        }
      } else {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: useChainID }],
        })
        return {
          address: "",
          status: "😥 Connect your wallet account to the site.",
        }
      }
      
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      }
    }
  }
}

export const changeNetwork = async (chainData) => {
  if (window.ethereum) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: Number(chainData.chainId).toString(16) }],
      })
    } catch (err) {
      if(err.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [chainData]
          })
        } catch (addError) {
          console.log(addError)
        }
      }
    }
  }
}

export const getCurrentWalletConnected = async (useChainID) => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      })
      const chain = await window.ethereum.request({
        method: "eth_chainId",
      })
      if (addressArray.length > 0 && chain === useChainID) {
        return {
          address: addressArray[0],
          status: "👆🏽 Please Sign in/up now.",
        }
      } else {
        return {
          address: "",
          status: "Click the “Wallet Icon” to connect your crypto wallet",
        }
      }
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      }
    }
  }
}

export const getCurrentWalletAddress = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      })
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: "👆🏽 Please Sign in/up now.",
        }
      } else {
        return {
          address: ""
        }
      }
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message
      }
    }
  }
}
export const getCurrentChainID = async () => {
  if (window.ethereum) {
    try {
      const chain = await window.ethereum.request({
        method: "eth_chainId",
      })
      console.log(chain)

      return {
        chainId: chain
      }
    } catch (err) {
      return {
        chainId: ""
      }
    }
  }
}
export const getSigner = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  return signer;
}

export const getTokenContract = (tokenAddress) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const contractABI = require("../constants/tokenABI.json");
  const contract = new ethers.Contract(tokenAddress, contractABI, signer);

  return contract;
}

export const getGasFee = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const gasPrice = await provider.getGasPrice()
  console.log(gasPrice)
  const gasPriceEth = Web3.utils.fromWei(gasPrice._hex, 'ether')
  const gasFee = gasPriceEth * 210000;
  return gasFee;
}

export const getBalance = async (address, tokenAddress) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  let balance;

  if (tokenAddress === 'BNBAddress') {
    balance = await provider.getBalance(address);
  } else {
    const contractABI = require("../constants/tokenABI.json");
    const contract = new ethers.Contract(tokenAddress, contractABI, signer);
    balance = await contract.balanceOf(address);
  }

  return ethers.utils.formatEther(balance);
}