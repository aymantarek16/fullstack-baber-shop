-- =====================================================
-- ADMIN AUTHENTICATION SETUP - RUN THIS IN SUPABASE SQL EDITOR
-- =====================================================

-- 1. Drop existing function to recreate with proper security
DROP FUNCTION IF EXISTS public.is_admin();

-- 2. Create robust is_admin function with better error handling
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  -- Check if current user exists in admin_users table
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.user_id = auth.uid()
  );
$$;

-- 3. Ensure admin_users table exists with proper structure
CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users (id) ON DELETE SET NULL
);

-- 4. Enable RLS on admin_users table
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 5. Create proper RLS policies for admin_users
-- Allow users to see their own admin status
DROP POLICY IF EXISTS "admin_users_select_self" ON public.admin_users;
CREATE POLICY "admin_users_select_self"
  ON public.admin_users
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Allow existing admins to insert new admins
DROP POLICY IF EXISTS "admin_users_insert_admin" ON public.admin_users;
CREATE POLICY "admin_users_insert_admin"
  ON public.admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

-- Allow users to see their own admin status for debugging
DROP POLICY IF EXISTS "admin_users_update_self" ON public.admin_users;
CREATE POLICY "admin_users_update_self"
  ON public.admin_users
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- 6. Grant proper permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.admin_users TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;

-- 7. Create helper function to add admin users
CREATE OR REPLACE FUNCTION public.add_admin_user(user_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_user_id UUID;
  admin_count INTEGER;
BEGIN
  -- Find user by email
  SELECT id INTO target_user_id 
  FROM auth.users 
  WHERE email = user_email;
  
  IF target_user_id IS NULL THEN
    RETURN 'ERROR: User with email ' || user_email || ' not found in auth.users';
  END IF;
  
  -- Check if already admin
  SELECT COUNT(*) INTO admin_count
  FROM public.admin_users 
  WHERE user_id = target_user_id;
  
  IF admin_count > 0 THEN
    RETURN 'User ' || user_email || ' is already an admin';
  END IF;
  
  -- Add to admin_users
  INSERT INTO public.admin_users (user_id, created_by)
  VALUES (target_user_id, auth.uid());
  
  RETURN 'SUCCESS: ' || user_email || ' is now an admin';
END;
$$;

-- 8. Create helper function to list all admins
CREATE OR REPLACE FUNCTION public.list_admins()
RETURNS TABLE (
  user_id UUID,
  email TEXT,
  created_at TIMESTAMPTZ,
  created_by_email TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    au.user_id,
    u.email,
    au.created_at,
    creator.email as created_by_email
  FROM public.admin_users au
  JOIN auth.users u ON au.user_id = u.id
  LEFT JOIN auth.users creator ON au.created_by = creator.id
  ORDER BY au.created_at DESC;
END;
$$;

-- 9. Grant permissions for helper functions
GRANT EXECUTE ON FUNCTION public.add_admin_user(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.list_admins() TO authenticated;

-- =====================================================
-- FIND YOUR USER ID AND MAKE THEM ADMIN
-- =====================================================

-- First, find your user ID by email (replace with your actual email)
-- Uncomment and run this line to find your user ID:
-- SELECT id, email, created_at, email_confirmed_at FROM auth.users WHERE email = 'your-email@example.com';

-- Once you have your user ID, run this to make yourself admin:
-- INSERT INTO public.admin_users (user_id) VALUES ('YOUR_USER_ID_HERE');

-- Or use the helper function (easier):
-- SELECT public.add_admin_user('your-email@example.com');

-- Check current admins:
-- SELECT * FROM public.list_admins();

-- Test if current user is admin:
-- SELECT public.is_admin();

-- =====================================================
-- EXAMPLE USAGE
-- =====================================================

-- To make user@example.com an admin:
-- SELECT public.add_admin_user('user@example.com');

-- To see all admins:
-- SELECT * FROM public.list_admins();

-- To check if current user is admin:
-- SELECT public.is_admin();
