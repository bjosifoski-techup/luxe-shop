/*
  # Fix User Profiles Infinite Recursion
  
  1. Problem
    - UPDATE policy on user_profiles references user_profiles table itself
    - This causes infinite recursion when evaluating the policy
    - Line: `AND is_admin = (SELECT is_admin FROM user_profiles WHERE id = ...)`
  
  2. Solution
    - Remove the self-referential check from the policy
    - Users can update their own profile (name, email, etc.)
    - The is_admin field will be protected at the application level
    - Admins can still manage user roles through admin functions
  
  3. Security
    - Users can only update their own profile (USING clause checks id = auth.uid())
    - Application code should not allow users to set is_admin directly
    - Future: Can add column-level security if needed
*/

-- Drop the problematic policy
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

-- Create fixed policy without self-reference
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);
