import { ml_dsa65 } from '@noble/post-quantum/ml-dsa.js';
import { sha256 } from '@noble/hashes/sha2.js';
import { keccak_256 } from '@noble/hashes/sha3.js';
import { randomBytes } from '@noble/hashes/utils.js';
import { Buffer } from 'buffer';

/**
 * Helper to convert string to Uint8Array using UTF-8 encoding.
 */
function utf8ToBytes(str: string): Uint8Array {
    return Buffer.from(str, 'utf8');
}

/**
 * Simple sponge-style hash function
 * Ported from Node Validator's security/quantum_signer.go
 */
class SpongeHash {
    private state: Uint8Array = new Uint8Array(32);
    private pos: number = 0;

    absorb(data: Uint8Array): void {
        for (const b of data) {
            this.state[this.pos] ^= b;
            this.pos = (this.pos + 1) % 32;
            if (this.pos === 0) {
                this.permute();
            }
        }
    }

    private permute(): void {
        // In-place permutation matching Go's implementation
        for (let i = 0; i < 32; i++) {
            let b = this.state[i] ^ this.state[(i + 1) % 32] ^ this.state[(i + 7) % 32];
            // 8-bit rotation: b << 1 | b >> 7
            this.state[i] = ((b << 1) | (b >>> 7)) & 0xff;
        }
    }

    squeeze(length: number): Uint8Array {
        const result = new Uint8Array(length);
        for (let i = 0; i < length; i++) {
            if (this.pos === 0) {
                this.permute();
            }
            result[i] = this.state[this.pos];
            this.pos = (this.pos + 1) % 32;
        }
        return result;
    }
}

/**
 * Generates a quantum-resistant hash using the custom SpongeHash
 * Matches the Node Validator's implementation
 */
export function generateQuantumHash(data: string | Uint8Array): Uint8Array {
    let bytes: Uint8Array;
    if (typeof data === 'string') {
        if (data.startsWith('0x')) {
            bytes = Buffer.from(data.slice(2), 'hex');
        } else {
            bytes = utf8ToBytes(data);
        }
    } else {
        bytes = data;
    }
    const sponge = new SpongeHash();
    sponge.absorb(bytes);
    return sponge.squeeze(32);
}

/**
 * Generate a quantum hash in hex format
 */
export function generateQuantumHashHex(data: string | Uint8Array): string {
    return '0x' + Buffer.from(generateQuantumHash(data)).toString('hex');
}

/**
 * Keccak-256 hash
 */
export function keccak256(data: string | Uint8Array): string {
    const bytes = typeof data === 'string'
        ? Buffer.from(data.startsWith('0x') ? data.slice(2) : data, 'hex')
        : data;
    return '0x' + Buffer.from(keccak_256(bytes)).toString('hex');
}

/**
 * Encode function signature (first 4 bytes of SHA256 per Node Validator specs)
 */
export function encodeFunctionSignature(signature: string): string {
    const hash = sha256(Buffer.from(signature));
    return '0x' + Buffer.from(hash.slice(0, 4)).toString('hex');
}

/**
 * Generate random hex string
 */
export function randomHex(length: number): string {
    const bytes = randomBytes(length);
    return '0x' + Buffer.from(bytes).toString('hex');
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

/**
 * ML-DSA-65 specific utilities
 */
export const crypto = {
    ml_dsa65,
    randomBytes,
};
