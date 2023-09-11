import { Injectable } from '@angular/core';
import { Contract, ethers } from 'ethers';
import * as qs from 'qs';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';

declare global {
  interface Window {
    ethereum: any;
  }
}
@Injectable({
  providedIn: 'root'
})
export class Web3Service {
  web3wallet:any;
  accounts = [];
  walletAddress!:string;


  constructor() {
    this.web3wallet = new Web3().setProvider(window.ethereum);
  }

  checkConnection():boolean {
    if (typeof window.ethereum !== "undefined") {
      console.log(this.accounts);

      try {
        if (this.accounts.length < 1) {
          console.log('Wallet not connected');
          return false;
        } else {
          console.log('Wallet connected');
          return true;
        }
      } catch (error) {
        console.error('Something Wrong With Metamask :(');
        return false;
      }
    } else {
      console.log('MetaMask not installed');
      return false;
    }

  }

  async connect(): Promise<any | null> {
    return new Promise(async (resolve, reject) => {
    if (typeof window.ethereum !== "undefined") {
      try {
        console.log("connecting");
        if (window.ethereum) {
          this.web3wallet = new Web3(window.ethereum.request({ method: "eth_requestAccounts" }));
          this.web3wallet.setProvider(window.ethereum);
          this.accounts = await this.web3wallet.eth.getAccounts();
          this.walletAddress = this.accounts[0];
          resolve(this.web3wallet);
          /* let web3 = new Web3();
          web3.setProvider(window.ethereum)
          let accounts = await web3.eth.getAccounts(); */
          /* if (accounts.length < 1) {
            console.log('metamask is not connected.');
            web3 = new Web3(window.ethereum.request({ method: "eth_requestAccounts" }));
            web3.setProvider(window.ethereum);
            accounts = await web3.eth.getAccounts();
            console.log("🚀 ~ file: web3.service.ts:36 ~ Web3Service ~ connect ~ accounts:", accounts)
            const walletAddress = accounts[0];
            console.log('Indirizzo del wallet collegato:', walletAddress);
          } else {
            // MetaMask è collegato
            console.log('metamask is connected.');
            const walletAddress = accounts[0];
            console.log('Indirizzo del wallet collegato:', walletAddress);
          } */
        } else {
          // MetaMask non è collegato
          console.log('MetaMask non è collegato');
          resolve(null);
        }
        /* const web3 = new Web3(window.ethereum.request({ method: "eth_requestAccounts" }));
        web3.setProvider(window.ethereum);
        console.log("🚀 ~ file: zero-x.service.ts:27 ~ ZeroXService ~ connect ~ web3:", web3) */
        /* const accounts = await web3.eth.getAccounts();
        const walletAddress = accounts[0];
        console.log('Indirizzo del wallet collegato:', walletAddress); */
      } catch (error) {
        console.log(error);
        reject(error);
      }
    } else {
      console.log("Please install MetaMask");
      resolve(null);
    }
    })
  }

  async getPrice() {
    console.log("Getting Price");
    let amount = 0.0001 * 10 ** 18;
    console.log("From amount WETH:", amount)

    const params = {
      sellToken: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',//Weth arbitrum
      //sellToken: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',//Wmatic
      //sellToken: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',//Wmatic mumbai
      //buyToken: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',//dai arbitrum
      buyToken: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',//wbtc arbitrum
      //buyToken: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',//dai
      //buyToken: '0xcB98A882261E900f68e3D4f514372a25Ab6Aa847',//matic mumbai
      sellAmount: amount,
    }

    const headers = {
      '0x-api-key': '5c4232b5-6441-4f21-9c0d-0025c6dc5db4'
    };

    //https://api.0x.org/swap/v1/price?sellToken=0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619&buyToken=0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174&sellAmount=10000000000000000
    // Fetch the swap price.
    const response = await fetch(`https://arbitrum.api.0x.org/swap/v1/price?${qs.stringify(params)}`, { headers });

    console.log("🚀 ~ file: zero-x.service.ts:57 ~ ZeroXService ~ getPrice ~ `https://api.0x.org/swap/v1/price?${qs.stringify(params)}`:", `https://api.0x.org/swap/v1/price?${qs.stringify(params)}`)
    const swapPriceJSON = await response.json();
    console.log("Price: ", swapPriceJSON);

    console.log('to amount DAI: ', swapPriceJSON.buyAmount / (10 ** 18));
    console.log('gas_estimate: ', swapPriceJSON.estimatedGas);
    return swapPriceJSON;

  }

  async getQuote() {
    console.log("Getting Quote");


    let amount = 0.0001 * (10 ** 18);

    const params = {
      sellToken: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',//Weth arbitrum
      buyToken: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',//wbtc arbitrum
      //buyToken: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',//dai arbitrum
      sellAmount: amount,
      takerAddress: '0xcB98A882261E900f68e3D4f514372a25Ab6Aa847', //predefinito, ma va cambiato
    }

    const headers = {
      '0x-api-key': '5c4232b5-6441-4f21-9c0d-0025c6dc5db4'
    };
    // Fetch the swap quote.
    const response = await fetch(`https://arbitrum.api.0x.org/swap/v1/quote?${qs.stringify(params)}`, { headers });

    const swapQuoteJSON = await response.json();
    console.log("Quote: ", swapQuoteJSON);

    return swapQuoteJSON;
  }

  async trySwap() {
    //const erc20abi = [{ "inputs": [{ "internalType": "string", "name": "name", "type": "string" }, { "internalType": "string", "name": "symbol", "type": "string" }, { "internalType": "uint256", "name": "max_supply", "type": "uint256" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "burn", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "burnFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" }], "name": "decreaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" }], "name": "increaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }]
    const abi = require('erc-20-abi')
    console.log("trying swap");

    // Only work if MetaMask is connect
    // Connecting to Ethereum: Metamask
    const web3 = new Web3(Web3.givenProvider);

    // The address, if any, of the most recently used account that the caller is permitted to access
    let accounts = await window.ethereum.request({ method: "eth_accounts" });
    let takerAddress = accounts[0];
    console.log("takerAddress: ", takerAddress);

    const swapQuoteJSON = await this.getQuote();//aggiungere taker address

    // Set Token Allowance
    // Set up approval amount
    const fromTokenAddress = '0x82af49447d8a07e3bd95bd0d56f35241523fbab1';
    const maxApproval = new BigNumber(2).pow(256).minus(1);
    console.log("approval amount: ", maxApproval);
    const ERC20TokenContract = new web3.eth.Contract(abi, fromTokenAddress);
    console.log("setup ERC20TokenContract: ", ERC20TokenContract);

    // Grant the allowance target an allowance to spend our tokens.
    const tx = await ERC20TokenContract.methods.approve(
      swapQuoteJSON.allowanceTarget,
      maxApproval,
    )
      .send({ from: takerAddress })
      .then((tx: any) => {
        console.log("tx: ", tx)
      });

    // Perform the swap
    const receipt = await web3.eth.sendTransaction(swapQuoteJSON);
    console.log("receipt: ", receipt);
  }



}
