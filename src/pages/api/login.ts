import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookie from "cookie";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username, password } = req.body;

  // Username prüfen
  if (username !== process.env.AUTH_USERNAME) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Passwort prüfen
  const valid = await bcrypt.compare(password, process.env.AUTH_PASSWORD_HASH!);

  if (!valid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Token erstellen
  const token = jwt.sign(
    { user: username },
    process.env.JWT_SECRET!,
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

  return res.status(200).json({ success: true });
}