import { Command } from "commander";
import { displayKeyInfo } from "../actions/keyinfo";

export function keyinfoCommand(program: Command) {
  program
    .command("keyinfo")
    .argument("<file>", "Path to keypair file")
    .description("Parse keypair and display public/private keys")
    .action(async (file) => {
      await displayKeyInfo(file);
    });
}
