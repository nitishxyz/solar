import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { execSync } from "child_process";
import { platform } from "os";

export async function setupAction() {
  console.log(chalk.blue("🚀 Setting up Solana development environment...\n"));
  const spinner = ora();

  // Check/Install Node.js
  spinner.start("Checking Node.js installation...");
  try {
    execSync("node --version");
    spinner.succeed(chalk.green("Node.js is installed"));
  } catch (error) {
    spinner.warn(chalk.yellow("Node.js is not installed"));
    console.log(
      chalk.gray(
        "Please install Node.js from https://nodejs.org (version 18 or higher)"
      )
    );
  }

  // Check/Install Rust
  spinner.start("Checking Rust installation...");
  try {
    execSync("rustc --version");
    spinner.succeed(chalk.green("Rust is installed"));
  } catch (error) {
    spinner.info(chalk.blue("Installing Rust..."));
    try {
      if (platform() === "win32") {
        console.log(
          chalk.yellow("Please install Rust manually from https://rustup.rs")
        );
      } else {
        execSync(
          'curl --proto "=https" --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y'
        );
        spinner.succeed(chalk.green("Rust installed successfully"));
      }
    } catch (error) {
      spinner.fail(chalk.red("Failed to install Rust"));
      console.log(
        chalk.gray("Please install Rust manually from https://rustup.rs")
      );
    }
  }

  // Check/Install Solana CLI
  spinner.start("Checking Solana CLI installation...");
  try {
    execSync("solana --version");
    spinner.succeed(chalk.green("Solana CLI is installed"));
  } catch (error) {
    spinner.info(chalk.blue("Installing Solana CLI..."));
    try {
      if (platform() === "win32") {
        console.log(
          chalk.yellow(
            "Please install Solana CLI manually from https://docs.solana.com/cli/install-solana-cli-tools"
          )
        );
      } else {
        execSync(
          'sh -c "$(curl -sSfL https://release.solana.com/stable/install)"'
        );
        spinner.succeed(chalk.green("Solana CLI installed successfully"));
      }
    } catch (error) {
      spinner.fail(chalk.red("Failed to install Solana CLI"));
      console.log(
        chalk.gray(
          "Please install Solana CLI manually from https://docs.solana.com/cli/install-solana-cli-tools"
        )
      );
    }
  }

  // Check/Install AVM (Anchor Version Manager)
  spinner.start("Checking AVM installation...");
  try {
    execSync("avm --version");
    spinner.succeed(chalk.green("AVM is installed"));
  } catch (error) {
    spinner.info(chalk.blue("Installing AVM..."));
    try {
      execSync(
        "cargo install --git https://github.com/coral-xyz/anchor avm --locked --force"
      );
      spinner.succeed(chalk.green("AVM installed successfully"));
    } catch (error) {
      spinner.fail(chalk.red("Failed to install AVM"));
      console.log(
        chalk.gray(
          "Please install AVM manually: cargo install --git https://github.com/coral-xyz/anchor avm --locked"
        )
      );
    }
  }

  // Install latest Anchor through AVM
  spinner.start("Installing latest Anchor version...");
  try {
    execSync("avm install latest");
    execSync("avm use latest");
    spinner.succeed(chalk.green("Anchor installed successfully"));
  } catch (error) {
    spinner.fail(chalk.red("Failed to install Anchor"));
    console.log(
      chalk.gray("Please install Anchor manually after installing AVM")
    );
  }

  console.log(chalk.green("\n✅ Development environment setup complete!"));
  console.log(chalk.gray("\nNext steps:"));
  console.log(
    chalk.gray("1. Run"),
    chalk.blue("solar doctor"),
    chalk.gray("to verify your installation")
  );
  console.log(
    chalk.gray("2. Run"),
    chalk.blue("solar -i"),
    chalk.gray("to start interactive mode")
  );

  // Additional setup notes for Windows users
  if (platform() === "win32") {
    console.log(chalk.yellow("\nNote for Windows users:"));
    console.log(
      chalk.gray("Some tools require manual installation on Windows.")
    );
    console.log(
      chalk.gray("Please follow the provided links to complete the setup.")
    );
  }
}

export function setupCommand(program: Command) {
  program
    .command("setup")
    .description("Setup Solana development environment")
    .action(setupAction);
}
