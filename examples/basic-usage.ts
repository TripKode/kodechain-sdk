/**
 * Basic usage example
 */

import { KodeChainClient } from '../src';

async function main() {
    // Create client
    const client = new KodeChainClient({
        nodeUrl: 'http://34.28.74.25:8084',
        defaultConsensus: 'DPOS',
        timeout: 30000,
    });

    try {
        // Connect to node
        console.log('Connecting to KodeChain node...');
        await client.connect();
        console.log('Connected');

        // Get node info
        const nodeInfo = await client.getNodeInfo();
        console.log('\nNode Info:');
        console.log('- Version:', nodeInfo.version);
        console.log('- Chain ID:', nodeInfo.chainId);
        console.log('- Node Type:', nodeInfo.nodeType);
        console.log('- Peers:', nodeInfo.peers);

        // Get health status
        const health = await client.getHealth();
        console.log('\nHealth Status:', health.status);
        console.log('- API:', health.checks.api ? 'OK' : 'Failed');
        console.log('- DPOS:', health.checks.dpos ? 'OK' : 'Failed');
        console.log('- PBFT:', health.checks.pbft ? 'OK' : 'Failed');
        console.log('- Database:', health.checks.database ? 'OK' : 'Failed');

        // Get block heights
        const dposHeight = await client.getBlockHeight('DPOS');
        const pbftHeight = await client.getBlockHeight('PBFT');
        console.log('\nBlock Heights:');
        console.log('- DPOS:', dposHeight);
        console.log('- PBFT:', pbftHeight);

        // Get latest blocks
        const dposBlock = await client.getLatestBlock('DPOS');
        const pbftBlock = await client.getLatestBlock('PBFT');
        console.log('\nLatest Blocks:');
        console.log('- DPOS:', dposBlock.number, '-', dposBlock.hash);
        console.log('- PBFT:', pbftBlock.number, '-', pbftBlock.hash);

        // Get balance example
        const exampleAddress = '0x1234567890123456789012345678901234567890';
        try {
            const balance = await client.getBalance(exampleAddress);
            console.log(`\nBalance for ${exampleAddress}:`, balance);
        } catch (error) {
            console.log('\nBalance query failed (expected if address does not exist)');
        }

        // Disconnect
        client.disconnect();
        console.log('\nDisconnected');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

main();
