/**
 * Contract deployment and interaction example
 */

import { KodeChainClient, ContractFactory, ABI } from '../src';

// Example ERC20 ABI (simplified)
const ERC20_ABI: ABI = [
    {
        type: 'function',
        name: 'totalSupply',
        inputs: [],
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'balanceOf',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'transfer',
        inputs: [
            { name: 'recipient', type: 'address' },
            { name: 'amount', type: 'uint256' },
        ],
        outputs: [{ name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
    },
    {
        type: 'event',
        name: 'Transfer',
        inputs: [
            { name: 'from', type: 'address', indexed: true },
            { name: 'to', type: 'address', indexed: true },
            { name: 'value', type: 'uint256', indexed: false },
        ],
    },
];

async function main() {
    const client = new KodeChainClient({
        nodeUrl: 'http://34.28.74.25:8084',
    });

    await client.connect();

    const factory = new ContractFactory(client);

    // Example bytecode (placeholder)
    const bytecode = '0x608060405234801561001057600080fd5b50...';
    const creatorAddress = '0x1234567890123456789012345678901234567890';

    try {
        console.log('Deploying contract...');

        // Deploy contract
        const contract = await factory.deploy({
            bytecode,
            abi: ERC20_ABI,
            creator: creatorAddress,
            name: 'MyToken',
            version: '1.0.0',
            gasLimit: 8000000,
        });

        console.log('Contract deployed at:', contract.address);

        // Get contract info
        const info = await contract.getInfo();
        console.log('\nContract Info:');
        console.log('- Name:', info.name);
        console.log('- Creator:', info.creator);
        console.log('- Deployed at:', new Date(info.deployedAt * 1000).toISOString());

        // Call view function
        console.log('\nCalling view function...');
        const totalSupply = await contract.view('totalSupply');
        console.log('Total Supply:', totalSupply);

        const balance = await contract.view('balanceOf', [creatorAddress]);
        console.log('Creator Balance:', balance);

        // Subscribe to events
        console.log('\nSubscribing to Transfer events...');
        contract.on('Transfer', (event) => {
            console.log('Transfer Event:');
            console.log('- From:', event.args[0]);
            console.log('- To:', event.args[1]);
            console.log('- Amount:', event.args[2]);
            console.log('- Block:', event.blockNumber);
            console.log('- Tx Hash:', event.transactionHash);
        });

        // Call function (modifies state)
        const recipientAddress = '0x9876543210987654321098765432109876543210';
        console.log('\nCalling transfer function...');

        const receipt = await contract.call(
            'transfer',
            [recipientAddress, '1000000000000000000'],
            {
                caller: creatorAddress,
                gasLimit: 100000,
            }
        );

        console.log('Transfer successful');
        console.log('- Tx Hash:', receipt.transactionHash);
        console.log('- Block:', receipt.blockNumber);
        console.log('- Gas Used:', receipt.gasUsed);

        // Verify new balance
        const newBalance = await contract.view('balanceOf', [recipientAddress]);
        console.log('\nRecipient Balance:', newBalance);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        client.disconnect();
    }
}

main();
