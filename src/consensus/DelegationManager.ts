/**
 * Delegation Manager
 */

import { KodeChainClient } from '../core';

import { validateAddress, validateAmount } from '../utils';

export class DelegationManager {
    private client: KodeChainClient;

    constructor(client: KodeChainClient) {
        this.client = client;
    }

    /**
     * Register as a delegate (active delegation)
     */
    async registerDelegate(
        delegateAddress: string,
        stakeAmount: number,
        name?: string,
        publicKey?: string
    ): Promise<any> {
        validateAddress(delegateAddress);

        return this.client.getProvider().post('/api/staking/delegate/register', {
            delegate_address: delegateAddress,
            stake_amount: stakeAmount,
            delegate_name: name,
            public_key: publicKey,
        });
    }

    /**
     * Delegate passively to a validator
     */
    async delegatePassive(
        delegatorAddress: string,
        validatorAddress: string,
        amount: string
    ): Promise<any> {
        validateAddress(delegatorAddress);
        validateAddress(validatorAddress);
        validateAmount(amount);

        return this.client.getProvider().post('/api/passive-delegation/create', {
            delegator_address: delegatorAddress,
            validator_address: validatorAddress,
            stake_amount: amount,
        });
    }

    /**
     * Remove an active delegate registration
     */
    async removeActiveDelegate(address: string): Promise<any> {
        validateAddress(address);
        return this.client.getProvider().delete(`/api/staking/delegate/remove?address=${address}`);
    }

    /**
     * Remove a passive delegation
     */
    async removePassiveDelegation(delegationId: string): Promise<any> {
        return this.client.getProvider().post('/api/passive-delegation/remove', {
            delegation_id: delegationId,
        });
    }

    /**
     * Get all active delegates
     */
    async getActiveDelegates(): Promise<any[]> {
        const response = await this.client
            .getProvider()
            .get<{ delegates: any[] }>('/api/staking/delegate/list');
        return response.delegates;
    }

    /**
     * Get passive delegations for a delegator
     */
    async getPassiveByDelegator(address: string): Promise<any[]> {
        validateAddress(address);
        const response = await this.client
            .getProvider()
            .get<{ delegations: any[] }>(`/api/passive-delegation/by-delegator?delegator_address=${address}`);
        return response.delegations;
    }

    /**
     * Get passive delegations for a validator
     */
    async getPassiveByValidator(address: string): Promise<any[]> {
        validateAddress(address);
        const response = await this.client
            .getProvider()
            .get<{ delegations: any[] }>(`/api/passive-delegation/by-validator?validator_address=${address}`);
        return response.delegations;
    }

    /**
     * Get validator delegation summary (passive)
     */
    async getValidatorSummary(address: string): Promise<any> {
        validateAddress(address);
        return this.client
            .getProvider()
            .get(`/api/passive-delegation/validator-summary?validator_address=${address}`);
    }

    /**
     * Get staking statistics
     */
    async getStakingStats(): Promise<any> {
        return this.client.getProvider().get('/api/staking/stats');
    }

    /**
     * Get passive delegation statistics
     */
    async getPassiveStats(): Promise<any> {
        return this.client.getProvider().get('/api/passive-delegation/stats');
    }

    /**
     * Distribute rewards to passive delegators
     */
    async distributePassiveRewards(validatorAddress: string, totalReward: string): Promise<any> {
        validateAddress(validatorAddress);
        return this.client.getProvider().post('/api/passive-delegation/distribute-rewards', {
            validator_address: validatorAddress,
            total_reward: totalReward,
        });
    }
}
