# KodeChain SDK - Guía para Agentes IA

## Descripción General

**Paquete:** `@kodechain/web-sdk`  
**Versión:** 1.0.0  
**Repository:** https://github.com/kodechain/web-sdk.git  
**Node.js:** >=16.0.0

SDK oficial de JavaScript/TypeScript para la blockchain KodeChain. Soporta dual-chain (DPOS para transacciones financieras, PBFT para procesos críticos), contratos inteligentes y cuentas inteligentes.

---

## Instalación

```bash
npm install @kodechain/web-sdk
```

---

## Arquitectura del SDK

### Exports Principales

| Módulo         | Archivo             | Descripción                                         |
| -------------- | ------------------- | --------------------------------------------------- |
| `core`         | `src/core/`         | Cliente principal, Provider, Signer                 |
| `accounts`     | `src/accounts/`     | Wallet, SmartAccount, SmartAccountManager           |
| `contracts`    | `src/contracts/`    | Contract, ContractFactory, SystemContracts          |
| `transactions` | `src/transactions/` | TransactionBuilder, Transaction, TransactionReceipt |
| `consensus`    | `src/consensus/`    | ValidatorManager, DelegationManager, DPOS, PBFT     |
| `gas`          | `src/gas/`          | GasManager                                          |
| `errors`       | `src/errors/`       | Errores específicos del SDK                         |
| `utils`        | `src/utils/`        | Utilidades, validadores, formateadores              |
| `types`        | `src/types/`        | Definiciones de tipos TypeScript                    |

---

## Uso Básico

### Inicialización del Cliente

```typescript
import { KodeChainClient } from '@kodechain/web-sdk';

const client = new KodeChainClient({
  nodeUrl: 'http://34.28.74.25:8084',
  defaultConsensus: 'DPOS', // 'DPOS' | 'PBFT'
  timeout: 30000,
  retries: 3,
  headers: { 'Custom-Header': 'value' },
});

await client.connect();
const health = await client.getHealth();
```

### Métodos del Cliente

| Método                        | Parámetros                 | Retorno                 | Descripción          |
| ----------------------------- | -------------------------- | ----------------------- | -------------------- |
| `connect()`                   | -                          | `Promise<void>`         | Conecta al nodo      |
| `disconnect()`                | -                          | `void`                  | Desconecta del nodo  |
| `isConnected()`               | -                          | `boolean`               | Verifica conexión    |
| `getNodeInfo()`               | -                          | `Promise<NodeInfo>`     | Info del nodo        |
| `getHealth()`                 | -                          | `Promise<HealthStatus>` | Estado de salud      |
| `getBlockHeight(chain?)`      | `chain?: 'DPOS' \| 'PBFT'` | `Promise<number>`       | Altura del bloque    |
| `getBlock(height, chain?)`    | `number, chain?`           | `Promise<Block>`        | Obtiene bloque       |
| `getLatestBlock(chain?)`      | `chain?`                   | `Promise<Block>`        | Último bloque        |
| `getBalance(address, chain?)` | `string, chain?`           | `Promise<string>`       | Balance de dirección |
| `getProvider()`               | -                          | `Provider`              | Obtiene Provider     |
| `getSigner()`                 | -                          | `Signer`                | Obtiene Signer       |
| `getGasManager()`             | -                          | `GasManager`            | Obtiene GasManager   |

---

## Contratos Inteligentes

### Desplegar Contrato

```typescript
import { ContractFactory } from '@kodechain/web-sdk';

const factory = new ContractFactory(client);

const contract = await factory.deploy({
  bytecode: '0x608060405234801561001057600080fd5b50...',
  abi: [
    {
      inputs: [
        { name: 'to', type: 'address' },
        { name: 'amount', type: 'uint256' },
      ],
      name: 'transfer',
      type: 'function',
      outputs: [],
      stateMutability: 'nonpayable',
    },
    {
      inputs: [{ name: 'owner', type: 'address' }],
      name: 'balanceOf',
      type: 'function',
      outputs: [{ name: '', type: 'uint256' }],
      stateMutability: 'view',
    },
  ],
  creator: '0x1234567890123456789012345678901234567890',
  name: 'MyToken',
  constructorArgs: [],
  gasLimit: 8000000,
  gasPrice: undefined,
  value: 0,
  consensus: 'DPOS',
});

console.log('Contract address:', contract.address);
```

### Adjuntar a Contrato Existente

```typescript
const contract = await factory.attach(
  '0xCONTRACT_ADDRESS',
  abi // ABI opcional si ya está registrado
);
```

### Llamar Funciones del Contrato

```typescript
// Modificar estado (transacción)
const receipt = await contract.call(
  'transfer',
  [
    '0x9876543210987654321098765432109876543210',
    '1000000000000000000', // 1 token (wei)
  ],
  {
    caller: '0x1234567890123456789012345678901234567890',
    gasLimit: 100000,
    gasPrice: undefined,
    value: 0,
    consensus: undefined,
  }
);

// Leer función view (solo lectura)
const balance = await contract.view('balanceOf', ['0x9876543210987654321098765432109876543210']);

// Suscribir a eventos
contract.on('Transfer', (event) => {
  console.log('From:', event.args.from);
  console.log('To:', event.args.to);
  console.log('Amount:', event.args.amount);
  console.log('Block:', event.blockNumber);
});

// Dejar de escuchar eventos
contract.off('Transfer');
```

### Métodos de Contract

| Método                          | Parámetros                   | Retorno                       | Descripción                  |
| ------------------------------- | ---------------------------- | ----------------------------- | ---------------------------- |
| `call(name, params?, options?)` | `string, any[], CallOptions` | `Promise<TransactionReceipt>` | Ejecuta función modificadora |
| `view(name, params?)`           | `string, any[]`              | `Promise<any>`                | Lee función view             |
| `getState()`                    | -                            | `Promise<ContractState>`      | Obtiene estado               |
| `getInfo()`                     | -                            | `Promise<ContractInfo>`       | Obtiene info del contrato    |
| `on(event, callback)`           | `string, function`           | `void`                        | Suscribe a evento            |
| `off(event, callback?)`         | `string, function?`          | `void`                        | Desuscribe                   |

---

## Cuentas Inteligentes

### Crear Cuenta Inteligente

```typescript
import { SmartAccountManager } from '@kodechain/web-sdk';

const accountManager = new SmartAccountManager(client);

// Crear nueva
const account = await accountManager.create('0xOWNER_ADDRESS');

// Obtener existente
const existing = await accountManager.get('0xACCOUNT_ADDRESS');

// Listar cuentas
const accounts = await accountManager.list({
  offset: 0,
  limit: 50,
  filter: undefined,
});

// Verificar si es cuenta inteligente
const isSmart = await accountManager.isSmartAccount('0xADDRESS');
```

### Operaciones DPOS

```typescript
const account = await accountManager.get('0xACCOUNT_ADDRESS');

// Obtener estado DPOS
const dposState = await account.getDPOSState();

// Delegar a validador
const delegateReceipt = await account.delegate(
  '0xVALIDATOR_ADDRESS',
  '10000000000000000000' // 10 KDC
);

// Retirar delegación
const undelegateReceipt = await account.undelegate('5000000000000000000');
```

### Operaciones PBFT

```typescript
// Obtener estado PBFT
const pbftState = await account.getPBFTState();

// Registrar registro crítico
const criticalReceipt = await account.registerCriticalRecord({
  type: 'MEDICAL_RECORD',
  data: {
    patientId: 'P123',
    diagnosis: 'Encrypted...',
    timestamp: Date.now(),
  },
});

// Obtener facturación mensual
const billing = await account.getMonthlyBilling();
```

### Transferencias Cross-Chain

```typescript
// Transferir entre cadenas
const crossChainReceipt = await account.transferCrossChain(
  '5000000000000000000', // amount
  'DPOS', // fromChain
  'PBFT' // toChain
);

// Obtener balances
const dposBalance = await account.getBalance('DPOS');
const pbftBalance = await account.getBalance('PBFT');
const totalBalance = await account.getTotalBalance();
```

### Métodos de SmartAccount

| Método                                 | Parámetros               | Retorno                       | Descripción   |
| -------------------------------------- | ------------------------ | ----------------------------- | ------------- |
| `getDPOSState()`                       | -                        | `Promise<DPOSState>`          | Estado DPOS   |
| `delegate(addr, amount)`               | `string, string`         | `Promise<TransactionReceipt>` | Delega        |
| `undelegate(amount)`                   | `string`                 | `Promise<TransactionReceipt>` | Retira        |
| `getPBFTState()`                       | -                        | `Promise<PBFTState>`          | Estado PBFT   |
| `registerCriticalRecord(data)`         | `any`                    | `Promise<TransactionReceipt>` | Registra      |
| `getMonthlyBilling()`                  | -                        | `Promise<BillingInfo>`        | Facturación   |
| `transferCrossChain(amount, from, to)` | `string, string, string` | `Promise<TransactionReceipt>` | Cross-chain   |
| `getBalance(chain?)`                   | `chain?`                 | `Promise<string>`             | Balance       |
| `getTotalBalance()`                    | -                        | `Promise<string>`             | Balance total |

---

## Transacciones

### Construir Transacción

```typescript
import { TransactionBuilder } from '@kodechain/web-sdk';

const txBuilder = new TransactionBuilder(client);

// Transacción simple
const receipt = await txBuilder
  .from('0xSENDER_ADDRESS')
  .to('0xRECIPIENT_ADDRESS')
  .value('1000000000000000000') // 1 KDC
  .consensus('DPOS')
  .gasLimit(21000)
  .send();

console.log('TX Hash:', receipt.transactionHash);
```

---

## Consenso y Validación

### Gestionar Validadores

```typescript
import { ValidatorManager, DelegationManager } from '@kodechain/web-sdk';

const validators = new ValidatorManager(client);
const delegations = new DelegationManager(client);

// Listar validadores
const allValidators = await validators.list();

// Obtener detalles de validador
const validator = await validators.get('0xVALIDATOR_ADDRESS');

// Delegación pasiva
await delegations.delegatePassive(
  '0xVALIDATOR_ADDRESS',
  '5000000000000000000', // amount
  '0xDELEGATOR_ADDRESS' // optional, usa signer por defecto
);

// Obtener estadísticas
const stats = await delegations.getStats();
```

---

## Gestión de Gas

```typescript
// Estimar gas para transacción
const gasEstimate = await client.gas.estimate({
  from: '0xFROM',
  to: '0xTO',
  value: '1000000000000000000',
  data: '0x...',
});

// Estimar gas para despliegue
const deployGas = await client.gas.estimateDeploy({
  bytecode: '0x...',
  constructorArgs: [],
});

// Obtener precio actual de gas
const gasPrice = await client.gas.getGasPrice();

// Calcular costo total
const totalCost = await client.gas.calculateCost(gasEstimate);
```

---

## Errores

### Tipos de Errores

| Error                    | Clase                            | Descripción                |
| ------------------------ | -------------------------------- | -------------------------- |
| `InsufficientFundsError` | `src/errors/TransactionError.ts` | Fondos insuficientes       |
| `GasEstimationError`     | `src/errors/GasError.ts`         | Error en estimación de gas |
| `ContractError`          | `src/errors/ContractError.ts`    | Error en contrato          |
| `NetworkError`           | `src/errors/NetworkError.ts`     | Error de red               |
| `ValidationError`        | `src/errors/ValidationError.ts`  | Error de validación        |

### Manejo de Errores

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
    console.error('Fondos insuficientes');
  } else if (error instanceof GasEstimationError) {
    console.error('Error en estimación de gas');
  } else if (error instanceof ContractError) {
    console.error('Error de contrato:', error.message);
  } else if (error instanceof NetworkError) {
    console.error('Error de red:', error.message);
  }
}
```

---

## Utilidades

### Validadores

```typescript
import { validateAddress, validateBytecode, validateRequired } from '@kodechain/web-sdk';

// Validar dirección
validateAddress('0x1234567890123456789012345678901234567890');

// Validar bytecode
validateBytecode('0x608060405234801561001057600080fd5b50...');

// Validar requerido
validateRequired(value, 'fieldName');
```

### Constantes

```typescript
import { CONSTANTS, DEFAULT_CONSENSUS, DEFAULT_GAS_LIMIT } from '@kodechain/web-sdk';

console.log('Timeout:', CONSTANTS.DEFAULT_TIMEOUT); // 30000
console.log('Retries:', CONSTANTS.DEFAULT_RETRIES); // 3
console.log('Default consensus:', DEFAULT_CONSENSUS); // 'DPOS'
```

---

## API Reference Completa

### KodeChainClient

```typescript
class KodeChainClient {
  constructor(config: ClientConfig);
  connect(): Promise<void>;
  disconnect(): void;
  isConnected(): boolean;
  getNodeInfo(): Promise<NodeInfo>;
  getHealth(): Promise<HealthStatus>;
  getBlockHeight(chain?: ConsensusType): Promise<number>;
  getBlock(height: number, chain?: ConsensusType): Promise<Block>;
  getLatestBlock(chain?: ConsensusType): Promise<Block>;
  getBalance(address: string, chain?: ConsensusType): Promise<string>;
  getProvider(): Provider;
  getSigner(): Signer;
  getGasManager(): GasManager;
  getConfig(): ClientConfig;
}
```

### ContractFactory

```typescript
class ContractFactory {
  constructor(client: KodeChainClient);
  deploy(options: DeployOptions): Promise<Contract>;
  attach(address: string, abi?: ABI): Promise<Contract>;
  estimateDeployGas(options: DeployOptions): Promise<number>;
}
```

### Contract

```typescript
class Contract {
  address: string;
  constructor(address: string, client: KodeChainClient, abi?: ABI);
  call(functionName: string, params?: any[], options?: CallOptions): Promise<TransactionReceipt>;
  view(functionName: string, params?: any[]): Promise<any>;
  getState(): Promise<ContractState>;
  getInfo(): Promise<ContractInfo>;
  on(eventName: string, callback: (event: ContractEvent) => void): void;
  off(eventName: string, callback?: (event: ContractEvent) => void): void;
}
```

### SmartAccountManager

```typescript
class SmartAccountManager {
  constructor(client: KodeChainClient);
  create(address: string): Promise<SmartAccount>;
  get(address: string): Promise<SmartAccount>;
  list(options?: ListOptions): Promise<SmartAccount[]>;
  isSmartAccount(address: string): Promise<boolean>;
}
```

### SmartAccount

```typescript
class SmartAccount {
  address: string;
  constructor(address: string, client: KodeChainClient);
  getDPOSState(): Promise<DPOSState>;
  delegate(validatorAddress: string, amount: string): Promise<TransactionReceipt>;
  undelegate(amount: string): Promise<TransactionReceipt>;
  getPBFTState(): Promise<PBFTState>;
  registerCriticalRecord(data: any): Promise<TransactionReceipt>;
  getMonthlyBilling(): Promise<BillingInfo>;
  transferCrossChain(
    amount: string,
    fromChain: 'DPOS' | 'PBFT',
    toChain: 'DPOS' | 'PBFT'
  ): Promise<TransactionReceipt>;
  getBalance(chain?: 'DPOS' | 'PBFT'): Promise<string>;
  getTotalBalance(): Promise<string>;
}
```

### TransactionBuilder

```typescript
class TransactionBuilder {
  constructor(client: KodeChainClient);
  from(address: string): TransactionBuilder;
  to(address: string): TransactionBuilder;
  value(value: string): TransactionBuilder;
  data(data: string): TransactionBuilder;
  gasLimit(limit: number): TransactionBuilder;
  gasPrice(price: string): TransactionBuilder;
  consensus(consensus: 'DPOS' | 'PBFT'): TransactionBuilder;
  send(): Promise<TransactionReceipt>;
}
```

---

## URLs de API del Nodo

| Endpoint                                  | Método   | Descripción          |
| ----------------------------------------- | -------- | -------------------- |
| `/api/node/info`                          | GET      | Info del nodo        |
| `/api/health`                             | GET      | Estado de salud      |
| `/api/blockchain/{chain}/height`          | GET      | Altura del bloque    |
| `/api/blockchain/{chain}/blocks/{height}` | GET      | Bloque específico    |
| `/api/blockchain/{chain}/blocks/latest`   | GET      | Último bloque        |
| `/api/accounts/{address}/balance`         | GET      | Balance              |
| `/api/contracts/deploy`                   | POST     | Desplegar contrato   |
| `/api/contracts/{address}/info`           | GET      | Info de contrato     |
| `/api/contracts/estimate-deploy-gas`      | POST     | Estimar gas          |
| `/api/smart-accounts`                     | GET/POST | Cuentas inteligentes |

---

## Desarrollo

```bash
# Instalar dependencias
npm install

# Construir
npm run build

# Tests
npm test

# Coverage
npm run test:coverage

# Lint
npm run lint

# Lint fix
npm run lint:fix

# Formato
npm run format

# Type check
npm run type-check
```

---

## Notas para Agentes IA

1. **Tipo de consenso:** Verificar siempre el tipo de consenso ('DPOS' o 'PBFT') antes de operaciones. DPOS para transacciones financieras, PBFT para procesos críticos.

2. **Direcciones:** Usar formato Ethereum (0x seguido de 40 hex chars). Validar con `validateAddress()` antes de usar.

3. **Valores:** Todos los valores monetarios están en wei (10^18 KDC = 1 KDC). Usar BigNumber para cálculos grandes.

4. **Bytes:** Bytecode y datos deben tener prefijo '0x'.

5. **Errores:** Siempre usar try/catch con tipos de error específicos para mejor manejo.

6. **Conexión:** Verificar `isConnected()` antes de operaciones, o usar `connect()` primero.

7. **Gas:** Usar `estimateGas()` antes de transacciones grandes para evitar fallos por gas insuficiente.

8. **Eventos:** Los contratos emitirán eventos. Usar `on()` para suscribirse y `off()` para cancelar.

9. **Cross-chain:** Transferencias entre DPOS y PBFT requieren configuración adicional.

10. **Async/await:** Todas las operaciones son asíncronas. Usar await o promises.

---

## Recursos

- **Documentación:** https://docs.kodechain.site
- **GitHub:** https://github.com/kodechain/web-sdk
- **NPM:** https://www.npmjs.com/package/@kodechain/web-sdk
- **Issues:** https://github.com/kodechain/web-sdk/issues
- **Email:** help@kodechain.site
