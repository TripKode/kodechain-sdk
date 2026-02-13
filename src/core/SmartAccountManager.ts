import { KodeChainClient } from './KodeChainClient';

/**
 * Manager for advanced Smart Account features, including critical records,
 * billing, and cross-chain transfers.
 */
export class SmartAccountManager {
    constructor(private client: KodeChainClient) { }

    /**
     * Creates a new smart account on the node
     */
    async createAccount(address: string): Promise<any> {
        return this.client.getProvider().post('/api/smart-accounts', { address });
    }

    /**
     * Gets basic account information and stats
     */
    async getAccount(address: string): Promise<any> {
        return this.client.getProvider().get(`/api/smart-accounts/${address}`);
    }

    /**
     * Gets billing information for a smart account
     */
    async getBillingInfo(address: string): Promise<any> {
        return this.client.getProvider().get(`/api/smart-accounts/${address}/billing`);
    }

    /**
     * Adds a critical audit record to the account (stored on PBFT chain)
     */
    async addCriticalRecord(address: string, recordType: string, content: string): Promise<any> {
        return this.client.getProvider().post(`/api/smart-accounts/${address}/records`, {
            recordType,
            content
        });
    }

    /**
     * Retrieves the history of audit records for an account
     */
    async getRecordHistory(address: string, options?: { limit?: number; offset?: number; type?: string }): Promise<any> {
        const queryParams = new URLSearchParams();
        if (options?.limit) queryParams.append('limit', options.limit.toString());
        if (options?.offset) queryParams.append('offset', options.offset.toString());
        if (options?.type) queryParams.append('type', options.type);

        const queryString = queryParams.toString();
        const url = `/api/smart-accounts/${address}/records/history${queryString ? '?' + queryString : ''}`;

        return this.client.getProvider().get(url);
    }

    /**
     * Transfers funds between PBFT and DPOS chains
     */
    async transferBetweenChains(address: string, amount: number | bigint, direction: 'to_dpos' | 'from_dpos'): Promise<any> {
        return this.client.getProvider().post(`/api/smart-accounts/${address}/transfer`, {
            amount: amount.toString(),
            direction
        });
    }

    /**
     * Checks account status and blocking reason
     */
    async getAccountStatus(address: string): Promise<any> {
        return this.client.getProvider().get(`/api/smart-accounts/${address}/status`);
    }

    /**
     * List all smart accounts
     */
    async list(options?: { limit?: number; offset?: number; filter?: string }): Promise<any> {
        const params = {
            offset: options?.offset || 0,
            limit: options?.limit || 50,
            filter: options?.filter,
        };
        return this.client.getProvider().get('/api/smart-accounts/all', { params });
    }

    /**
     * Check if an address is a smart account
     */
    async isSmartAccount(address: string): Promise<boolean> {
        try {
            await this.getAccount(address);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Get billing summary for all accounts
     */
    async getBillingSummary(): Promise<any> {
        return this.client.getProvider().get('/api/smart-accounts/billing/summary');
    }

    /**
     * Get all blocked accounts
     */
    async getBlockedAccounts(): Promise<any> {
        return this.client.getProvider().get('/api/smart-accounts/blocked');
    }

    /**
     * Get payment history for an account
     */
    async getPaymentHistory(address: string): Promise<any> {
        return this.client.getProvider().get(`/api/smart-accounts/${address}/payments`);
    }
}
