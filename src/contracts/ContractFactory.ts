/**
 * Contract factory for deployment and attachment
 */

import { KodeChainClient } from '../core';
import { Contract } from './Contract';
import { DeployOptions, ABI, TransactionReceipt } from '../types';
import { ContractDeploymentError } from '../errors';
import {
    validateRequired,
    validateAddress,
    validateBytecode,
    DEFAULT_CONSENSUS,
    CONSTANTS,
} from '../utils';

export class ContractFactory {
    private client: KodeChainClient;

    constructor(client: KodeChainClient) {
        this.client = client;
    }

    /**
     * Deploy a new contract
     */
    async deploy(options: DeployOptions): Promise<Contract> {
        validateRequired(options.bytecode, 'bytecode');
        validateRequired(options.creator, 'creator');
        validateBytecode(options.bytecode);
        validateAddress(options.creator);

        const deployData = {
            bytecode: options.bytecode,
            abi: options.abi,
            creator: options.creator,
            constructorArgs: options.constructorArgs || [],
            name: options.name,
            version: options.version,
            gasLimit: options.gasLimit || CONSTANTS.DEFAULT_GAS_LIMIT,
            gasPrice: options.gasPrice || CONSTANTS.DEFAULT_GAS_PRICE,
            value: options.value || 0,
            consensus: options.consensus || DEFAULT_CONSENSUS,
        };

        try {
            const receipt = await this.client
                .getProvider()
                .post<TransactionReceipt>('/api/contracts/deploy', deployData);

            if (!receipt.success || !receipt.contractAddress) {
                throw new ContractDeploymentError('Contract deployment failed', {
                    receipt,
                });
            }

            return new Contract(receipt.contractAddress, this.client, options.abi);
        } catch (error) {
            if (error instanceof ContractDeploymentError) {
                throw error;
            }
            throw new ContractDeploymentError(
                error instanceof Error ? error.message : 'Unknown deployment error',
                { originalError: error }
            );
        }
    }

    /**
     * Attach to an existing contract
     */
    async attach(address: string, abi?: ABI): Promise<Contract> {
        validateAddress(address);

        // Verify contract exists
        try {
            await this.client.getProvider().get(`/api/contracts/${address}/info`);
        } catch (error) {
            throw new ContractDeploymentError(`Contract not found at address ${address}`, {
                address,
                originalError: error,
            });
        }

        return new Contract(address, this.client, abi);
    }

    /**
     * Estimate gas for contract deployment
     */
    async estimateDeployGas(options: DeployOptions): Promise<number> {
        validateRequired(options.bytecode, 'bytecode');
        validateBytecode(options.bytecode);

        const estimateData = {
            bytecode: options.bytecode,
            constructorArgs: options.constructorArgs || [],
            consensus: options.consensus || DEFAULT_CONSENSUS,
        };

        const response = await this.client
            .getProvider()
            .post<{ gasEstimate: number }>('/api/contracts/estimate-deploy-gas', estimateData);

        return response.gasEstimate;
    }
}
