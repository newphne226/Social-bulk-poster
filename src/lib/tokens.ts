// Stateless auth token helpers — shared across auth routes and api-auth.
import crypto from "crypto";

const SECRET = process.env.TOKEN_SECRET || "sp-demo-secret-key-change-in-production";

export function generateToken(userId: string, remember = false): string {
  const expiresAt = Date.now() + (remember ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000);
  const payload = `${userId}:${expiresAt}`;
  const signature = crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
  const token = Buffer.from(`${payload}:${signature}`).toString("base64url");
  return `sp_${token}`;
}

export function verifyToken(token: string): { userId: string; expiresAt: number } | null {
  try {
    if (!token.startsWith("sp_")) return null;
    const decoded = Buffer.from(token.slice(3), "base64url").toString("utf-8");
    const parts = decoded.split(":");
    if (parts.length !== 3) return null;

    const [userId, expiresAtStr, signature] = parts;
    const expiresAt = parseInt(expiresAtStr, 10);
    if (isNaN(expiresAt) || Date.now() > expiresAt) return null;

    const payload = `${userId}:${expiresAt}`;
    const expected = crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
    if (signature !== expected) return null;

    return { userId, expiresAt };
  } catch {
    return null;
  }
}
