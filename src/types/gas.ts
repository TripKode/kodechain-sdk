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

export interface MonthlyBilling {
    currentMonth: string;
    usageCount: number;
    totalCost: number;
    paidAmount: number;
    outstandingDebt: number;
    lastPaymentDate?: string;
    gracePeriodEnd?: string;
}

export interface PaymentRecord {
    id: string;
    amount: number;
    month: string;
    paymentDate: string;
    transactionHash: string;
    status: string;
}

export interface PBFTUsageStats {
    totalRecords: number;
    recordsThisMonth: number;
    totalCost: number;
    averageCost: number;
    lastRecordDate?: string;
}

export interface BillingRecord {
    period: string;
    usageCount: number;
    totalCost: string; // Using string for big.Int
    paidAmount: string;
    paymentDate: number;
    status: string;
}

export interface BillingInfo extends MonthlyBilling {
    paymentHistory: PaymentRecord[];
    usageStats: PBFTUsageStats;
}

export interface PaymentReceipt {
    success: boolean;
    amountPaid: number;
    remainingDebt: number;
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
