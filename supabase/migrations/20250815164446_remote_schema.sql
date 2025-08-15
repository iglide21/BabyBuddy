drop policy "Can access own/shared babies" on "public"."babies";

drop policy "Allow authenticated users to view diapers" on "public"."diapers";

drop policy "Allow authenticated users to view feedings" on "public"."feedings";

drop policy "Allow authenticated users to view reminders" on "public"."reminders";

drop policy "Allow authenticated users to view sleeps" on "public"."sleeps";

create policy "Can access own/shared babies"
on "public"."babies"
as permissive
for select
to authenticated
using (true);


create policy "Allow authenticated users to view diapers"
on "public"."diapers"
as permissive
for select
to authenticated
using (true);


create policy "Allow authenticated users to view feedings"
on "public"."feedings"
as permissive
for select
to authenticated
using (true);


create policy "Allow authenticated users to view reminders"
on "public"."reminders"
as permissive
for select
to authenticated
using (true);


create policy "Allow authenticated users to view sleeps"
on "public"."sleeps"
as permissive
for select
to authenticated
using (true);



