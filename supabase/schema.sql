-- Barber Shop Booking — full schema for Supabase (PostgreSQL)
-- Run this in: Supabase Dashboard → SQL Editor → New query → Run

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enum for booking status
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_status') THEN
    CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'done');
  END IF;
END$$;

-- Admin users (link Supabase Auth users to dashboard access)
CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Barbers
CREATE TABLE IF NOT EXISTS public.barbers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  tagline TEXT,
  image_url TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.barbers ENABLE ROW LEVEL SECURITY;

-- Services
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  duration_minutes INT NOT NULL CHECK (duration_minutes > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Bookings
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  barber_id UUID NOT NULL REFERENCES public.barbers (id) ON DELETE RESTRICT,
  service_id UUID NOT NULL REFERENCES public.services (id) ON DELETE RESTRICT,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  notes TEXT,
  status public.booking_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Prevent double booking for non-cancelled rows (cancelled slot can be rebooked)
CREATE UNIQUE INDEX IF NOT EXISTS bookings_barber_date_time_active_uq
  ON public.bookings (barber_id, booking_date, booking_time)
  WHERE status <> 'cancelled';

CREATE INDEX IF NOT EXISTS bookings_created_at_idx ON public.bookings (created_at DESC);
CREATE INDEX IF NOT EXISTS bookings_barber_date_idx ON public.bookings (barber_id, booking_date);

-- Helper: admin check (SECURITY DEFINER bypasses RLS on admin_users)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.user_id = auth.uid()
  );
$$;

-- Public: booked times for a barber on a date (no PII)
CREATE OR REPLACE FUNCTION public.get_booked_slots(p_barber_id UUID, p_date DATE)
RETURNS TABLE (slot_time TIME)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT b.booking_time
  FROM public.bookings b
  WHERE b.barber_id = p_barber_id
    AND b.booking_date = p_date
    AND b.status <> 'cancelled';
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.get_booked_slots(UUID, DATE) TO authenticated, anon;

-- RLS: admins can read only their own row (grants are managed in SQL Editor)
CREATE POLICY "admin_users_select_self"
  ON public.admin_users
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Barbers: active for everyone; full list for admins
CREATE POLICY "barbers_select_public"
  ON public.barbers
  FOR SELECT
  USING (active = TRUE OR public.is_admin());

CREATE POLICY "barbers_write_admin"
  ON public.barbers
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Services: read all; write admin
CREATE POLICY "services_select_all"
  ON public.services
  FOR SELECT
  USING (TRUE);

CREATE POLICY "services_write_admin"
  ON public.services
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Bookings: anyone can create pending; admins manage
CREATE POLICY "bookings_insert_public"
  ON public.bookings
  FOR INSERT
  WITH CHECK (status = 'pending');

CREATE POLICY "bookings_select_admin"
  ON public.bookings
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "bookings_update_admin"
  ON public.bookings
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "bookings_delete_admin"
  ON public.bookings
  FOR DELETE
  TO authenticated
  USING (public.is_admin());
