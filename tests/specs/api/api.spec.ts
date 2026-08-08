import { describe, it } from 'mocha';
import { expect } from 'chai';
import { isAxiosError } from 'axios';
import apiClient from '../../../utils/apiClient';
import { logger } from '../../../utils/logger';
import AllureReporter from '@wdio/allure-reporter';

interface LoginResponse {
  token: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
}

describe('API Integration Tests', () => {
  describe('User Authentication API', () => {
    it('should authenticate user via API', async () => {
      AllureReporter.addFeature('API Testing');
      AllureReporter.addStory('User Authentication');

      try {
        const response = await apiClient.post<LoginResponse>('/auth/login', {
          username: 'testuser@example.com',
          password: 'Test@1234',
        });

        expect(response.status).to.equal(200);
        expect(response.data).to.have.property('token');
        expect(response.data.token).to.be.a('string');

        logger.info(`Authentication successful. Token: ${response.data.token.substring(0, 20)}...`);
        AllureReporter.addStep('API authentication successful');
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        logger.error(`API authentication failed: ${message}`);
        throw error;
      }
    });

    it('should fail authentication with invalid credentials', async () => {
      AllureReporter.addStory('Invalid Authentication');

      try {
        await apiClient.post('/auth/login', {
          username: 'invalid@example.com',
          password: 'wrongpassword',
        });

        // Should not reach here
        expect.fail('Expected authentication to fail');
      } catch (error) {
        const status = isAxiosError(error) ? error.response?.status : undefined;
        expect(status).to.equal(401);
        logger.info('Invalid credentials correctly rejected');
        AllureReporter.addStep('Invalid credentials rejected as expected');
      }
    });
  });

  describe('Product API', () => {
    let authToken: string;

    before(async () => {
      // Get auth token
      const response = await apiClient.post<LoginResponse>('/auth/login', {
        username: 'testuser@example.com',
        password: 'Test@1234',
      });
      authToken = response.data.token;
      apiClient.setAuthToken(authToken);
    });

    it('should fetch product list', async () => {
      AllureReporter.addStory('Get Products');

      const response = await apiClient.get<Product[]>('/products');

      expect(response.status).to.equal(200);
      expect(response.data).to.be.an('array');
      expect(response.data.length).to.be.greaterThan(0);

      logger.info(`Fetched ${response.data.length} products`);
      AllureReporter.addStep(`Products fetched: ${response.data.length}`);
    });

    it('should fetch single product details', async () => {
      AllureReporter.addStory('Get Product Details');

      const productId = 1;
      const response = await apiClient.get<Product>(`/products/${productId}`);

      expect(response.status).to.equal(200);
      expect(response.data).to.have.property('id');
      expect(response.data).to.have.property('name');
      expect(response.data).to.have.property('price');

      logger.info(`Product details: ${JSON.stringify(response.data)}`);
      AllureReporter.addStep(`Product ${productId} details retrieved`);
    });

    after(() => {
      apiClient.removeAuthToken();
    });
  });
});
