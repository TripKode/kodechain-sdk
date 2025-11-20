/**
 * DPOS-specific operations
 */

import { KodeChainClient } from '../core';

export class DPOS {
    private client: KodeChainClient;

    constructor(client: KodeChainClient) {
        this.client = client;
    }

    /**
     * Get DPOS chain height
     */
    async getHeight(): Promise<number> {
        return this.client.getBlockHeight('DPOS');
    }

    /**
     * Get DPOS block
     */
    async getBlock(height: number): Promise<any> {
        return this.client.getBlock(height, 'DPOS');
    }

    /**
     * Get latest DPOS block
     */
    async getLatestBlock(): Promise<any> {
        return this.client.getLatestBlock('DPOS');
    }

    /**
     * Get DPOS statistics
     */
    async getStats(): Promise<any> {
        return this.client.getProvider().get('/api/blockchain/dpos/stats');
    }
}
