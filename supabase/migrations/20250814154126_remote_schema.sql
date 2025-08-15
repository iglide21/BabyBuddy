drop policy "Enable read access for all users" on "public"."babies";

drop policy "Allow authenticated users to view diapers" on "public"."diapers";

drop policy "Allow authenticated users to view feedings" on "public"."feedings";

drop policy "Allow authenticated users to view reminders" on "public"."reminders";

drop policy "Allow authenticated users to view sleeps" on "public"."sleeps";

create policy "Can access own/shared babies"
on "public"."babies"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM baby_guardians
  WHERE ((baby_guardians.baby_id = babies.id) AND (baby_guardians.user_id = auth.uid())))));


create policy "Allow authenticated users to view diapers"
on "public"."diapers"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM baby_guardians
  WHERE ((baby_guardians.baby_id = diapers.baby_id) AND (baby_guardians.user_id = auth.uid())))));


create policy "Allow authenticated users to view feedings"
on "public"."feedings"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM baby_guardians
  WHERE ((baby_guardians.baby_id = feedings.baby_id) AND (baby_guardians.user_id = auth.uid())))));


create policy "Allow authenticated users to view reminders"
on "public"."reminders"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM baby_guardians
  WHERE ((baby_guardians.baby_id = reminders.baby_id) AND (baby_guardians.user_id = auth.uid())))));


create policy "Allow authenticated users to view sleeps"
on "public"."sleeps"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM baby_guardians
  WHERE ((baby_guardians.baby_id = sleeps.baby_id) AND (baby_guardians.user_id = auth.uid())))));



