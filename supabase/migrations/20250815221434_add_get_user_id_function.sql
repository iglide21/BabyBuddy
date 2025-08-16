create or replace function public.get_user_id_by_email(p_email text)
returns uuid
language plpgsql
security definer
as $$
begin
  -- make sure the auth schema is found!
  perform set_config('search_path', 'public, auth', true);

  return (
    select id from auth.users
    where email = p_email
    limit 1
  );
end;
$$;

revoke all on function public.get_user_id_by_email(text) from public, anon, authenticated;
grant execute on function public.get_user_id_by_email(text) to service_role;
