/**
 * Transaction-related errors
 */

import { KodeChainError, ErrorCode } from './KodeChainError';

export class TransactionError extends KodeChainError {
    public readonly transactionHash?: string;

    constructor(message: string, details?: any, transactionHash?: string) {
        super(message, ErrorCode.TRANSACTION_FAILED, details);
        this.name = 'TransactionError';
        this.transactionHash = transactionHash;
    }
}

export class TransactionRevertedError extends KodeChainError {
    public readonly transactionHash?: string;

    constructor(message: string, details?: any, transactionHash?: string) {
        super(message, ErrorCode.TRANSACTION_REVERTED, details);
        this.name = 'TransactionRevertedError';
        this.transactionHash = transactionHash;
    }
}

export class InsufficientFundsError extends KodeChainError {
    public readonly required: string;
    public readonly available: string;

    constructor(required: string, available: string) {
        super(
            `Insufficient funds: required ${required}, available ${available}`,
            ErrorCode.INSUFFICIENT_BALANCE,
            { required, available }
        );
        this.name = 'InsufficientFundsError';
        this.required = required;
        this.available = available;
    }
}
