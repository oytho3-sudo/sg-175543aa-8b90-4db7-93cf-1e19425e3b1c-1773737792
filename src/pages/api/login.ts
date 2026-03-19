import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookie from "cookie";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username, password } = req.body;

  // Debug-Ausgabe (NUR für Entwicklung!)
  console.log("=== LOGIN DEBUG ===");
  console.log("Eingabe Username:", username);
  console.log("Erwartet Username:", process.env.AUTH_USERNAME);
  console.log("Hash aus ENV:", process.env.AUTH_PASSWORD_HASH?.substring(0, 20) + "...");
  console.log("Eingabe Passwort Länge:", password?.length);

  // Username prüfen
  if (username !== process.env.AUTH_USERNAME) {
    console.log("❌ Username stimmt nicht überein");
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Passwort prüfen
  const passwordHash = process.env.AUTH_PASSWORD_HASH;
  if (!passwordHash) {
    console.log("❌ AUTH_PASSWORD_HASH fehlt in .env.local");
    return res.status(500).json({ error: "Server configuration error" });
  }

  console.log("Vergleiche Passwort mit Hash...");
  const valid = await bcrypt.compare(password, passwordHash);
  console.log("Passwort gültig?", valid);

  if (!valid) {
    console.log("❌ Passwort ungültig");
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Token erstellen
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.log("❌ JWT_SECRET fehlt in .env.local");
    return res.status(500).json({ error: "Server configuration error" });
  }

  const token = jwt.sign(
    { user: username },
    jwtSecret,
    { expiresIn: "1h" }
  );

  // HttpOnly Cookie setzen
  res.setHeader("Set-Cookie", cookie.serialize("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60, // 1 Stunde
  }));

  console.log("✅ Login erfolgreich");
  return res.status(200).json({ success: true });
}