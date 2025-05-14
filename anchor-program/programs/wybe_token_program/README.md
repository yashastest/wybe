
# Wybe Token Program

This is the smart contract for the Wybe token platform, built on Solana using the Anchor framework.

## Features

- Token creation with customizable creator and platform fees
- Trading functionality with automatic fee collection
- Treasury integration with 1% of all minted tokens sent to project treasury
- Emergency freeze/unfreeze capabilities for security
- Creator fee claiming mechanism
- Treasury wallet management

## Contract Structure

### Core Accounts
- `TokenAccount`: Stores token metadata, fees configuration, and treasury address
- `TokenHolder`: Represents a wallet holding tokens with balance tracking

### Key Instructions
- `initialize`: Create a new token with specified name, symbol, and fee structure
- `mint_tokens`: Mint new tokens with 1% sent to treasury
- `execute_trade`: Process a token trade with fee collection
- `update_fees`: Modify the fee structure (creator and platform fees)
- `update_treasury`: Change the treasury wallet address
- `claim_creator_fees`: Allow creators to claim accumulated fees
- `emergency_freeze`/`emergency_unfreeze`: Safety controls for risk management

## Deployment

### Testnet
```bash
anchor build
anchor deploy --provider.cluster testnet
```

### Mainnet
```bash
anchor build
anchor deploy --provider.cluster mainnet-beta
```

## Security Considerations

- All fee calculations include overflow/underflow protection
- Authority validation on sensitive operations
- Emergency freeze capability for incident response
- Events emitted for all state changes to support off-chain tracking

## Fee Structure

Fees are specified in basis points (1/100 of 1%):
- Creator fee: Default 250 (2.5%)
- Platform fee: Default 250 (2.5%)
- Total fees capped at 1000 basis points (10%)

## Treasury Integration

1% of all newly minted tokens are automatically sent to the treasury wallet. Additionally, the platform fee portion of all trades is directed to the treasury.

## Events

The contract emits events for all major operations to facilitate off-chain tracking and frontend integration:
- `TokenInitialized`: When a new token is created
- `TokensMinted`: When tokens are minted
- `TradeExecuted`: When a trade occurs
- `FeesUpdated`: When fee structure changes
- `TreasuryUpdated`: When treasury wallet is updated
- `CreatorFeesClaimed`: When a creator claims their fees
- `AccountFrozen`/`AccountUnfrozen`: For emergency actions
