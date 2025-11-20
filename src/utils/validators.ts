/**
 * Input validators for KodeChain SDK
 */

import BigNumber from 'bignumber.js';
import { InvalidAddressError, InvalidAmountError, ValidationError } from '../errors';

/**
 * Check if address is valid
 */
export function isValidAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Check if amount is valid
 */
export function isValidAmount(amount: string | number | BigNumber): boolean {
    try {
        const bn = new BigNumber(amount);
        return bn.isFinite() && bn.isGreaterThanOrEqualTo(0);
    } catch {
        return false;
    }
}

/**
 * Check if hex string is valid
 */
export function isValidHex(hex: string): boolean {
    return /^0x[a-fA-F0-9]*$/.test(hex);
}

/**
 * Check if bytecode is valid
 */
export function isValidBytecode(bytecode: string): boolean {
    return isValidHex(bytecode) && bytecode.length > 2;
}

/**
 * Validate address and throw if invalid
 */
export function validateAddress(address: string, _fieldName: string = 'address'): void {
    if (!isValidAddress(address)) {
        throw new InvalidAddressError(address);
    }
}

/**
 * Validate amount and throw if invalid
 */
export function validateAmount(
    amount: string | number | BigNumber,
    _fieldName: string = 'amount'
): void {
    if (!isValidAmount(amount)) {
        throw new InvalidAmountError(String(amount));
    }
}

/**
 * Validate hex string and throw if invalid
 */
export function validateHex(hex: string, fieldName: string = 'hex'): void {
    if (!isValidHex(hex)) {
        throw new ValidationError(`Invalid hex string: ${hex}`, fieldName);
    }
}

/**
 * Validate bytecode and throw if invalid
 */
export function validateBytecode(bytecode: string): void {
    if (!isValidBytecode(bytecode)) {
        throw new ValidationError(`Invalid bytecode: ${bytecode}`, 'bytecode');
    }
}

/**
 * Validate required parameter
 */
export function validateRequired(value: any, fieldName: string): void {
    if (value === undefined || value === null || value === '') {
        throw new ValidationError(`${fieldName} is required`, fieldName);
    }
}

/**
 * Validate gas limit
 */
export function validateGasLimit(gasLimit: number): void {
    if (!Number.isInteger(gasLimit) || gasLimit < 0) {
        throw new ValidationError(`Invalid gas limit: ${gasLimit}`, 'gasLimit');
    }
}

/**
 * Validate gas price
 */
export function validateGasPrice(gasPrice: number): void {
    if (!Number.isInteger(gasPrice) || gasPrice < 0) {
        throw new ValidationError(`Invalid gas price: ${gasPrice}`, 'gasPrice');
    }
}
