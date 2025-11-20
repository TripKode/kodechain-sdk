/**
 * Transaction receipt utilities
 */

import { TransactionReceipt } from '../types';

/**
 * Check if transaction was successful
 */
export function isTransactionSuccessful(receipt: TransactionReceipt): boolean {
    return receipt.success === true;
}

/**
 * Get contract address from deployment receipt
 */
export function getContractAddress(receipt: TransactionReceipt): string | undefined {
    return receipt.contractAddress;
}

/**
 * Get total gas cost
 */
export function getGasCost(receipt: TransactionReceipt): number {
    return receipt.gasUsed;
}

/**
 * Extract events from receipt logs
 */
export function extractEvents(receipt: TransactionReceipt, _eventName?: string): any[] {
    if (!receipt.logs) {
        return [];
    }

    if (_eventName) {
        // Filter by event name (simplified - in production, decode properly)
        return receipt.logs.filter((_log) => {
            // This is a placeholder - proper implementation would decode topics
            return true;
        });
    }

    return receipt.logs;
}
