/**
 * Contract-related types
 */

import { ConsensusType } from './core';

export interface ABIParameter {
    name: string;
    type: string;
    indexed?: boolean; // For events
}

export interface ABIEntry {
    type: 'function' | 'event' | 'constructor';
    name?: string;
    inputs?: ABIParameter[];
    outputs?: ABIParameter[];
    stateMutability?: 'pure' | 'view' | 'nonpayable' | 'payable';
}

export type ABI = ABIEntry[];

export interface DeployOptions {
    bytecode: string;
    abi?: ABI;
    creator: string;
    constructorArgs?: any[];
    name?: string;
    version?: string;
    gasLimit?: number;
    gasPrice?: number;
    value?: number;
    consensus?: ConsensusType;
}

export interface CallOptions {
    caller: string;
    value?: number;
    gasLimit?: number;
    gasPrice?: number;
    consensus?: ConsensusType;
}

export interface ContractMetadata {
    name?: string;
    version?: string;
    creator: string;
    deployedAt: number;
    bytecodeHash: string;
}

export interface ContractState {
    address: string;
    balance: string;
    codeSize: number;
    storage: Record<string, string>;
    metadata: ContractMetadata;
}

export interface ContractInfo {
    address: string;
    creator: string;
    deployedAt: number;
    name?: string;
    version?: string;
    consensus: ConsensusType;
}

export interface ContractEvent {
    eventName: string;
    blockNumber: number;
    transactionHash: string;
    args: any[];
    raw: {
        data: string;
        topics: string[];
    };
}
