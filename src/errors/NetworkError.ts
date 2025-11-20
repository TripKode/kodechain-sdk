/**
 * Network-related errors
 */

import { KodeChainError, ErrorCode } from './KodeChainError';

export class NetworkError extends KodeChainError {
    constructor(message: string, details?: any) {
        super(message, ErrorCode.NETWORK_ERROR, details);
        this.name = 'NetworkError';
    }
}

export class TimeoutError extends KodeChainError {
    constructor(message: string = 'Request timeout', details?: any) {
        super(message, ErrorCode.TIMEOUT, details);
        this.name = 'TimeoutError';
    }
}

export class ConnectionError extends KodeChainError {
    constructor(message: string = 'Connection failed', details?: any) {
        super(message, ErrorCode.CONNECTION_FAILED, details);
        this.name = 'ConnectionError';
    }
}
