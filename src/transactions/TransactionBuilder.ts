/**
 * Transaction builder with fluent API
 */

import { KodeChainClient } from '../core';
import { Transaction } from './Transaction';
import { TransactionReceipt, ConsensusType } from '../types';
import { validateAddress, validateAmount, DEFAULT_CONSENSUS, CONSTANTS } from '../utils';
import { ValidationError } from '../errors';

export class TransactionBuilder {
    private client: KodeChainClient;
    private _from?: string;
    private _to?: string;
    private _value?: string;
    private _data?: string;
    private _gasLimit?: number;
    private _gasPrice?: number;
    private _consensus?: ConsensusType;

    constructor(client: KodeChainClient) {
        this.client = client;
    }

    /**
     * Set sender address
     */
    from(address: string): this {
        validateAddress(address);
        this._from = address;
        return this;
    }

    /**
     * Set recipient address
     */
    to(address: string): this {
        validateAddress(address);
        this._to = address;
        return this;
    }

    /**
     * Set value to send
     */
    value(amount: string): this {
        validateAmount(amount);
        this._value = amount;
        return this;
    }

    /**
     * Set transaction data
     */
    data(data: string): this {
        this._data = data;
        return this;
    }

    /**
     * Set gas limit
     */
    gasLimit(limit: number): this {
        if (limit < 0) {
            throw new ValidationError('Gas limit must be positive', 'gasLimit');
        }
        this._gasLimit = limit;
        return this;
    }

    /**
     * Set gas price
     */
    gasPrice(price: number): this {
        if (price < 0) {
            throw new ValidationError('Gas price must be positive', 'gasPrice');
        }
        this._gasPrice = price;
        return this;
    }

    /**
     * Set consensus type
     */
    consensus(type: ConsensusType): this {
        this._consensus = type;
        return this;
    }

    /**
     * Estimate gas for this transaction
     */
    async estimateGas(): Promise<number> {
        this.validate();

        const estimateData = {
            from: this._from!,
            to: this._to!,
            value: this._value || '0',
            data: this._data || '0x',
            consensus: this._consensus || DEFAULT_CONSENSUS,
        };

        const response = await this.client
            .getProvider()
            .post<{ gasEstimate: number }>('/api/transactions/estimate-gas', estimateData);

        return response.gasEstimate;
    }

    /**
     * Build the transaction
     */
    build(): Transaction {
        this.validate();

        const txData = {
            hash: '', // Will be set after sending
            from: this._from!,
            to: this._to!,
            value: this._value || '0',
            data: this._data || '0x',
            gasLimit: this._gasLimit || CONSTANTS.DEFAULT_GAS_LIMIT,
            gasPrice: this._gasPrice || CONSTANTS.DEFAULT_GAS_PRICE,
            consensus: this._consensus || DEFAULT_CONSENSUS,
        };

        return new Transaction(txData, this.client);
    }

    /**
     * Build and send the transaction
     */
    async send(): Promise<TransactionReceipt> {
        const tx = this.build();
        return tx.send();
    }

    /**
     * Validate transaction data
     */
    private validate(): void {
        if (!this._from) {
            throw new ValidationError('Sender address (from) is required', 'from');
        }
        if (!this._to) {
            throw new ValidationError('Recipient address (to) is required', 'to');
        }
    }

    /**
     * Reset the builder
     */
    reset(): this {
        this._from = undefined;
        this._to = undefined;
        this._value = undefined;
        this._data = undefined;
        this._gasLimit = undefined;
        this._gasPrice = undefined;
        this._consensus = undefined;
        return this;
    }
}
