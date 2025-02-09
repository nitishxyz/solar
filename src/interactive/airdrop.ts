import inquirer from "inquirer";
import { validators } from "../utils/validators";
import { requestAirdrop } from "../actions/airdrop";
import { loadConfig } from "../utils/config";
import fs from "fs";
import { Keypair } from "@solana/web3.js";

export async function airdropInteractive() {
  const config = loadConfig();
  const hasConfiguredWallet =
    config.keypairPath && validators.keypairFile(config.keypairPath) === true;

  const { choice } = await inquirer.prompt([
    {
      type: "list",
      name: "choice",
      message: "Request SOL airdrop?",
      choices: [
        ...(hasConfiguredWallet
          ? [{ name: "Current Configured Wallet", value: "current" }]
          : []),
        { name: "Enter Wallet Address", value: "other" },
        { name: "Back to Main Menu", value: "back" },
      ],
    },
  ]);

  if (choice === "back") return;

  let address: string;

  if (choice === "current") {
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

  await requestAirdrop(address);
}
