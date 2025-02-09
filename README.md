# Solar CLI

A powerful command-line interface tool for Solana developers that simplifies common development tasks.

<img src="https://369y9gxi2s.ufs.sh/f/iELAm9NYeRd6FIC1fS3VWoaU4plicm3wq5JZv6d8uPxFShCH" alt="Solar CLI Demo" width="800"/>

## Features

- 🔑 Generate and manage Solana keypairs
- 💫 Request SOL airdrops for development
- ⚙️ Flexible configuration management (global & local)
- 🔄 Sync settings with Solana CLI
- 💻 Interactive mode for easier usage
- 🌐 Support for multiple networks (localnet, devnet, testnet, mainnet)

## Development

### Prerequisites

- [Bun](https://bun.sh) v1.1.42 or higher
- Node.js 18 or higher

### Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/solar.git
cd solar
```

2. Install dependencies:

```bash
bun install
```

3. Run in development mode:

```bash
bun run cli.ts
```

### Building

Build the project:

```bash
bun run build
```

The built files will be in the `dist` directory.

### Installation

#### From NPM

```bash
npm install -g @nitishxyz/solar
```

#### From Source

```bash
npm install -g .
```

## Usage

### Interactive Mode

Start the interactive CLI interface:

```bash
solar
# or
solar -i
```

### Command Mode

```bash
solar <command> [options]
```

### Available Commands

#### Configuration

```bash
solar config [options] [network]
  -g, --global    Use global configuration
  -l, --local     Use local configuration (default)
  -s, --show      Show current configuration
  -i, --init      Initialize configuration file
  -k, --keypair   <path> Set keypair path
```

#### Keypair Management

```bash
solar keygen [options]
  -g, --global    Save to global keypair location

solar keyinfo <file>
  View keypair information
```

#### Airdrop

```bash
solar airdrop <address>
  Request 1 SOL airdrop for development
```

#### Sync with Solana CLI

```bash
solar sync
  Sync configuration with Solana CLI
```

## Configuration

Solar CLI supports both global and local configuration:

- Global config: `~/.config/solar/config.json`
- Local config: `./solar-config.json` (in project directory)

Local configuration takes precedence over global configuration.

### Supported Networks

- `localnet`: http://127.0.0.1:8899
- `devnet`: https://api.devnet.solana.com
- `testnet`: https://api.testnet.solana.com
- `mainnet`: https://api.mainnet-beta.solana.com
- Custom RPC URL

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Bun](https://bun.sh)
- Uses [Solana Web3.js](https://github.com/solana-labs/solana-web3.js)
