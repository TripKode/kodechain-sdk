import { KodeChainClient } from '../../src/core/KodeChainClient';
import { Provider } from '../../src/core/Provider';
import { TransactionBuilder } from '../../src/transactions/TransactionBuilder';

// Mock Provider to simulate network calls
jest.mock('../../src/core/Provider');

describe('Full Flow Integration', () => {
    let client: KodeChainClient;
    let mockProvider: jest.Mocked<Provider>;

    beforeEach(() => {
        jest.clearAllMocks();

        // Setup client with mocked provider
        client = new KodeChainClient({ nodeUrl: 'http://localhost:8545' });
        mockProvider = (Provider as jest.Mock).mock.instances[0] as any;

        // Mock getProvider to return our mocked instance
        jest.spyOn(client, 'getProvider').mockReturnValue(mockProvider);
    });

    it('should execute a complete transaction flow', async () => {
        // 1. Connect
        mockProvider.get.mockResolvedValueOnce({ status: 'ok' }); // Health check
        await client.connect();
        expect(client.isConnected()).toBe(true);

        // 2. Get Balance
        const address = '0x1234567890123456789012345678901234567890';
        mockProvider.get.mockResolvedValueOnce({ balance: '1000000000000000000' }); // getBalance
        const balance = await client.getBalance(address);
        expect(balance).toBe('1000000000000000000');

        // 3. Build Transaction
        const txBuilder = new TransactionBuilder(client);
        const tx = txBuilder
            .from(address)
            .to('0x0987654321098765432109876543210987654321')
            .value('1000000000000000')
            .build();

        // 4. Estimate Gas
        const mockEstimation = {
            estimatedGas: 21000,
            safeGasLimit: 25200,
            gasPrice: '1000000000',
            estimatedCost: '21000000000000',
            breakdown: { baseCost: 21000, dataCost: 0, executionCost: 0 }
        };
        mockProvider.post.mockResolvedValueOnce(mockEstimation); // estimateGas

        const gasInfo = await client.getGasManager().estimateGas(tx);
        expect(gasInfo.estimatedGas).toBe(21000);

        // 5. Send Transaction (Simulated)
        // In a real scenario, we would sign and send. 
        // Here we just verify the builder produced the correct object
        expect(tx.from).toBe(address);
        expect(tx.value).toBe('1000000000000000');
    });
});
