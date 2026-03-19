# 🔐 Sichere Authentifizierung - Setup Anleitung

## ✅ Was wurde umgesetzt

Die App nutzt jetzt eine **sichere Backend-basierte Authentifizierung**:

- ✅ Passwörter werden **nie im Klartext** gespeichert
- ✅ **bcrypt** für sicheres Passwort-Hashing
- ✅ **JWT-Tokens** in **HttpOnly Cookies** (nicht via JavaScript auslesbar)
- ✅ Backend-API prüft alle Logins
- ✅ Kein unsicheres `sessionStorage` oder `localStorage` mehr

---

## 📋 Setup-Schritte

### 1. Passwort-Hash generieren

Führe das Skript aus, um deinen Passwort-Hash zu erstellen:

```bash
node scripts/generate-password-hash.js "DEIN_PASSWORT"
```

**Beispiel-Output:**
```
✅ Passwort-Hash erfolgreich generiert!

Füge diese Zeilen in deine .env.local Datei ein:

AUTH_USERNAME=GERLIEVA
AUTH_PASSWORD_HASH=$2a$10$abc123...
JWT_SECRET=a1b2c3d4e5f6...
```

### 2. `.env.local` Datei aktualisieren

Kopiere die drei Zeilen aus dem Output in deine `.env.local`:

```env
AUTH_USERNAME=GERLIEVA
AUTH_PASSWORD_HASH=$2a$10$YourActualHashHere
JWT_SECRET=your-actual-jwt-secret-here
```

⚠️ **Wichtig:** 
- Verwende das **echte Passwort** (z.B. `1Ger/2226%`)
- Der JWT_SECRET sollte mindestens 32 Zeichen lang sein
- **NIE** diese Datei in Git committen!

### 3. Server neu starten

```bash
npm run dev
```

oder in Softgen: **"Restart Server"** Button klicken

---

## 🧪 Testen

1. Öffne die App
2. Login-Screen sollte erscheinen
3. Gib den Benutzernamen und das Passwort ein
4. Bei erfolgreichem Login: Weiterleitung zur App

---

## 🔒 Sicherheits-Features

### Backend-APIs

| Endpoint | Funktion |
|----------|----------|
| `POST /api/login` | Prüft Credentials, setzt JWT Cookie |
| `GET /api/me` | Prüft ob User authentifiziert ist |
| `POST /api/logout` | Löscht Auth-Cookie |

### Cookie-Einstellungen

```javascript
{
  httpOnly: true,      // ✅ Nicht via JavaScript auslesbar
  secure: true,        // ✅ Nur über HTTPS (Production)
  sameSite: "strict",  // ✅ CSRF-Schutz
  maxAge: 86400        // ✅ 24 Stunden Gültigkeit
}
```

---

## 🚀 Deployment (Vercel)

Auf Vercel musst du die Environment Variables setzen:

1. Gehe zu **Vercel Dashboard** → Dein Projekt → **Settings** → **Environment Variables**
2. Füge hinzu:
   - `AUTH_USERNAME` → `GERLIEVA`
   - `AUTH_PASSWORD_HASH` → `$2a$10$...` (der generierte Hash)
   - `JWT_SECRET` → `...` (der generierte Secret)
3. Redeploy die App

---

## 📚 Architektur-Übersicht

### Vorher (❌ unsicher):
```
Frontend → prüft Login → speichert in sessionStorage
```

### Nachher (✅ sicher):
```
Frontend → POST /api/login → Backend prüft → JWT Cookie
                          ↓
                    GET /api/me
                          ↓
                  Authentifizierung OK?
```

---

## 🛡️ Best Practices

✅ **Was wurde implementiert:**
- Passwort-Hashing mit bcrypt (10 Rounds)
- JWT-Tokens mit Ablaufzeit (24h)
- HttpOnly Cookies (XSS-Schutz)
- SameSite=strict (CSRF-Schutz)
- Environment Variables für Secrets

✅ **Zusätzliche Empfehlungen:**
- Aktiviere HTTPS für Production
- Nutze starke Passwörter (min. 12 Zeichen)
- Rotiere JWT_SECRET regelmäßig
- Implementiere Rate-Limiting für Login-Versuche (optional)

---

## 🐛 Troubleshooting

**Problem:** Login funktioniert nicht

**Lösung:**
1. Prüfe `.env.local` - sind alle 3 Variablen gesetzt?
2. Server neu starten
3. Browser-Cache leeren
4. Console-Output prüfen

**Problem:** "JWT_SECRET is not defined"

**Lösung:**
- `.env.local` erstellt?
- Server neu gestartet?

---

## 📞 Support

Bei Problemen: Kontaktiere den Entwickler oder öffne ein Issue.