-- 1. Füge die role Spalte zur profiles Tabelle hinzu
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role text DEFAULT 'Techniker';

-- 2. Erstelle einen CHECK constraint für erlaubte Rollen
ALTER TABLE profiles
DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE profiles
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('Admin', 'Techniker'));

-- 3. Admin-Policy: Admins können alle Profile verwalten
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;

CREATE POLICY "Admins can manage all profiles" ON profiles
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role = 'Admin'
  )
);

-- 4. Erstelle einen Admin-User (falls noch nicht vorhanden)
-- Dieser User muss manuell in Supabase Auth erstellt werden
-- Hier setzen wir nur die Rolle, falls die User-ID bereits existiert