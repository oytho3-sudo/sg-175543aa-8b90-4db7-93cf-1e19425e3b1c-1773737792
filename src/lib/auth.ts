import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Authentifizierungs-Utilities
 */

export interface JWTPayload {
  user: string;
  iat?: number;
  exp?: number;
}

/**
 * Passwort mit bcrypt vergleichen
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * JWT Token erstellen
 */
export function createToken(username: string): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.sign(
    { user: username } as JWTPayload,
    secret,
    { expiresIn: "24h" }
  );
}

/**
 * JWT Token verifizieren
 */
export function verifyToken(token: string): JWTPayload | null {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  try {
    return jwt.verify(token, secret) as JWTPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Auth-Token aus Request-Cookies extrahieren
 */
export function getTokenFromRequest(req: NextApiRequest): string | null {
  return req.cookies.auth_token || null;
}

/**
 * Middleware: Prüft ob User authentifiziert ist
 */
export function requireAuth(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void> | void
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = getTokenFromRequest(req);

    if (!token) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    // Token-Payload an Request anhängen
    (req as any).user = payload;

    return handler(req, res);
  };
}