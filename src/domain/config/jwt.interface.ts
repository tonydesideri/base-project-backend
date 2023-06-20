export interface IJwTConfig {
  getJwtSecret(): string;
  getJwtExpirationTime(): string;
  getJwtRefreshSecret(): string;
  getJwtRefreshExpirationTime(): string;
  getJwtForgotPasswordSecret(): string;
  getJwtForgotPasswordExpirationTime(): string;
}
