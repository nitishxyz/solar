import { Command } from "commander";
import { Keypair } from "@solana/web3.js";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import { GLOBAL_KEYPAIR_PATH, LOCAL_KEYPAIR_PATH } from "../constants";

export function keygenCommand(program: Command) {
  program
    .command("keygen")
    .description("Generate a new Solana keypair")
    .option("-g, --global", "Save to global keypair location")
    .action((options) => {
      const keypairPath = options.global
        ? GLOBAL_KEYPAIR_PATH
        : LOCAL_KEYPAIR_PATH;
      const keypair = Keypair.generate();
      const keypairData = JSON.stringify(Array.from(keypair.secretKey));

      try {
        fs.mkdirSync(path.dirname(keypairPath), { recursive: true });
        fs.writeFileSync(keypairPath, keypairData);
        console.log(chalk.green(`✅ Keypair generated: ${keypairPath}`));
        console.log(chalk.blue("Public Key:"), keypair.publicKey.toBase58());
      } catch (error) {
        console.error(
          chalk.red(
            `Failed to save keypair: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          )
        );
      }
    });
}
