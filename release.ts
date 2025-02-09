import { execSync } from "child_process";
import { readFileSync } from "fs";
import chalk from "chalk";

const VALID_BUMP_TYPES = ["patch", "minor", "major"] as const;
type BumpType = (typeof VALID_BUMP_TYPES)[number];

function getBumpType(): BumpType {
  const type = process.argv[2] as BumpType;
  if (!VALID_BUMP_TYPES.includes(type)) {
    console.error(
      chalk.red(
        `Invalid bump type. Please use one of: ${VALID_BUMP_TYPES.join(", ")}`
      )
    );
    process.exit(1);
  }
  return type;
}

function getCurrentVersion(): string {
  const pkg = JSON.parse(readFileSync("package.json", "utf-8"));
  return pkg.version;
}

function release() {
  try {
    // Ensure working directory is clean
    execSync("git diff-index --quiet HEAD --");
  } catch (error) {
    console.error(
      chalk.red(
        "❌ Working directory is not clean. Please commit or stash changes."
      )
    );
    process.exit(1);
  }

  const bumpType = getBumpType();
  const currentVersion = getCurrentVersion();

  console.log(chalk.blue(`📦 Current version: ${currentVersion}`));
  console.log(chalk.blue(`🔄 Bumping ${bumpType} version...`));

  try {
    // Build the project first
    console.log(chalk.blue("🛠️  Building project..."));
    execSync("bun run build");

    // Run npm version to bump version, create git tag
    execSync(`npm version ${bumpType} --no-git-tag-version`);

    const newVersion = getCurrentVersion();

    // Stage and commit changes
    execSync("git add package.json");
    execSync(`git commit -m "chore: release v${newVersion}"`);

    // Create and push tag
    execSync(`git tag -a v${newVersion} -m "Release v${newVersion}"`);
    execSync("git push origin main --tags");

    console.log(chalk.green(`✅ Successfully created release v${newVersion}!`));
    console.log(chalk.gray("📝 Don't forget to update CHANGELOG.md"));
    console.log(
      chalk.blue(
        "🚀 GitHub Action will handle the npm publishing automatically"
      )
    );
  } catch (error) {
    console.error(chalk.red("❌ Release failed:"), error);
    process.exit(1);
  }
}

release();
