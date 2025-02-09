import inquirer from "inquirer";
import chalk from "chalk";
import { Connection } from "@solana/web3.js";
import { configInteractive } from "./config";
import { keygenInteractive } from "./keygen";
import { keyinfoInteractive } from "./keyinfo";
import { airdropInteractive } from "./airdrop";
import { syncInteractive } from "./sync";
import { txInteractive } from "./tx";
import { doctorInteractive } from "./doctor";
import { setupInteractive } from "./setup";

export async function interactiveMode(connection: Connection) {
  while (true) {
    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          { name: chalk.blue("Configure Settings"), value: "Configure" },
          {
            name: chalk.green("Generate New Keypair"),
            value: "Generate New Keypair",
          },
          {
            name: chalk.yellow("View Keypair Info"),
            value: "View Keypair Info",
          },
          {
            name: chalk.magenta("View Transaction Details"),
            value: "View Transaction Details",
          },
          {
            name: chalk.magenta("Request SOL Airdrop"),
            value: "Request SOL Airdrop",
          },
          { name: chalk.cyan("Sync with Solana CLI"), value: "Sync" },
          { name: chalk.blue("Setup Development Environment"), value: "Setup" },
          { name: chalk.yellow("Check Dependencies"), value: "Doctor" },
          { name: chalk.red("Exit"), value: "Exit" },
        ],
      },
    ]);

    if (action === "Exit") {
      console.log(chalk.yellow("👋 Goodbye!"));
      process.exit(0);
    }

    switch (action) {
      case "Configure":
        await configInteractive();
        break;
      case "View Transaction Details":
        await txInteractive();
        break;
      case "Generate New Keypair":
        await keygenInteractive();
        break;
      case "View Keypair Info":
        await keyinfoInteractive();
        break;
      case "Request SOL Airdrop":
        await airdropInteractive();
        break;
      case "Sync":
        await syncInteractive();
        break;
      case "Setup":
        await setupInteractive();
        break;
      case "Doctor":
        await doctorInteractive();
        break;
    }

    await inquirer.prompt([
      {
        type: "input",
        name: "continue",
        message: "Press enter to continue...",
      },
    ]);
  }
}
