import chalk from "chalk";
import ora from "ora";
import { execSync } from "child_process";
import { checkDependencies } from "./doctor";

export async function setupEnvironment() {
  console.log(chalk.blue("🚀 Setting up development environment...\n"));

  // First check dependencies
  const dependenciesOk = await checkDependencies();
  if (!dependenciesOk) {
    const spinner = ora("Installing missing dependencies...").start();
    try {
      // Install Solana CLI
      execSync(
        "curl --proto '=https' --tlsv1.2 -sSfL https://raw.githubusercontent.com/solana-developers/solana-install/main/install.sh | bash"
      );

      spinner.succeed(chalk.green("Dependencies installed successfully"));
      console.log(chalk.green("\n✅ Development environment is ready!"));
      return true;
    } catch (error) {
      spinner.fail(
        chalk.red(
          `Failed to install dependencies: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        )
      );
      console.log(chalk.yellow("\nPlease install the following manually:"));
      console.log(chalk.gray("1. Rust: https://rustup.rs"));
      console.log(
        chalk.gray(
          "2. Solana CLI: https://docs.solana.com/cli/install-solana-cli-tools"
        )
      );
      console.log(
        chalk.gray("3. Anchor: https://www.anchor-lang.com/docs/installation")
      );
      return false;
    }
  }

  console.log(chalk.green("\n✅ Development environment is already set up!"));
  return true;
}
