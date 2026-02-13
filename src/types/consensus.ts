/**
 * Consensus-related types
 */

import { ConsensusType } from './core';

export interface Validator {
    address: string;
    name: string;
    consensusType: ConsensusType;
    isActive: boolean;
    stakedAmount: string;
    delegationCount: number;
    totalDelegated: string;
    commission: number;
    uptime: number;
    blocksProduced: number;
    lastActiveBlock: number;
}

export interface Delegation {
    delegator: string;
    validator: string;
    amount: string;
    type: 'active' | 'passive';
    createdAt: number;
    rewards: string;
}

export interface DelegationStats {
    totalDelegations: number;
    activeDelegations: number;
    passiveDelegations: number;
    totalDelegatedStake: string;
    averageStake: string;
    topValidators: Validator[];
}

export interface RegisterValidatorOptions {
    address: string;
    name: string;
    consensusType: ConsensusType;
    stakeAmount: string;
    commission?: number;
    description?: string;
    httpUrl?: string;
    nodeId?: string;
}
