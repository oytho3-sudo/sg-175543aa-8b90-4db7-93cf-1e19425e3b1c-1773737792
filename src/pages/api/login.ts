import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookie from "cookie";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { username, password } = req.body;

    console.log("=== LOGIN DEBUG ===");
    console.log("Username eingegeben:", username);
    console.log("Passwort eingegeben:", password ? "***" : "leer");

    // Username prüfen
    if (username !== process.env.AUTH_USERNAME) {
      console.log("❌ Username falsch");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Passwort prüfen
    const passwordHash = process.env.AUTH_PASSWORD_HASH;
    if (!passwordHash) {
      console.log("❌ AUTH_PASSWORD_HASH nicht gesetzt");
      return res.status(500).json({ error: "Server configuration error" });
    }

    const valid = await bcrypt.compare(password, passwordHash);
    console.log("Passwort korrekt?", valid);

    if (!valid) {
      console.log("❌ Passwort falsch");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Token erstellen
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.log("❌ JWT_SECRET nicht gesetzt");
      return res.status(500).json({ error: "Server configuration error" });
    }

    const token = jwt.sign(
      { user: username },
      jwtSecret,
      { expiresIn: "1h" }
    );

    // Cookie setzen
    res.setHeader("Set-Cookie", cookie.serialize("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60,
    }));

    console.log("✅ Login erfolgreich");
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ LOGIN ERROR:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}