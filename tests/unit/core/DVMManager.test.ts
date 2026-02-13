import { KodeChainClient } from '../../../src/core/KodeChainClient';
import { DVMManager } from '../../../src/core/DVMManager';
import { Provider } from '../../../src/core/Provider';

jest.mock('../../../src/core/Provider');

describe('DVMManager', () => {
    let client: KodeChainClient;
    let manager: DVMManager;
    let mockProvider: jest.Mocked<Provider>;

    beforeEach(() => {
        jest.clearAllMocks();
        client = new KodeChainClient({ nodeUrl: 'http://localhost:8080' });
        mockProvider = (Provider as jest.Mock).mock.instances[0] as any;
        jest.spyOn(client, 'getProvider').mockReturnValue(mockProvider);
        manager = new DVMManager(client);
    });

    it('should list contracts', async () => {
        mockProvider.get.mockResolvedValue({ contracts: [] });
        await manager.list();
        expect(mockProvider.get).toHaveBeenCalledWith('/api/contracts');
    });

    it('should deploy a contract', async () => {
        const bytecode = '0x6060';
        const options = { creator: '0x123', name: 'Test' };
        mockProvider.post.mockResolvedValue({ success: true });

        await manager.deploy(bytecode, undefined, options as any);
        expect(mockProvider.post).toHaveBeenCalledWith('/api/contracts/deploy', expect.objectContaining({
            bytecode,
            creator: '0x123',
            name: 'Test'
        }));
    });

    it('should call a contract', async () => {
        const address = '0x1234567890123456789012345678901234567890';
        const signature = 'test()';
        const options = { caller: '0x0987654321098765432109876543210987654321' };
        mockProvider.post.mockResolvedValue({ success: true });

        await manager.call(address, signature, undefined, options as any);
        expect(mockProvider.post).toHaveBeenCalledWith('/api/contracts/call', expect.objectContaining({
            contract_address: address,
            function: signature
        }));
    });

    it('should query a contract', async () => {
        const address = '0x1234567890123456789012345678901234567890';
        const signature = 'test()';
        mockProvider.post.mockResolvedValue({ success: true });

        await manager.query(address, signature);
        expect(mockProvider.post).toHaveBeenCalledWith('/api/contracts/call', expect.objectContaining({
            contract_address: address,
            function: signature
        }));
    });

    it('should get contract state', async () => {
        const address = '0x1234567890123456789012345678901234567890';
        mockProvider.get.mockResolvedValue({ state: {} });

        await manager.getState(address);
        expect(mockProvider.get).toHaveBeenCalledWith(`/api/contract/state/${address}`);
    });

    it('should get contract information', async () => {
        const address = '0x1234567890123456789012345678901234567890';
        mockProvider.get.mockResolvedValue({ contract: {} });

        await manager.getInfo(address);
        expect(mockProvider.get).toHaveBeenCalledWith(`/api/contract/${address}`);
    });
});
