import chalk from "chalk";
import ora from "ora";
import { execSync } from "child_process";
import { checkDependencies } from "./doctor";

export async function setupEnvironment() {
  console.log(chalk.blue("🚀 Setting up development environment...\n"));

  // First check dependencies
  const dependenciesOk = await checkDependencies();
  if (!dependenciesOk) {
    console.log(
      chalk.yellow("\nPlease install missing dependencies before continuing.")
    );
    return false;
  }

  // Initialize workspace
  const spinner = ora("Initializing workspace...").start();
  try {
    // Create basic project structure
    execSync("mkdir -p src");
    execSync("mkdir -p tests");

    // Create basic configuration files if they don't exist
    execSync("touch .gitignore");
    execSync("touch README.md");

    spinner.succeed(chalk.green("Workspace initialized"));
    console.log(chalk.green("\n✅ Development environment is ready!"));
    return true;
  } catch (error) {
    spinner.fail(
      chalk.red(
        `Failed to initialize workspace: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      )
    );
    return false;
  }
}
