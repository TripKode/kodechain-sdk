/**
 * Example: Quantum-Resistant Cryptography and Wallet Management
 * 
 * Demonstrates:
 * 1. Generating a random ML-DSA-65 wallet
 * 2. Importing a wallet from a seed
 * 3. Signing messages with post-quantum security
 * 4. Deriving addresses from quantum public keys
 */

import { KodeChainClient, Wallet } from '../src';

async function main() {
    const client = new KodeChainClient({
        nodeUrl: 'http://34.28.74.25:8084'
    });

    console.log('--- KodeChain Quantum Wallet Example ---\n');

    // 1. Create a completely new random wallet
    console.log('Generating random ML-DSA-65 wallet...');
    const wallet = Wallet.createRandom(client);

    console.log('New Wallet Created:');
    console.log('- Address:', wallet.address);
    console.log('- Public Key (hex):', wallet.getPublicKey());

    // In a real app, you'd securely save the secret key
    const privKey = wallet.getPrivateKey();
    console.log('- Private Key (hex):', privKey ? privKey.slice(0, 32) + '...' : 'N/A');

    // 2. Import from a fixed seed (useful for deterministic tests)
    const seed = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
    console.log('\nImporting wallet from seed...');
    const importedWallet = Wallet.fromSeed(seed, client);
    console.log('- Imported Address:', importedWallet.address);

    // 3. Signing a message (Quantum-Resistant)
    const message = 'Hello KodeChain! This is a quantum-secure message.';
    console.log('\nSigning message: "' + message + '"');

    // signing returns a hex signature
    const signature = await wallet.sign(message);
    console.log('- Signature (hex):', signature.slice(0, 64) + '...');
    console.log('- Signature length:', signature.length / 2, 'bytes');

    // 4. Getting Balance
    console.log('\nChecking balance for wallet...');
    try {
        await client.connect();
        const balance = await wallet.getBalance();
        console.log('- Current Balance:', balance, 'KDC');
    } catch (error) {
        console.warn('- Could not fetch balance (node might be unreachable)');
    }

    client.disconnect();
}

main().catch(console.error);
