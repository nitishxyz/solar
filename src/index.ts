import { program } from "commander";
import { configCommand } from "./commands/config";
import { keygenCommand } from "./commands/keygen";
import { keyinfoCommand } from "./commands/keyinfo";
import { airdropCommand } from "./commands/airdrop";
import { interactiveMode } from "./interactive";
import { getConnection } from "./utils/connection";

// Setup CLI
program
  .name("solar")
  .description("A CLI tool for Solana developers")
  .version("0.1.0")
  .option("-i, --interactive", "Run in interactive mode");

// Register commands
configCommand(program);
keygenCommand(program);
keyinfoCommand(program);
airdropCommand(program, getConnection());

// Parse or run interactive mode
const options = program.opts();
if (options.interactive || process.argv.length <= 2) {
  interactiveMode(getConnection());
} else {
  program.parse();
}
