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
        // 1. Setup URL-based mocks for stability
        mockProvider.get.mockImplementation(async (url) => {
            if (url === '/api/node/health') return { health: { status: 'healthy' } };
            if (url === '/api/node/status') return { status: { node_id: 'test', node_type: 'validator' } };
            if (url.startsWith('/api/smart-accounts/')) {
                return {
                    account: {
                        balances: {
                            KDC: { amount: '1000000000000000000' }
                        }
                    }
                };
            }
            return {};
        });

        mockProvider.post.mockImplementation(async (url, data: any) => {
            if (url === '/api/contracts/deploy') return { success: true, contractAddress: '0xABC' };
            if (url === '/api/contracts/call') return { success: true, hash: '0xTX' };
            if (url === '/api/gas/estimate') {
                return {
                    estimatedGas: 21000,
                    safeGasLimit: 25200,
                    gasPrice: '1000000000',
                    estimatedCost: '21000000000000',
                    breakdown: { baseCost: 21000, dataCost: 0, executionCost: 0 }
                };
            }
            return { success: true };
        });

        // 2. Connect
        await client.connect();
        expect(client.isConnected()).toBe(true);

        // 3. Get Balance
        const address = '0x1234567890123456789012345678901234567890';
        const balance = await client.getBalance(address);
        expect(balance).toBeDefined();

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

        // 5. Deploy Contract
        const deployOptions = { creator: address, bytecode: '0x6060', name: 'Identity' };
        const contractAddress = '0x1111111111111111111111111111111111111111';
        mockProvider.post.mockResolvedValue({ success: true, contractAddress });
        const deployResult = await client.dvm.deploy(deployOptions.bytecode, undefined, deployOptions as any);
        expect(deployResult.contractAddress).toBe(contractAddress);

        // 6. Call Contract
        const callOptions = { contractAddress, caller: address, function: 'set(uint256)', parameters: '00...01' };
        mockProvider.post.mockResolvedValue({ success: true, hash: '0xTX' });
        const callResult = await client.dvm.call(callOptions.contractAddress, callOptions.function, callOptions.parameters, callOptions as any);
        expect(callResult.success).toBe(true);

        // 7. Send Transaction (Simulated)
        // In a real scenario, we would sign and send. 
        // Here we just verify the builder produced the correct object
        expect(tx.from).toBe(address);
        expect(tx.value).toBe('1000000000000000');
    });
});
