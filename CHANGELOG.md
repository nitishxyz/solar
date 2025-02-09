# Changelog

All notable changes to this project will be documented in this file.

## [0.1.11] - 2025-02-09

### Added

- New upgrade command functionality
  - Added `upgrade` command to update Solar CLI to the latest version
  - Automatic package manager detection (npm, yarn, pnpm)
  - Fallback to npm if no package manager is detected

## [0.1.10] - 2025-02-09

### Added

- New wallet command functionality
  - Added `wallet` command for viewing wallet information
  - Integrated wallet viewing capabilities in interactive mode
- UI/UX Improvements
  - Increased page size to 15 items in interactive menus
  - Enhanced menu readability in configuration and main menu
- Airdrop command now supports using the current configured wallet

## [0.1.8] - 2025-02-09

### Added

- Connection utility for managing Solana RPC endpoints
  - Added `getConnection` function with global/local configuration support
  - Implements connection caching to improve performance
  - Automatic RPC endpoint synchronization based on config changes
  - Restructured commands and actions to improve readability and maintainability
  - tx command now displays a summary of the transaction

## [0.1.7] - 2025-02-09

### Added

- `setup` command to automate development environment setup
  - Installs Rust, Solana CLI, and Anchor toolchain
  - Provides guided installation for Windows users
- `doctor` command to verify development dependencies
  - Checks for Node.js, Rust, Solana CLI, and Anchor installations

## [0.1.5] - 2025-02-09

- Added release script
- Added GitHub Actions for releasing to npm

## [0.1.3] - 2025-02-09

### Added

- Basic CLI functionality
- Keypair management commands
- SOL airdrop support
- Configuration management
- Solana CLI sync feature
