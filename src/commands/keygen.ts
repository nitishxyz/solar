import { Command } from "commander";
import { generateKeypair } from "../actions/keygen";

export function keygenCommand(program: Command) {
  program
    .command("keygen")
    .description("Generate a new Solana keypair")
    .option("-g, --global", "Save to global keypair location")
    .action((options) => {
      generateKeypair({ isGlobal: options.global });
    });
}
