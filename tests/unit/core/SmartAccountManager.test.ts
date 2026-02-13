import { KodeChainClient } from '../../../src/core/KodeChainClient';
import { SmartAccountManager } from '../../../src/core/SmartAccountManager';
import { Provider } from '../../../src/core/Provider';

jest.mock('../../../src/core/Provider');

describe('SmartAccountManager', () => {
    let client: KodeChainClient;
    let manager: SmartAccountManager;
    let mockProvider: jest.Mocked<Provider>;

    beforeEach(() => {
        jest.clearAllMocks();
        client = new KodeChainClient({ nodeUrl: 'http://localhost:8080' });
        mockProvider = (Provider as jest.Mock).mock.instances[0] as any;
        jest.spyOn(client, 'getProvider').mockReturnValue(mockProvider);
        manager = new SmartAccountManager(client);
    });

    it('should create an account', async () => {
        const address = '0x123';
        mockProvider.post.mockResolvedValue({ success: true });

        const result = await manager.createAccount(address);
        expect(result.success).toBe(true);
        expect(mockProvider.post).toHaveBeenCalledWith('/api/smart-accounts', { address });
    });

    it('should get billing info', async () => {
        const address = '0x123';
        const mockBilling = { totalCost: '5000' };
        mockProvider.get.mockResolvedValue({ success: true, billingInfo: mockBilling });

        const result = await manager.getBillingInfo(address);
        expect(result.billingInfo).toEqual(mockBilling);
        expect(mockProvider.get).toHaveBeenCalledWith(`/api/smart-accounts/${address}/billing`);
    });

    it('should add a critical record', async () => {
        const address = '0x123';
        mockProvider.post.mockResolvedValue({ success: true });

        const result = await manager.addCriticalRecord(address, 'LOG', 'Content');
        expect(result.success).toBe(true);
        expect(mockProvider.post).toHaveBeenCalledWith(`/api/smart-accounts/${address}/records`, {
            recordType: 'LOG',
            content: 'Content'
        });
    });

    it('should get record history with options', async () => {
        const address = '0x123';
        mockProvider.get.mockResolvedValue({ records: [] });

        await manager.getRecordHistory(address, { limit: 10, type: 'AUDIT' });
        expect(mockProvider.get).toHaveBeenCalledWith(
            expect.stringContaining('/api/smart-accounts/0x123/records/history?limit=10&type=AUDIT')
        );
    });

    it('should transfer between chains', async () => {
        const address = '0x123';
        mockProvider.post.mockResolvedValue({ success: true });

        await manager.transferBetweenChains(address, 1000n, 'to_dpos');
        expect(mockProvider.post).toHaveBeenCalledWith(`/api/smart-accounts/${address}/transfer`, {
            amount: '1000',
            direction: 'to_dpos'
        });
    });
});
