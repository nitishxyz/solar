import { Command } from "commander";
import { setupEnvironment } from "../actions/setup";

export function setupCommand(program: Command) {
  program
    .command("setup")
    .description("Setup development environment")
    .action(async () => {
      await setupEnvironment();
    });
}
