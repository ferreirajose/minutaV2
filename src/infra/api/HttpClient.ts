// 1. ABSTRAÇÕES (Interfaces)

export interface HttpClient {
  post(url: string, data: any, config?: any): Promise<any>;
  get(url: string, config?: any): Promise<any>;
  delete(url: string, config?: any): Promise<any>;
}

export interface ConfigService {
  getApiUrl(): string | undefined;
  getAuthToken(): string | undefined;
}
