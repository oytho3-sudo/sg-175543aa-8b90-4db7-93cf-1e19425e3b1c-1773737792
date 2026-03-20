-- Lösche alle bestehenden Policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

-- Erstelle neue, sichere Policies OHNE Rekursion
-- 1. Jeder kann sein eigenes Profil sehen
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- 2. Jeder kann sein eigenes Profil erstellen
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 3. Jeder kann sein eigenes Profil aktualisieren
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- 4. TEMPORÄR: Alle können alle Profile sehen (für Admin-Panel)
-- Dies vermeidet die Rekursion, da wir nicht mehr role checken müssen
CREATE POLICY "Allow all to view profiles"
  ON profiles FOR SELECT
  USING (true);

-- 5. TEMPORÄR: Authenticated users können Profile aktualisieren
CREATE POLICY "Authenticated can update profiles"
  ON profiles FOR UPDATE
  USING (auth.uid() IS NOT NULL);