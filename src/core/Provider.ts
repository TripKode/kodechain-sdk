/**
 * HTTP Provider for KodeChain API communication
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { NetworkError, TimeoutError, ConnectionError } from '../errors';
import { CONSTANTS } from '../utils';

export interface ProviderConfig {
    baseURL: string;
    timeout?: number;
    retries?: number;
    headers?: Record<string, string>;
}

export class Provider {
    private client: AxiosInstance;
    private retries: number;

    constructor(config: ProviderConfig) {
        this.retries = config.retries ?? CONSTANTS.DEFAULT_RETRIES;

        this.client = axios.create({
            baseURL: config.baseURL,
            timeout: config.timeout ?? CONSTANTS.DEFAULT_TIMEOUT,
            headers: {
                'Content-Type': 'application/json',
                ...config.headers,
            },
        });

        this.setupInterceptors();
    }

    private setupInterceptors(): void {
        // Request interceptor
        this.client.interceptors.request.use(
            (config) => {
                return config;
            },
            (error) => {
                return Promise.reject(this.handleError(error));
            }
        );

        // Response interceptor
        this.client.interceptors.response.use(
            (response) => {
                return response;
            },
            (error) => {
                return Promise.reject(this.handleError(error));
            }
        );
    }

    private handleError(error: AxiosError): Error {
        if (error.code === 'ECONNABORTED') {
            return new TimeoutError('Request timeout', { originalError: error.message });
        }

        if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
            return new ConnectionError('Connection failed', { originalError: error.message });
        }

        if (error.response) {
            return new NetworkError((error.response.data as any)?.message || error.message, {
                status: error.response.status,
                data: error.response.data,
            });
        }

        return new NetworkError(error.message, { originalError: error });
    }

    async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return this.request<T>({ ...config, method: 'GET', url });
    }

    async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        return this.request<T>({ ...config, method: 'POST', url, data });
    }

    async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        return this.request<T>({ ...config, method: 'PUT', url, data });
    }

    async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return this.request<T>({ ...config, method: 'DELETE', url });
    }

    private async request<T>(config: AxiosRequestConfig, attempt: number = 0): Promise<T> {
        try {
            const response = await this.client.request<T>(config);
            return response.data;
        } catch (error) {
            if (attempt < this.retries && this.shouldRetry(error)) {
                await this.delay(CONSTANTS.RETRY_DELAY * (attempt + 1));
                return this.request<T>(config, attempt + 1);
            }
            throw error;
        }
    }

    private shouldRetry(error: any): boolean {
        // Retry on network errors and 5xx server errors
        if (error instanceof NetworkError) {
            return true;
        }
        if (error instanceof TimeoutError) {
            return true;
        }
        if (error instanceof ConnectionError) {
            return true;
        }
        return false;
    }

    private delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    getBaseURL(): string {
        return this.client.defaults.baseURL || '';
    }
}
