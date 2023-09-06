import { Injectable } from '@angular/core';
import Web3 from 'web3';

declare global {
  interface Window {
    ethereum: any;
  }
}
@Injectable({
  providedIn: 'root'
})
export class Web3Service {
  private web3!: Web3 | null;
  contract: any | null;
  networkId: null | bigint;
  accounts: string[];
  address!: string;
  /* polygonRpcUrl: string = 'https://polygon-rpc.com/'; */



  constructor() {
    this.web3 = null;
    this.contract = null;
    this.networkId = null;
    this.accounts = [];
    this.init();
  }

  async init() {
    if (window.ethereum) {
      try {
        // Creazione di un'istanza di Web3 con Metamask
        this.web3 = new Web3(window.ethereum);
        /* this.web3 = new Web3(this.polygonRpcUrl); */
        console.log(window);
        console.log(this.web3);


        // Richiedi l'accesso all'account Metamask
        await window.ethereum.enable();

        // Ottieni l'elenco degli account collegati
        this.accounts = await this.web3.eth.getAccounts();

        // Ottieni l'ID della rete
        this.networkId = await this.web3.eth.net.getId();

        // L'indirizzo dell'account collegato è disponibile in this.accounts[0]
        this.address = await this.accounts[0];

        console.log('Indirizzo dell\'account collegato:', this.address);

        this.getBalance(this.address);
        console.log('Connesso alla blockchain Ethereum');
      } catch (error) {
        console.error('Errore durante la connessione alla blockchain:', error);
      }
    } else {
      console.error('Installare e configurare Metamask per utilizzare questo sito.');
    }
  }

  async getBalance(address: string) {
    if (!this.web3) {
      console.error('Connessione non inizializzata.');
      return null;
    }
    try {
      const balance = await this.web3.eth.getBalance(address);
      const balanceInWei = balance.toString(); // Saldo in wei sottoforma di stringa
      const balanceInEther = this.web3.utils.fromWei(balanceInWei, 'ether'); //trasformo wei in ETH
      console.log('Saldo ETH:', balanceInEther);
      return balanceInEther;
    } catch (error) {
      console.error('Errore nel recupero del saldo:', error);
      return null;
    }
  }

  async sendTransaction(to: string, value: string) {
    if (!this.web3) {
      console.error('Connessione non inizializzata.');
      return null;
    }

    if (!this.accounts.length) {
      console.error('Nessun account collegato.');
      return null;
    }
    try {
      const tx = await this.web3.eth.sendTransaction({
        from: this.accounts[0],
        to,
        value: this.web3.utils.toWei(value, 'ether'),
      });
      return tx;
    } catch (error) {
      console.error('Errore nell\'invio della transazione:', error);
      return null;
    }
  }



}
