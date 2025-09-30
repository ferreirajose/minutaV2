import { ConfigService } from "./HttpClient";

export class LocalConfigService implements ConfigService {
   getApiUrl(): string | undefined {
    return process.env.VITE_API_URL;
  }

  getAuthToken(): string | undefined {
    return process.env.VITE_API_AUTH_TOKEN;
  }
}