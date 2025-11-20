/**
 * Wallet management utilities
 */

import { KodeChainClient } from '../core';
import { validateAddress } from '../utils';

export class Wallet {
    private client: KodeChainClient;
    public readonly address: string;

    constructor(address: string, client: KodeChainClient) {
        validateAddress(address);
        this.address = address;
        this.client = client;
    }

    /**
     * Get wallet balance
     */
    async getBalance(chain?: 'DPOS' | 'PBFT'): Promise<string> {
        return this.client.getBalance(this.address, chain);
    }

    /**
     * Send transaction
     */
    async sendTransaction(to: string, amount: string, chain?: 'DPOS' | 'PBFT'): Promise<any> {
        validateAddress(to);

        return this.client.getProvider().post('/api/transactions/send', {
            from: this.address,
            to,
            value: amount,
            consensus: chain || 'DPOS',
        });
    }
}
