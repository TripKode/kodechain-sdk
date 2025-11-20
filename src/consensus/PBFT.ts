/**
 * PBFT-specific operations
 */

import { KodeChainClient } from '../core';

export class PBFT {
    private client: KodeChainClient;

    constructor(client: KodeChainClient) {
        this.client = client;
    }

    /**
     * Get PBFT chain height
     */
    async getHeight(): Promise<number> {
        return this.client.getBlockHeight('PBFT');
    }

    /**
     * Get PBFT block
     */
    async getBlock(height: number): Promise<any> {
        return this.client.getBlock(height, 'PBFT');
    }

    /**
     * Get latest PBFT block
     */
    async getLatestBlock(): Promise<any> {
        return this.client.getLatestBlock('PBFT');
    }

    /**
     * Get PBFT statistics
     */
    async getStats(): Promise<any> {
        return this.client.getProvider().get('/api/blockchain/pbft/stats');
    }

    /**
     * Get PBFT consensus status
     */
    async getConsensusStatus(): Promise<any> {
        return this.client.getProvider().get('/api/blockchain/pbft/consensus-status');
    }
}
