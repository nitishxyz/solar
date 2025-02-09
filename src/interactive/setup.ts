import inquirer from "inquirer";
import { setupEnvironment } from "../actions/setup";

export async function setupInteractive() {
  const { choice } = await inquirer.prompt([
    {
      type: "list",
      name: "choice",
      message: "Setup development environment?",
      choices: [
        { name: "Initialize Workspace", value: "setup" },
        { name: "Back to Main Menu", value: "back" },
      ],
    },
  ]);

  if (choice === "back") return;
  await setupEnvironment();
}
