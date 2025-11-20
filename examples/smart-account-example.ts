/**
 * Smart Account management example
 */

import { KodeChainClient, SmartAccountManager } from '../src';

async function main() {
    const client = new KodeChainClient({
        nodeUrl: 'http://34.28.74.25:8084',
    });

    await client.connect();

    const accountManager = new SmartAccountManager(client);
    const userAddress = '0xABCDEF1234567890ABCDEF1234567890ABCDEF12';
    const validatorAddress = '0x1111111111111111111111111111111111111111';

    try {
        console.log('Creating Smart Account...');
        const account = await accountManager.create(userAddress);
        console.log('Smart Account created:', account.address);

        // DPOS Operations
        console.log('\n=== DPOS Operations ===');

        const dposState = await account.getDPOSState();
        console.log('DPOS State:');
        console.log('- Staked Amount:', dposState.stakedAmount);
        console.log('- Delegated Amount:', dposState.delegatedAmount);
        console.log('- Is Validator:', dposState.isValidator);
        console.log('- Transaction Count:', dposState.transactionCount);

        // Delegate to validator
        console.log('\nDelegating to validator...');
        const delegateReceipt = await account.delegate(
            validatorAddress,
            '10000000000000000000' // 10 KDC
        );
        console.log('Delegation successful');
        console.log('- Tx Hash:', delegateReceipt.transactionHash);

        // Get updated state
        const updatedDposState = await account.getDPOSState();
        console.log('\nUpdated Delegated Amount:', updatedDposState.delegatedAmount);

        // PBFT Operations
        console.log('\n=== PBFT Operations ===');

        const pbftState = await account.getPBFTState();
        console.log('PBFT State:');
        console.log('- Record Count:', pbftState.recordCount);
        console.log('- Is Blocked:', pbftState.isBlocked);

        // Register critical record
        console.log('\nRegistering critical record...');
        const recordReceipt = await account.registerCriticalRecord({
            type: 'MEDICAL_RECORD',
            data: {
                patientId: 'P123',
                diagnosis: 'Encrypted medical data...',
                timestamp: Date.now(),
            },
        });
        console.log('Record registered');
        console.log('- Tx Hash:', recordReceipt.transactionHash);

        // Get billing info
        const billing = await account.getMonthlyBilling();
        console.log('\nMonthly Billing:');
        console.log('- Usage Count:', billing.usageCount);
        console.log('- Total Cost:', billing.totalCost);
        console.log('- Outstanding Debt:', billing.outstandingDebt);

        // Cross-Chain Operations
        console.log('\n=== Cross-Chain Operations ===');

        const interopSettings = await account.getInteropSettings();
        console.log('Interop Settings:');
        console.log('- Cross-Chain Enabled:', interopSettings.crossChainEnabled);
        console.log('- Max Transfer Amount:', interopSettings.maxTransferAmount);

        if (!interopSettings.crossChainEnabled) {
            console.log('\nEnabling cross-chain transfers...');
            await account.enableCrossChain();
            console.log('Cross-chain enabled');
        }

        // Transfer between chains
        console.log('\nTransferring from DPOS to PBFT...');
        const transferReceipt = await account.transferCrossChain(
            '5000000000000000000', // 5 KDC
            'DPOS',
            'PBFT'
        );
        console.log('Cross-chain transfer successful');
        console.log('- Tx Hash:', transferReceipt.transactionHash);

        // Check balances
        console.log('\n=== Balances ===');
        const dposBalance = await account.getBalance('DPOS');
        const pbftBalance = await account.getBalance('PBFT');
        const totalBalance = await account.getTotalBalance();

        console.log('DPOS Balance:', dposBalance);
        console.log('PBFT Balance:', pbftBalance);
        console.log('Total Balance:', totalBalance);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        client.disconnect();
    }
}

main();
