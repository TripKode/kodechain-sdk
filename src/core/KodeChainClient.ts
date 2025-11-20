import { Provider } from './Provider';
import { Signer } from './Signer';
import { GasManager } from '../gas';
import {
    ClientConfig,
    NodeInfo,
    HealthStatus,
    Block,
    ConsensusType,
} from '../types';
import { CONSTANTS, DEFAULT_CONSENSUS, validateRequired } from '../utils';

export class KodeChainClient {
    private provider: Provider;
    private signer: Signer;
    public gas: GasManager;
    private config: ClientConfig;
    private connected: boolean = false;

    constructor(config: ClientConfig) {
        validateRequired(config.nodeUrl, 'nodeUrl');

        this.config = {
            defaultConsensus: DEFAULT_CONSENSUS,
            timeout: CONSTANTS.DEFAULT_TIMEOUT,
            retries: CONSTANTS.DEFAULT_RETRIES,
            ...config,
        };

        this.provider = new Provider({
            baseURL: this.config.nodeUrl,
            timeout: this.config.timeout,
            retries: this.config.retries,
            headers: this.config.headers,
        });

        this.signer = new Signer();
        this.gas = new GasManager(this);
    }

    /**
     * Connect to the node
     */
    async connect(): Promise<void> {
        try {
            await this.getHealth();
            this.connected = true;
        } catch (error) {
            this.connected = false;
            throw error;
        }
    }

    /**
     * Disconnect from the node
     */
    disconnect(): void {
        this.connected = false;
    }

    /**
     * Check if connected
     */
    isConnected(): boolean {
        return this.connected;
    }

    /**
     * Get node information
     */
    async getNodeInfo(): Promise<NodeInfo> {
        return this.provider.get<NodeInfo>('/api/node/info');
    }

    /**
     * Get node health status
     */
    async getHealth(): Promise<HealthStatus> {
        return this.provider.get<HealthStatus>('/api/health');
    }

    /**
     * Get block height for a specific chain
     */
    async getBlockHeight(chain?: ConsensusType): Promise<number> {
        const consensus = chain || this.config.defaultConsensus!;
        const response = await this.provider.get<{ height: number }>(
            `/api/blockchain/${consensus.toLowerCase()}/height`
        );
        return response.height;
    }

    /**
     * Get block by height
     */
    async getBlock(height: number, chain?: ConsensusType): Promise<Block> {
        const consensus = chain || this.config.defaultConsensus!;
        return this.provider.get<Block>(
            `/api/blockchain/${consensus.toLowerCase()}/blocks/${height}`
        );
    }

    /**
     * Get latest block
     */
    async getLatestBlock(chain?: ConsensusType): Promise<Block> {
        const consensus = chain || this.config.defaultConsensus!;
        return this.provider.get<Block>(
            `/api/blockchain/${consensus.toLowerCase()}/blocks/latest`
        );
    }

    /**
     * Get balance for an address
     */
    async getBalance(address: string, chain?: ConsensusType): Promise<string> {
        const consensus = chain || this.config.defaultConsensus;
        const response = await this.provider.get<{ balance: string }>(
            `/api/accounts/${address}/balance`,
            { params: { chain: consensus } }
        );
        return response.balance;
    }

    /**
     * Get the provider instance
     */
    getProvider(): Provider {
        return this.provider;
    }

    /**
     * Get the signer instance
     */
    getSigner(): Signer {
        return this.signer;
    }

    /**
     * Get the gas manager instance
     */
    getGasManager(): GasManager {
        return this.gas;
    }

    /**
     * Get the client configuration
     */
    getConfig(): ClientConfig {
        return { ...this.config };
    }
}
