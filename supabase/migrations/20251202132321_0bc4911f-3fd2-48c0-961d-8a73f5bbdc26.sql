-- Update user role to admin based on email
-- Run this AFTER creating the admin@sekawan.demo account via signup

UPDATE public.user_roles 
SET role = 'admin' 
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'admin@sekawan.demo'
);