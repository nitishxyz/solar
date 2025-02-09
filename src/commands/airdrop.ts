import { Command } from "commander";
import { requestAirdrop } from "../actions/airdrop";

export function airdropCommand(program: Command) {
  program
    .command("airdrop")
    .argument("<address>", "Wallet address")
    .description("Request 1 SOL airdrop")
    .action(async (address) => {
      await requestAirdrop(address);
    });
}
