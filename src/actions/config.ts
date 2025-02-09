import fs from "fs";
import path from "path";
import chalk from "chalk";
import ora from "ora";
import { loadConfig, saveConfig } from "../utils/config";
import {
  DEFAULT_CONFIG,
  GLOBAL_CONFIG_PATH,
  RPC_URLS,
  GLOBAL_KEYPAIR_PATH,
  LOCAL_KEYPAIR_PATH,
} from "../constants";
import type { NetworkType } from "../types";

export function displayCurrentConfig(isGlobal: boolean = false) {
  const config = loadConfig(isGlobal);
  console.log(chalk.blue("\nCurrent Configuration:"));
  console.log(chalk.gray("- RPC URL:"), config.rpcUrl);
  console.log(chalk.gray("- Keypair Path:"), config.keypairPath);
  return config;
}

export async function initializeConfig(isGlobal = false) {
  const spinner = ora("Initializing configuration...").start();
  try {
    const configPath = isGlobal
      ? GLOBAL_CONFIG_PATH
      : path.join(process.cwd(), ".solar", "config.json");
    fs.mkdirSync(path.dirname(configPath), { recursive: true });
    saveConfig(DEFAULT_CONFIG, isGlobal ? "global" : "local");
    spinner.succeed(chalk.green(`Configuration initialized at ${configPath}`));
    displayCurrentConfig(isGlobal);
    return true;
  } catch (error) {
    spinner.fail(
      chalk.red(
        `Failed to initialize config: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      )
    );
    return false;
  }
}

export async function setRpcUrl(url: string | NetworkType, isGlobal = false) {
  const spinner = ora("Updating RPC URL...").start();
  try {
    const config = loadConfig();
    config.rpcUrl = RPC_URLS[url as NetworkType] || url;
    saveConfig(config, isGlobal ? "global" : "local");
    spinner.succeed(chalk.green("RPC URL updated"));
    displayCurrentConfig();
    return true;
  } catch (error) {
    spinner.fail(
      chalk.red(
        `Failed to update RPC URL: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      )
    );
    return false;
  }
}

export async function setKeypairPath(keypairPath: string, isGlobal = false) {
  const spinner = ora("Updating keypair path...").start();
  try {
    const config = loadConfig();
    config.keypairPath = path.resolve(keypairPath);
    saveConfig(config, isGlobal ? "global" : "local");
    spinner.succeed(chalk.green("Keypair path updated"));
    displayCurrentConfig();
    return true;
  } catch (error) {
    spinner.fail(
      chalk.red(
        `Failed to update keypair path: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      )
    );
    return false;
  }
}
