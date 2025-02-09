import { Command } from "commander";
import { execSync } from "child_process";

export function upgradeCommand(program: Command) {
  program
    .command("upgrade")
    .description("Upgrade Solar CLI to the latest version")
    .action(async () => {
      try {
        // Check if npm was used (package-lock.json exists)
        try {
          execSync("test -f package-lock.json", { stdio: "ignore" });
          console.log("📦 Upgrading using npm...");
          execSync("npm install -g @nitishxyz/solar-cli@latest", {
            stdio: "inherit",
          });
          return;
        } catch {}

        // Check if yarn was used (yarn.lock exists)
        try {
          execSync("test -f yarn.lock", { stdio: "ignore" });
          console.log("📦 Upgrading using yarn...");
          execSync("yarn global add @nitishxyz/solar-cli@latest", {
            stdio: "inherit",
          });
          return;
        } catch {}

        // Check if pnpm was used (pnpm-lock.yaml exists)
        try {
          execSync("test -f pnpm-lock.yaml", { stdio: "ignore" });
          console.log("📦 Upgrading using pnpm...");
          execSync("pnpm add -g @nitishxyz/solar-cli@latest", {
            stdio: "inherit",
          });
          return;
        } catch {}

        // Default to npm if no lock file is found
        console.log("📦 Upgrading using npm...");
        execSync("npm install -g @nitishxyz/solar-cli@latest", {
          stdio: "inherit",
        });
      } catch (error: any) {
        console.error("❌ Failed to upgrade Solar CLI:", error.message);
        process.exit(1);
      }
    });
}
