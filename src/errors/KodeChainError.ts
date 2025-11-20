/**
 * Error codes for KodeChain SDK
 */

export enum ErrorCode {
    // Network errors
    NETWORK_ERROR = 'NETWORK_ERROR',
    TIMEOUT = 'TIMEOUT',
    CONNECTION_FAILED = 'CONNECTION_FAILED',

    // Transaction errors
    TRANSACTION_FAILED = 'TRANSACTION_FAILED',
    TRANSACTION_REVERTED = 'TRANSACTION_REVERTED',
    NONCE_TOO_LOW = 'NONCE_TOO_LOW',
    REPLACEMENT_UNDERPRICED = 'REPLACEMENT_UNDERPRICED',

    // Contract errors
    CONTRACT_NOT_FOUND = 'CONTRACT_NOT_FOUND',
    CONTRACT_DEPLOYMENT_FAILED = 'CONTRACT_DEPLOYMENT_FAILED',
    INVALID_BYTECODE = 'INVALID_BYTECODE',
    FUNCTION_NOT_FOUND = 'FUNCTION_NOT_FOUND',

    // Validation errors
    INVALID_ADDRESS = 'INVALID_ADDRESS',
    INVALID_AMOUNT = 'INVALID_AMOUNT',
    INVALID_PARAMETER = 'INVALID_PARAMETER',

    // Account errors
    ACCOUNT_NOT_FOUND = 'ACCOUNT_NOT_FOUND',
    INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
    ACCOUNT_BLOCKED = 'ACCOUNT_BLOCKED',

    // Gas errors
    OUT_OF_GAS = 'OUT_OF_GAS',
    GAS_ESTIMATION_FAILED = 'GAS_ESTIMATION_FAILED',
    INSUFFICIENT_GAS = 'INSUFFICIENT_GAS',

    // Permission errors
    UNAUTHORIZED = 'UNAUTHORIZED',
    PERMISSION_DENIED = 'PERMISSION_DENIED',
}

/**
 * Base error class for KodeChain SDK
 */
export class KodeChainError extends Error {
    public readonly code: ErrorCode;
    public readonly details?: any;

    constructor(message: string, code: ErrorCode, details?: any) {
        super(message);
        this.name = 'KodeChainError';
        this.code = code;
        this.details = details;

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
