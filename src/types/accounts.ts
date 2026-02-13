/**
 * Account-related types
 */

export interface DPOSState {
    stakedAmount: number;
    delegatedAmount: number;
    delegationTarget: string;
    stakingContracts: string[];
    isValidator?: boolean;
    validatorRewards?: number;
    transactionCount: number;
    totalVolume: number;
}

export interface CriticalRecord {
    id: string;
    type: string;
    content: string;
    hash: string;
    timestamp: string;
    cost: number;
    status: string;
}

import { MonthlyBilling, PaymentRecord, PBFTUsageStats } from './gas';

export interface PBFTState {
    criticalRecords: CriticalRecord[];
    recordCount: number;
    monthlyBilling: MonthlyBilling;
    paymentHistory: PaymentRecord[];
    isBlocked: boolean;
    blockReason: string;
    blockedSince?: string;
    usageStats: PBFTUsageStats;
}

export interface InteropSettings {
    crossChainEnabled: boolean;
    maxTransferAmount: number;
    autoPaymentEnabled: boolean;
    paymentThreshold: number;
    notificationsEnabled: boolean;
    emailNotifications: boolean;
    requireConfirmation: boolean;
    maxDailyRecords: number;
}

export interface ListOptions {
    offset?: number;
    limit?: number;
    filter?: Record<string, any>;
}
