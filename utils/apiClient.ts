import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { logger } from './logger';

/**
 * API Client for API testing integration
 */
export class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL?: string) {
    this.client = axios.create({
      baseURL: baseURL || process.env.API_BASE_URL || 'https://api.example.com',
      timeout: parseInt(process.env.API_TIMEOUT || '10000'),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        logger.debug(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        logger.error(`API Request Error: ${error.message}`);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        logger.debug(
          `API Response: ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`
        );
        return response;
      },
      (error) => {
        logger.error(
          `API Response Error: ${error.response?.status} ${error.config?.method?.toUpperCase()} ${error.config?.url}`
        );
        return Promise.reject(error);
      }
    );
  }

  /**
   * Set authorization token
   * @param token - Bearer token
   */
  setAuthToken(token: string): void {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    logger.info('Authorization token set');
  }

  /**
   * Remove authorization token
   */
  removeAuthToken(): void {
    delete this.client.defaults.headers.common['Authorization'];
    logger.info('Authorization token removed');
  }

  /**
   * GET request
   * @param url - Endpoint URL
   * @param config - Axios config
   * @returns Promise with response
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return await this.client.get<T>(url, config);
  }

  /**
   * POST request
   * @param url - Endpoint URL
   * @param data - Request body
   * @param config - Axios config
   * @returns Promise with response
   */
  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return await this.client.post<T>(url, data, config);
  }

  /**
   * PUT request
   * @param url - Endpoint URL
   * @param data - Request body
   * @param config - Axios config
   * @returns Promise with response
   */
  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return await this.client.put<T>(url, data, config);
  }

  /**
   * PATCH request
   * @param url - Endpoint URL
   * @param data - Request body
   * @param config - Axios config
   * @returns Promise with response
   */
  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return await this.client.patch<T>(url, data, config);
  }

  /**
   * DELETE request
   * @param url - Endpoint URL
   * @param config - Axios config
   * @returns Promise with response
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return await this.client.delete<T>(url, config);
  }
}

export default new ApiClient();
