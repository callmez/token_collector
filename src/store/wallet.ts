import { toDecimalValue } from "@/utils";
import { defineStore } from "pinia";
import Web3 from "web3/dist/web3.min.js";
import { contractCall, getAccounts, getERC20Contract, getWeb3 } from "../web3";

export interface WalletState {
  originalWeb3?: Web3;
  accounts: string[];
  tokens: {
    [address: string]: {
      contract: Web3.eth.Contract;
      name: string;
      symbol: string;
      totalSupply: number;
      decimals: number;
    };
  };
}

export const useWalletStore = defineStore({
  id: "wallet",
  state: (): WalletState => ({
    originalWeb3: undefined,
    accounts: [],
    tokens: {},
  }),
  getters: {
    web3(state) {
      return state.originalWeb3 || new Web3();
    },
    activeAccount(state) {
      return state.accounts[0];
    },
  },
  actions: {
    async loadWeb3() {
      if (!this.originalWeb3) {
        this.originalWeb3 = await getWeb3();
      }

      return this.originalWeb3;
    },
    async loadAccounts() {
      await this.loadWeb3();
      this.accounts = await getAccounts();

      return this.accounts;
    },
    async loadToken({ address, force }: { address: string; force?: boolean }) {
      if (!this.tokens[address] || force) {
        const contract = await getERC20Contract(address);

        this.tokens[address] = {
          contract,
          name: await contract.methods.name().call(),
          symbol: await contract.methods.symbol().call(),
          totalSupply: await contract.methods.totalSupply().call(),
          decimals: await contract.methods.decimals().call(),
        };
      }

      return this.tokens[address];
    },
    async approve({
      tokenAddress,
      spender,
      amount,
    }: {
      tokenAddress: string;
      spender: string;
      amount: number | string;
    }) {
      const { contract, decimals } = await this.loadToken({
        address: tokenAddress,
      });
      const value = toDecimalValue(amount, decimals).toString();

      const tx = await contractCall(
        contract,
        "approve",
        [spender, value],
        this.activeAccount
      );

      return tx;
    },
  },
});
