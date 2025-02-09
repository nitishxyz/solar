import { Command } from "commander";
import { displayTransaction } from "../actions/transaction";

export function txCommand(program: Command) {
  program
    .command("tx")
    .argument("<signature>", "Transaction signature")
    .description("Display transaction details")
    .action(async (signature) => {
      await displayTransaction(signature);
    });
}
