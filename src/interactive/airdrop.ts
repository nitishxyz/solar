import inquirer from "inquirer";
import ora from "ora";
import chalk from "chalk";
import { Connection, PublicKey } from "@solana/web3.js";
import { validators } from "../utils/validators";

export async function airdropInteractive(connection: Connection) {
  const { choice } = await inquirer.prompt([
    {
      type: "list",
      name: "choice",
      message: "Request SOL airdrop?",
      choices: [
        { name: "Enter Wallet Address", value: "airdrop" },
        { name: "Back to Main Menu", value: "back" },
      ],
    },
  ]);

  if (choice === "back") return;

  const { address } = await inquirer.prompt([
    {
      type: "input",
      name: "address",
      message: "Enter the wallet address:",
      validate: validators.publicKey,
    },
  ]);

  const airdropSpinner = ora("Requesting airdrop...").start();
  try {
    const publicKey = new PublicKey(address);
    const signature = await connection.requestAirdrop(publicKey, 1e9);
    airdropSpinner.succeed(chalk.green(`Airdropped 1 SOL to ${address}`));
    console.log(chalk.blue("Transaction Signature:"), signature);
  } catch (error) {
    airdropSpinner.fail(
      chalk.red(
        `Airdrop failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      )
    );
  }
}
