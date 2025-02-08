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

// Add initial spacing
console.log();

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
syncCommand(program);

// Parse or run interactive mode
const options = program.opts();
if (options.interactive || process.argv.length <= 2) {
  console.log("🌟 Welcome to Solar CLI Interactive Mode!\n");

  // Handle CTRL+C gracefully
  process.on("SIGINT", () => {
    console.log("\n👋 Goodbye!");
    process.exit(0);
  });

  // Additional handler for process exit
  process.on("exit", () => {});

  try {
    await interactiveMode(getConnection());
  } catch (error: any) {
    if (error?.message?.includes("User force closed")) {
      process.exit(0);
    }
    throw error;
  }
} else {
  program.parse();
}
