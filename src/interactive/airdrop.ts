import inquirer from "inquirer";
import { validators } from "../utils/validators";
import { requestAirdrop } from "../actions/airdrop";

export async function airdropInteractive() {
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

  await requestAirdrop(address);
}
