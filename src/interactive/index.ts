import inquirer from "inquirer";
import chalk from "chalk";
import { Connection } from "@solana/web3.js";
import { configInteractive } from "./config";
import { keygenInteractive } from "./keygen";
import { keyinfoInteractive } from "./keyinfo";
import { airdropInteractive } from "./airdrop";
import { syncAction } from "../commands/sync";
import { checkDependencies } from "../commands/doctor";
import { setupAction } from "../commands/setup";

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
      case "Generate New Keypair":
        await keygenInteractive();
        break;
      case "View Keypair Info":
        await keyinfoInteractive();
        break;
      case "Request SOL Airdrop":
        await airdropInteractive(connection);
        break;
      case "Sync":
        await syncAction();
        break;
      case "Setup":
        await setupAction();
        break;
      case "Doctor":
        await checkDependencies();
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
