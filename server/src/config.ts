import { QueueOptions } from "bullmq";
import { CHAIN_NAME as RONIN_CHAIN_NAME } from "./networks/ronin";

export interface Network {
  url: string;
  enable?: boolean;
}

export interface Config {
  port: number;
  networks: {
    [name: string]: Network;
  };
  queues: {
    [name: string]: QueueOptions;
  };
}

export default {
  port: 3000,
  networks: {
    [RONIN_CHAIN_NAME]: {
      url: "https://api.roninchain.com/rpc",
    },
  },
  queues: {
    [RONIN_CHAIN_NAME]: {
      connection: {
        host: "localhost",
      },
    },
  },
} as Config;
