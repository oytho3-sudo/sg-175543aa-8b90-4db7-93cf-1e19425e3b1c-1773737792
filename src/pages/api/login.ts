import type { NextApiRequest, NextApiResponse } from "next";
import { verifyPassword, createToken } from "@/lib/auth";
import cookie from "cookie";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username, password } = req.body;

  // Validierung
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  // Umgebungsvariablen prüfen
  const validUsername = process.env.AUTH_USERNAME;
  const validPasswordHash = process.env.AUTH_PASSWORD_HASH;

  if (!validUsername || !validPasswordHash) {
    console.error("AUTH_USERNAME or AUTH_PASSWORD_HASH not configured");
    return res.status(500).json({ error: "Server configuration error" });
  }

  // Username prüfen
  if (username !== validUsername) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Passwort prüfen
  const isValid = await verifyPassword(password, validPasswordHash);

  if (!isValid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // JWT Token erstellen
  try {
    const token = createToken(username);

    // HttpOnly Cookie setzen
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24, // 24 Stunden
      })
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Token creation failed:", error);
    return res.status(500).json({ error: "Authentication failed" });
  }
}