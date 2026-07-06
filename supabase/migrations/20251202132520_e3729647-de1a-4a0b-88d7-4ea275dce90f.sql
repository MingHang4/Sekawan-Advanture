-- Update user role to admin for admin@example.com
-- Run this AFTER creating the admin@example.com account via signup

UPDATE public.user_roles 
SET role = 'admin' 
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'admin@example.com'
);