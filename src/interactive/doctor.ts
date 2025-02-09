import inquirer from "inquirer";
import { checkDependencies } from "../actions/doctor";

export async function doctorInteractive() {
  const { choice } = await inquirer.prompt([
    {
      type: "list",
      name: "choice",
      message: "Check development environment?",
      choices: [
        { name: "Check Dependencies", value: "check" },
        { name: "Back to Main Menu", value: "back" },
      ],
    },
  ]);

  if (choice === "back") return;
  await checkDependencies();
}
