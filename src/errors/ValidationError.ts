/**
 * Validation-related errors
 */

import { KodeChainError, ErrorCode } from './KodeChainError';

export class ValidationError extends KodeChainError {
    public readonly field?: string;

    constructor(message: string, field?: string, details?: any) {
        super(message, ErrorCode.INVALID_PARAMETER, details);
        this.name = 'ValidationError';
        this.field = field;
    }
}

export class InvalidAddressError extends ValidationError {
    constructor(address: string) {
        super(`Invalid address format: ${address}`, 'address', { address });
        this.name = 'InvalidAddressError';
    }
}

export class InvalidAmountError extends ValidationError {
    constructor(amount: string) {
        super(`Invalid amount: ${amount}`, 'amount', { amount });
        this.name = 'InvalidAmountError';
    }
}
