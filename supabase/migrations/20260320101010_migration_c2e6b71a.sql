-- Lösche ALLE Policies (komplett neu aufsetzen)
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON profiles;

-- SICHERE POLICY-STRUKTUR (KEINE REKURSION):

-- 1. SELECT: Jeder sieht NUR sein eigenes Profil
CREATE POLICY "Allow users to view own profile"
ON profiles FOR SELECT
TO public
USING (auth.uid() = id);

-- 2. UPDATE: Jeder kann NUR sein eigenes Profil ändern
CREATE POLICY "Allow users to update own profile"
ON profiles FOR UPDATE
TO public
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 3. DELETE: Jeder kann NUR sein eigenes Profil löschen
CREATE POLICY "Allow users to delete own profile"
ON profiles FOR DELETE
TO public
USING (auth.uid() = id);

-- Policies anzeigen zur Bestätigung
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;