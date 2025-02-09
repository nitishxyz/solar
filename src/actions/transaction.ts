import { getConnection } from "../utils/connection";
import chalk from "chalk";
import ora from "ora";

export async function displayTransaction(signature: string) {
  const spinner = ora("Fetching transaction...").start();
  try {
    const tx = await getConnection().getTransaction(signature, {
      maxSupportedTransactionVersion: 0,
    });

    if (!tx) {
      spinner.fail(chalk.red("Transaction not found"));
      return false;
    }

    spinner.succeed(chalk.green("Transaction found"));

    // Display basic info in a more compact format
    console.log(chalk.blue("\nTransaction Summary:"));
    console.log(`${chalk.gray("Signature:")} ${signature.slice(0, 20)}...`);
    console.log(
      `${chalk.gray("Slot/Time:")} ${tx.slot} (${new Date(
        tx.blockTime! * 1000
      ).toLocaleString()})`
    );
    console.log(
      `${chalk.gray("Status:")} ${
        tx.meta?.err ? chalk.red("Failed") : chalk.green("Success")
      }`
    );
    console.log(`${chalk.gray("Fee:")} ${(tx.meta?.fee ?? 0) / 1e9} SOL`);

    // Display SOL balance changes
    if (tx.meta?.preBalances && tx.meta?.postBalances) {
      console.log(chalk.blue("\nSOL Balance Changes:"));
      tx.meta.preBalances.forEach((pre, index) => {
        const post = tx.meta?.postBalances[index] ?? 0;
        const change = (post - pre) / 1e9;
        if (change !== 0) {
          const account =
            tx.transaction.message.staticAccountKeys[index]?.toString();
          const changeStr =
            change > 0
              ? chalk.green(`+${change}`.padStart(12))
              : chalk.red(`${change}`.padStart(12));
          console.log(
            `${chalk.gray("•")} ${account.padEnd(44)} : ${changeStr} SOL`
          );
        }
      });
    }

    // Display SPL Token balance changes
    if (tx.meta?.preTokenBalances && tx.meta?.postTokenBalances) {
      console.log(chalk.blue("\nToken Balance Changes:"));
      const allTokenChanges = new Map();

      // Track pre-balances
      tx.meta.preTokenBalances.forEach((pre) => {
        const key = `${pre.mint}-${pre.owner}`;
        allTokenChanges.set(key, {
          mint: pre.mint,
          owner: pre.owner,
          pre: Number(pre.uiTokenAmount.amount),
          post: 0,
        });
      });

      // Update with post-balances
      tx.meta.postTokenBalances.forEach((post) => {
        const key = `${post.mint}-${post.owner}`;
        const existing = allTokenChanges.get(key) || {
          mint: post.mint,
          owner: post.owner,
          pre: 0,
        };
        existing.post = Number(post.uiTokenAmount.amount);
        allTokenChanges.set(key, existing);
      });

      // Display changes
      allTokenChanges.forEach(({ mint, owner, pre, post }) => {
        const change = post - pre;
        if (change !== 0) {
          const truncatedMint = `${mint.slice(0, 4)}...${mint.slice(-4)}`;
          const changeStr =
            change > 0
              ? chalk.green(`+${change}`.padStart(12))
              : chalk.red(`${change}`.padStart(12));
          console.log(
            `${chalk.gray("•")} ${owner.padEnd(
              44
            )} : ${changeStr} tokens (${truncatedMint})`
          );
        }
      });
    }

    // Display program invocations in a cleaner format
    console.log(chalk.blue("\nProgram Invocations:"));
    const programCounts = new Map<string, number>();
    const instructions = tx.transaction.message.compiledInstructions;
    const accountKeys = tx.transaction.message.staticAccountKeys;
    instructions.forEach((ix) => {
      const programId = accountKeys[ix.programIdIndex]?.toString() ?? "Unknown";
      programCounts.set(programId, (programCounts.get(programId) ?? 0) + 1);
    });

    Array.from(programCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .forEach(([programId, count]) => {
        const truncatedProgramId = `${programId.slice(
          0,
          4
        )}...${programId.slice(-4)}`;
        console.log(
          `${chalk.gray("•")} ${truncatedProgramId} (${count} calls)`
        );
      });

    // Display key participants more concisely
    const uniqueAccounts = new Set(
      instructions.flatMap((ix) =>
        ix.accountKeyIndexes.map((i) => accountKeys[i]?.toString())
      )
    );
    console.log(chalk.blue("\nKey Participants:"));
    Array.from(uniqueAccounts)
      .slice(0, 5)
      .forEach((account) => {
        if (account) {
          const truncatedAccount = `${account.slice(0, 4)}...${account.slice(
            -4
          )}`;
          console.log(`${chalk.gray("•")} ${truncatedAccount}`);
        }
      });
    if (uniqueAccounts.size > 5) {
      console.log(
        chalk.gray(`... and ${uniqueAccounts.size - 5} more accounts`)
      );
    }

    return true;
  } catch (error) {
    spinner.fail(
      chalk.red(
        `Failed to fetch transaction: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      )
    );
    return false;
  }
}
