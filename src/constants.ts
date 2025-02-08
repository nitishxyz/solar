import path from "path";
import os from "os";
import type { SolarConfig } from "./types";
export const CONFIG_DIR = path.join(os.homedir(), ".config", "solar");
export const GLOBAL_CONFIG_PATH = path.join(CONFIG_DIR, "config.json");
export const LOCAL_CONFIG_PATH = path.join(process.cwd(), "solar-config.json");
export const GLOBAL_KEYPAIR_PATH = path.join(
  os.homedir(),
  ".config",
  "solana",
  "id.json"
);
export const LOCAL_KEYPAIR_PATH = path.join(process.cwd(), "id.json");

export const RPC_URLS = {
  localnet: "http://127.0.0.1:8899",
  devnet: "https://api.devnet.solana.com",
  testnet: "https://api.testnet.solana.com",
  mainnet: "https://api.mainnet-beta.solana.com",
} as const;

export const DEFAULT_CONFIG: SolarConfig = {
  rpcUrl: RPC_URLS.devnet,
  keypairPath: GLOBAL_KEYPAIR_PATH,
};
