# KodeChain Web SDK

Official JavaScript/TypeScript SDK for KodeChain blockchain. Build decentralized applications with dual-chain support (DPOS and PBFT), smart contracts, and smart accounts.

## Features

- **Dual-Chain Support**: Native support for DPOS (financial transactions) and PBFT (critical processes)
- **Smart Contracts**: Deploy and interact with smart contracts
- **Smart Accounts**: Manage hybrid accounts with cross-chain capabilities
- **Type-Safe**: Full TypeScript support with comprehensive type definitions
- **Promise-Based**: Modern async/await API
- **Event Listeners**: Subscribe to contract events
- **Error Handling**: Robust error handling with specific error classes
- **Gas Management**: Automatic gas estimation  

## Installation

```bash
# NPM
npm install @kodechain/web-sdk

# Yarn
yarn add @kodechain/web-sdk

# PNPM
pnpm add @kodechain/web-sdk
```

## Quick Start

```typescript
import { KodeChainClient } from '@kodechain/web-sdk';

// Create client
const client = new KodeChainClient({
  nodeUrl: 'http://34.28.74.25:8084',
  defaultConsensus: 'DPOS',
});

// Connect to node
await client.connect();

// Check node health
const health = await client.getHealth();
console.log('Node status:', health.status);

// Get block height
const height = await client.getBlockHeight('DPOS');
console.log('DPOS height:', height);
```

## Usage Examples

### Deploy a Smart Contract

```typescript
import { ContractFactory } from '@kodechain/web-sdk';

const factory = new ContractFactory(client);

const contract = await factory.deploy({
  bytecode: '0x608060405234801561001057600080fd5b50...',
  abi: [...],
  creator: '0x1234567890123456789012345678901234567890',
  name: 'MyToken',
  gasLimit: 8000000,
});

console.log('Contract deployed at:', contract.address);
```

### Call Contract Functions

```typescript
// Call function (modifies state)
const receipt = await contract.call('transfer', [
  '0x9876543210987654321098765432109876543210',
  '1000000000000000000', // 1 token
], {
  caller: '0x1234567890123456789012345678901234567890',
  gasLimit: 100000,
});

// Read view function (read-only)
const balance = await contract.view('balanceOf', [
  '0x9876543210987654321098765432109876543210',
]);

console.log('Balance:', balance);
```

### Manage Smart Accounts

```typescript
import { SmartAccountManager } from '@kodechain/web-sdk';

const accountManager = new SmartAccountManager(client);

// Create Smart Account
const account = await accountManager.create('0xABCD...');

// Delegate to validator (DPOS)
await account.delegate('0xVALIDATOR...', '10000000000000000000');

// Register critical record (PBFT)
await account.registerCriticalRecord({
  type: 'MEDICAL_RECORD',
  data: { patientId: 'P123', diagnosis: 'Encrypted...' },
});

// Cross-chain transfer
await account.transferCrossChain('5000000000000000000', 'DPOS', 'PBFT');
```

### Build Transactions

```typescript
import { TransactionBuilder } from '@kodechain/web-sdk';

const txBuilder = new TransactionBuilder(client);

const receipt = await txBuilder
  .from('0xSENDER...')
  .to('0xRECIPIENT...')
  .value('1000000000000000000') // 1 KDC
  .consensus('DPOS')
  .gasLimit(21000)
  .send();

console.log('Transaction hash:', receipt.transactionHash);
```

### Subscribe to Events

```typescript
contract.on('Transfer', (event) => {
  console.log('Transfer event:', {
    from: event.args.from,
    to: event.args.to,
    amount: event.args.amount,
    blockNumber: event.blockNumber,
  });
});
```

### Manage Validators and Delegations

```typescript
import { ValidatorManager, DelegationManager } from '@kodechain/web-sdk';

const validators = new ValidatorManager(client);
const delegations = new DelegationManager(client);

// List all validators
const allValidators = await validators.list();

// Delegate passively
await delegations.delegatePassive(
  '0xVALIDATOR...',
  '5000000000000000000',
  '0xDELEGATOR...'
);

// Get delegation stats
const stats = await delegations.getStats();
console.log('Total delegations:', stats.totalDelegations);
```

## Error Handling

```typescript
import {
  InsufficientFundsError,
  GasEstimationError,
  ContractError,
  NetworkError,
} from '@kodechain/web-sdk';

try {
  const tx = await contract.call('transfer', [recipient, amount], {
    caller: myAddress,
  });
} catch (error) {
  if (error instanceof InsufficientFundsError) {
    console.error('Insufficient funds');
  } else if (error instanceof GasEstimationError) {
    console.error('Gas estimation failed');
  } else if (error instanceof ContractError) {
    console.error('Contract error:', error.message);
  } else if (error instanceof NetworkError) {
    console.error('Network error:', error.message);
  }
}
```

## API Reference

### KodeChainClient

Main client for interacting with KodeChain.

```typescript
class KodeChainClient {
  constructor(config: ClientConfig);
  
  // Connection
  connect(): Promise<void>;
  disconnect(): void;
  isConnected(): boolean;
  
  // Node info
  getNodeInfo(): Promise<NodeInfo>;
  getHealth(): Promise<HealthStatus>;
  
  // Blockchain
  getBlockHeight(chain?: 'DPOS' | 'PBFT'): Promise<number>;
  getBlock(height: number, chain?: 'DPOS' | 'PBFT'): Promise<Block>;
  getLatestBlock(chain?: 'DPOS' | 'PBFT'): Promise<Block>;
  
  // Balances
  getBalance(address: string, chain?: 'DPOS' | 'PBFT'): Promise<string>;
}
```

### ContractFactory

Deploy and attach to contracts.

```typescript
class ContractFactory {
  deploy(options: DeployOptions): Promise<Contract>;
  attach(address: string, abi?: ABI): Promise<Contract>;
  estimateDeployGas(options: DeployOptions): Promise<number>;
}
```

### Contract

Interact with deployed contracts.

```typescript
class Contract {
  call(functionName: string, params?: any[], options?: CallOptions): Promise<TransactionReceipt>;
  view(functionName: string, params?: any[]): Promise<any>;
  getState(): Promise<ContractState>;
  getInfo(): Promise<ContractInfo>;
  on(eventName: string, callback: (event: ContractEvent) => void): void;
  off(eventName: string, callback?: (event: ContractEvent) => void): void;
}
```

### SmartAccount

Manage smart accounts with DPOS and PBFT operations.

```typescript
class SmartAccount {
  // DPOS
  getDPOSState(): Promise<DPOSState>;
  delegate(validatorAddress: string, amount: string): Promise<TransactionReceipt>;
  undelegate(amount: string): Promise<TransactionReceipt>;
  
  // PBFT
  getPBFTState(): Promise<PBFTState>;
  registerCriticalRecord(data: any): Promise<TransactionReceipt>;
  getMonthlyBilling(): Promise<BillingInfo>;
  
  // Cross-chain
  transferCrossChain(amount: string, fromChain: 'DPOS' | 'PBFT', toChain: 'DPOS' | 'PBFT'): Promise<TransactionReceipt>;
  
  // Balances
  getBalance(chain?: 'DPOS' | 'PBFT'): Promise<string>;
  getTotalBalance(): Promise<string>;
}
```

## TypeScript Support

The SDK is written in TypeScript and includes comprehensive type definitions.

```typescript
import type {
  ClientConfig,
  NodeInfo,
  Block,
  TransactionReceipt,
  ABI,
  DPOSState,
  PBFTState,
} from '@kodechain/web-sdk';
```

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Node.js Compatibility

- Node.js 16.x or higher

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Lint
npm run lint

# Format
npm run format
```

## License

MIT License - Copyright (c) 2025 KodeChain

## Links

- [Documentation](https://docs.kodechain.site)
- [GitHub](https://github.com/kodechain/web-sdk)
- [NPM](https://www.npmjs.com/package/@kodechain/web-sdk)

## Support

For issues and questions:
- GitHub Issues: https://github.com/kodechain/web-sdk/issues
- Email: help@kodechain.site
