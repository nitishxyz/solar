import { Command } from "commander";
import {
  displayCurrentConfig,
  initializeConfig,
  setRpcUrl,
  setKeypairPath,
} from "../actions/config";

export function configCommand(program: Command) {
  program
    .command("config")
    .description("Manage configuration")
    .option("-g, --global", "Use global configuration")
    .option("-s, --show", "Show current configuration")
    .option("-i, --init", "Initialize configuration file")
    .option("-k, --keypair <path>", "Set keypair path")
    .argument(
      "[network]",
      "Network to use (localnet, devnet, testnet, mainnet) or RPC URL"
    )
    .action(async (network, options) => {
      if (options.show) {
        displayCurrentConfig(options.global);
      } else if (options.init) {
        await initializeConfig(options.global);
      } else if (options.keypair) {
        await setKeypairPath(options.keypair, options.global);
      } else if (network) {
        await setRpcUrl(network, options.global);
      } else {
        displayCurrentConfig(options.global);
      }
    });
}
