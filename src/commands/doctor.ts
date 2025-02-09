import { Command } from "commander";
import { checkDependencies } from "../actions/doctor";

export function doctorCommand(program: Command) {
  program
    .command("doctor")
    .description("Check development environment")
    .action(async () => {
      await checkDependencies();
    });
}
