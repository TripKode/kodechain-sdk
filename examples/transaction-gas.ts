/**
 * Example: Transaction Building and Gas Estimation
 * 
 * Demonstrates:
 * 1. Building a transaction using TransactionBuilder
 * 2. Estimating gas costs before sending
 * 3. Handling gas prices and limits
 */

import { KodeChainClient, TransactionBuilder } from '../src';

async function main() {
    const client = new KodeChainClient({
        nodeUrl: 'http://34.28.74.25:8084',
        defaultConsensus: 'DPOS'
    });

    try {
        await client.connect();
        const txBuilder = new TransactionBuilder(client);

        const fromAddress = '0x1234567890123456789012345678901234567890';
        const toAddress = '0x0987654321098765432109876543210987654321';
        const amount = '1000000000000000000'; // 1 KDC in wei

        console.log('--- Transaction & Gas Management ---\n');

        // 1. Build a basic transfer transaction
        console.log('Building transaction...');
        const tx = txBuilder
            .from(fromAddress)
            .to(toAddress)
            .value(amount)
            .consensus('DPOS') // Explicitly set consensus
            .build();

        console.log('Transaction Object:');
        console.log('- From:', tx.from);
        console.log('- To:', tx.to);
        console.log('- Value:', tx.value, 'wei');
        console.log('- Chain:', tx.consensus);

        // 2. Estimate Gas
        console.log('\nEstimating gas for this transaction...');
        const gasInfo = await client.getGasManager().estimateGas(tx);

        console.log('Estimation Results:');
        console.log('- Estimated Gas:', gasInfo.estimatedGas);
        console.log('- Safe Gas Limit:', gasInfo.safeGasLimit);
        console.log('- Current Gas Price:', gasInfo.gasPrice, 'wei');
        console.log('- Estimated Cost:', gasInfo.estimatedCost, 'wei');

        console.log('\nBreakdown:');
        console.log('  - Base Cost:', gasInfo.breakdown.baseCost);
        console.log('  - Data Cost:', gasInfo.breakdown.dataCost);
        console.log('  - Execution Cost:', gasInfo.breakdown.executionCost);

        // 3. Update transaction with estimated gas
        tx.gasLimit = gasInfo.safeGasLimit;
        // Use parseInt because tx.gasPrice is a number in the interface
        tx.gasPrice = parseInt(gasInfo.gasPrice);

        console.log('\nTransaction is now ready to be signed and sent.');
        // const receipt = await client.sendTransaction(tx);

    } catch (error) {
        console.error('Error during transaction flow:', error);
    } finally {
        client.disconnect();
    }
}

main().catch(console.error);
