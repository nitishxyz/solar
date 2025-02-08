import inquirer from "inquirer";
import ora from "ora";
import chalk from "chalk";
import { Keypair } from "@solana/web3.js";
import fs from "fs";
import bs58 from "bs58";
import { validators } from "../utils/validators";

export async function keyinfoInteractive() {
  const { choice } = await inquirer.prompt([
    {
      type: "list",
      name: "choice",
      message: "View keypair info?",
      choices: [
        { name: "Enter Keypair Path", value: "view" },
        { name: "Back to Main Menu", value: "back" },
      ],
    },
  ]);

  if (choice === "back") return;

  const { file } = await inquirer.prompt([
    {
      type: "input",
      name: "file",
      message: "Enter the path to keypair file:",
      default: "id.json",
      validate: validators.keypairFile,
    },
  ]);

  const viewSpinner = ora("Reading keypair...").start();
  try {
    const secretKey = new Uint8Array(
      JSON.parse(fs.readFileSync(file, "utf-8"))
    );
    const existingKeypair = Keypair.fromSecretKey(secretKey);
    viewSpinner.stop();
    console.log(
      chalk.blue("🔑 Public Key:"),
      existingKeypair.publicKey.toBase58()
    );
    console.log(
      chalk.yellow("🔐 Secret Key:"),
      bs58.encode(existingKeypair.secretKey)
    );
  } catch (error) {
    viewSpinner.fail(
      chalk.red(
        `Failed to read keypair: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      )
    );
  }
}
