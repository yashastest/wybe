
import { ethers } from 'ethers';

/**
 * Interface for a generic token contract wrapper
 */
export interface ITokenContract {
  address: string;
  name(): Promise<string>;
  symbol(): Promise<string>;
  decimals(): Promise<number>;
  totalSupply(): Promise<ethers.BigNumber>;
  balanceOf(address: string): Promise<ethers.BigNumber>;
}

/**
 * Interface for Wybe's bonding curve token contract
 */
export interface IBondingCurveTokenContract extends ITokenContract {
  // Bonding curve specific methods
  getCurrentPrice(): Promise<ethers.BigNumber>;
  getBuyPrice(amount: ethers.BigNumber): Promise<ethers.BigNumber>;
  getSellPrice(amount: ethers.BigNumber): Promise<ethers.BigNumber>;
  buy(signer: ethers.Signer, amount?: ethers.BigNumber): Promise<ethers.ContractTransaction>;
  sell(signer: ethers.Signer, amount: ethers.BigNumber): Promise<ethers.ContractTransaction>;
  // Fee related methods
  getCreatorFee(): Promise<ethers.BigNumber>;
  getPlatformFee(): Promise<ethers.BigNumber>;
  // Creator & fee collection methods
  getCreator(): Promise<string>;
  getCreatorFeeCollected(): Promise<ethers.BigNumber>;
  getPlatformFeeCollected(): Promise<ethers.BigNumber>;
  // Admin methods (only callable by authorized addresses)
  withdrawCreatorFee(signer: ethers.Signer): Promise<ethers.ContractTransaction>;
  withdrawPlatformFee(signer: ethers.Signer): Promise<ethers.ContractTransaction>;
}

/**
 * Interface for a contract factory that deploys new token contracts
 */
export interface ITokenFactoryContract {
  createToken(
    signer: ethers.Signer,
    name: string,
    symbol: string,
    initialSupply: ethers.BigNumber,
    creatorFeePercent: number,
    platformFeePercent: number
  ): Promise<ethers.ContractTransaction>;
  
  getTokensCreated(): Promise<string[]>;
  getTokenAtIndex(index: number): Promise<string>;
  isTokenFromFactory(tokenAddress: string): Promise<boolean>;
}
