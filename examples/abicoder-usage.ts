/**
 * Example: ABICoder for Manual Encoding/Decoding
 * 
 * Demonstrates:
 * 1. Native 32-byte padded binary encoding for contract parameters
 * 2. Generating function selectors (signatures)
 * 3. Decoding return values from contract calls
 */

import { ABICoder } from '../src';

async function main() {
    console.log('--- ABICoder Manual Usage ---\n');

    // 1. Encode simple parameters
    // KodeChain uses a 32-byte padded binary format.
    console.log('Encoding parameters (uint256, address, bool)...');

    // Using static methods directly
    const encodedUint = ABICoder.encodeParameter(123456789n);
    const encodedAddr = ABICoder.encodeParameter('0x1234567890123456789012345678901234567890');
    const encodedBool = ABICoder.encodeParameter(true);

    console.log('- Encoded Uint (32 bytes):', encodedUint);
    console.log('- Encoded Address (32 bytes):', encodedAddr);
    console.log('- Encoded Bool (32 bytes):', encodedBool);

    // 2. Generate function selector
    // KodeChain uses a 4-byte selector from SpongeHash
    const functionName = 'transfer(address,uint256)';
    const selector = ABICoder.encodeFunctionSignature(functionName);
    console.log(`\nFunction selector for "${functionName}":`, selector);

    // 3. Batch encoding for a full call
    console.log('\nCreating full transaction data for a call...');
    const params = [
        '0x9876543210987654321098765432109876543210',
        1000000n
    ];

    // Concatenate selector + encoded params
    const callData = selector + ABICoder.encodeParameters(params);
    console.log('Full Call Data:', callData);

    // 4. Decoding
    const mockReturnValue = encodedUint; // Assume node returned our 32-byte uint
    console.log('\nDecoding received data...');
    const decodedValue = ABICoder.decodeParameters(mockReturnValue, ['uint256']);
    console.log('- Decoded Result:', decodedValue[0].toString());
}

main().catch(console.error);
