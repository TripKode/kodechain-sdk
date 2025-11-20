/**
 * Delegation Manager
 */

import { KodeChainClient } from '../core';
import { Delegation, DelegationStats, TransactionReceipt } from '../types';
import { validateAddress, validateAmount } from '../utils';

export class DelegationManager {
    private client: KodeChainClient;

    constructor(client: KodeChainClient) {
        this.client = client;
    }

    /**
     * Delegate actively to a validator (physical validator)
     */
    async delegateActive(
        validatorAddress: string,
        amount: string,
        from: string
    ): Promise<TransactionReceipt> {
        validateAddress(validatorAddress);
        validateAddress(from);
        validateAmount(amount);

        return this.client.getProvider().post<TransactionReceipt>('/api/delegations/active', {
            validatorAddress,
            amount,
            from,
        });
    }

    /**
     * Delegate passively to a validator
     */
    async delegatePassive(
        validatorAddress: string,
        amount: string,
        from: string
    ): Promise<TransactionReceipt> {
        validateAddress(validatorAddress);
        validateAddress(from);
        validateAmount(amount);

        return this.client.getProvider().post<TransactionReceipt>('/api/delegations/passive', {
            validatorAddress,
            amount,
            from,
        });
    }

    /**
     * Undelegate from a validator
     */
    async undelegate(
        validatorAddress: string,
        amount: string,
        from: string
    ): Promise<TransactionReceipt> {
        validateAddress(validatorAddress);
        validateAddress(from);
        validateAmount(amount);

        return this.client.getProvider().post<TransactionReceipt>('/api/delegations/undelegate', {
            validatorAddress,
            amount,
            from,
        });
    }

    /**
     * Get delegations for an address
     */
    async getDelegations(address: string): Promise<Delegation[]> {
        validateAddress(address);

        const response = await this.client
            .getProvider()
            .get<{ delegations: Delegation[] }>(`/api/delegations/${address}`);

        return response.delegations;
    }

    /**
     * Get delegations to a specific validator
     */
    async getDelegationsToValidator(validatorAddress: string): Promise<Delegation[]> {
        validateAddress(validatorAddress);

        const response = await this.client
            .getProvider()
            .get<{ delegations: Delegation[] }>(`/api/validators/${validatorAddress}/delegations`);

        return response.delegations;
    }

    /**
     * Get delegation statistics
     */
    async getStats(): Promise<DelegationStats> {
        return this.client.getProvider().get<DelegationStats>('/api/delegations/stats');
    }

    /**
     * Get active delegations for an address
     */
    async getActiveDelegations(address: string): Promise<Delegation[]> {
        const delegations = await this.getDelegations(address);
        return delegations.filter((d) => d.type === 'active');
    }

    /**
     * Get passive delegations for an address
     */
    async getPassiveDelegations(address: string): Promise<Delegation[]> {
        const delegations = await this.getDelegations(address);
        return delegations.filter((d) => d.type === 'passive');
    }

    /**
     * Get total delegated amount for an address
     */
    async getTotalDelegated(address: string): Promise<string> {
        const delegations = await this.getDelegations(address);
        return delegations.reduce((total, d) => {
            return (parseFloat(total) + parseFloat(d.amount)).toString();
        }, '0');
    }
}
