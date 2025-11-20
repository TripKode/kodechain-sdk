/**
 * Transaction-related types
 */

import { ConsensusType } from './core';

export interface Transaction {
    hash: string;
    from: string;
    to: string;
    value: string;
    data: string;
    gasLimit: number;
    gasPrice: number;
    consensus: ConsensusType;
    nonce?: number;
    timestamp?: number;
}

export interface Log {
    address: string;
    topics: string[];
    data: string;
    blockNumber: number;
    transactionHash: string;
    logIndex: number;
}

export interface TransactionReceipt {
    transactionHash: string;
    blockNumber: number;
    blockHash: string;
    from: string;
    to: string;
    gasUsed: number;
    cumulativeGasUsed: number;
    success: boolean;
    logs: Log[];
    contractAddress?: string;
    returnData?: string;
    timestamp?: number;
}

export type TransactionStatus = 'pending' | 'confirmed' | 'failed' | 'reverted';

export interface TransactionStatusInfo {
    status: TransactionStatus;
    confirmations: number;
    blockNumber?: number;
    timestamp?: number;
}
