-- Schritt 1: Erstelle das Auth User Password Hash
-- Für Passwort: 1tho/2GERdev%
-- Verwende crypt() Funktion von pgcrypto Extension

-- Stelle sicher, dass pgcrypto Extension aktiv ist
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Erstelle den Auth User direkt
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'Thomas.oyntzen@gerlieva.com',
  crypt('1tho/2GERdev%', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Thomas Oyntzen"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
)
RETURNING id;

-- Schritt 2: Erstelle das Profil (wird durch Trigger automatisch erstellt, aber wir setzen die Rolle)
UPDATE profiles 
SET role = 'Admin',
    full_name = 'Thomas Oyntzen'
WHERE id = (SELECT id FROM auth.users WHERE email = 'Thomas.oyntzen@gerlieva.com');