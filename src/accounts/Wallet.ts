import { KodeChainClient } from '../core';
import { validateAddress, generateQuantumHashHex, crypto } from '../utils';
import { Buffer } from 'buffer';

export class Wallet {
    private client: KodeChainClient;
    public readonly address: string;
    private secretKey?: Uint8Array;
    private publicKey: Uint8Array;

    constructor(address: string, client: KodeChainClient, publicKey: Uint8Array, secretKey?: Uint8Array) {
        validateAddress(address);
        this.address = address;
        this.client = client;
        this.secretKey = secretKey;
        this.publicKey = publicKey;
    }

    /**
     * Create a new random wallet
     */
    static createRandom(client: KodeChainClient): Wallet {
        const seed = crypto.randomBytes(32);
        const { publicKey, secretKey } = crypto.ml_dsa65.keygen(seed);
        const address = generateQuantumHashHex(publicKey);

        return new Wallet(address, client, publicKey, secretKey);
    }

    /**
     * Import a wallet from a private seed (32 bytes)
     */
    static fromSeed(seed: string | Uint8Array, client: KodeChainClient): Wallet {
        const seedBytes = typeof seed === 'string'
            ? Buffer.from(seed.startsWith('0x') ? seed.slice(2) : seed, 'hex')
            : seed;

        if (seedBytes.length !== 32) {
            throw new Error('ML-DSA-65 seed must be 32 bytes.');
        }

        const { publicKey, secretKey } = crypto.ml_dsa65.keygen(seedBytes);
        const address = generateQuantumHashHex(publicKey);

        return new Wallet(address, client, publicKey, secretKey);
    }

    /**
     * Compatibility helper: derived from private key (seed)
     */
    static fromPrivateKey(privateKey: string, client: KodeChainClient): Wallet {
        return this.fromSeed(privateKey, client);
    }

    /**
     * Sign data with the ML-DSA-65 secret key
     */
    async sign(data: string | Uint8Array): Promise<string> {
        if (!this.secretKey) {
            throw new Error('Wallet not initialized with a secret key. Cannot sign.');
        }

        const bytes = typeof data === 'string' ? Buffer.from(data) : data;
        const signature = crypto.ml_dsa65.sign(bytes, this.secretKey);

        return '0x' + Buffer.from(signature).toString('hex');
    }

    /**
     * Get wallet balance
     */
    async getBalance(chain?: 'DPOS' | 'PBFT'): Promise<string> {
        return this.client.getBalance(this.address, chain);
    }

    /**
     * Get the secret key in hex
     */
    getPrivateKey(): string | undefined {
        return this.secretKey ? '0x' + Buffer.from(this.secretKey).toString('hex') : undefined;
    }

    /**
     * Get public key in hex
     */
    getPublicKey(): string {
        return '0x' + Buffer.from(this.publicKey).toString('hex');
    }

    /**
     * Send transaction
     */
    async sendTransaction(to: string, amount: string, chain?: 'DPOS' | 'PBFT'): Promise<any> {
        validateAddress(to);

        const tx = {
            from: this.address,
            to,
            value: amount,
            consensus: chain || 'DPOS',
            timestamp: Date.now(),
        };

        const signature = await this.sign(JSON.stringify(tx));

        return this.client.getProvider().post('/api/transactions/send', {
            ...tx,
            signature,
            pubKey: this.getPublicKey(),
        });
    }
}
