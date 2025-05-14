
# Wybe Token Platform - Mainnet Deployment Guide

This guide provides detailed instructions for deploying the Wybe Token Platform smart contracts to the Solana mainnet. Following these steps ensures a secure, properly configured deployment.

## Pre-Deployment Checklist

Before proceeding to mainnet deployment, confirm the following:

- [x] All smart contract code has been audited by a reputable security firm
- [x] All test cases pass successfully on devnet and testnet
- [x] Treasury wallet is properly configured (preferably multisig)
- [x] Fee parameters have been finalized and approved
- [x] Deployment keys are secured properly
- [x] Backup and recovery procedures are documented
- [x] Emergency response plan is in place

## Environment Setup

### Hardware Requirements

- Use a dedicated, secure machine for deployment
- Physical security controls for deployment machine
- Cold storage for deployment keys when not in use

### Software Requirements

```bash
# Required software versions
Solana CLI: 1.14.0 or later
Anchor: 0.29.0 or later
Node.js: 16.x or later
Rust: 1.60.0 or later
```

### Security Configurations

1. Set up a new, dedicated Solana wallet for deployment
   ```bash
   solana-keygen new --outfile mainnet-deploy.json
   ```

2. Transfer sufficient SOL for deployment (approximately 10 SOL)

3. Secure this key with hardware-based encryption

## Build Procedure

1. Clone the repository from the secure, audited branch
   ```bash
   git clone https://github.com/wybe-finance/wybe-token-platform.git
   cd wybe-token-platform
   git checkout v1.0-release
   ```

2. Install dependencies
   ```bash
   yarn install
   ```

3. Build the program
   ```bash
   anchor build
   ```

4. Verify build artifacts
   ```bash
   ls -la target/deploy/
   ```

5. Check program ID matches the expected value
   ```bash
   solana address -k target/deploy/wybe_token_program-keypair.json
   ```

## Deployment Procedure

### Step 1: Connect to Mainnet

```bash
solana config set --url https://api.mainnet-beta.solana.com
solana config set --keypair mainnet-deploy.json
```

### Step 2: Verify Wallet Balance

```bash
solana balance
```
Ensure sufficient funds (minimum 5 SOL recommended).

### Step 3: Deploy Program

```bash
# Initialize 
anchor deploy --provider.cluster mainnet-beta
```

Expected output:
```
Deploying workspace: https://api.mainnet-beta.solana.com
Upgrading program Wyb111111111111111111111111111111111111111
Program Id: Wyb111111111111111111111111111111111111111
```

### Step 4: Record Deployment Information

Document the following:
- Program ID
- Deployment transaction signature
- Deployment timestamp
- Deployer's key identifier (NOT the private key)

### Step 5: Initialize Main Token Account

```bash
# Run the initialization script with proper parameters
anchor run initialize-mainnet-token -- \
  --name "Wybe Token" \
  --symbol "WYBE" \
  --creator-fee 250 \
  --platform-fee 250 \
  --treasury <TREASURY_WALLET_ADDRESS>
```

### Step 6: Configure Treasury Settings

```bash
# Verify treasury configuration
anchor run verify-treasury -- --program-id <PROGRAM_ID> --treasury <TREASURY_WALLET_ADDRESS>
```

### Step 7: Verify Deployment

```bash
# Run the comprehensive verification script
anchor run verify-deployment -- --network mainnet --program-id <PROGRAM_ID>
```

The script will verify:
- Program is properly deployed
- Token creation works as expected
- Fee calculation is correct
- Treasury integration functions properly

## Post-Deployment Verification

1. Transaction Testing
   - Execute test trades
   - Verify fee collection
   - Confirm treasury receives platform fees
   - Validate 1% token allocation to treasury on mint operations

2. Emergency Controls Testing
   - Test freeze functionality (if included in deployment)
   - Verify administrative functions work as expected

3. Frontend Integration
   - Ensure frontend properly connects to deployed contract
   - Test all user-facing functionality 
   - Verify transaction displays and notifications

## Security Procedures

### Monitoring Setup

1. Set up alerts for:
   - Unusual transaction volume
   - Large token transfers
   - Treasury withdrawals
   - Fee parameter changes

2. Implement regular audit procedures:
   - Weekly treasury balance verification
   - Monthly contract activity review

### Emergency Response

If an issue is detected:

1. Assess severity (Low, Medium, High, Critical)
2. For Critical/High issues:
   - Activate emergency freeze if necessary
   - Notify security team immediately
   - Begin incident response procedure

3. Document incident details:
   - Nature of issue
   - Affected components
   - Impact assessment
   - Resolution steps

## Maintenance Procedures

### Updates and Upgrades

1. All updates must follow the same security process as initial deployment
2. Changes must be:
   - Thoroughly tested on testnet
   - Security audited if modifying critical functionality
   - Approved by governance process (if applicable)

2. Deployment schedule:
   - Schedule updates during low-activity periods
   - Provide advance notice to users
   - Have rollback plan prepared

### Contact Information

- Technical emergencies: security@wybe.finance
- General support: support@wybe.finance
- Developer documentation: https://docs.wybe.finance/developers

## Appendix: Deployment Parameters

| Parameter | Value | Description |
|-----------|-------|-------------|
| Creator Fee | 250 | 2.5% fee for token creators |
| Platform Fee | 250 | 2.5% fee for platform treasury |
| Treasury Address | [Address] | Destination for platform fees |
| Token Decimals | 9 | Standard SPL token decimals |
| Minimum Transaction | 1 | Minimum transaction size |
| Upgrade Authority | [Address] | Authority for program upgrades |

---

By following this guide, you ensure a secure, properly configured mainnet deployment of the Wybe Token Platform.

**IMPORTANT:** Never share private keys, deployment credentials, or security information outside of the authorized deployment team.
