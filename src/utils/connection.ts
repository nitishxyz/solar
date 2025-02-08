import { Connection } from "@solana/web3.js";
import { loadConfig } from "./config";

let connection: Connection;

export function getConnection(): Connection {
  const config = loadConfig();
  if (!connection || connection.rpcEndpoint !== config.rpcUrl) {
    connection = new Connection(config.rpcUrl);
  }
  return connection;
}
