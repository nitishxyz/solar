import fs from "fs";
import path from "path";
import chalk from "chalk";
import type { SolarConfig } from "../types";
import {
  DEFAULT_CONFIG,
  GLOBAL_CONFIG_PATH,
  LOCAL_CONFIG_PATH,
} from "../constants";

export function loadConfig(isGlobal: boolean = false): SolarConfig {
  try {
    if (isGlobal) {
      // Load global config if exists
      if (fs.existsSync(GLOBAL_CONFIG_PATH)) {
        return JSON.parse(fs.readFileSync(GLOBAL_CONFIG_PATH, "utf-8"));
      }
    } else {
      // Try local config first
      if (fs.existsSync(LOCAL_CONFIG_PATH)) {
        return JSON.parse(fs.readFileSync(LOCAL_CONFIG_PATH, "utf-8"));
      }
      // Fall back to global config if no local config
      if (fs.existsSync(GLOBAL_CONFIG_PATH)) {
        return JSON.parse(fs.readFileSync(GLOBAL_CONFIG_PATH, "utf-8"));
      }
    }
    // If no config exists, return default
    return DEFAULT_CONFIG;
  } catch {
    return DEFAULT_CONFIG;
  }
}

export function saveConfig(
  config: SolarConfig,
  scope: "global" | "local" = "local"
): boolean {
  const configPath =
    scope === "global" ? GLOBAL_CONFIG_PATH : LOCAL_CONFIG_PATH;

  try {
    fs.mkdirSync(path.dirname(configPath), { recursive: true });
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    return true;
  } catch (error) {
    console.error(
      chalk.red(
        `Failed to save ${scope} config: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      )
    );
    return false;
  }
}

export function displayConfig(showGlobal: boolean = false) {
  console.log(chalk.blue("\nCurrent Configuration:"));

  // Show global config if exists
  if (fs.existsSync(GLOBAL_CONFIG_PATH)) {
    console.log(chalk.gray("\nGlobal config path:"), GLOBAL_CONFIG_PATH);
    try {
      const globalConfig = JSON.parse(
        fs.readFileSync(GLOBAL_CONFIG_PATH, "utf-8")
      );
      console.log(chalk.gray("Global config:"), globalConfig);
    } catch (error) {
      console.log(chalk.red("Error reading global config"));
    }
  }

  // Show local config if exists
  if (fs.existsSync(LOCAL_CONFIG_PATH)) {
    console.log(chalk.gray("\nLocal config path:"), LOCAL_CONFIG_PATH);
    try {
      const localConfig = JSON.parse(
        fs.readFileSync(LOCAL_CONFIG_PATH, "utf-8")
      );
      console.log(chalk.gray("Local config:"), localConfig);
    } catch (error) {
      console.log(chalk.red("Error reading local config"));
    }
  }

  // Show active merged config
  console.log(chalk.gray("\nActive merged config:"), loadConfig());
}
