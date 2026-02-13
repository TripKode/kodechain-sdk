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

    /**
     * Get full account data
     */
    async getAccount(): Promise<any> {
        const response = await this.client
            .getProvider()
            .get<{ account: any }>(`/api/smart-accounts/${this.address}`);
        return response.account;
    }

    // ==================== DPOS Operations ====================

    /**
     * Get DPOS state
     */
    async getDPOSState(): Promise<DPOSState> {
        const account = await this.getAccount();
        return account.dposState;
    }

    /**
     * Get staked amount
     */
    async getStakedAmount(): Promise<string> {
        const state = await this.getDPOSState();
        return (state.stakedAmount || 0).toString();
    }

    /**
     * Delegate to a validator
     */
    async delegate(validatorAddress: string, amount: string): Promise<TransactionReceipt> {
        validateAddress(validatorAddress);
        validateAmount(amount);

        return this.client.getProvider().post<TransactionReceipt>(
            `/api/staking/delegate/register`,
            {
                delegate_address: validatorAddress,
                stake_amount: parseFloat(amount),
                delegate_address_source: this.address
            }
        );
    }

    /**
     * Undelegate from validator
     */
    async undelegate(address: string): Promise<TransactionReceipt> {
        validateAddress(address);

        return this.client.getProvider().delete(
            `/api/staking/delegate/remove?address=${address}`
        );
    }

    // ==================== PBFT Operations ====================

    /**
     * Get PBFT state
     */
    async getPBFTState(): Promise<PBFTState> {
        const account = await this.getAccount();
        return account.pbftState;
    }

    /**
     * Get account status (blocking info)
     */
    async getStatus(): Promise<any> {
        const response = await this.client
            .getProvider()
            .get<{ status: any }>(`/api/smart-accounts/${this.address}/status`);
        return response.status;
    }

    /**
     * Get critical records
     */
    async getCriticalRecords(): Promise<CriticalRecord[]> {
        const state = await this.getPBFTState();
        return state.criticalRecords || [];
    }

    /**
     * Get critical record history with pagination
     */
    async getRecordHistory(options?: { limit?: number; offset?: number; type?: string }): Promise<any> {
        const response = await this.client.getProvider().get<{ records: any[]; total: number }>(
            `/api/smart-accounts/${this.address}/records/history`,
            { params: options }
        );
        return response;
    }

    /**
     * Register a critical record
     */
    async registerCriticalRecord(data: any): Promise<TransactionReceipt> {
        return this.client.getProvider().post<TransactionReceipt>(
            `/api/smart-accounts/${this.address}/records`,
            {
                recordType: data.type || 'generic',
                content: typeof data === 'string' ? data : JSON.stringify(data),
            }
        );
    }

    /**
     * Get monthly billing information
     */
    async getMonthlyBilling(): Promise<BillingInfo> {
        const response = await this.client
            .getProvider()
            .get<{ billingInfo: BillingInfo }>(`/api/smart-accounts/${this.address}/billing`);
        return response.billingInfo;
    }

    /**
     * Pay PBFT billing
     */
    async payPBFTBilling(amount: string): Promise<TransactionReceipt> {
        validateAmount(amount);

        return this.client.getProvider().post<TransactionReceipt>(
            `/api/smart-accounts/${this.address}/payments`,
            {
                amount: parseInt(amount),
                transactionHash: 'internal_sdk_payment',
            }
        );
    }

    // ==================== Interoperability ====================

    /**
     * Get interoperability settings
     */
    async getInteropSettings(): Promise<InteropSettings> {
        const account = await this.getAccount();
        return account.interopSettings;
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
        direction: 'to_dpos' | 'from_dpos'
    ): Promise<TransactionReceipt> {
        validateAmount(amount);

        return this.client.getProvider().post<TransactionReceipt>(
            `/api/smart-accounts/${this.address}/transfer`,
            {
                amount: parseInt(amount),
                direction,
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
     * Get total balance across all tokens
     */
    async getTotalBalance(): Promise<string> {
        const account = await this.getAccount();
        if (!account || !account.balances) {
            return '0';
        }

        let total = 0;
        for (const symbol in account.balances) {
            const b = account.balances[symbol];
            if (b && b.currentBalance) {
                total += b.currentBalance;
            }
        }
        return total.toString();
    }
}
