import { Command } from "commander";
import { syncWithSolanaCLI } from "../actions/sync";

export function syncCommand(program: Command) {
  program
    .command("sync")
    .description("Sync configuration with Solana CLI")
    .action(async () => {
      await syncWithSolanaCLI();
    });
}
