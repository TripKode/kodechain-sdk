/**
 * Cryptographic utilities for KodeChain SDK
 */

/**
 * Hash data using SHA-256 (placeholder for actual implementation)
 * In production, use a proper crypto library
 */
export function sha256(data: string): string {
    // This is a placeholder. In production, use:
    // - crypto.createHash('sha256') in Node.js
    // - SubtleCrypto in browsers
    // - or a library like crypto-js
    return '0x' + Buffer.from(data).toString('hex');
}

/**
 * Keccak-256 hash (placeholder for actual implementation)
 */
export function keccak256(data: string): string {
    // This is a placeholder. In production, use:
    // - keccak256 from ethers.js or web3.js
    return '0x' + Buffer.from(data).toString('hex');
}

/**
 * Encode function signature
 */
export function encodeFunctionSignature(signature: string): string {
    const hash = keccak256(signature);
    return hash.slice(0, 10); // First 4 bytes
}

/**
 * Generate random hex string
 */
export function randomHex(length: number): string {
    const bytes = new Uint8Array(length);
    if (typeof window !== 'undefined' && window.crypto) {
        window.crypto.getRandomValues(bytes);
    } else {
        // Node.js
        const crypto = require('crypto');
        crypto.randomFillSync(bytes);
    }
    return '0x' + Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Convert string to hex
 */
export function stringToHex(str: string): string {
    return '0x' + Buffer.from(str, 'utf8').toString('hex');
}

/**
 * Convert hex to string
 */
export function hexToString(hex: string): string {
    const stripped = hex.startsWith('0x') ? hex.slice(2) : hex;
    return Buffer.from(stripped, 'hex').toString('utf8');
}
