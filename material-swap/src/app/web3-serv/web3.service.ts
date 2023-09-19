import { Injectable } from '@angular/core';
import { Contract, ethers } from 'ethers';
import * as qs from 'qs';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RegisterDto } from '../interfaces/register-dto';

declare global {
  interface Window {
    ethereum: any;
  }
}
@Injectable({
  providedIn: 'root'
})
export class Web3Service {
  web3wallet: any;
  accounts = [];
  walletAddress!: string;

  walletSubject = new BehaviorSubject<null | any>(null);
  metamask$ = this.walletSubject.asObservable();

  ZERO_x_TARGET_subject = new BehaviorSubject<string>('https://arbitrum.api.0x.org/swap/v1/');
  ZeroXtarget$ = this.ZERO_x_TARGET_subject.asObservable();

  targetNetworkSubject = new BehaviorSubject<string | null>(null);
  network$ = this.targetNetworkSubject.asObservable();

  //le prove stanno su "seconda prova angular capstone"
  constructor(private http: HttpClient) {

  }

  connect(): Promise<any | null> {
    return new Promise(async (resolve, reject) => {
      if (typeof window.ethereum !== "undefined") {
        try {
          console.log("connecting");
          if (window.ethereum) {
            this.web3wallet = new Web3(window.ethereum
              .request({ method: "eth_requestAccounts" })
              .then((res: string[]) => {
                //aspetto che il client accetti di collegarsi
                console.log(res);
                this.web3wallet.setProvider(window.ethereum);
                this.accounts = this.web3wallet.eth.getAccounts();
                this.walletAddress = this.accounts[0];
                this.walletSubject.next(this.web3wallet.eth.accounts.givenProvider)
              }));
          } else {
            // MetaMask non è collegato
            console.log('MetaMask non è collegato');
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        console.log("Please install MetaMask");
      }
    })
  }

  switchNetwork(networkId: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (typeof window.ethereum !== "undefined") {
        const web3 = new Web3();
        const hex = web3.utils.toHex(networkId);
        window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: hex }]
        }).then(() => {
          // Il cambio di rete è avvenuto con successo
          resolve(true);
        }).catch((error: any) => {
          console.error("Errore durante il cambio di rete:", error);
          // Il cambio di rete è fallito
          resolve(false);
        });
      } else {
        console.error("Metamask non è installato.");
        // Metamask non è installato
        resolve(false);
      }
    });
  }

  getPrice_V2(amountToSwap: number, tokenAddressFrom: string, tokenAddressTo: string, networkZeroX: string): Observable<any> {
    console.log('Getting Price...');
    let amount: number | string = 0;
    if (amountToSwap > 999) {
      let numAmount = amountToSwap * 10 ** 18;
      amount = this.formatLargeNumber(numAmount);
    } else {
      amount = amountToSwap * 10 ** 18;
    }
    //let amount = number(amountToSwap * 10 ** 18);
    console.log("🚀 ~ file: web3.service.ts:94 ~ Web3Service ~ getPrice_V2 ~ amount:", amount)

    const headers = {
      '0x-api-key': environment.ZERO_x_API_KEY,
    };

    const params = new HttpParams()
      .set('sellToken', tokenAddressFrom)
      .set('buyToken', tokenAddressTo)
      .set('sellAmount', amount);


    const url = `${networkZeroX}price`;

    return this.http.get(url, { headers, params });
  }

  formatLargeNumber(num: number) {
    const numStr = num.toString();
    // Divido la notazione scientifica
    const parts = numStr.split(/[eE]/);
    if (parts.length === 2) {
      // Se è una notazione scientifica
      const significand = parts[0]; // Parte principale
      const exponent = parseInt(parts[1]); // Esponente
      const zerosToAdd = Math.max(0, exponent - significand.length + 1);
      const formattedNumber = significand + '0'.repeat(zerosToAdd);
      return formattedNumber;
    } else {
      //stringa originale se non è una notazione scientifica, restituisci la
      return numStr;
    }
  }

  async getQuote_V2(amountToSwap:number, tokenAddressFrom:string, tokenAddressTo:string, networkZeroX:string, takerAddress:string):Promise<any> {
    console.log("Getting Quote");

    /* if (amountToSwap > 999) {
      let numAmount = amountToSwap * 10 ** 18;
      amount = this.formatLargeNumber(numAmount);
    } else {
    } */
    let amount = amountToSwap * 10 ** 18;

    console.log("🚀 ~ file: web3.service.ts:233 ~ Web3Service ~ getQuote_V2 ~ takerAddress:", takerAddress)
    console.log("🚀 ~ file: web3.service.ts:233 ~ Web3Service ~ getQuote_V2 ~ networkZeroX:", networkZeroX)
    console.log("🚀 ~ file: web3.service.ts:233 ~ Web3Service ~ getQuote_V2 ~ tokenAddressTo:", tokenAddressTo)
    console.log("🚀 ~ file: web3.service.ts:233 ~ Web3Service ~ getQuote_V2 ~ tokenAddressFrom:", tokenAddressFrom)
    console.log("🚀 ~ file: web3.service.ts:233 ~ Web3Service ~ getQuote_V2 ~ amountToSwap:", amountToSwap)
    console.log("🚀 ~ file: web3.service.ts:235 ~ Web3Service ~ getQuote_V2 ~ amount:", amount)


    const headers = {
      '0x-api-key': '5c4232b5-6441-4f21-9c0d-0025c6dc5db4'
    };
    console.log(tokenAddressFrom);
    console.log(tokenAddressTo);
    console.log(amount);
    console.log(tokenAddressFrom);


    const params = {
      sellToken: tokenAddressFrom,
      buyToken: tokenAddressTo,
      sellAmount: amount,
      takerAddress: takerAddress,
    }


    const url = `${networkZeroX}quote`;

    //return this.http.get<any>(url, { headers, params })/* .subscribe(res => {return res.json()}); */
    const response = await fetch(`https://arbitrum.api.0x.org/swap/v1/quote?${qs.stringify(params)}`, { headers });

    const swapQuoteJSON = await response.json();
    console.log("Quote: ", swapQuoteJSON);

    return swapQuoteJSON;
  }

  async trySwap_V2(amountToSwap:number, tokenAddressFrom:string, tokenAddressTo:string, networkZeroX:string) {
    const abi = require('erc-20-abi')
    //const abi = [{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"quoteSigner","type":"address"}],"name":"QuoteSignerUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"taker","type":"address"},{"indexed":false,"internalType":"address","name":"inputToken","type":"address"},{"indexed":false,"internalType":"address","name":"outputToken","type":"address"},{"indexed":false,"internalType":"uint256","name":"inputTokenAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"outputTokenAmount","type":"uint256"}],"name":"TransformedERC20","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"transformerDeployer","type":"address"}],"name":"TransformerDeployerUpdated","type":"event"},{"inputs":[],"name":"FEATURE_NAME","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"FEATURE_VERSION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"address payable","name":"taker","type":"address"},{"internalType":"contract IERC20TokenV06","name":"inputToken","type":"address"},{"internalType":"contract IERC20TokenV06","name":"outputToken","type":"address"},{"internalType":"uint256","name":"inputTokenAmount","type":"uint256"},{"internalType":"uint256","name":"minOutputTokenAmount","type":"uint256"},{"components":[{"internalType":"uint32","name":"deploymentNonce","type":"uint32"},{"internalType":"bytes","name":"data","type":"bytes"}],"internalType":"struct ITransformERC20Feature.Transformation[]","name":"transformations","type":"tuple[]"},{"internalType":"bool","name":"useSelfBalance","type":"bool"},{"internalType":"address payable","name":"recipient","type":"address"}],"internalType":"struct ITransformERC20Feature.TransformERC20Args","name":"args","type":"tuple"}],"name":"_transformERC20","outputs":[{"internalType":"uint256","name":"outputTokenAmount","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"createTransformWallet","outputs":[{"internalType":"contract IFlashWallet","name":"wallet","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getQuoteSigner","outputs":[{"internalType":"address","name":"signer","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getTransformWallet","outputs":[{"internalType":"contract IFlashWallet","name":"wallet","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getTransformerDeployer","outputs":[{"internalType":"address","name":"deployer","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"transformerDeployer","type":"address"}],"name":"migrate","outputs":[{"internalType":"bytes4","name":"success","type":"bytes4"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"quoteSigner","type":"address"}],"name":"setQuoteSigner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"transformerDeployer","type":"address"}],"name":"setTransformerDeployer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IERC20TokenV06","name":"inputToken","type":"address"},{"internalType":"contract IERC20TokenV06","name":"outputToken","type":"address"},{"internalType":"uint256","name":"inputTokenAmount","type":"uint256"},{"internalType":"uint256","name":"minOutputTokenAmount","type":"uint256"},{"components":[{"internalType":"uint32","name":"deploymentNonce","type":"uint32"},{"internalType":"bytes","name":"data","type":"bytes"}],"internalType":"struct ITransformERC20Feature.Transformation[]","name":"transformations","type":"tuple[]"}],"name":"transformERC20","outputs":[{"internalType":"uint256","name":"outputTokenAmount","type":"uint256"}],"stateMutability":"payable","type":"function"}]
    //const abi = [{ "inputs": [ { "internalType": "string", "name": "name", "type": "string" }, { "internalType": "string", "name": "symbol", "type": "string" }, { "internalType": "uint256", "name": "max_supply", "type": "uint256" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" } ], "name": "allowance", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "approve", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "balanceOf", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "burn", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "burnFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [ { "internalType": "uint8", "name": "", "type": "uint8" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" } ], "name": "decreaseAllowance", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" } ], "name": "increaseAllowance", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "transfer", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }]
    console.log("trying swap");

    // Only work if MetaMask is connect
    // Connecting to Ethereum: Metamask
    const web3 = new Web3(Web3.givenProvider);

    // The address, if any, of the most recently used account that the caller is permitted to access
    let accounts = await window.ethereum.request({ method: "eth_accounts" });
    let takerAddress = accounts[0];
    console.log("takerAddress: ", takerAddress);

    const swapQuoteJSON = await this.getQuote_V2(amountToSwap, tokenAddressFrom, tokenAddressTo, networkZeroX, takerAddress);//aggiungere taker address
    console.log("🚀 ~ file: web3.service.ts:281 ~ Web3Service ~ trySwap_V2 ~ swapQuoteJSON:", swapQuoteJSON.allowanceTarget)

    // Set Token Allowance
    // Set up approval amount
    const fromTokenAddress = tokenAddressFrom;
    const maxApproval = new BigNumber(2).pow(256).minus(2);
    console.log("approval amount: ", maxApproval);
    const ERC20TokenContract = new web3.eth.Contract(abi, fromTokenAddress);
    console.log("setup ERC20TokenContract: ", ERC20TokenContract);

    // Grant the allowance target an allowance to spend our tokens.
    const tx = await ERC20TokenContract.methods.approve(
      swapQuoteJSON.allowanceTarget,
      //"0xdef1c0ded9bec7f1a1670819833240f027b25eff",
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

  async signRegisterRequest(): Promise<string> {
    const messageToSign = 'Are you sure to sign up to MaterialSwap? No sensitive data will be saved.';
    try {
      const accounts = await this.web3wallet.eth.getAccounts();
      const signature = await this.web3wallet.eth.personal.sign(messageToSign, accounts[0]);
      console.log('Firma riuscita:', signature);
      return signature;
    } catch (error) {
      console.error('Errore durante la firma:', error);
    }
    return '';
  }


}
