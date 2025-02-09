import { Command } from "commander";
import {
  displayWalletInfo,
  displayWalletTransactions,
} from "../actions/wallet";
import { loadConfig } from "../utils/config";
import fs from "fs";
import { Keypair } from "@solana/web3.js";

export function walletCommand(program: Command) {
  program
    .command("wallet")
    .argument(
      "[address]",
      "Wallet address (optional if using configured wallet)"
    )
    .option("-b, --balances", "Show token balances (default)")
    .option("-t, --transactions", "Show recent transactions")
    .option("-p, --page <number>", "Transaction page number", "1")
    .option("-l, --limit <number>", "Transactions per page", "10")
    .option("-c, --current", "Use current configured wallet")
    .description("Display wallet information and token balances")
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

      if (options.transactions) {
        await displayWalletTransactions(walletAddress, {
          page: parseInt(options.page),
          limit: parseInt(options.limit),
        });
      } else {
        await displayWalletInfo(walletAddress);
      }
    });
}
