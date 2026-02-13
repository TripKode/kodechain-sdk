/**
 * KDC Tokenomics Manager
 */

import { KodeChainClient } from '../core';

export interface KDCInfo {
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: string;
    circulatingSupply: string;
    maxSupply: string;
    features: string[];
}

export class KDCManager {
    private client: KodeChainClient;

    constructor(client: KodeChainClient) {
        this.client = client;
    }

    /**
     * Get KDC tokenomics information
     */
    async getTokenomics(): Promise<KDCInfo> {
        const response = await this.client
            .getProvider()
            .get<{ success: boolean; data: KDCInfo }>('/api/kdc/tokenomics');

        return response.data;
    }

    /**
     * Get real-time total supply
     */
    async getTotalSupply(): Promise<string> {
        const info = await this.getTokenomics();
        return info.totalSupply;
    }
}
