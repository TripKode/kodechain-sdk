/**
 * Transaction class
 */

import { KodeChainClient } from '../core';
import {
    Transaction as ITransaction,
    TransactionReceipt,
    TransactionStatusInfo,
} from '../types';
import { CONSTANTS } from '../utils';

export class Transaction implements ITransaction {
    public hash: string;
    public from: string;
    public to: string;
    public value: string;
    public data: string;
    public gasLimit: number;
    public gasPrice: number;
    public consensus: 'DPOS' | 'PBFT';
    public nonce?: number;
    public timestamp?: number;

    private client: KodeChainClient;

    constructor(txData: ITransaction, client: KodeChainClient) {
        this.hash = txData.hash;
        this.from = txData.from;
        this.to = txData.to;
        this.value = txData.value;
        this.data = txData.data;
        this.gasLimit = txData.gasLimit;
        this.gasPrice = txData.gasPrice;
        this.consensus = txData.consensus;
        this.nonce = txData.nonce;
        this.timestamp = txData.timestamp;
        this.client = client;
    }

    /**
     * Send the transaction
     */
    async send(): Promise<TransactionReceipt> {
        const txData = {
            from: this.from,
            to: this.to,
            value: this.value,
            data: this.data,
            gasLimit: this.gasLimit,
            gasPrice: this.gasPrice,
            consensus: this.consensus,
        };

        const receipt = await this.client
            .getProvider()
            .post<TransactionReceipt>('/api/transactions/send', txData);

        this.hash = receipt.transactionHash;
        return receipt;
    }

    /**
     * Wait for transaction confirmation
     */
    async wait(confirmations: number = CONSTANTS.DEFAULT_CONFIRMATIONS): Promise<TransactionReceipt> {
        if (!this.hash) {
            throw new Error('Transaction not sent yet');
        }

        let currentConfirmations = 0;
        const pollInterval = 2000; // 2 seconds

        while (currentConfirmations < confirmations) {
            const status = await this.getStatus();

            if (status.status === 'failed' || status.status === 'reverted') {
                throw new Error(`Transaction ${status.status}: ${this.hash}`);
            }

            if (status.status === 'confirmed') {
                currentConfirmations = status.confirmations;
            }

            if (currentConfirmations < confirmations) {
                await this.delay(pollInterval);
            }
        }

        return this.getReceipt();
    }

    /**
     * Get transaction status
     */
    async getStatus(): Promise<TransactionStatusInfo> {
        if (!this.hash) {
            return {
                status: 'pending',
                confirmations: 0,
            };
        }

        return this.client
            .getProvider()
            .get<TransactionStatusInfo>(`/api/transactions/${this.hash}/status`);
    }

    /**
     * Get transaction receipt
     */
    async getReceipt(): Promise<TransactionReceipt> {
        if (!this.hash) {
            throw new Error('Transaction not sent yet');
        }

        return this.client
            .getProvider()
            .get<TransactionReceipt>(`/api/transactions/${this.hash}/receipt`);
    }

    private delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
