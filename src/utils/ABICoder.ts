import { Buffer } from 'buffer';
import { generateQuantumHash } from './crypto';

/**
 * ABICoder handles encoding and decoding of parameters for KodeChain smart contracts.
 * It uses a 32-byte padded binary format.
 */
export class ABICoder {
    /**
     * Encodes a function call with its parameters.
     * @param functionName The name of the function (e.g., 'transfer(address,uint256)')
     * @param params Array of parameters to encode
     * @returns Hex string of the encoded call
     */
    static encodeFunctionCall(functionName: string, params: any[]): string {
        const selector = this.encodeFunctionSignature(functionName);
        const encodedParams = this.encodeParameters(params);
        return '0x' + selector + encodedParams;
    }

    /**
     * Encodes a function signature to its 4-byte selector.
     * Selector is the first 4 bytes of the SpongeHash of the signature.
     */
    static encodeFunctionSignature(functionSignature: string): string {
        // Normalize signature (remove spaces)
        const normalized = functionSignature.replace(/\s/g, '');
        const hash = generateQuantumHash(normalized);
        return Buffer.from(hash.slice(0, 4)).toString('hex');
    }

    /**
     * Encodes an array of parameters into a 32-byte padded hex string.
     */
    static encodeParameters(params: any[]): string {
        let result = '';
        for (const param of params) {
            result += this.encodeParameter(param);
        }
        return result;
    }

    /**
     * Encodes a single parameter into a 32-byte padded hex string.
     */
    static encodeParameter(param: any): string {
        if (typeof param === 'number' || typeof param === 'bigint') {
            return this.encodeUint256(param);
        } else if (typeof param === 'string') {
            if (param.startsWith('0x') && (param.length === 42 || param.length === 66)) {
                return this.encodeAddress(param);
            }
            return this.encodeString(param);
        } else if (typeof param === 'boolean') {
            return this.encodeBool(param);
        } else if (Buffer.isBuffer(param) || param instanceof Uint8Array) {
            return this.encodeBytes(param);
        }
        throw new Error(`Unsupported parameter type: ${typeof param}`);
    }

    private static encodeUint256(value: number | bigint): string {
        const hex = value.toString(16).padStart(64, '0');
        return hex;
    }

    private static encodeAddress(address: string): string {
        const clean = address.startsWith('0x') ? address.slice(2) : address;
        return clean.padStart(64, '0');
    }

    private static encodeBool(value: boolean): string {
        return value ? '1'.padStart(64, '0') : '0'.padStart(64, '0');
    }

    private static encodeString(str: string): string {
        const bytes = Buffer.from(str, 'utf8');
        // For now, KodeChain ABI treats strings as fixed-length blobs or simple padded values
        // In many simple systems, it's just the bytes padded to 32 bytes or 
        // a length-prefixed structure.
        // Based on the Node Validator, it seems to prefer 32-byte chunks.
        const hex = bytes.toString('hex').padEnd(64, '0');
        return hex;
    }

    private static encodeBytes(data: Uint8Array): string {
        const hex = Buffer.from(data).toString('hex').padEnd(64, '0');
        return hex;
    }

    /**
     * Decodes a hex string representing return values.
     * @param data The hex string to decode
     * @param types Array of types to decode (e.g., ['uint256', 'address'])
     */
    static decodeParameters(data: string, types: string[]): any[] {
        const cleanData = data.startsWith('0x') ? data.slice(2) : data;
        const result: any[] = [];

        for (let i = 0; i < types.length; i++) {
            const chunk = cleanData.slice(i * 64, (i + 1) * 64);
            result.push(this.decodeParameter(chunk, types[i]));
        }

        return result;
    }

    private static decodeParameter(chunk: string, type: string): any {
        switch (type) {
            case 'uint256':
            case 'int256':
                return BigInt('0x' + chunk);
            case 'address':
                return '0x' + chunk.slice(-40); // Standard 20-byte address (40 chars)
            case 'address64':
                return '0x' + chunk.slice(-64); // ML-DSA address
            case 'bool':
                return BigInt('0x' + chunk) !== BigInt(0);
            case 'string':
                // Simple decoding: trim null bytes
                const bytes = Buffer.from(chunk, 'hex');
                return bytes.toString('utf8').replace(/\0/g, '');
            default:
                return '0x' + chunk;
        }
    }
}
