import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { execSync } from "child_process";

interface DependencyCheck {
  name: string;
  command: string;
}

const dependencies: DependencyCheck[] = [
  {
    name: "Rust",
    command: "rustc --version",
  },
  {
    name: "Solana CLI",
    command: "solana --version",
  },
  {
    name: "Anchor CLI",
    command: "anchor --version",
  },
  {
    name: "Node.js",
    command: "node --version",
  },
];

export async function checkDependencies() {
  console.log(chalk.blue("🏥 Checking development environment...\n"));
  let allPassed = true;

  for (const dep of dependencies) {
    const spinner = ora(`Checking ${dep.name}...`).start();
    try {
      execSync(dep.command);
      spinner.succeed(chalk.green(`${dep.name} is installed`));
    } catch (error) {
      allPassed = false;
      spinner.fail(chalk.red(`${dep.name} is not installed`));
    }
  }

  if (allPassed) {
    console.log(chalk.green("\n✅ All dependencies are installed!"));
  } else {
    console.log(chalk.yellow("\n⚠️  Some dependencies are missing."));
    console.log(chalk.gray("\nPlease visit:"));
    console.log(
      chalk.blue("https://docs.solana.com/getstarted/developer-tools")
    );
  }
}

export function doctorCommand(program: Command) {
  program
    .command("doctor")
    .description("Check if all dependencies are properly installed")
    .action(checkDependencies);
}
