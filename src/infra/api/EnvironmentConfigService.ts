import { ConfigService } from "./HttpClient";

export class EnvironmentConfigService implements ConfigService {
  getApiUrl(): string | undefined {
    return process.env.VITE_API_URL;
  }

  getAuthToken(): string | undefined {
    return process.env.VITE_API_AUTH_TOKEN;
  }
}