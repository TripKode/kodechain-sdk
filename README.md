# KodeChain Web SDK

[![NPM Version](https://img.shields.io/npm/v/@kodechain/sdk-ts?style=for-the-badge&color=blue)](https://www.npmjs.com/package/@kodechain/sdk-ts)
[![License](https://img.shields.io/npm/l/@kodechain/sdk-ts?style=for-the-badge&color=orange)](https://github.com/kodechain/web-sdk/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Quantum Resistant](https://img.shields.io/badge/Security-Quantum--Resistant-green?style=for-the-badge)](https://csrc.nist.gov/projects/post-quantum-cryptography)

The official **KodeChain Web SDK** for JavaScript and TypeScript. Build high-performance, secure decentralised applications on the KodeChain network with native support for dual-chain consensus and quantum-resistant cryptography.

[Explore Documentation](https://docs.kodechain.site) • [View Examples](./examples) • [Report Issue](https://github.com/kodechain/web-sdk/issues)

---

## ✨ Key Features

- **⚛️ Quantum-Resistant**: Native implementation of **ML-DSA-65** for post-quantum security.
- **⛓️ Dual-Chain Architecture**: Seamless interaction with **DPOS** (Financial) and **PBFT** (Records/Processes) chains.
- **🏦 Smart Accounts**: Hybrid accounts with cross-chain transfer capabilities and billing management.
- **📜 DVM (Dual Virtual Machine)**: Comprehensive tools for deploying and interacting with smart contracts.
- **🛡️ Type-Safety**: Built with TypeScript for a robust developer experience.
- **⛽ Smart Gas**: Automatic gas estimation and PBFT billing cycle management.

---

## 📦 Installation

Install the SDK using your favorite package manager:

```bash
# Using NPM
npm install @kodechain/sdk-ts

# Using Yarn
yarn add @kodechain/sdk-ts

# Using PNPM
pnpm add @kodechain/sdk-ts
```

---

## 🚀 Quick Start

Initialize the client and check node health in seconds:

```typescript
import { KodeChainClient } from '@kodechain/sdk-ts';

// 1. Initialize Client
const client = new KodeChainClient({
  nodeUrl: 'http://34.28.74.25:8084',
  defaultConsensus: 'DPOS',
});

async function run() {
  await client.connect();
  
  // 2. Query Blockchain State
  const health = await client.getHealth();
  const height = await client.getBlockHeight();
  
  console.log(`Connected to KodeChain! Height: ${height} | Status: ${health.status}`);
}

run();
```

---

## 💡 Core Concepts

### Dual-Chain Synergy
KodeChain operates two parallel chains to optimize for different use cases:
*   **DPOS (Delegated Proof of Stake)**: Optimized for fast financial transactions, token transfers (KDC), and staking.
*   **PBFT (Practical Byzantine Fault Tolerance)**: Optimized for critical records, immutable logs, and complex business processes that require immediate finality.

### Quantum Security
Every account in KodeChain is protected by **ML-DSA** (Module-Lattice-Based Digital Signature Algorithm), making your assets and data safe even against future quantum computing threats.

---

## 🛠️ Usage Guide

### 1. Quantum Wallet Management
Create or import wallets with post-quantum security.

```typescript
import { Wallet } from '@kodechain/sdk-ts';

// Create a new ML-DSA-65 wallet
const wallet = Wallet.createRandom(client);
console.log(`Address: ${wallet.address}`);

// Sign a message (Quantum-Resistant)
const signature = await wallet.sign("Secure data package");
```

### 2. Smart Contract Interaction
Deploy contracts or interact with existing ones using the DVM.

```typescript
import { ContractFactory } from '@kodechain/sdk-ts';

const factory = new ContractFactory(client);
const contract = await factory.attach('0xContractAddress...', ABI);

// Call a state-changing function
const tx = await contract.call('transfer', ['0xRecipient...', '1000n'], {
  caller: wallet.address
});

// Query a view function
const balance = await contract.view('balanceOf', [wallet.address]);
```

### 3. Smart Account Operations
Manage hybrid balances and cross-chain transfers.

```typescript
import { SmartAccountManager } from '@kodechain/sdk-ts';

const manager = new SmartAccountManager(client);
const account = await manager.getAccount('0xAddress...');

// Transfer KDC from DPOS to PBFT chain
await account.transferCrossChain('5000n', 'DPOS', 'PBFT');

// Register a critical record on PBFT
await account.registerCriticalRecord({
  type: 'AUDIT_LOG',
  data: { action: 'LOGIN', result: 'SUCCESS' }
});
```

---

## 📂 Examples

Visit the [`/examples`](./examples) directory for complete, runnable scripts:

| Example | Description |
| :--- | :--- |
| [`basic-usage.ts`](./examples/basic-usage.ts) | Connection, node info, and health checks |
| [`crypto-wallet.ts`](./examples/crypto-wallet.ts) | Quantum keys and message signing |
| [`staking-delegation.ts`](./examples/staking-delegation.ts) | Validator management and voting |
| [`smart-account-example.ts`](./examples/smart-account-example.ts) | Advanced hybrid account features |
| [`abicoder-usage.ts`](./examples/abicoder-usage.ts) | Manual data encoding/decoding |

---

## 🤝 Contributing

We welcome contributions to the KodeChain SDK! 

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 🔗 Links & Resources

- **Official Website**: [kodechain.site](https://kodechain.site)
- **Developer Docs**: [docs.kodechain.site](https://docs.kodechain.site)
- **Explorer**: [explorer.kodechain.site](https://explorer.kodechain.site)
- **Discord**: [Join our Community](https://discord.gg/kodechain)

Copyright © 2025 **KodeChain Network**. All rights reserved.
