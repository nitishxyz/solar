import { PublicKey } from "@solana/web3.js";
import chalk from "chalk";
import ora from "ora";
import { getConnection } from "../utils/connection";

export async function requestAirdrop(address: string) {
  const spinner = ora("Requesting airdrop...").start();
  try {
    const publicKey = new PublicKey(address);
    const signature = await getConnection().requestAirdrop(publicKey, 1e9);
    spinner.succeed(chalk.green(`Airdropped 1 SOL to ${address}`));
    console.log(chalk.blue("Transaction Signature:"), signature);
    return true;
  } catch (error) {
    spinner.fail(
      chalk.red(
        `Airdrop failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      )
    );
    return false;
  }
}
