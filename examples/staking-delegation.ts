/**
 * Example: Staking and Validator Delegation
 * 
 * Demonstrates:
 * 1. Querying the list of active validators
 * 2. Getting detailed validator stats
 * 3. Managing delegations to validators
 */

import { KodeChainClient, ValidatorManager, DelegationManager } from '../src';

async function main() {
    const client = new KodeChainClient({
        nodeUrl: 'http://34.28.74.25:8084'
    });

    try {
        await client.connect();

        const validatorManager = new ValidatorManager(client);
        const delegationManager = new DelegationManager(client);

        console.log('--- KodeChain Staking & Delegation ---\n');

        // 1. List active validators
        console.log('Fetching active validators...');
        const validators = await validatorManager.list();

        console.log(`Found ${validators.length} active validators:`);
        validators.forEach(v => {
            console.log(`- ${v.address} | DPOS/PBFT: ${v.consensusType} | Active: ${v.isActive}`);
        });

        if (validators.length > 0) {
            const targetAddress = validators[0].address;

            // 2. Get specific validator details
            console.log(`\nFetching details for validator ${targetAddress}...`);
            const details = await validatorManager.get(targetAddress);
            console.log('Validator Details:');
            console.log('- Total Stake:', details.stakedAmount);
            console.log('- Total Delegated:', details.totalDelegated);
            console.log('- Commission Earned:', details.commission);
            console.log('- Uptime:', details.uptime);

            // 3. Delegate to this validator
            // Note: This requires the client to have an authenticated signer/wallet
            console.log(`\nBuilding delegation request for 50 KDC...`);
            // await delegationManager.delegatePassive('0xYOUR_ADDRESS', targetAddress, '50000000000000000000');
            console.log('(Execution skipped: requires private key)');
        }

        // 4. Get general delegation stats
        const stats = await delegationManager.getStakingStats();
        console.log('\nNetwork Staking Stats:');
        console.log('- Total Delegated Stake:', stats.totalDelegatedStake, 'KDC');
        console.log('- Total Delegations:', stats.totalDelegations);

    } catch (error) {
        console.error('Error fetching staking data:', error);
    } finally {
        client.disconnect();
    }
}

main().catch(console.error);
