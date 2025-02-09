import inquirer from "inquirer";
import { validators } from "../utils/validators";
import { displayKeyInfo } from "../actions/keyinfo";

export async function keyinfoInteractive() {
  const { choice } = await inquirer.prompt([
    {
      type: "list",
      name: "choice",
      message: "View keypair info?",
      choices: [
        { name: "Enter Keypair Path", value: "view" },
        { name: "Back to Main Menu", value: "back" },
      ],
    },
  ]);

  if (choice === "back") return;

  const { file } = await inquirer.prompt([
    {
      type: "input",
      name: "file",
      message: "Enter the path to keypair file:",
      default: "id.json",
      validate: validators.keypairFile,
    },
  ]);

  await displayKeyInfo(file);
}
