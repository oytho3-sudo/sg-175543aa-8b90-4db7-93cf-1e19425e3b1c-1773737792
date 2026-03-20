-- Erstelle Admin-Policy für SELECT auf alle Profile
CREATE POLICY "Admins can view all profiles"
ON profiles FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() 
    AND role = 'Admin'
  )
  OR auth.uid() = id
);

-- Lösche die alte "Users can view own profile" Policy
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;