import Web3 from 'web3';

// ABI for ERC20 token standard
const ERC20_ABI = [
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [{ "name": "", "type": "string" }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [{ "name": "", "type": "string" }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{ "name": "", "type": "uint8" }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{ "name": "", "type": "uint256" }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{ "name": "owner", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "name": "", "type": "uint256" }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      { "name": "to", "type": "address" },
      { "name": "value", "type": "uint256" }
    ],
    "name": "transfer",
    "outputs": [{ "name": "", "type": "bool" }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export class TokenService {
  private web3: Web3;
  private tokenContract: any;
  private contractAddress: string;

  constructor(contractAddress: string, providerUrl = 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY') {
    this.contractAddress = contractAddress;
    // Using Infura as provider, replace with your own provider if needed
    this.web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));
    this.tokenContract = new this.web3.eth.Contract(ERC20_ABI as any, contractAddress);
  }

  /**
   * Get token information (name, symbol, total supply)
   */
  async getTokenInfo() {
    try {
      const [name, symbol, decimals, totalSupply] = await Promise.all([
        this.tokenContract.methods.name().call(),
        this.tokenContract.methods.symbol().call(),
        this.tokenContract.methods.decimals().call(),
        this.tokenContract.methods.totalSupply().call()
      ]);

      // Convert total supply to readable format
      const formattedTotalSupply = totalSupply / Math.pow(10, parseInt(decimals));

      return {
        name,
        symbol,
        decimals: parseInt(decimals),
        totalSupply: formattedTotalSupply,
        contractAddress: this.contractAddress
      };
    } catch (error) {
      console.error('Error fetching token info:', error);
      throw error;
    }
  }

  /**
   * Get token balance for a specific address
   */
  async getBalance(address: string) {
    try {
      const [balance, decimals] = await Promise.all([
        this.tokenContract.methods.balanceOf(address).call(),
        this.tokenContract.methods.decimals().call()
      ]);

      // Convert balance to readable format
      return balance / Math.pow(10, parseInt(decimals));
    } catch (error) {
      console.error('Error fetching balance:', error);
      throw error;
    }
  }

  /**
   * Transfer tokens to another address
   * Requires the user to have a connected wallet (MetaMask or similar)
   */
  async transferTokens(to: string, amount: number, from: string) {
    try {
      const decimals = await this.tokenContract.methods.decimals().call();
      const amountInWei = amount * Math.pow(10, parseInt(decimals));

      // This will prompt the user to sign the transaction in their wallet
      return await this.tokenContract.methods.transfer(to, amountInWei).send({
        from: from
      });
    } catch (error) {
      console.error('Error transferring tokens:', error);
      throw error;
    }
  }

  /**
   * Deploy a new ERC20 token contract for a company
   * Note: This is a simplified version and should be expanded for production use
   */
  async deployNewToken(
    name: string,
    symbol: string,
    totalSupply: number,
    ownerAddress: string
  ) {
    // In a real implementation, this would deploy a new contract
    // For now, return mock data
    return {
      contractAddress: '0x' + Math.random().toString(16).substring(2, 42),
      name,
      symbol,
      totalSupply,
      owner: ownerAddress
    };
  }
}

// Export singleton instance for the app
let tokenServiceInstance: TokenService | null = null;

export const getTokenService = (contractAddress: string) => {
  if (!tokenServiceInstance || tokenServiceInstance.contractAddress !== contractAddress) {
    tokenServiceInstance = new TokenService(contractAddress);
  }
  return tokenServiceInstance;
};
