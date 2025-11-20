/**
 * Transaction history queries
 */

import { KodeChainClient } from '../core';
import { Transaction, ConsensusType } from '../types';
import { validateAddress } from '../utils';

export interface TransactionHistoryOptions {
    offset?: number;
    limit?: number;
    consensus?: ConsensusType;
    startBlock?: number;
    endBlock?: number;
}

export class TransactionHistory {
    private client: KodeChainClient;

    constructor(client: KodeChainClient) {
        this.client = client;
    }

    /**
     * Get transaction history for an address
     */
    async getHistory(
        address: string,
        options?: TransactionHistoryOptions
    ): Promise<Transaction[]> {
        validateAddress(address);

        const params = {
            offset: options?.offset || 0,
            limit: options?.limit || 50,
            consensus: options?.consensus,
            startBlock: options?.startBlock,
            endBlock: options?.endBlock,
        };

        const response = await this.client
            .getProvider()
            .get<{ transactions: Transaction[] }>(`/api/accounts/${address}/transactions`, {
                params,
            });

        return response.transactions;
    }

    /**
     * Get sent transactions
     */
    async getSentTransactions(
        address: string,
        options?: TransactionHistoryOptions
    ): Promise<Transaction[]> {
        validateAddress(address);

        const params = {
            ...options,
            type: 'sent',
        };

        const response = await this.client
            .getProvider()
            .get<{ transactions: Transaction[] }>(`/api/accounts/${address}/transactions`, {
                params,
            });

        return response.transactions;
    }

    /**
     * Get received transactions
     */
    async getReceivedTransactions(
        address: string,
        options?: TransactionHistoryOptions
    ): Promise<Transaction[]> {
        validateAddress(address);

        const params = {
            ...options,
            type: 'received',
        };

        const response = await this.client
            .getProvider()
            .get<{ transactions: Transaction[] }>(`/api/accounts/${address}/transactions`, {
                params,
            });

        return response.transactions;
    }

    /**
     * Get transaction by hash
     */
    async getTransaction(hash: string): Promise<Transaction> {
        return this.client.getProvider().get<Transaction>(`/api/transactions/${hash}`);
    }
}
