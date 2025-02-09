import inquirer from "inquirer";
import { validators } from "../utils/validators";
import {
  displayWalletInfo,
  displayWalletTransactions,
} from "../actions/wallet";
import { loadConfig } from "../utils/config";
import fs from "fs";
import { Keypair } from "@solana/web3.js";

export async function walletInteractive() {
  const config = loadConfig();
  const hasConfiguredWallet =
    config.keypairPath && validators.keypairFile(config.keypairPath) === true;

  const { choice } = await inquirer.prompt([
    {
      type: "list",
      name: "choice",
      message: "What would you like to view?",
      choices: [
        ...(hasConfiguredWallet
          ? [
              { name: "Current Wallet Balances", value: "current-balance" },
              { name: "Current Wallet Transactions", value: "current-tx" },
            ]
          : []),
        { name: "Other Wallet Balances", value: "other-balance" },
        { name: "Other Wallet Transactions", value: "other-tx" },
        { name: "Back to Main Menu", value: "back" },
      ],
    },
  ]);

  if (choice === "back") return;

  let address: string;

  if (choice.startsWith("current")) {
    const keypair = JSON.parse(fs.readFileSync(config.keypairPath, "utf-8"));
    address = Keypair.fromSecretKey(
      new Uint8Array(keypair)
    ).publicKey.toString();
  } else {
    const { inputAddress } = await inquirer.prompt([
      {
        type: "input",
        name: "inputAddress",
        message: "Enter the wallet address:",
        validate: validators.publicKey,
      },
    ]);
    address = inputAddress;
  }

  if (choice.endsWith("-tx")) {
    const { txLimit } = await inquirer.prompt([
      {
        type: "number",
        name: "txLimit",
        message: "How many transactions to show?",
        default: 10,
        validate: (input: any) =>
          !isNaN(input) && input > 0 && input <= 50
            ? true
            : "Please enter a number between 1 and 50",
      },
    ]);
    await displayWalletTransactions(address, { page: 1, limit: txLimit });
  } else {
    await displayWalletInfo(address);
  }
}
