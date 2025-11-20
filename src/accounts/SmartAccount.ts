/**
 * Smart Account class
 */

import { KodeChainClient } from '../core';
import {
    DPOSState,
    PBFTState,
    CriticalRecord,
    BillingInfo,
    InteropSettings,
    TransactionReceipt,
    ConsensusType,
} from '../types';
import { validateAddress, validateAmount } from '../utils';

export class SmartAccount {
    public readonly address: string;
    private client: KodeChainClient;

    constructor(address: string, client: KodeChainClient) {
        validateAddress(address);
        this.address = address;
        this.client = client;
    }

    // ==================== DPOS Operations ====================

    /**
     * Get DPOS state
     */
    async getDPOSState(): Promise<DPOSState> {
        return this.client
            .getProvider()
            .get<DPOSState>(`/api/smart-accounts/${this.address}/dpos/state`);
    }

    /**
     * Get staked amount
     */
    async getStakedAmount(): Promise<string> {
        const state = await this.getDPOSState();
        return state.stakedAmount;
    }

    /**
     * Delegate to a validator
     */
    async delegate(validatorAddress: string, amount: string): Promise<TransactionReceipt> {
        validateAddress(validatorAddress);
        validateAmount(amount);

        return this.client.getProvider().post<TransactionReceipt>(
            `/api/smart-accounts/${this.address}/dpos/delegate`,
            {
                validatorAddress,
                amount,
            }
        );
    }

    /**
     * Undelegate from validator
     */
    async undelegate(amount: string): Promise<TransactionReceipt> {
        validateAmount(amount);

        return this.client.getProvider().post<TransactionReceipt>(
            `/api/smart-accounts/${this.address}/dpos/undelegate`,
            {
                amount,
            }
        );
    }

    // ==================== PBFT Operations ====================

    /**
     * Get PBFT state
     */
    async getPBFTState(): Promise<PBFTState> {
        return this.client
            .getProvider()
            .get<PBFTState>(`/api/smart-accounts/${this.address}/pbft/state`);
    }

    /**
     * Get critical records
     */
    async getCriticalRecords(): Promise<CriticalRecord[]> {
        const state = await this.getPBFTState();
        return state.criticalRecords;
    }

    /**
     * Register a critical record
     */
    async registerCriticalRecord(data: any): Promise<TransactionReceipt> {
        return this.client.getProvider().post<TransactionReceipt>(
            `/api/smart-accounts/${this.address}/pbft/records`,
            {
                data,
            }
        );
    }

    /**
     * Get monthly billing information
     */
    async getMonthlyBilling(): Promise<BillingInfo> {
        const state = await this.getPBFTState();
        return state.monthlyBilling;
    }

    /**
     * Pay PBFT billing
     */
    async payPBFTBilling(amount: string): Promise<TransactionReceipt> {
        validateAmount(amount);

        return this.client.getProvider().post<TransactionReceipt>(
            `/api/smart-accounts/${this.address}/pbft/pay-billing`,
            {
                amount,
            }
        );
    }

    // ==================== Interoperability ====================

    /**
     * Get interoperability settings
     */
    async getInteropSettings(): Promise<InteropSettings> {
        return this.client
            .getProvider()
            .get<InteropSettings>(`/api/smart-accounts/${this.address}/interop/settings`);
    }

    /**
     * Enable cross-chain transfers
     */
    async enableCrossChain(): Promise<TransactionReceipt> {
        return this.client.getProvider().post<TransactionReceipt>(
            `/api/smart-accounts/${this.address}/interop/enable`
        );
    }

    /**
     * Disable cross-chain transfers
     */
    async disableCrossChain(): Promise<TransactionReceipt> {
        return this.client.getProvider().post<TransactionReceipt>(
            `/api/smart-accounts/${this.address}/interop/disable`
        );
    }

    /**
     * Transfer between chains
     */
    async transferCrossChain(
        amount: string,
        fromChain: ConsensusType,
        toChain: ConsensusType
    ): Promise<TransactionReceipt> {
        validateAmount(amount);

        return this.client.getProvider().post<TransactionReceipt>(
            `/api/smart-accounts/${this.address}/interop/transfer`,
            {
                amount,
                fromChain,
                toChain,
            }
        );
    }

    // ==================== Balances ====================

    /**
     * Get balance for a specific chain
     */
    async getBalance(chain?: ConsensusType): Promise<string> {
        return this.client.getBalance(this.address, chain);
    }

    /**
     * Get total balance across both chains
     */
    async getTotalBalance(): Promise<string> {
        const response = await this.client
            .getProvider()
            .get<{ totalBalance: string }>(`/api/smart-accounts/${this.address}/balance/total`);

        return response.totalBalance;
    }
}
