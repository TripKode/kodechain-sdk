/**
 * Auth Manager for KodeChain Apps
 */

import { KodeChainClient } from './KodeChainClient';
import { Wallet } from '../accounts/Wallet';

export class AuthManager {
    private client: KodeChainClient;
    private currentWallet?: Wallet;

    constructor(client: KodeChainClient) {
        this.client = client;
    }

    /**
     * Authenticate using a private key
     */
    async login(privateKey: string): Promise<Wallet> {
        const wallet = Wallet.fromPrivateKey(privateKey, this.client);

        // Verification step: Check if account exists or heart-beat
        try {
            await this.client.getProvider().get(`/api/smart-accounts/${wallet.address}`);
            this.currentWallet = wallet;
            return wallet;
        } catch (error) {
            throw new Error(`Authentication failed: Account ${wallet.address} not found or node unreachable.`);
        }
    }

    /**
     * Create a new session with a random key (Signup)
     */
    async signup(): Promise<Wallet> {
        const wallet = Wallet.createRandom(this.client);
        // Usually, in blockchain, signup means creating the account on-chain
        // For KodeChain, we might need to register the public key
        this.currentWallet = wallet;
        return wallet;
    }

    /**
     * Logout and clear session
     */
    logout(): void {
        this.currentWallet = undefined;
    }

    /**
     * Check if authenticated
     */
    isAuthenticated(): boolean {
        return this.currentWallet !== undefined;
    }

    /**
     * Get the active wallet for the session
     */
    getWallet(): Wallet {
        if (!this.currentWallet) {
            throw new Error('No active session. Please login first.');
        }
        return this.currentWallet;
    }

    /**
     * Sign a challenge for server-side authentication (AuthN)
     */
    async signChallenge(challenge: string): Promise<{ signature: string; publicKey: string; address: string }> {
        const wallet = this.getWallet();
        const signature = await wallet.sign(challenge);

        return {
            signature,
            publicKey: wallet.getPublicKey() || '',
            address: wallet.address
        };
    }
}
