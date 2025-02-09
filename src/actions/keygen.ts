import { Keypair } from "@solana/web3.js";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import { GLOBAL_KEYPAIR_PATH, LOCAL_KEYPAIR_PATH } from "../constants";

interface KeygenOptions {
  isGlobal?: boolean;
  customPath?: string;
}

export async function generateKeypair(options: KeygenOptions = {}) {
  const keypairPath = options.customPath
    ? options.customPath
    : options.isGlobal
    ? GLOBAL_KEYPAIR_PATH
    : LOCAL_KEYPAIR_PATH;

  try {
    // Check for existing keypair
    if (fs.existsSync(keypairPath)) {
      const existingKey = new Uint8Array(
        JSON.parse(fs.readFileSync(keypairPath, "utf-8"))
      );
      const existingKeypair = Keypair.fromSecretKey(existingKey);
      console.log(
        chalk.yellow("\n⚠️  WARNING: An existing keypair file was found:")
      );
      console.log(
        chalk.yellow("Existing Public Key:"),
        existingKeypair.publicKey.toBase58()
      );
    }

    // Generate and save new keypair
    const keypair = Keypair.generate();
    const keypairData = JSON.stringify(Array.from(keypair.secretKey));

    fs.mkdirSync(path.dirname(keypairPath), { recursive: true });
    fs.writeFileSync(keypairPath, keypairData);

    console.log(chalk.green(`✅ Keypair generated: ${keypairPath}`));
    console.log(chalk.blue("Public Key:"), keypair.publicKey.toBase58());
    return true;
  } catch (error) {
    console.error(
      chalk.red(
        `Failed to save keypair: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      )
    );
    return false;
  }
}
