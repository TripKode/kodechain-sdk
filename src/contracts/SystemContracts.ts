/**
 * System contracts helpers
 */

import { KodeChainClient } from '../core';
import { Contract } from './Contract';
import { CONSTANTS } from '../utils';

/**
 * Get staking contract instance
 */
export function getStakingContract(client: KodeChainClient): Contract {
    return new Contract(CONSTANTS.STAKING_CONTRACT, client);
}

/**
 * Get validator contract instance
 */
export function getValidatorContract(client: KodeChainClient): Contract {
    return new Contract(CONSTANTS.VALIDATOR_CONTRACT, client);
}

/**
 * Get rewards contract instance
 */
export function getRewardsContract(client: KodeChainClient): Contract {
    return new Contract(CONSTANTS.REWARDS_CONTRACT, client);
}
