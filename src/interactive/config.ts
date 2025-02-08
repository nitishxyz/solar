import inquirer from "inquirer";
import ora from "ora";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import { validators } from "../utils/validators";
import { loadConfig, saveConfig, displayConfig } from "../utils/config";
import {
  DEFAULT_CONFIG,
  GLOBAL_CONFIG_PATH,
  RPC_URLS,
  GLOBAL_KEYPAIR_PATH,
  LOCAL_KEYPAIR_PATH,
} from "../constants";
import type { NetworkType } from "../types";
import { syncAction } from "../commands/sync";

export async function configInteractive() {
  const { configAction } = await inquirer.prompt([
    {
      type: "list",
      name: "configAction",
      message: "What would you like to configure?",
      choices: [
        {
          name: "Show Current Configuration",
          value: "Show Current Configuration",
        },
        {
          name: "Show Global Configuration",
          value: "Show Global Configuration",
        },
        { name: "Set RPC URL (Local)", value: "Set RPC URL (Local)" },
        { name: "Set RPC URL (Global)", value: "Set RPC URL (Global)" },
        { name: "Set Keypair (Local)", value: "Set Keypair (Local)" },
        { name: "Set Keypair (Global)", value: "Set Keypair (Global)" },
        { name: "Initialize Local Config", value: "Initialize Local Config" },
        { name: "Initialize Global Config", value: "Initialize Global Config" },
        { name: "Sync with Solana CLI", value: "Sync with Solana CLI" },
        { name: "Back to Main Menu", value: "Back to Main Menu" },
      ],
    },
  ]);

  if (configAction === "Back to Main Menu") return;

  switch (configAction) {
    case "Show Current Configuration":
      displayConfig();
      break;

    case "Show Global Configuration":
      if (fs.existsSync(GLOBAL_CONFIG_PATH)) {
        console.log(chalk.gray("\nGlobal config path:"), GLOBAL_CONFIG_PATH);
        try {
          const globalConfig = JSON.parse(
            fs.readFileSync(GLOBAL_CONFIG_PATH, "utf-8")
          );
          console.log(chalk.gray("Global config:"), globalConfig);
        } catch (error) {
          console.log(chalk.red("Error reading global config"));
        }
      } else {
        console.log(chalk.yellow("\nNo global configuration found."));
      }
      break;

    case "Set RPC URL (Local)":
    case "Set RPC URL (Global)": {
      const scope = configAction.includes("Global") ? "global" : "local";
      const { networkChoice } = await inquirer.prompt([
        {
          type: "list",
          name: "networkChoice",
          message: "Select network or enter custom URL:",
          choices: [
            { name: "Localnet (127.0.0.1:8899)", value: "localnet" },
            { name: "Devnet", value: "devnet" },
            { name: "Testnet", value: "testnet" },
            { name: "Mainnet", value: "mainnet" },
            { name: "Custom URL", value: "custom" },
          ],
        },
      ]);

      let rpcUrl: string;
      if (networkChoice === "custom") {
        const { url } = await inquirer.prompt([
          {
            type: "input",
            name: "url",
            message: "Enter the RPC URL:",
            default: loadConfig().rpcUrl,
            validate: validators.url,
          },
        ]);
        rpcUrl = url;
      } else {
        rpcUrl = RPC_URLS[networkChoice as NetworkType];
      }

      const spinner = ora("Updating configuration...").start();
      try {
        const scopedConfig = { ...DEFAULT_CONFIG, rpcUrl };
        if (saveConfig(scopedConfig, scope)) {
          spinner.succeed(
            chalk.green(`RPC URL set to: ${rpcUrl} (${scope} config)`)
          );
        } else {
          spinner.fail(chalk.red("Failed to update configuration"));
        }
      } catch (error) {
        spinner.fail(
          chalk.red(
            `Failed to update config: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          )
        );
      }
      break;
    }

    case "Set Keypair (Local)":
    case "Set Keypair (Global)": {
      const scope = configAction.includes("Global") ? "global" : "local";
      const { keypairPath } = await inquirer.prompt([
        {
          type: "input",
          name: "keypairPath",
          message: "Enter the keypair path:",
          default:
            scope === "global" ? GLOBAL_KEYPAIR_PATH : LOCAL_KEYPAIR_PATH,
          validate: validators.keypairFile,
        },
      ]);

      const spinner = ora("Updating configuration...").start();
      try {
        const scopedConfig = {
          ...DEFAULT_CONFIG,
          keypairPath: path.resolve(keypairPath),
        };
        if (saveConfig(scopedConfig, scope)) {
          spinner.succeed(
            chalk.green(`Keypair path set to: ${keypairPath} (${scope} config)`)
          );
        } else {
          spinner.fail(chalk.red("Failed to update configuration"));
        }
      } catch (error) {
        spinner.fail(
          chalk.red(
            `Failed to update config: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          )
        );
      }
      break;
    }

    case "Initialize Local Config":
    case "Initialize Global Config": {
      const scope = configAction.includes("Global") ? "global" : "local";
      if (saveConfig(DEFAULT_CONFIG, scope)) {
        console.log(chalk.green(`✅ Initialized ${scope} configuration`));
      }
      break;
    }

    case "Sync with Solana CLI":
      await syncAction();
      break;
  }
}
