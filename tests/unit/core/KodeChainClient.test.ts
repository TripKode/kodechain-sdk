import { KodeChainClient } from '../../../src/core/KodeChainClient';
import { Provider } from '../../../src/core/Provider';
import { Signer } from '../../../src/core/Signer';
import { GasManager } from '../../../src/gas/GasManager';

// Mock dependencies
jest.mock('../../../src/core/Provider');
jest.mock('../../../src/core/Signer');
jest.mock('../../../src/gas/GasManager');

describe('KodeChainClient', () => {
    let client: KodeChainClient;
    let mockProvider: jest.Mocked<Provider>;

    const config = {
        nodeUrl: 'http://localhost:8545',
        defaultConsensus: 'DPOS' as const
    };

    beforeEach(() => {
        // Clear all mocks
        jest.clearAllMocks();

        client = new KodeChainClient(config);
        // Get the mocked provider instance
        mockProvider = (Provider as jest.Mock).mock.instances[0] as any;
    });

    describe('constructor', () => {
        it('should initialize with correct config', () => {
            expect(Provider).toHaveBeenCalledWith(expect.objectContaining({
                baseURL: config.nodeUrl
            }));
            expect(Signer).toHaveBeenCalled();
            expect(GasManager).toHaveBeenCalled();
        });
    });

    describe('connect', () => {
        it('should set connected status on successful health check', async () => {
            mockProvider.get.mockResolvedValue({ status: 'ok' });

            await client.connect();
            expect(client.isConnected()).toBe(true);
        });

        it('should throw and set disconnected on failure', async () => {
            mockProvider.get.mockRejectedValue(new Error('Network error'));

            await expect(client.connect()).rejects.toThrow('Network error');
            expect(client.isConnected()).toBe(false);
        });
    });

    describe('getNodeInfo', () => {
        it('should fetch node info', async () => {
            const mockInfo = { node_id: 'node1', node_type: 'validator' };
            mockProvider.get.mockResolvedValue({ status: mockInfo });

            const result = await client.getNodeInfo();
            expect(result).toEqual(mockInfo);
            expect(mockProvider.get).toHaveBeenCalledWith('/api/node/status');
        });
    });

    describe('getHealth', () => {
        it('should fetch health status', async () => {
            const mockHealth = { status: 'healthy', timestamp: '2024-01-01' };
            mockProvider.get.mockResolvedValue({ health: mockHealth });

            const result = await client.getHealth();
            expect(result).toEqual(mockHealth);
            expect(mockProvider.get).toHaveBeenCalledWith('/api/node/health');
        });
    });

    describe('getBalance', () => {
        it('should fetch balance for address', async () => {
            const address = '0x123';
            const mockAccount = {
                balances: {
                    'KDC': { amount: '1000' }
                }
            };
            mockProvider.get.mockResolvedValue({ account: mockAccount });

            const result = await client.getBalance(address);
            expect(result).toEqual('1000');
            expect(mockProvider.get).toHaveBeenCalledWith(
                `/api/smart-accounts/${address}`
            );
        });
    });

    describe('getGasManager', () => {
        it('should return gas manager instance', () => {
            const gasManager = client.getGasManager();
            expect(gasManager).toBeInstanceOf(GasManager);
        });
    });
});
