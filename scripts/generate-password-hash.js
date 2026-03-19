/**
 * Skript zum Generieren eines bcrypt Passwort-Hashes
 * 
 * Verwendung:
 * node scripts/generate-password-hash.js DEIN_PASSWORT
 */

const bcrypt = require("bcryptjs");

const password = process.argv[2];

if (!password) {
  console.error("❌ Fehler: Bitte gib ein Passwort an");
  console.log("\nVerwendung:");
  console.log("  node scripts/generate-password-hash.js DEIN_PASSWORT");
  process.exit(1);
}

async function generateHash() {
  try {
    const hash = await bcrypt.hash(password, 10);
    console.log("\n✅ Passwort-Hash erfolgreich generiert!\n");
    console.log("Füge diese Zeilen in deine .env.local Datei ein:\n");
    console.log("AUTH_USERNAME=GERLIEVA");
    console.log(`AUTH_PASSWORD_HASH=${hash}`);
    console.log("JWT_SECRET=" + generateRandomSecret());
    console.log("\n");
  } catch (error) {
    console.error("❌ Fehler beim Generieren des Hashes:", error);
    process.exit(1);
  }
}

function generateRandomSecret() {
  return require("crypto").randomBytes(32).toString("hex");
}

generateHash();