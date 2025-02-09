import { Keypair } from "@solana/web3.js";
import fs from "fs";
import chalk from "chalk";
import bs58 from "bs58";
import ora from "ora";

export async function displayKeyInfo(file: string) {
  const spinner = ora("Reading keypair...").start();
  try {
    const secretKey = new Uint8Array(
      JSON.parse(fs.readFileSync(file, "utf-8"))
    );
    const keypair = Keypair.fromSecretKey(secretKey);
    spinner.stop();
    console.log(chalk.blue("🔑 Public Key:"), keypair.publicKey.toBase58());
    console.log(chalk.yellow("🔐 Secret Key:"), bs58.encode(keypair.secretKey));
    return true;
  } catch (error) {
    spinner.fail(
      chalk.red(
        `Failed to read keypair: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      )
    );
    return false;
  }
}
