import { KodeChainClient } from './KodeChainClient';
import { validateAddress, validateRequired } from '../utils';
import { DeployOptions, CallOptions, ContractInfo } from '../types';

export class DVMManager {
    private client: KodeChainClient;

    constructor(client: KodeChainClient) {
        this.client = client;
    }

    /**
     * List all contracts
     */
    async list(): Promise<ContractInfo[]> {
        const response = await this.client.getProvider().get<{ contracts: ContractInfo[] }>('/api/contracts');
        return response.contracts;
    }

    /**
     * Get contract information
     */
    async getInfo(address: string): Promise<ContractInfo> {
        validateAddress(address);
        const response = await this.client.getProvider().get<{ contract: ContractInfo }>(`/api/contract/${address}`);
        return response.contract;
    }

    /**
     * Get contract state
     */
    async getState(address: string): Promise<any> {
        validateAddress(address);
        const response = await this.client.getProvider().get<{ state: any }>(`/api/contract/state/${address}`);
        return response.state;
    }

    /**
     * Deploy a new contract
     */
    async deploy(bytecode: string, abi?: any, options: DeployOptions = {}): Promise<any> {
        validateRequired(bytecode, 'bytecode');

        const wallet = this.client.auth.isAuthenticated() ? this.client.auth.getWallet() : undefined;
        const creator = options.creator || wallet?.address || '0x0000000000000000000000000000000000000000';

        return this.client.getProvider().post('/api/contracts/deploy', {
            creator,
            bytecode,
            abi,
            name: options.name,
            version: options.version,
            initParams: options.initParams,
            value: options.value,
            gasLimit: options.gasLimit,
            gasPrice: options.gasPrice,
        });
    }

    /**
     * Call a contract function
     */
    async call(address: string, functionName: string, params?: string, options: CallOptions = {}): Promise<any> {
        validateAddress(address);

        const wallet = this.client.auth.isAuthenticated() ? this.client.auth.getWallet() : undefined;
        if (!wallet && !options.caller) {
            throw new Error('Authentication required for contract calls.');
        }

        return this.client.getProvider().post('/api/contracts/call', {
            contract_address: address,
            caller: options.caller || wallet?.address,
            function: functionName,
            parameters: params,
            value: options.value,
            gas_limit: options.gasLimit,
            gas_price: options.gasPrice,
        });
    }

    /**
     * Static call (query) - read-only execution
     */
    async query(address: string, functionName: string, params?: string): Promise<any> {
        return this.client.getProvider().post('/api/contracts/call', {
            contract_address: address,
            caller: '0x0000000000000000000000000000000000000000',
            function: functionName,
            parameters: params,
        });
    }
}
