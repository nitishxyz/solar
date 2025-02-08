import { Command } from "commander";
import { Keypair } from "@solana/web3.js";
import fs from "fs";
import chalk from "chalk";
import bs58 from "bs58";

export function keyinfoCommand(program: Command) {
  program
    .command("keyinfo")
    .argument("<file>", "Path to keypair file")
    .description("Parse keypair and display public/private keys")
    .action((file) => {
      try {
        const secretKey = new Uint8Array(
          JSON.parse(fs.readFileSync(file, "utf-8"))
        );
        const keypair = Keypair.fromSecretKey(secretKey);
        console.log(chalk.blue("🔑 Public Key:"), keypair.publicKey.toBase58());
        console.log(
          chalk.yellow("🔐 Secret Key:"),
          bs58.encode(keypair.secretKey)
        );
      } catch (error) {
        console.error(
          chalk.red(
            `Failed to read keypair: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          )
        );
      }
    });
}
