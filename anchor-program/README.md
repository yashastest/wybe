
# Wybe Finance Anchor Program

This folder contains the Solana smart contracts for the Wybe Finance platform, built using the Anchor framework.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Build the program:
```bash
anchor build
```

3. Deploy to devnet:
```bash
anchor deploy --provider.cluster devnet
```

4. Run tests:
```bash
anchor test
```

## Smart Contract Structure

- `programs/wybe_token_program/src/lib.rs`: Main program implementation
- Token metadata and bonding curve implementations
- Fee calculations and reward distribution logic

## Program Features

- Token creation and metadata management
- Configurable bonding curves
- Creator fee calculation and distribution
- Platform fee handling

## Project Structure

```
anchor-program/
├── Anchor.toml          # Anchor configuration
├── Cargo.toml           # Rust workspace configuration
├── programs/            # Solana programs
│   └── wybe_token_program/ # Main token program
│       ├── Cargo.toml   # Program dependencies
│       └── src/         # Program source code
│           └── lib.rs   # Main program implementation
├── tests/               # Program tests
│   └── wybe-token-program.ts # Test suite
└── target/              # Build artifacts (generated)
    └── types/          # TypeScript type definitions (generated)
```
