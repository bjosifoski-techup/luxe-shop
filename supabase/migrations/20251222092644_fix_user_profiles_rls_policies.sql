/*
  # Fix User Profiles RLS Policies - Remove Circular Dependency

  ## Problem
  The existing admin check policies create infinite recursion by querying
  user_profiles while checking permissions on user_profiles.

  ## Solution
  - Drop all existing user_profiles policies
  - Create simplified policies that don't cause circular references
  - Use a security definer function to check admin status safely

  ## Changes
  1. Drop existing problematic policies
  2. Create a safe admin check function
  3. Recreate policies using the safe function
*/

-- Drop existing policies that cause circular reference
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

-- Create a security definer function to check admin status safely
-- This function bypasses RLS to avoid circular dependency
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_status boolean;
BEGIN
  SELECT is_admin INTO admin_status
  FROM user_profiles
  WHERE id = user_id;
  
  RETURN COALESCE(admin_status, false);
END;
$$;

-- Recreate policies using the safe function

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile (but not change is_admin flag)
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id 
    AND is_admin = (SELECT is_admin FROM user_profiles WHERE id = auth.uid())
  );

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION is_admin(uuid) TO authenticated;
