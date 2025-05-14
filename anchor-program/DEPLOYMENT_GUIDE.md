
# Wybe Token Platform Deployment Guide

This guide provides comprehensive instructions for deploying the Wybe Token Platform smart contracts to both testnet and mainnet environments.

## Prerequisites

- Solana CLI tools installed and configured
- Anchor CLI installed (v0.29.0 or later)
- A funded Solana wallet for deployment costs
- Node.js and npm/yarn installed

## Development Environment Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/wybe-finance/wybe-token-platform.git
   cd wybe-token-platform
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Configure your local Solana wallet**
   ```bash
   solana config set --keypair ~/.config/solana/id.json
   solana config set --url https://api.devnet.solana.com
   ```

4. **Verify wallet funding (for testnet/devnet)**
   ```bash
   solana balance
   ```
   If needed, request airdrop:
   ```bash
   solana airdrop 2
   ```

## Build & Test

1. **Build the program**
   ```bash
   anchor build
   ```

2. **Update program ID**
   - After building, copy the generated program ID from `target/idl/wybe_token_program.json`
   - Update the program ID in `programs/wybe_token_program/src/lib.rs` and `Anchor.toml`

3. **Run tests**
   ```bash
   anchor test
   ```
   Ensure all tests pass before proceeding to deployment.

## Testnet Deployment

1. **Configure for testnet**
   ```bash
   solana config set --url https://api.testnet.solana.com
   ```

2. **Deploy to testnet**
   ```bash
   anchor deploy --provider.cluster testnet
   ```

3. **Verify deployment**
   ```bash
   solana program show --output json <PROGRAM_ID>
   ```

4. **Initialize treasury wallet**
   ```bash
   anchor run initialize-treasury -- --program-id <PROGRAM_ID> --treasury <TREASURY_WALLET_ADDRESS>
   ```

5. **Record deployment details**
   - Program ID: `<PROGRAM_ID>`
   - Treasury Address: `<TREASURY_WALLET_ADDRESS>`
   - Deployment Date: `YYYY-MM-DD`
   - Transaction Signature: `<DEPLOY_SIGNATURE>`

## Mainnet Deployment Checklist

Before deploying to mainnet, ensure:

1. **Security audit** is completed and all findings addressed
2. **Gas optimization** has been performed
3. **Treasury wallet** is properly secured (ideally multisig)
4. **Fee structure** is finalized and approved
5. **Emergency procedures** are documented and tested
6. **Backup of deployment keys** is securely stored

## Mainnet Deployment

1. **Set up a dedicated deployment machine**
   - Use a clean, secure environment
   - Ensure private keys are properly secured

2. **Configure for mainnet**
   ```bash
   solana config set --url https://api.mainnet-beta.solana.com
   ```

3. **Final verification**
   ```bash
   anchor build
   anchor verify <PROGRAM_ID>
   ```

4. **Deploy to mainnet**
   ```bash
   anchor deploy --provider.cluster mainnet-beta
   ```

5. **Record deployment information**
   - Program ID: `<PROGRAM_ID>`
   - Treasury Address: `<TREASURY_WALLET_ADDRESS>`
   - Deployment Date: `YYYY-MM-DD`
   - Transaction Signature: `<DEPLOY_SIGNATURE>`

6. **Initialize with proper parameters**
   ```bash
   anchor run initialize-mainnet -- \
     --program-id <PROGRAM_ID> \
     --treasury <TREASURY_WALLET_ADDRESS> \
     --creator-fee 250 \
     --platform-fee 250
   ```

## Post-Deployment Verification

1. **Verify program is active**
   ```bash
   solana program show <PROGRAM_ID>
   ```

2. **Test initial transactions**
   - Create a test token
   - Mint a small amount
   - Execute a test trade
   - Verify fees are correctly sent to treasury

3. **Monitor program activity**
   ```bash
   solana program show <PROGRAM_ID> --lamports
   ```

## Frontend Integration

1. **Update frontend configuration**
   - Update program ID in frontend configuration
   - Set correct network (testnet/mainnet)
   - Configure treasury address

2. **Test frontend interactions**
   - Verify all transactions work through UI
   - Confirm fee collection is displayed correctly
   - Test administrative functions

## Ongoing Maintenance

1. **Regular monitoring**
   - Set up alerts for unusual activity
   - Monitor treasury balance

2. **Update process**
   If program updates are needed:
   - Deploy new version to testnet first
   - Thoroughly test all functionality
   - Schedule mainnet update during low-usage period
   - Always maintain backward compatibility when possible

## Emergency Procedures

1. **Freeze functionality**
   If critical issues are discovered:
   ```bash
   anchor run emergency-freeze -- --program-id <PROGRAM_ID>
   ```

2. **Contact information**
   - Technical emergency: tech@wybe.finance
   - Security concerns: security@wybe.finance

## Support

For deployment assistance or questions:
- Email: support@wybe.finance
- Developer docs: https://docs.wybe.finance
