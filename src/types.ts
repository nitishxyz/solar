import { RPC_URLS } from "./constants";

export interface SolarConfig {
  rpcUrl: string;
  keypairPath: string;
  [key: string]: any;
}

export type NetworkType = keyof typeof RPC_URLS;
