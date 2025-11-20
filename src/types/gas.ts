/**
 * Gas Payment and Billing Types
 */

export interface GasConfig {
    enabled: boolean;
    defaultGasPrice: string;
    minGasPrice: string;
    maxGasPrice: string;
    dposSettings: {
        chargeImmediately: boolean;
        refundUnusedGas: boolean;
        validatorShare: number;
    };
    pbftSettings: {
        useBilling: boolean;
        billingCycle: string;
        maxDebtLimit: string;
        blockingThreshold: string;
        gracePeriod: number;
    };
}

export interface GasEstimation {
    estimatedGas: number;
    safeGasLimit: number; // With 20% buffer
    gasPrice: string;
    estimatedCost: string;
    breakdown: {
        baseCost: number;
        dataCost: number;
        executionCost: number;
    };
}

export interface BillingInfo {
    address: string;
    current: {
        period: string; // "2025-01"
        usageCount: number;
        totalCost: string;
        paidAmount: string;
        outstandingDebt: string;
    };
    status: {
        isBlocked: boolean;
        blockedAt?: number;
        blockReason?: string;
    };
    limits: {
        maxDebtLimit: string;
        blockingThreshold: string;
    };
    history: BillingRecord[];
}

export interface BillingRecord {
    period: string;
    totalCost: string;
    paidAmount: string;
    status: 'PAID' | 'PARTIAL' | 'UNPAID';
    paymentTxHash?: string;
    timestamp: number;
}

export interface PaymentReceipt {
    success: boolean;
    amountPaid: string;
    remainingDebt: string;
    newDPOSBalance: string;
    isBlocked: boolean;
    transactionHash: string;
}

export interface GasStats {
    address: string;
    dpos: {
        totalGasPaid: string;
        transactionCount: number;
        averageGasUsed: number;
        lastGasPrice: string;
    };
    pbft: {
        totalBilled: string;
        totalPaid: string;
        periodsCount: number;
    };
}

export interface GlobalGasMetrics {
    totalGasConsumed: string;
    averageGasPrice: string;
    totalFeesCollected: string;
    dailyStats: {
        date: string;
        gasUsed: string;
        fees: string;
    }[];
}
