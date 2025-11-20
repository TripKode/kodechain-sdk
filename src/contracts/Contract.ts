/**
 * Contract instance class
 */

import EventEmitter from 'eventemitter3';
import { KodeChainClient } from '../core';
import {
    ABI,
    CallOptions,
    ContractState,
    ContractInfo,
    ContractEvent,
    TransactionReceipt,
} from '../types';
import { validateRequired, validateAddress, DEFAULT_CONSENSUS } from '../utils';

export class Contract extends EventEmitter {
    public readonly address: string;
    public readonly abi?: ABI;
    private client: KodeChainClient;

    constructor(address: string, client: KodeChainClient, abi?: ABI) {
        super();
        validateAddress(address);
        this.address = address;
        this.client = client;
        this.abi = abi;
    }

    /**
     * Call a contract function (modifies state)
     */
    async call(
        functionName: string,
        params: any[] = [],
        options?: CallOptions
    ): Promise<TransactionReceipt> {
        validateRequired(options?.caller, 'caller');

        const data = {
            contractAddress: this.address,
            functionName,
            params,
            caller: options!.caller,
            value: options?.value,
            gasLimit: options?.gasLimit,
            gasPrice: options?.gasPrice,
            consensus: options?.consensus || DEFAULT_CONSENSUS,
        };

        const receipt = await this.client
            .getProvider()
            .post<TransactionReceipt>('/api/contracts/call', data);

        // Emit events from logs
        if (receipt.logs && this.abi) {
            this.emitEventsFromLogs(receipt);
        }

        return receipt;
    }

    /**
     * Read a view/pure function (does not modify state)
     */
    async view(functionName: string, params: any[] = []): Promise<any> {
        const data = {
            contractAddress: this.address,
            functionName,
            params,
        };

        const response = await this.client
            .getProvider()
            .post<{ result: any }>('/api/contracts/view', data);

        return response.result;
    }

    /**
     * Get contract state
     */
    async getState(): Promise<ContractState> {
        return this.client.getProvider().get<ContractState>(`/api/contracts/${this.address}/state`);
    }

    /**
     * Get contract information
     */
    async getInfo(): Promise<ContractInfo> {
        return this.client.getProvider().get<ContractInfo>(`/api/contracts/${this.address}/info`);
    }

    /**
     * Emit events from transaction logs
     */
    private emitEventsFromLogs(receipt: TransactionReceipt): void {
        if (!this.abi) return;

        for (const log of receipt.logs) {
            // Find matching event in ABI
            const eventAbi = this.abi.find(
                (entry) => entry.type === 'event' && this.matchesEventSignature(entry, log)
            );

            if (eventAbi && eventAbi.name) {
                const event: ContractEvent = {
                    eventName: eventAbi.name,
                    blockNumber: receipt.blockNumber,
                    transactionHash: receipt.transactionHash,
                    args: this.decodeEventArgs(eventAbi, log),
                    raw: {
                        data: log.data,
                        topics: log.topics,
                    },
                };

                this.emit(eventAbi.name, event);
            }
        }
    }

    private matchesEventSignature(_eventAbi: any, _log: any): boolean {
        // Simplified event matching
        // In production, properly hash event signature and compare with log.topics[0]
        return true;
    }

    private decodeEventArgs(_eventAbi: any, _log: any): any[] {
        // Simplified event decoding
        // In production, properly decode based on ABI types
        return [];
    }
}
