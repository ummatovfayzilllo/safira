import { ConfigService } from '@nestjs/config';

export class EnvironmentConfig {
  constructor(private readonly configService: ConfigService) {}

  // JWT Configuration
  getJwtAccessSecret(): string {
    return (
      this.configService.get('JWT_ACCESS_SECRET') || 'default-access-secret'
    );
  }

  getJwtAccessExpiresIn(): string {
    return this.configService.get('JWT_ACCESS_EXPIRES_IN') || '1d';
  }

  getJwtRefreshSecret(): string {
    return (
      this.configService.get('JWT_REFRESH_SECRET') || 'default-refresh-secret'
    );
  }

  getJwtRefreshExpiresIn(): string {
    return this.configService.get('JWT_REFRESH_EXPIRES_IN') || '7d';
  }

  // Email Configuration
  getEmailHost(): string {
    return this.configService.get('EMAIL_HOST') || 'smtp.gmail.com';
  }

  getEmailPort(): number {
    return this.configService.get('EMAIL_PORT') || 465;
  }

  getEmailUser(): string {
    return this.configService.get('EMAIL_USER') || '';
  }

  getEmailPassword(): string {
    return this.configService.get('EMAIL_PASSWORD') || '';
  }

  getEmailSecret(): string {
    return this.configService.get('EMAIL_SECRET') || 'default-email-secret';
  }

  // CORS Configuration
  getAllowedOrigins(): string[] {
    const originsEnv = this.configService.get('ALLOWED_ORIGINS') || '';
    return originsEnv
      .split(',')
      .map((origin) => origin.trim())
      .filter((origin) => origin.length > 0);
  }

  // Database Configuration
  getDatabaseUrl(): string {
    return this.configService.get('DATABASE_URL') || '';
  }

  // App Configuration
  getPort(): number {
    return this.configService.get('PORT') || 15975;
  }

  getHost(): string {
    return this.configService.get('HOST') || 'localhost';
  }

  getAppBaseUrl(): string {
    return this.configService.get('APP_BASE_URL') || 'http://localhost:15975';
  }

  // Bcrypt Configuration
  getBcryptSaltRounds(): number {
    return parseInt(this.configService.get('BCRYPT_SALT_ROUNDS') || '10', 10);
  }
}
