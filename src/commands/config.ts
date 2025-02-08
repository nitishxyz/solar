import { Command } from "commander";
import inquirer from "inquirer";
import ora from "ora";
import chalk from "chalk";
import { loadConfig, saveConfig, displayConfig } from "../utils/config";
import { validators } from "../utils/validators";
import {
  DEFAULT_CONFIG,
  RPC_URLS,
  GLOBAL_CONFIG_PATH,
  LOCAL_CONFIG_PATH,
} from "../constants";
import type { NetworkType } from "../types";
import fs from "fs";
import path from "path";

export function configCommand(program: Command) {
  program
    .command("config")
    .description("Manage Solar CLI configuration")
    .option("-g, --global", "Use global configuration")
    .option("-l, --local", "Use local configuration (default)")
    .option("-s, --show", "Show current configuration")
    .option("-i, --init", "Initialize configuration file")
    .option("-k, --keypair <path>", "Set keypair path")
    .argument(
      "[network]",
      "Network to use (localnet, devnet, testnet, mainnet) or RPC URL"
    )
    .action(async (network, options) => {
      if (options.show) {
        displayConfig();
        return;
      }

      if (options.init) {
        const scope = options.global ? "global" : "local";
        const { confirmed } = await inquirer.prompt([
          {
            type: "confirm",
            name: "confirmed",
            message: `Initialize ${scope} configuration?`,
            default: false,
          },
        ]);

        if (confirmed) {
          saveConfig(DEFAULT_CONFIG, scope);
          console.log(chalk.green(`✅ Initialized ${scope} configuration`));
        }
        return;
      }

      const scope = options.global ? "global" : "local";
      const spinner = ora("Updating configuration...").start();

      try {
        const configPath = options.global
          ? GLOBAL_CONFIG_PATH
          : LOCAL_CONFIG_PATH;
        let scopedConfig = DEFAULT_CONFIG;

        if (fs.existsSync(configPath)) {
          scopedConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
        }

        // Update RPC URL if provided
        if (network) {
          if (network in RPC_URLS) {
            scopedConfig.rpcUrl = RPC_URLS[network as NetworkType];
          } else {
            new URL(network); // Validate custom URL
            scopedConfig.rpcUrl = network;
          }
        }

        // Update keypair path if provided
        if (options.keypair) {
          if (!fs.existsSync(options.keypair)) {
            spinner.fail(chalk.red("Keypair file does not exist"));
            return;
          }
          scopedConfig.keypairPath = path.resolve(options.keypair);
        }

        if (saveConfig(scopedConfig, scope)) {
          spinner.succeed(chalk.green(`Configuration updated (${scope})`));
          console.log(chalk.gray("New config:"), scopedConfig);
        } else {
          spinner.fail(chalk.red("Failed to update configuration"));
        }
      } catch (error) {
        spinner.fail(
          chalk.red(
            `Update failed: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          )
        );
      }
    });
}
