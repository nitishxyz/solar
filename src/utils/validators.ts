import { PublicKey } from "@solana/web3.js";
import fs from "fs";
import { RPC_URLS } from "../constants";

export const validators = {
  url: (input: string) => {
    try {
      new URL(input);
      return true;
    } catch {
      return "Please enter a valid URL";
    }
  },

  publicKey: (input: string) => {
    try {
      new PublicKey(input);
      return true;
    } catch {
      return "Please enter a valid Solana address";
    }
  },

  keypairFile: (input: string) => {
    if (!fs.existsSync(input)) {
      return "File does not exist";
    }
    try {
      JSON.parse(fs.readFileSync(input, "utf-8"));
      return true;
    } catch {
      return "Invalid keypair file format";
    }
  },

  network: (input: string): boolean | string => {
    return (
      Object.keys(RPC_URLS).includes(input) ||
      validators.url(input) === true ||
      "Please enter a valid network name (localnet, devnet, testnet, mainnet) or URL"
    );
  },
};
