import inquirer from "inquirer";
import ora from "ora";
import chalk from "chalk";
import { Keypair } from "@solana/web3.js";
import fs from "fs";
import path from "path";
import { GLOBAL_KEYPAIR_PATH } from "../constants";

export async function keygenInteractive() {
  const { choice } = await inquirer.prompt([
    {
      type: "list",
      name: "choice",
      message: "Generate new keypair?",
      choices: [
        { name: "Generate Global Keypair", value: "global" },
        { name: "Generate Local Keypair", value: "local" },
        { name: "Back to Main Menu", value: "back" },
      ],
    },
  ]);

  if (choice === "back") return;

  let keypairPath = GLOBAL_KEYPAIR_PATH;

  if (choice === "local") {
    const { filename } = await inquirer.prompt([
      {
        type: "input",
        name: "filename",
        message: "Enter keypair filename (will be saved in current directory):",
        default: "id.json",
        validate: (input: string) => {
          if (!input.endsWith(".json")) return "Filename must end with .json";
          if (input.includes("/") || input.includes("\\"))
            return "Filename cannot contain path separators";
          const fullPath = path.join(process.cwd(), input);
          if (fs.existsSync(fullPath)) {
            return chalk.yellow(
              "⚠️  File exists, will be overwritten if you continue"
            );
          }
          return true;
        },
      },
    ]);
    keypairPath = path.join(process.cwd(), filename);
  }

  if (fs.existsSync(keypairPath)) {
    console.log(
      chalk.yellow("\n⚠️  WARNING: An existing keypair file was found:")
    );
    const existingKey = new Uint8Array(
      JSON.parse(fs.readFileSync(keypairPath, "utf-8"))
    );
    const existingKeypair = Keypair.fromSecretKey(existingKey);
    console.log(
      chalk.yellow("Existing Public Key:"),
      existingKeypair.publicKey.toBase58()
    );
  }

  const { confirmed } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirmed",
      message: `This will ${
        fs.existsSync(keypairPath) ? "overwrite" : "create"
      } ${keypairPath}. Continue?`,
      default: false,
    },
  ]);

  if (!confirmed) {
    console.log(chalk.yellow("Operation cancelled"));
    return;
  }

  const genSpinner = ora("Generating keypair...").start();
  try {
    const keypair = Keypair.generate();
    const keypairData = JSON.stringify(Array.from(keypair.secretKey));
    fs.mkdirSync(path.dirname(keypairPath), { recursive: true });
    fs.writeFileSync(keypairPath, keypairData);
    genSpinner.succeed(chalk.green(`Keypair generated: ${keypairPath}`));
    console.log(chalk.blue("Public Key:"), keypair.publicKey.toBase58());
  } catch (error) {
    genSpinner.fail(
      chalk.red(
        `Failed to generate keypair: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      )
    );
  }
}
