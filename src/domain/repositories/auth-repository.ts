export interface AuthRepository {
  createMagicLinkToken(userId: string, email: string, expiresAt: string): Promise<string>;
  consumeMagicLinkToken(token: string): Promise<{ userId: string; email: string } | null>;
  createSession(userId: string, expiresAt: string): Promise<string>;
  getSession(sessionToken: string): Promise<{ userId: string; expiresAt: string } | null>;
  revokeSession(sessionToken: string): Promise<void>;
}
