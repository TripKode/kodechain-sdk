/**
 * Example: DVM (Dual Virtual Machine) Management
 * 
 * Demonstrates:
 * 1. Listing all registered contracts on the node
 * 2. Querying contract metadata and state
 * 3. Performing read-only DVM queries
 */

import { KodeChainClient } from '../src';

async function main() {
    const client = new KodeChainClient({
        nodeUrl: 'http://34.28.74.25:8084'
    });

    try {
        await client.connect();

        // The DVM manager is accessible via client.dvm
        const dvm = client.dvm;

        console.log('--- KodeChain DVM Management ---\n');

        // 1. List all contracts (deployed via the system)
        console.log('Fetching all registered contracts...');
        const contracts = await dvm.list();

        console.log(`Found ${contracts.length} contracts.`);
        if (contracts.length > 0) {
            const sampleContract = contracts[0];
            console.log('\nSample Contract:');
            console.log('- Address:', sampleContract.address);
            console.log('- Name:', sampleContract.name);
            console.log('- Creator:', sampleContract.creator);

            // 2. Get detailed metadata
            console.log(`\nQuerying info for ${sampleContract.address}...`);
            const info = await dvm.getInfo(sampleContract.address);
            console.log('- Version:', info.version);
            console.log('- Deployed At (Block):', info.deployedAt);

            // 3. Query contract state (raw storage)
            console.log('\nFetching raw contract state...');
            const state = await dvm.getState(sampleContract.address);
            console.log('- State variables count:', Object.keys(state || {}).length);

            // 4. Perform a read-only query (call without transaction)
            console.log('\nPerforming read-only query (view call)...');
            try {
                // example query: getBalance(address)
                const result = await dvm.query(
                    sampleContract.address,
                    'balanceOf(address)',
                    '0000000000000000000000001234567890123456789012345678901234567890' // padded param
                );
                console.log('- Query Result:', result);
            } catch (e) {
                console.log('- Query failed (expected if function does not exist on this contract)');
            }
        } else {
            console.log('No contracts found on this node yet.');
        }

    } catch (error) {
        console.error('Error during DVM management:', error);
    } finally {
        client.disconnect();
    }
}

main().catch(console.error);
