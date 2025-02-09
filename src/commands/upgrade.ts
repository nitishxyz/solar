import { Command } from "commander";
import { execSync } from "child_process";

export function upgradeCommand(program: Command) {
  program
    .command("upgrade")
    .description("Upgrade Solar CLI to the latest version")
    .action(async () => {
      try {
        // Check which package manager was used for the global installation
        try {
          const which = execSync("which solar").toString();

          if (which.includes("/.bun/")) {
            console.log("📦 Upgrading using bun...");
            execSync("bun add -g @nitishxyz/solar@latest", {
              stdio: "inherit",
            });
            return;
          }

          if (which.includes("/.pnpm/")) {
            console.log("📦 Upgrading using pnpm...");
            execSync("pnpm add -g @nitishxyz/solar@latest", {
              stdio: "inherit",
            });
            return;
          }

          if (which.includes("/.yarn/")) {
            console.log("📦 Upgrading using yarn...");
            execSync("yarn global add @nitishxyz/solar@latest", {
              stdio: "inherit",
            });
            return;
          }

          // Default to npm
          console.log("📦 Upgrading using npm...");
          execSync("npm install -g @nitishxyz/solar@latest", {
            stdio: "inherit",
          });
        } catch (error) {
          // If which command fails, default to npm
          console.log("📦 Upgrading using npm...");
          execSync("npm install -g @nitishxyz/solar@latest", {
            stdio: "inherit",
          });
        }
      } catch (error: any) {
        console.error("❌ Failed to upgrade Solar CLI:", error.message);
        process.exit(1);
      }
    });
}
