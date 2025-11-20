/**
 * Contract-related errors
 */

import { KodeChainError, ErrorCode } from './KodeChainError';

export class ContractError extends KodeChainError {
    public readonly contractAddress?: string;

    constructor(message: string, details?: any, contractAddress?: string) {
        super(message, ErrorCode.CONTRACT_NOT_FOUND, details);
        this.name = 'ContractError';
        this.contractAddress = contractAddress;
    }
}

export class ContractDeploymentError extends KodeChainError {
    constructor(message: string, details?: any) {
        super(message, ErrorCode.CONTRACT_DEPLOYMENT_FAILED, details);
        this.name = 'ContractDeploymentError';
    }
}

export class InvalidBytecodeError extends KodeChainError {
    constructor(message: string = 'Invalid contract bytecode', details?: any) {
        super(message, ErrorCode.INVALID_BYTECODE, details);
        this.name = 'InvalidBytecodeError';
    }
}

export class FunctionNotFoundError extends KodeChainError {
    public readonly functionName: string;

    constructor(functionName: string, contractAddress?: string) {
        super(
            `Function '${functionName}' not found in contract${contractAddress ? ` at ${contractAddress}` : ''}`,
            ErrorCode.FUNCTION_NOT_FOUND,
            { functionName, contractAddress }
        );
        this.name = 'FunctionNotFoundError';
        this.functionName = functionName;
    }
}
