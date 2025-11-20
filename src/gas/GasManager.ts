/**
 * Gas Manager for handling gas payments and billing
 */

import { KodeChainClient } from '../core';
import type { Transaction } from '../transactions/Transaction';
import {
    GasConfig,
    GasEstimation,
    BillingInfo,
    PaymentReceipt,
    BillingRecord,
    GasStats,
    GlobalGasMetrics,
} from '../types';
import { GasEstimationError } from '../errors';
import { validateAddress, validateAmount } from '../utils';

export class GasManager {
    private client: KodeChainClient;

    constructor(client: KodeChainClient) {
        this.client = client;
    }

    /**
     * Get current gas configuration
     */
    async getConfig(): Promise<GasConfig> {
        return this.client.getProvider().get<GasConfig>('/api/gas/config');
    }

    /**
     * Update gas configuration (Admin only)
     */
    async updateConfig(config: GasConfig): Promise<void> {
        await this.client.getProvider().post('/api/gas/config', config);
    }

    /**
     * Estimate gas for a transaction
     */
    async estimateGas(tx: Partial<Transaction>): Promise<GasEstimation> {
        try {
            const response = await this.client
                .getProvider()
                .post<GasEstimation>('/api/gas/estimate', tx);
            return response;
        } catch (error) {
            throw new GasEstimationError(
                error instanceof Error ? error.message : 'Gas estimation failed',
                { originalError: error }
            );
        }
    }

    /**
     * Get billing information for an address (PBFT)
     */
    async getBilling(address: string): Promise<BillingInfo> {
        validateAddress(address);
        return this.client.getProvider().get<BillingInfo>(`/api/gas/billing/${address}`);
    }

    /**
     * Pay outstanding billing debt
     */
    async payBilling(address: string, amount: string): Promise<PaymentReceipt> {
        validateAddress(address);
        validateAmount(amount);

        return this.client.getProvider().post<PaymentReceipt>('/api/gas/billing/pay', {
            address,
            amount,
        });
    }

    /**
     * Get billing history
     */
    async getBillingHistory(address: string): Promise<BillingRecord[]> {
        validateAddress(address);
        return this.client
            .getProvider()
            .get<BillingRecord[]>(`/api/gas/billing/${address}/history`);
    }

    /**
     * Get gas statistics for an address
     */
    async getGasStats(address: string): Promise<GasStats> {
        validateAddress(address);
        return this.client.getProvider().get<GasStats>(`/api/gas/stats/${address}`);
    }

    /**
     * Get global gas metrics
     */
    async getGlobalGasMetrics(): Promise<GlobalGasMetrics> {
        return this.client.getProvider().get<GlobalGasMetrics>('/api/gas/stats/global');
    }
}
