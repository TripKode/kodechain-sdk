/**
 * Data formatters for KodeChain SDK
 */

import BigNumber from 'bignumber.js';
import { CONSTANTS } from './constants';

/**
 * Format wei to KDC
 */
export function formatKDC(wei: string | number | BigNumber): string {
    return new BigNumber(wei).dividedBy(CONSTANTS.WEI_PER_KDC).toString();
}

/**
 * Parse KDC to wei
 */
export function parseKDC(kdc: string | number | BigNumber): string {
    return new BigNumber(kdc).multipliedBy(CONSTANTS.WEI_PER_KDC).toString();
}

/**
 * Shorten address for display
 */
export function shortenAddress(address: string, chars: number = 4): string {
    if (!address || address.length < chars * 2 + 2) {
        return address;
    }
    return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Format block number
 */
export function formatBlockNumber(blockNumber: number): string {
    return blockNumber.toLocaleString();
}

/**
 * Format timestamp to ISO string
 */
export function formatTimestamp(timestamp: number): string {
    return new Date(timestamp * 1000).toISOString();
}

/**
 * Format gas amount
 */
export function formatGas(gas: number): string {
    return gas.toLocaleString();
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 2): string {
    return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Pad hex string to specific length
 */
export function padHex(hex: string, length: number): string {
    const stripped = hex.startsWith('0x') ? hex.slice(2) : hex;
    return '0x' + stripped.padStart(length, '0');
}

/**
 * Remove 0x prefix from hex string
 */
export function stripHexPrefix(hex: string): string {
    return hex.startsWith('0x') ? hex.slice(2) : hex;
}

/**
 * Add 0x prefix to hex string
 */
export function addHexPrefix(hex: string): string {
    return hex.startsWith('0x') ? hex : `0x${hex}`;
}
