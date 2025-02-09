import { Connection, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import chalk from "chalk";
import ora from "ora";
import { getConnection } from "../utils/connection";

export async function displayWalletInfo(address: string) {
  const spinner = ora("Fetching wallet information...").start();
  try {
    const connection = getConnection();
    const pubkey = new PublicKey(address);

    // Fetch SOL balance
    const balance = await connection.getBalance(pubkey);
    spinner.succeed(chalk.green("Wallet information retrieved"));

    console.log(chalk.blue("\nWallet Summary:"));
    console.log(`${chalk.gray("Address:")} ${address}`);
    console.log(
      `${chalk.gray("SOL Balance:")} ${(balance / 1e9).toFixed(4)} SOL`
    );

    // Fetch token accounts
    await displayTokenBalances(connection, pubkey);

    return true;
  } catch (error) {
    spinner.fail(
      chalk.red(
        `Failed to fetch wallet info: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      )
    );
    return false;
  }
}

async function displayTokenBalances(connection: Connection, pubkey: PublicKey) {
  const spinner = ora("Fetching token balances...").start();
  try {
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      pubkey,
      {
        programId: TOKEN_PROGRAM_ID,
      }
    );

    if (tokenAccounts.value.length === 0) {
      spinner.info(chalk.yellow("No token balances found"));
      return;
    }

    spinner.succeed(chalk.green("Token balances retrieved"));
    console.log(chalk.blue("\nToken Balances:"));

    tokenAccounts.value.forEach((account) => {
      const parsedInfo = account.account.data.parsed.info;
      const balance = parsedInfo.tokenAmount.uiAmount;
      if (balance > 0) {
        console.log(
          `${chalk.gray("•")} ${balance.toString().padEnd(12)} ${
            parsedInfo.mint
          }`
        );
      }
    });
  } catch (error) {
    spinner.fail(chalk.red("Failed to fetch token balances"));
  }
}

interface TransactionOptions {
  page?: number;
  limit?: number;
}

export async function displayWalletTransactions(
  address: string,
  options: TransactionOptions = {}
) {
  const spinner = ora("Fetching transactions...").start();
  try {
    const connection = getConnection();
    const pubkey = new PublicKey(address);
    const page = options.page || 1;
    const limit = options.limit || 10;

    console.log(chalk.blue("\nWallet Transactions:"));
    console.log(`${chalk.gray("Address:")} ${address}`);

    const signatures = await connection.getSignaturesForAddress(pubkey, {
      limit,
      before: page > 1 ? undefined : undefined, // TODO: Implement proper pagination
    });

    if (signatures.length === 0) {
      spinner.info(chalk.yellow("No transactions found"));
      return;
    }

    spinner.succeed(chalk.green("Transactions retrieved"));

    signatures.forEach((sig, index) => {
      const status = sig.err ? chalk.red("Failed") : chalk.green("Success");
      console.log(
        `${chalk.gray(
          ((page - 1) * limit + index + 1).toString().padStart(3)
        )}. ${sig.signature} ${status}`
      );
    });

    console.log(
      chalk.gray(
        `\nPage ${page} of ? • Use --page <number> to view more transactions`
      )
    );
    return true;
  } catch (error) {
    spinner.fail(chalk.red("Failed to fetch transactions"));
    return false;
  }
}
