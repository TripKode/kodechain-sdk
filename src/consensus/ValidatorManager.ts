/**
 * Validator Manager
 */

import { KodeChainClient } from '../core';
import type { Validator, RegisterValidatorOptions, TransactionReceipt } from '../types';
import { validateAddress, validateRequired } from '../utils';

export class ValidatorManager {
    private client: KodeChainClient;

    constructor(client: KodeChainClient) {
        this.client = client;
    }

    /**
     * List all validators
     */
    async list(): Promise<Validator[]> {
        const response = await this.client
            .getProvider()
            .get<{ validators: Validator[] }>('/api/validators');

        return response.validators;
    }

    /**
     * Get a specific validator
     */
    async get(address: string): Promise<Validator> {
        validateAddress(address);
        return this.client.getProvider().get<Validator>(`/api/validators/${address}`);
    }

    /**
     * Register a new validator
     */
    async register(options: RegisterValidatorOptions): Promise<TransactionReceipt> {
        validateRequired(options.address, 'address');
        validateRequired(options.name, 'name');
        validateRequired(options.stakeAmount, 'stakeAmount');
        validateAddress(options.address);

        return this.client.getProvider().post<TransactionReceipt>('/api/validators/register', {
            address: options.address,
            name: options.name,
            consensusType: options.consensusType,
            stakeAmount: options.stakeAmount,
            commission: options.commission,
        });
    }

    /**
     * Activate a validator
     */
    async activate(address: string): Promise<TransactionReceipt> {
        validateAddress(address);
        return this.client
            .getProvider()
            .post<TransactionReceipt>(`/api/validators/${address}/activate`);
    }

    /**
     * Deactivate a validator
     */
    async deactivate(address: string): Promise<TransactionReceipt> {
        validateAddress(address);
        return this.client
            .getProvider()
            .post<TransactionReceipt>(`/api/validators/${address}/deactivate`);
    }

    /**
     * Get active validators
     */
    async getActive(): Promise<Validator[]> {
        const validators = await this.list();
        return validators.filter((v) => v.isActive);
    }

    /**
     * Get validators by consensus type
     */
    async getByConsensus(consensusType: 'DPOS' | 'PBFT'): Promise<Validator[]> {
        const validators = await this.list();
        return validators.filter((v) => v.consensusType === consensusType);
    }

    /**
     * Get top validators by stake
     */
    async getTopByStake(limit: number = 10): Promise<Validator[]> {
        const validators = await this.list();
        return validators
            .sort((a, b) => parseFloat(b.stakedAmount) - parseFloat(a.stakedAmount))
            .slice(0, limit);
    }
}
