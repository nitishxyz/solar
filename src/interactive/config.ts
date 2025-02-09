import inquirer from "inquirer";
import { validators } from "../utils/validators";
import {
  displayCurrentConfig,
  initializeConfig,
  setRpcUrl,
  setKeypairPath,
} from "../actions/config";
import { RPC_URLS } from "../constants";

export async function configInteractive() {
  const { configAction } = await inquirer.prompt([
    {
      type: "list",
      name: "configAction",
      message: "What would you like to configure?\n",
      pageSize: 15,
      choices: [
        { name: "Show Current Configuration", value: "show-current" },
        { name: "Show Global Configuration", value: "show-global" },
        { name: "Set RPC URL (Local)", value: "set-rpc-local" },
        { name: "Set RPC URL (Global)", value: "set-rpc-global" },
        { name: "Set Keypair (Local)", value: "set-keypair-local" },
        { name: "Set Keypair (Global)", value: "set-keypair-global" },
        { name: "Initialize Local Config", value: "init-local" },
        { name: "Initialize Global Config", value: "init-global" },
        { name: "Back to Main Menu", value: "back" },
      ],
    },
  ]);

  if (configAction === "back") return;

  switch (configAction) {
    case "show-current":
      displayCurrentConfig(false);
      break;
    case "show-global":
      displayCurrentConfig(true);
      break;
    case "init-local":
      await initializeConfig(false);
      break;
    case "init-global":
      await initializeConfig(true);
      break;
    case "set-rpc-local":
    case "set-rpc-global": {
      const { network } = await inquirer.prompt([
        {
          type: "list",
          name: "network",
          message: "Select network or enter custom RPC URL:",
          choices: [
            ...Object.keys(RPC_URLS).map((key) => ({ name: key, value: key })),
            { name: "Custom URL", value: "custom" },
          ],
        },
      ]);

      if (network === "custom") {
        const { url } = await inquirer.prompt([
          {
            type: "input",
            name: "url",
            message: "Enter custom RPC URL:",
            validate: validators.url,
          },
        ]);
        await setRpcUrl(url, configAction === "set-rpc-global");
      } else {
        await setRpcUrl(network, configAction === "set-rpc-global");
      }
      break;
    }
    case "set-keypair-local":
    case "set-keypair-global": {
      const { keypairPath } = await inquirer.prompt([
        {
          type: "input",
          name: "keypairPath",
          message: "Enter keypair path:",
          validate: validators.keypairFile,
        },
      ]);
      await setKeypairPath(keypairPath, configAction === "set-keypair-global");
      break;
    }
  }
}
