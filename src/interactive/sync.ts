import inquirer from "inquirer";
import { syncWithSolanaCLI } from "../actions/sync";

export async function syncInteractive() {
  const { choice } = await inquirer.prompt([
    {
      type: "list",
      name: "choice",
      message: "Sync with Solana CLI?",
      choices: [
        { name: "Sync Configuration", value: "sync" },
        { name: "Back to Main Menu", value: "back" },
      ],
    },
  ]);

  if (choice === "back") return;

  await syncWithSolanaCLI();
}
