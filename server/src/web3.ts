import Web3 from "web3";
import config from "./config";

const data: {
  [name: string]: Web3;
} = {};

export function getWeb3(name: string) {
  if (data[name] === undefined) {
    data[name] = new Web3(config.networks[name].url);
  }

  return data[name];
}
