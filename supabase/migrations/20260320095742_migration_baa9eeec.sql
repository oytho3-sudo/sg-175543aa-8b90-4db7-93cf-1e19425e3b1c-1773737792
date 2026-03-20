-- Schritt 1: Alle bestehenden Policies löschen
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Schritt 2: Sichere Policies erstellen (OHNE Rekursion)

-- SELECT: Jeder User kann sein eigenes Profil sehen
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
TO public
USING (auth.uid() = id);

-- INSERT: User kann nur sein eigenes Profil erstellen
CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
TO public
WITH CHECK (auth.uid() = id);

-- UPDATE: User kann nur sein eigenes Profil aktualisieren
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO public
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- DELETE: User kann sein eigenes Profil löschen
CREATE POLICY "Users can delete own profile"
ON profiles FOR DELETE
TO public
USING (auth.uid() = id);