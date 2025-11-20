import { GasManager } from '../../../src/gas/GasManager';
import { KodeChainClient } from '../../../src/core/KodeChainClient';
import { Provider } from '../../../src/core/Provider';
import { GasEstimationError } from '../../../src/errors';

// Mock dependencies
jest.mock('../../../src/core/KodeChainClient');
jest.mock('../../../src/core/Provider');

describe('GasManager', () => {
    let gasManager: GasManager;
    let mockClient: jest.Mocked<KodeChainClient>;
    let mockProvider: jest.Mocked<Provider>;

    beforeEach(() => {
        mockProvider = new Provider({ baseURL: 'http://localhost:8545' }) as any;
        mockClient = new KodeChainClient({ nodeUrl: 'http://localhost:8545' }) as any;

        // Setup client to return mock provider
        mockClient.getProvider.mockReturnValue(mockProvider);

        gasManager = new GasManager(mockClient);
    });

    describe('getConfig', () => {
        it('should fetch gas configuration', async () => {
            const mockConfig = {
                enabled: true,
                defaultGasPrice: '1000000000',
                minGasPrice: '1000000000',
                maxGasPrice: '100000000000',
                dposSettings: {
                    chargeImmediately: true,
                    refundUnusedGas: true,
                    validatorShare: 10
                },
                pbftSettings: {
                    useBilling: true,
                    billingCycle: 'monthly',
                    maxDebtLimit: '1000000000000000000',
                    blockingThreshold: '2000000000000000000',
                    gracePeriod: 86400
                }
            };

            mockProvider.get.mockResolvedValue(mockConfig);

            const result = await gasManager.getConfig();
            expect(result).toEqual(mockConfig);
            expect(mockProvider.get).toHaveBeenCalledWith('/api/gas/config');
        });
    });

    describe('estimateGas', () => {
        it('should estimate gas for a transaction', async () => {
            const mockTx = {
                to: '0x123',
                value: '100',
                data: '0x'
            };

            const mockEstimation = {
                estimatedGas: 21000,
                safeGasLimit: 25200,
                gasPrice: '1000000000',
                estimatedCost: '21000000000000',
                breakdown: {
                    baseCost: 21000,
                    dataCost: 0,
                    executionCost: 0
                }
            };

            mockProvider.post.mockResolvedValue(mockEstimation);

            const result = await gasManager.estimateGas(mockTx);
            expect(result).toEqual(mockEstimation);
            expect(mockProvider.post).toHaveBeenCalledWith('/api/gas/estimate', mockTx);
        });

        it('should throw GasEstimationError on failure', async () => {
            mockProvider.post.mockRejectedValue(new Error('Network error'));

            await expect(gasManager.estimateGas({})).rejects.toThrow(GasEstimationError);
        });
    });

    describe('getBilling', () => {
        it('should fetch billing info for an address', async () => {
            const address = '0x1234567890123456789012345678901234567890';
            const mockBilling = {
                address,
                current: {
                    period: '2025-01',
                    usageCount: 10,
                    totalCost: '1000',
                    paidAmount: '0',
                    outstandingDebt: '1000'
                },
                status: {
                    isBlocked: false
                },
                limits: {
                    maxDebtLimit: '1000000',
                    blockingThreshold: '2000000'
                },
                history: []
            };

            mockProvider.get.mockResolvedValue(mockBilling);

            const result = await gasManager.getBilling(address);
            expect(result).toEqual(mockBilling);
            expect(mockProvider.get).toHaveBeenCalledWith(`/api/gas/billing/${address}`);
        });
    });

    describe('payBilling', () => {
        it('should process billing payment', async () => {
            const address = '0x1234567890123456789012345678901234567890';
            const amount = '1000';
            const mockReceipt = {
                success: true,
                amountPaid: amount,
                remainingDebt: '0',
                newDPOSBalance: '9000',
                isBlocked: false,
                transactionHash: '0xabc'
            };

            mockProvider.post.mockResolvedValue(mockReceipt);

            const result = await gasManager.payBilling(address, amount);
            expect(result).toEqual(mockReceipt);
            expect(mockProvider.post).toHaveBeenCalledWith('/api/gas/billing/pay', {
                address,
                amount
            });
        });
    });
});
