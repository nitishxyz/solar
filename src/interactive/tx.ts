import inquirer from "inquirer";
import { displayTransaction } from "../actions/transaction";

export async function txInteractive() {
  const { choice } = await inquirer.prompt([
    {
      type: "list",
      name: "choice",
      message: "View transaction details?",
      choices: [
        { name: "Enter Transaction Signature", value: "view" },
        { name: "Back to Main Menu", value: "back" },
      ],
    },
  ]);

  if (choice === "back") return;

  const { signature } = await inquirer.prompt([
    {
      type: "input",
      name: "signature",
      message: "Enter the transaction signature:",
      validate: (input: string) =>
        input.length > 0 || "Please enter a signature",
    },
  ]);

  await displayTransaction(signature);
}
