import { ABICoder } from '../../../src/utils/ABICoder';

describe('ABICoder', () => {
    describe('encodeFunctionSignature', () => {
        it('should generate correct selector prefix', () => {
            const signature = 'transfer(address,uint256)';
            const selector = ABICoder.encodeFunctionSignature(signature);
            expect(selector).toHaveLength(8); // 4 bytes = 8 hex chars
        });

        it('should normalize signatures by removing spaces', () => {
            const sig1 = 'transfer(address, uint256)';
            const sig2 = 'transfer(address,uint256)';
            expect(ABICoder.encodeFunctionSignature(sig1))
                .toBe(ABICoder.encodeFunctionSignature(sig2));
        });
    });

    describe('encodeParameters', () => {
        it('should encode uint256 with 32-byte padding', () => {
            const encoded = ABICoder.encodeParameter(123n);
            expect(encoded).toBe('0'.repeat(61) + '07b');
            expect(encoded).toHaveLength(64);
        });

        it('should encode address with 32-byte padding', () => {
            const address = '0x1234567890123456789012345678901234567890';
            const encoded = ABICoder.encodeParameter(address);
            expect(encoded).toBe('0'.repeat(24) + address.slice(2));
            expect(encoded).toHaveLength(64);
        });

        it('should encode boolean', () => {
            expect(ABICoder.encodeParameter(true)).toBe('0'.repeat(63) + '1');
            expect(ABICoder.encodeParameter(false)).toBe('0'.repeat(64));
        });

        it('should encode strings as padded bytes', () => {
            const str = 'abc';
            const encoded = ABICoder.encodeParameter(str);
            expect(encoded).toMatch(/^616263/); // 'abc' in hex
            expect(encoded).toHaveLength(64);
        });
    });

    describe('decodeParameters', () => {
        it('should decode uint256', () => {
            const chunk = '0'.repeat(61) + '07b';
            const decoded = ABICoder.decodeParameters(chunk, ['uint256']);
            expect(decoded[0]).toBe(123n);
        });

        it('should decode address', () => {
            const address = '1234567890123456789012345678901234567890';
            const chunk = '0'.repeat(24) + address;
            const decoded = ABICoder.decodeParameters(chunk, ['address']);
            expect(decoded[0]).toBe('0x' + address);
        });
    });
});
