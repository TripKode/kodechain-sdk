/**
 * Account-related types
 */

export interface DPOSState {
    stakedAmount: string;
    delegatedAmount: string;
    delegationTarget: string;
    isValidator: boolean;
    transactionCount: number;
    totalVolume: number;
}

export interface CriticalRecord {
    id: string;
    type: string;
    data: any;
    timestamp: number;
    cost: number;
}

export interface BillingInfo {
    usageCount: number;
    totalCost: number;
    paidAmount: number;
    outstandingDebt: number;
    billingPeriod: {
        start: number;
        end: number;
    };
}

export interface PBFTState {
    criticalRecords: CriticalRecord[];
    recordCount: number;
    monthlyBilling: BillingInfo;
    isBlocked: boolean;
}

export interface InteropSettings {
    crossChainEnabled: boolean;
    maxTransferAmount: number;
    autoPaymentEnabled: boolean;
    paymentThreshold: number;
    maxDailyRecords: number;
}

export interface ListOptions {
    offset?: number;
    limit?: number;
    filter?: Record<string, any>;
}
