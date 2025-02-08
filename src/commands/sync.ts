import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { loadConfig } from "../utils/config";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function syncAction() {
  const spinner = ora("Syncing configuration...").start();
  try {
    const config = loadConfig();

    // Execute solana config set commands
    await execAsync(`solana config set --url ${config.rpcUrl}`);
    await execAsync(`solana config set --keypair ${config.keypairPath}`);

    spinner.succeed(chalk.green("✅ Configuration synced with Solana CLI"));
    console.log(chalk.gray("Updated settings:"));
    console.log(chalk.gray("- RPC URL:"), config.rpcUrl);
    console.log(chalk.gray("- Keypair Path:"), config.keypairPath);

    // Show current solana config
    const { stdout } = await execAsync("solana config get");
    console.log(chalk.blue("\nCurrent Solana CLI config:"));
    console.log(stdout);
  } catch (error) {
    spinner.fail(
      chalk.red(
        `Failed to sync config: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      )
    );
  }
}

export function syncCommand(program: Command) {
  program
    .command("sync")
    .description("Sync Solar CLI config with Solana CLI")
    .action(syncAction);
}
