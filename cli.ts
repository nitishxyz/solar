#!/usr/bin/env node

// Suppress deprecation warnings
process.removeAllListeners("warning");

import { program } from "commander";
import { configCommand } from "./src/commands/config";
import { keygenCommand } from "./src/commands/keygen";
import { keyinfoCommand } from "./src/commands/keyinfo";
import { airdropCommand } from "./src/commands/airdrop";
import { syncCommand } from "./src/commands/sync";
import { interactiveMode } from "./src/interactive";
import { getConnection } from "./src/utils/connection";
import { version } from "./package.json";
import { setupCommand } from "./src/commands/setup";
import { doctorCommand } from "./src/commands/doctor";
import { txCommand } from "./src/commands/tx";
import { walletCommand } from "./src/commands/wallet";
import { upgradeCommand } from "./src/commands/upgrade";
// Add initial spacing
console.log();

// Setup CLI
program
  .name("solar")
  .description("A CLI tool for Solana developers")
  .version(version)
  .option("-i, --interactive", "Run in interactive mode");

// Register commands
configCommand(program);
keygenCommand(program);
keyinfoCommand(program);
airdropCommand(program);
syncCommand(program);
setupCommand(program);
doctorCommand(program);
txCommand(program);
walletCommand(program);
upgradeCommand(program);

// Parse or run interactive mode
const options = program.opts();
if (options.interactive || process.argv.length <= 2) {
  console.log("🌟 Welcome to Solar CLI Interactive Mode!");

  // Handle CTRL+C gracefully
  process.on("SIGINT", () => {
    console.log("\n👋 Goodbye!");
    process.exit(0);
  });

  // Additional handler for process exit
  process.on("exit", () => {});

  try {
    await interactiveMode(getConnection(false));
  } catch (error: any) {
    if (error?.message?.includes("User force closed")) {
      process.exit(0);
    }
    throw error;
  }
} else {
  program.parse();
}
