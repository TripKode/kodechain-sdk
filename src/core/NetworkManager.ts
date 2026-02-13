/**
 * Network Manager
 */

import { KodeChainClient } from '../core';

export interface NodeStatus {
    node_id: string;
    node_type: string;
    version: string;
    uptime: string;
    peers: number;
    block_height: number;
    is_syncing: boolean;
}

export interface PeerInfo {
    node_id: string;
    address: string;
    port: number;
    http_port: number;
    last_seen: string;
}

export class NetworkManager {
    private client: KodeChainClient;

    constructor(client: KodeChainClient) {
        this.client = client;
    }

    /**
     * Get node status
     */
    async getStatus(): Promise<NodeStatus> {
        return this.client.getProvider().get<NodeStatus>('/api/node/status');
    }

    /**
     * Get node health
     */
    async getHealth(): Promise<any> {
        return this.client.getProvider().get('/api/node/health');
    }

    /**
     * Get P2P peers (contacts)
     */
    async getPeers(): Promise<PeerInfo[]> {
        const response = await this.client
            .getProvider()
            .get<{ success: boolean; contacts: PeerInfo[] }>('/api/p2p/contacts');

        return response.contacts;
    }

    /**
     * Get P2P stats
     */
    async getP2PStats(): Promise<any> {
        return this.client.getProvider().get('/api/p2p/stats');
    }

    /**
     * Get network status
     */
    async getNetworkStatus(): Promise<any> {
        return this.client.getProvider().get('/api/network/status');
    }

    /**
     * Get local enode
     */
    async getEnode(): Promise<string> {
        const response = await this.client
            .getProvider()
            .get<{ enode: string }>('/api/network/enode');
        return response.enode;
    }

    /**
     * Get routing table
     */
    async getRoutingTable(): Promise<any> {
        return this.client.getProvider().get('/api/network/routing');
    }

    /**
     * Add a P2P contact manually
     */
    async addContact(contact: { node_id: string; address: string; port: number; http_port?: number }): Promise<any> {
        return this.client.getProvider().post('/api/p2p/add-contact', contact);
    }
}
