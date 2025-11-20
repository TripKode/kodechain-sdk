/**
 * Balance query utilities
 */

import { KodeChainClient } from '../core';
import { ConsensusType } from '../types';
import { validateAddress } from '../utils';
import BigNumber from 'bignumber.js';

export class Balance {
    private client: KodeChainClient;

    constructor(client: KodeChainClient) {
        this.client = client;
    }

    /**
     * Get balance for an address on a specific chain
     */
    async get(address: string, chain?: ConsensusType): Promise<string> {
        validateAddress(address);
        return this.client.getBalance(address, chain);
    }

    /**
     * Get balances for multiple addresses
     */
    async getMultiple(addresses: string[], chain?: ConsensusType): Promise<Record<string, string>> {
        const balances: Record<string, string> = {};

        await Promise.all(
            addresses.map(async (address) => {
                balances[address] = await this.get(address, chain);
            })
        );

        return balances;
    }

    /**
     * Get total balance across both chains
     */
    async getTotal(address: string): Promise<string> {
        validateAddress(address);

        const dposBalance = await this.get(address, 'DPOS');
        const pbftBalance = await this.get(address, 'PBFT');

        return new BigNumber(dposBalance).plus(pbftBalance).toString();
    }

    /**
     * Compare balances
     */
    async compare(address1: string, address2: string, chain?: ConsensusType): Promise<number> {
        const balance1 = await this.get(address1, chain);
        const balance2 = await this.get(address2, chain);

        const bn1 = new BigNumber(balance1);
        const bn2 = new BigNumber(balance2);

        return bn1.comparedTo(bn2) || 0;
    }
}
