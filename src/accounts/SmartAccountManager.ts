/**
 * Smart Account Manager
 */

import { KodeChainClient } from '../core';
import { SmartAccount } from './SmartAccount';
import { ListOptions } from '../types';
import { validateAddress } from '../utils';

export class SmartAccountManager {
    private client: KodeChainClient;

    constructor(client: KodeChainClient) {
        this.client = client;
    }

    /**
     * Create a new Smart Account
     */
    async create(address: string): Promise<SmartAccount> {
        validateAddress(address);

        await this.client.getProvider().post(`/api/smart-accounts`, {
            address,
        });

        return new SmartAccount(address, this.client);
    }

    /**
     * Get an existing Smart Account
     */
    async get(address: string): Promise<SmartAccount> {
        validateAddress(address);

        // Verify account exists
        await this.client.getProvider().get(`/api/smart-accounts/${address}`);

        return new SmartAccount(address, this.client);
    }

    /**
     * List all Smart Accounts
     */
    async list(options?: ListOptions): Promise<SmartAccount[]> {
        const params = {
            offset: options?.offset || 0,
            limit: options?.limit || 50,
            filter: options?.filter,
        };

        const response = await this.client
            .getProvider()
            .get<{ accounts: Array<{ address: string }> }>('/api/smart-accounts', { params });

        return response.accounts.map((acc) => new SmartAccount(acc.address, this.client));
    }

    /**
     * Check if an account is a Smart Account
     */
    async isSmartAccount(address: string): Promise<boolean> {
        validateAddress(address);

        try {
            await this.client.getProvider().get(`/api/smart-accounts/${address}`);
            return true;
        } catch {
            return false;
        }
    }
}
