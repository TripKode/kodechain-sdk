/**
 * System constants for KodeChain SDK
 */

import { ConsensusType } from '../types';

export const CONSTANTS = {
    // Gas
    DEFAULT_GAS_LIMIT: 8000000,
    DEFAULT_GAS_PRICE: 20000000000, // 20 gwei
    MIN_GAS_LIMIT: 21000,
    MAX_GAS_LIMIT: 10000000,

    // Values
    WEI_PER_KDC: '1000000000000000000',

    // Addresses
    ZERO_ADDRESS: '0x0000000000000000000000000000000000000000',
    STAKING_CONTRACT: '0x0000000000000000000000000000000000000001',
    VALIDATOR_CONTRACT: '0x0000000000000000000000000000000000000002',
    REWARDS_CONTRACT: '0x0000000000000000000000000000000000000003',

    // Timeouts
    DEFAULT_TIMEOUT: 30000,
    TRANSACTION_TIMEOUT: 120000,

    // Confirmations
    DEFAULT_CONFIRMATIONS: 3,
    SAFE_CONFIRMATIONS: 6,

    // Retry
    DEFAULT_RETRIES: 3,
    RETRY_DELAY: 1000,
} as const;

export const GAS_COSTS = {
    // Base transactions
    TX_BASE: 21000,
    TX_CREATE: 32000,
    TX_DATA_ZERO: 4,
    TX_DATA_NONZERO: 16,

    // Contracts
    CALL: 700,
    CALL_VALUE: 9000,

    // Storage
    SLOAD: 800,
    SSTORE_SET: 20000,
    SSTORE_RESET: 5000,

    // Operations
    ADD: 3,
    MUL: 5,
    DIV: 5,
    EXP: 10,

    // Cryptography
    SHA3: 30,
    SHA3_WORD: 6,
    ECRECOVER: 3000,
} as const;

export const DEFAULT_CONSENSUS: ConsensusType = 'DPOS';
