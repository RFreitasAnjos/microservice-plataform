import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProxyService {
  private userServiceClient: AxiosInstance;

  constructor(private configService: ConfigService) {
    const userServiceUrl =
      this.configService.get<string>('USER_SERVICE_URL') ||
      'http://user-service:3001';

    this.userServiceClient = axios.create({
      baseURL: userServiceUrl,
      timeout: 5000,
    });
  }

  async proxyRequest(
    method: string,
    path: string,
    data?: any,
    headers?: any,
  ) {
    try {
      const response = await this.userServiceClient.request({
        method: method as any,
        url: path,
        data,
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error: any) {
      const status =
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message =
        error.response?.data?.message || 'Error communicating with service';

      throw new HttpException(
        {
          statusCode: status,
          message,
          error: message,
        },
        status,
      );
    }
  }

  async get(path: string, headers?: any) {
    return this.proxyRequest('GET', path, undefined, headers);
  }

  async post(path: string, data: any, headers?: any) {
    return this.proxyRequest('POST', path, data, headers);
  }

  async patch(path: string, data: any, headers?: any) {
    return this.proxyRequest('PATCH', path, data, headers);
  }

  async delete(path: string, headers?: any) {
    return this.proxyRequest('DELETE', path, undefined, headers);
  }
}
