import { Command } from "commander";
import { requestAirdrop } from "../actions/airdrop";
import { loadConfig } from "../utils/config";
import fs from "fs";
import { Keypair } from "@solana/web3.js";

export function airdropCommand(program: Command) {
  program
    .command("airdrop")
    .argument(
      "[address]",
      "Wallet address (optional if using configured wallet)"
    )
    .option("-c, --current", "Use current configured wallet")
    .description("Request 1 SOL airdrop")
    .action(async (address, options) => {
      let walletAddress = address;

      if (options.current || !address) {
        const config = loadConfig();
        if (!config.keypairPath) {
          console.error("No wallet configured. Use --help for usage info.");
          return;
        }
        const keypair = JSON.parse(
          fs.readFileSync(config.keypairPath, "utf-8")
        );
        walletAddress = Keypair.fromSecretKey(
          new Uint8Array(keypair)
        ).publicKey.toString();
      }

      await requestAirdrop(walletAddress);
    });
}
