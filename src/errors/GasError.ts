/**
 * Gas-related errors
 */

import { KodeChainError, ErrorCode } from './KodeChainError';

export class GasEstimationError extends KodeChainError {
    constructor(message: string, details?: any) {
        super(message, ErrorCode.GAS_ESTIMATION_FAILED, details);
        this.name = 'GasEstimationError';
    }
}

export class OutOfGasError extends KodeChainError {
    constructor(message: string = 'Transaction ran out of gas', details?: any) {
        super(message, ErrorCode.OUT_OF_GAS, details);
        this.name = 'OutOfGasError';
    }
}

export class InsufficientGasError extends KodeChainError {
    constructor(message: string, details?: any) {
        super(message, ErrorCode.INSUFFICIENT_GAS, details);
        this.name = 'InsufficientGasError';
    }
}
