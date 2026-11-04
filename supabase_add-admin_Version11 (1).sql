insert into public.admins (user_id)
select id from auth.users
where email = 'YOUR_ADMIN_EMAIL'
on conflict do nothing;