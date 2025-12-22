/*
  # Optimize RLS Policies for Performance and Security

  ## Issues Fixed
  1. RLS policies re-evaluating auth functions for each row (performance issue)
  2. Multiple permissive policies on same table/action (security risk)
  3. Function search path mutability issues
  
  ## Changes
  1. Wrap all auth.uid() calls with (SELECT auth.uid()) for better performance
  2. Combine multiple permissive policies into single policies with OR conditions
  3. Fix function search paths

  ## Performance Impact
  - Queries will now cache auth.uid() value instead of re-evaluating per row
  - Significantly improves query performance at scale
*/

-- ========================================
-- FIX FUNCTION SEARCH PATHS
-- ========================================

-- Fix handle_new_user function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, created_at)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NOW());
  RETURN NEW;
END;
$$;

-- Fix update_updated_at_column function  
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ========================================
-- OPTIMIZE USER_PROFILES POLICIES
-- ========================================

DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

-- Optimized: Uses SELECT to cache auth.uid()
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = id)
  WITH CHECK (
    (SELECT auth.uid()) = id 
    AND is_admin = (SELECT is_admin FROM user_profiles WHERE id = (SELECT auth.uid()))
  );

-- ========================================
-- OPTIMIZE CATEGORIES POLICIES
-- ========================================

DROP POLICY IF EXISTS "Admins can insert categories" ON categories;
DROP POLICY IF EXISTS "Admins can update categories" ON categories;
DROP POLICY IF EXISTS "Admins can delete categories" ON categories;

-- Optimized: Uses SELECT to cache auth.uid()
CREATE POLICY "Admins can insert categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (is_admin((SELECT auth.uid())));

CREATE POLICY "Admins can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (is_admin((SELECT auth.uid())))
  WITH CHECK (is_admin((SELECT auth.uid())));

CREATE POLICY "Admins can delete categories"
  ON categories FOR DELETE
  TO authenticated
  USING (is_admin((SELECT auth.uid())));

-- ========================================
-- OPTIMIZE PRODUCTS POLICIES
-- ========================================

DROP POLICY IF EXISTS "Admins can insert products" ON products;
DROP POLICY IF EXISTS "Admins can update products" ON products;
DROP POLICY IF EXISTS "Admins can delete products" ON products;

-- Optimized: Uses SELECT to cache auth.uid()
CREATE POLICY "Admins can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (is_admin((SELECT auth.uid())));

CREATE POLICY "Admins can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (is_admin((SELECT auth.uid())))
  WITH CHECK (is_admin((SELECT auth.uid())));

CREATE POLICY "Admins can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (is_admin((SELECT auth.uid())));

-- ========================================
-- OPTIMIZE ORDERS POLICIES - COMBINE MULTIPLE PERMISSIVE
-- ========================================

DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Users can create own orders" ON orders;
DROP POLICY IF EXISTS "Admins can update orders" ON orders;

-- Combined policy: Users see their own orders OR admins see all
CREATE POLICY "Users and admins can view orders"
  ON orders FOR SELECT
  TO authenticated
  USING (
    (SELECT auth.uid()) = user_id 
    OR is_admin((SELECT auth.uid()))
  );

-- Optimized: Users can create their own orders
CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- Optimized: Only admins can update orders
CREATE POLICY "Admins can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (is_admin((SELECT auth.uid())))
  WITH CHECK (is_admin((SELECT auth.uid())));

-- ========================================
-- OPTIMIZE ORDER_ITEMS POLICIES - COMBINE MULTIPLE PERMISSIVE
-- ========================================

DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
DROP POLICY IF EXISTS "Admins can view all order items" ON order_items;
DROP POLICY IF EXISTS "Users can create order items for own orders" ON order_items;

-- Combined policy: Users see items from their orders OR admins see all
CREATE POLICY "Users and admins can view order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = (SELECT auth.uid())
    )
    OR is_admin((SELECT auth.uid()))
  );

-- Optimized: Users can create items for their own orders
CREATE POLICY "Users can create order items for own orders"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = (SELECT auth.uid())
    )
  );
