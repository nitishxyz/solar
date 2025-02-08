import { Command } from "commander";
import { Connection, PublicKey } from "@solana/web3.js";
import chalk from "chalk";
import ora from "ora";

export function airdropCommand(program: Command, connection: Connection) {
  program
    .command("airdrop")
    .argument("<address>", "Wallet address")
    .description("Request 1 SOL airdrop")
    .action(async (address) => {
      const spinner = ora("Requesting airdrop...").start();
      try {
        const publicKey = new PublicKey(address);
        const signature = await connection.requestAirdrop(publicKey, 1e9);
        spinner.succeed(chalk.green(`Airdropped 1 SOL to ${address}`));
        console.log(chalk.blue("Transaction Signature:"), signature);
      } catch (error) {
        spinner.fail(
          chalk.red(
            `Airdrop failed: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          )
        );
      }
    });
}
