import inquirer from "inquirer";
import path from "path";
import { generateKeypair } from "../actions/keygen";

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
          return true;
        },
      },
    ]);
    await generateKeypair({ customPath: path.join(process.cwd(), filename) });
  } else {
    await generateKeypair({ isGlobal: true });
  }
}
