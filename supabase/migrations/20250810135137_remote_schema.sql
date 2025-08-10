

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."BabySettingsSections" AS ENUM (
    'birth',
    'measurements',
    'medical',
    'notes'
);


ALTER TYPE "public"."BabySettingsSections" OWNER TO "postgres";


CREATE TYPE "public"."BloodType" AS ENUM (
    'A',
    'B',
    'AB',
    'O',
    'A+',
    'A-',
    'B+',
    'B-',
    'AB+',
    'AB-',
    'O+',
    'O-'
);


ALTER TYPE "public"."BloodType" OWNER TO "postgres";


COMMENT ON TYPE "public"."BloodType" IS 'blood types';



CREATE TYPE "public"."DiaperColor" AS ENUM (
    'yellow',
    'green',
    'brown',
    'orange',
    'black',
    'red',
    'white_gray',
    'pink_specks'
);


ALTER TYPE "public"."DiaperColor" OWNER TO "postgres";


CREATE TYPE "public"."DiaperType" AS ENUM (
    'wet',
    'dirty',
    'both'
);


ALTER TYPE "public"."DiaperType" OWNER TO "postgres";


CREATE TYPE "public"."Feeding type" AS ENUM (
    'breast',
    'bottle',
    'solid'
);


ALTER TYPE "public"."Feeding type" OWNER TO "postgres";


CREATE TYPE "public"."Gender" AS ENUM (
    'male',
    'female',
    'other'
);


ALTER TYPE "public"."Gender" OWNER TO "postgres";


CREATE TYPE "public"."Reminder type" AS ENUM (
    'daily',
    'interval'
);


ALTER TYPE "public"."Reminder type" OWNER TO "postgres";


CREATE TYPE "public"."SettingValueType" AS ENUM (
    'string',
    'array',
    'number'
);


ALTER TYPE "public"."SettingValueType" OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."diapers" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "occurred_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text") NOT NULL,
    "note" "text" NOT NULL,
    "type" "public"."DiaperType" NOT NULL,
    "color" "public"."DiaperColor",
    "baby_id" "uuid" NOT NULL
);


ALTER TABLE "public"."diapers" OWNER TO "postgres";


COMMENT ON TABLE "public"."diapers" IS 'here we store the diaper changes';



CREATE TABLE IF NOT EXISTS "public"."feedings" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "type" "public"."Feeding type" NOT NULL,
    "amount_ml" integer,
    "duration_minutes" integer,
    "note" "text",
    "occurred_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text") NOT NULL,
    "baby_id" "uuid" NOT NULL
);


ALTER TABLE "public"."feedings" OWNER TO "postgres";


COMMENT ON TABLE "public"."feedings" IS 'here we store every feed of the babies';



COMMENT ON COLUMN "public"."feedings"."occurred_at" IS 'the timestamp of ocurrence of the event';



CREATE TABLE IF NOT EXISTS "public"."sleeps" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "start_date" timestamp with time zone NOT NULL,
    "end_date" timestamp with time zone,
    "note" "text",
    "duration_minutes" integer NOT NULL,
    "baby_id" "uuid" NOT NULL
);


ALTER TABLE "public"."sleeps" OWNER TO "postgres";


COMMENT ON TABLE "public"."sleeps" IS 'here we store the naps of the babies';



CREATE OR REPLACE VIEW "public"."all_events_view" WITH ("security_invoker"='on') AS
 SELECT 'feeding'::"text" AS "event_type",
    "feedings"."id",
    "feedings"."occurred_at",
    "feedings"."duration_minutes" AS "duration",
    ("feedings"."type")::"text" AS "feeding_type",
    NULL::"text" AS "diaper_type",
    NULL::"text" AS "color",
    NULL::timestamp with time zone AS "end_date",
    "feedings"."note",
    "feedings"."amount_ml" AS "amount",
    "feedings"."baby_id"
   FROM "public"."feedings"
UNION ALL
 SELECT 'diaper'::"text" AS "event_type",
    "diapers"."id",
    "diapers"."occurred_at",
    NULL::integer AS "duration",
    NULL::"text" AS "feeding_type",
    ("diapers"."type")::"text" AS "diaper_type",
    ("diapers"."color")::"text" AS "color",
    NULL::timestamp with time zone AS "end_date",
    "diapers"."note",
    NULL::integer AS "amount",
    "diapers"."baby_id"
   FROM "public"."diapers"
UNION ALL
 SELECT 'sleep'::"text" AS "event_type",
    "sleeps"."id",
    "sleeps"."start_date" AS "occurred_at",
    "sleeps"."duration_minutes" AS "duration",
    NULL::"text" AS "feeding_type",
    NULL::"text" AS "diaper_type",
    NULL::"text" AS "color",
    "sleeps"."end_date",
    "sleeps"."note",
    NULL::integer AS "amount",
    "sleeps"."baby_id"
   FROM "public"."sleeps";


ALTER VIEW "public"."all_events_view" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."babies" (
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "name" character varying NOT NULL,
    "birth_date" timestamp with time zone NOT NULL,
    "gender" "public"."Gender" NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "birth_weight" numeric,
    "birth_length" numeric,
    "blood_type" "public"."BloodType",
    "current_weight" numeric,
    "current_length" numeric,
    "head_circumference" numeric,
    "allergies" "text"[],
    "pediatrician_name" "text",
    "pediatrician_phone" "text",
    "pediatrician_email" "text",
    "emergency_contact_name" "text",
    "emergency_contact_relationship" "text",
    "emergency_contact_phone" "text",
    "notes" "text",
    "medications" "text"[]
);


ALTER TABLE "public"."babies" OWNER TO "postgres";


COMMENT ON TABLE "public"."babies" IS 'here we store all the babies';



CREATE TABLE IF NOT EXISTS "public"."baby_guardians" (
    "baby_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "role" "text" DEFAULT 'guardian'::"text"
);


ALTER TABLE "public"."baby_guardians" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."baby_measurements" (
    "id" bigint NOT NULL,
    "measured_at" timestamp with time zone NOT NULL,
    "baby_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "weight_kg" numeric,
    "length_cm" numeric,
    "head-circumference_cm" numeric
);


ALTER TABLE "public"."baby_measurements" OWNER TO "postgres";


ALTER TABLE "public"."baby_measurements" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."baby_measurements_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."baby_profile_history" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "changed_at" timestamp with time zone NOT NULL,
    "baby_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "section" "public"."BabySettingsSections" NOT NULL,
    "field" "text" NOT NULL,
    "old_value" "jsonb",
    "new_value" "jsonb" NOT NULL,
    "value_type" "public"."SettingValueType" DEFAULT 'string'::"public"."SettingValueType" NOT NULL
);


ALTER TABLE "public"."baby_profile_history" OWNER TO "postgres";


ALTER TABLE "public"."diapers" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."diapers_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE "public"."feedings" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."feeding_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE "public"."sleeps" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."naps_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."reminders" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "baby_id" "uuid" NOT NULL,
    "label" "text" NOT NULL,
    "type" "public"."Reminder type" NOT NULL,
    "time_of_day" time without time zone,
    "interval_minutes" bigint,
    "start_time" time without time zone NOT NULL,
    "end_time" time without time zone NOT NULL,
    "is_active" boolean NOT NULL,
    "last_triggered" timestamp with time zone
);


ALTER TABLE "public"."reminders" OWNER TO "postgres";


ALTER TABLE ONLY "public"."babies"
    ADD CONSTRAINT "babies_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."baby_guardians"
    ADD CONSTRAINT "baby_guardians_pkey" PRIMARY KEY ("baby_id", "user_id");



ALTER TABLE ONLY "public"."baby_measurements"
    ADD CONSTRAINT "baby_measurements_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."baby_profile_history"
    ADD CONSTRAINT "baby_profile_history_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."diapers"
    ADD CONSTRAINT "diapers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."feedings"
    ADD CONSTRAINT "feeding_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."sleeps"
    ADD CONSTRAINT "naps_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."reminders"
    ADD CONSTRAINT "reminders_pkey" PRIMARY KEY ("id");



CREATE INDEX "baby_guardians_user_id_idx" ON "public"."baby_guardians" USING "btree" ("user_id");



ALTER TABLE ONLY "public"."baby_guardians"
    ADD CONSTRAINT "baby_guardians_baby_id_fkey" FOREIGN KEY ("baby_id") REFERENCES "public"."babies"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."baby_guardians"
    ADD CONSTRAINT "baby_guardians_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."baby_measurements"
    ADD CONSTRAINT "baby_measurements_baby_id_fkey" FOREIGN KEY ("baby_id") REFERENCES "public"."babies"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."baby_measurements"
    ADD CONSTRAINT "baby_measurements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."baby_profile_history"
    ADD CONSTRAINT "baby_profile_history_baby_id_fkey" FOREIGN KEY ("baby_id") REFERENCES "public"."babies"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."baby_profile_history"
    ADD CONSTRAINT "baby_profile_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."diapers"
    ADD CONSTRAINT "diapers_baby_id_fkey" FOREIGN KEY ("baby_id") REFERENCES "public"."babies"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."feedings"
    ADD CONSTRAINT "feedings_baby_id_fkey" FOREIGN KEY ("baby_id") REFERENCES "public"."babies"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."sleeps"
    ADD CONSTRAINT "naps_baby_id_fkey" FOREIGN KEY ("baby_id") REFERENCES "public"."babies"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reminders"
    ADD CONSTRAINT "reminders_baby_id_fkey" FOREIGN KEY ("baby_id") REFERENCES "public"."babies"("id") ON UPDATE CASCADE ON DELETE CASCADE;



CREATE POLICY "Allow authenticated users to delete diapers on their babies" ON "public"."diapers" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."baby_guardians" "bg"
  WHERE (("diapers"."baby_id" = "bg"."baby_id") AND ("bg"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))));



CREATE POLICY "Allow authenticated users to delete feedings on their babies" ON "public"."feedings" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."baby_guardians" "bg"
  WHERE (("feedings"."baby_id" = "bg"."baby_id") AND ("bg"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))));



CREATE POLICY "Allow authenticated users to delete reminders on their babies" ON "public"."reminders" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."baby_guardians" "bg"
  WHERE (("reminders"."baby_id" = "bg"."baby_id") AND ("bg"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))));



CREATE POLICY "Allow authenticated users to delete sleeps on their babies" ON "public"."sleeps" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."baby_guardians" "bg"
  WHERE (("sleeps"."baby_id" = "bg"."baby_id") AND ("bg"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))));



CREATE POLICY "Allow authenticated users to insert in baby_guardians" ON "public"."baby_guardians" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Allow authenticated users to insert in diapers" ON "public"."diapers" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Allow authenticated users to insert in feedings" ON "public"."feedings" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Allow authenticated users to insert in reminders" ON "public"."reminders" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Allow authenticated users to insert in sleeps" ON "public"."sleeps" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Allow authenticated users to update diapers on their babies" ON "public"."diapers" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."baby_guardians" "bg"
  WHERE (("diapers"."baby_id" = "bg"."baby_id") AND ("bg"."user_id" = ( SELECT "auth"."uid"() AS "uid")))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."baby_guardians" "bg"
  WHERE (("bg"."baby_id" = "diapers"."baby_id") AND ("bg"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))));



CREATE POLICY "Allow authenticated users to update feedings on their babies" ON "public"."feedings" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."baby_guardians" "bg"
  WHERE (("feedings"."baby_id" = "bg"."baby_id") AND ("bg"."user_id" = ( SELECT "auth"."uid"() AS "uid")))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."baby_guardians" "bg"
  WHERE (("bg"."baby_id" = "feedings"."baby_id") AND ("bg"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))));



CREATE POLICY "Allow authenticated users to update reminders on their babies" ON "public"."reminders" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."baby_guardians" "bg"
  WHERE (("reminders"."baby_id" = "bg"."baby_id") AND ("bg"."user_id" = ( SELECT "auth"."uid"() AS "uid")))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."baby_guardians" "bg"
  WHERE (("bg"."baby_id" = "reminders"."baby_id") AND ("bg"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))));



CREATE POLICY "Allow authenticated users to update sleeps on their babies" ON "public"."sleeps" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."baby_guardians" "bg"
  WHERE (("sleeps"."baby_id" = "bg"."baby_id") AND ("bg"."user_id" = ( SELECT "auth"."uid"() AS "uid")))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."baby_guardians" "bg"
  WHERE (("bg"."baby_id" = "sleeps"."baby_id") AND ("bg"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))));



CREATE POLICY "Allow authenticated users to view baby_guardians" ON "public"."baby_guardians" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Allow authenticated users to view diapers" ON "public"."diapers" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Allow authenticated users to view feedings" ON "public"."feedings" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Allow authenticated users to view reminders" ON "public"."reminders" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Allow authenticated users to view sleeps" ON "public"."sleeps" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Allow users with same user_id to delete" ON "public"."baby_guardians" FOR DELETE TO "authenticated" USING (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "Authenticated can insert" ON "public"."baby_profile_history" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Authenticated can select" ON "public"."baby_measurements" FOR SELECT USING (true);



CREATE POLICY "Authenticated could select" ON "public"."baby_profile_history" FOR SELECT USING (true);



CREATE POLICY "Can delete only own records" ON "public"."baby_measurements" FOR DELETE USING (( SELECT ("auth"."uid"() = "baby_measurements"."user_id")));



CREATE POLICY "Can only update own rows" ON "public"."baby_measurements" FOR UPDATE USING (( SELECT ("auth"."uid"() = "baby_measurements"."user_id"))) WITH CHECK (( SELECT ("auth"."uid"() = "baby_measurements"."user_id")));



CREATE POLICY "Delete only own records" ON "public"."baby_profile_history" FOR DELETE USING (( SELECT ("auth"."uid"() = "baby_profile_history"."user_id")));



CREATE POLICY "Enable insert for authenticated users only" ON "public"."babies" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."baby_measurements" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable read access for all users" ON "public"."babies" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Enable update for users based on email" ON "public"."baby_guardians" FOR UPDATE USING (( SELECT ("auth"."uid"() = "baby_guardians"."user_id"))) WITH CHECK (( SELECT ("auth"."uid"() = "baby_guardians"."user_id")));



CREATE POLICY "Guardians can delete only their babies" ON "public"."babies" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."baby_guardians" "bg"
  WHERE (("babies"."id" = "bg"."baby_id") AND ("bg"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))));



CREATE POLICY "Guardians can update their babies" ON "public"."babies" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."baby_guardians" "bg"
  WHERE (("bg"."baby_id" = "babies"."id") AND ("bg"."user_id" = ( SELECT "auth"."uid"() AS "uid")))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."baby_guardians" "bg"
  WHERE (("bg"."baby_id" = "babies"."id") AND ("bg"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))));



CREATE POLICY "Update only own records" ON "public"."baby_profile_history" FOR UPDATE USING (( SELECT ("auth"."uid"() = "baby_profile_history"."user_id"))) WITH CHECK (( SELECT ("auth"."uid"() = "baby_profile_history"."user_id")));



ALTER TABLE "public"."babies" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."baby_guardians" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."baby_measurements" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."baby_profile_history" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."diapers" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."feedings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."reminders" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."sleeps" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";








































































































































































GRANT ALL ON TABLE "public"."diapers" TO "anon";
GRANT ALL ON TABLE "public"."diapers" TO "authenticated";
GRANT ALL ON TABLE "public"."diapers" TO "service_role";



GRANT ALL ON TABLE "public"."feedings" TO "anon";
GRANT ALL ON TABLE "public"."feedings" TO "authenticated";
GRANT ALL ON TABLE "public"."feedings" TO "service_role";



GRANT ALL ON TABLE "public"."sleeps" TO "anon";
GRANT ALL ON TABLE "public"."sleeps" TO "authenticated";
GRANT ALL ON TABLE "public"."sleeps" TO "service_role";



GRANT ALL ON TABLE "public"."all_events_view" TO "anon";
GRANT ALL ON TABLE "public"."all_events_view" TO "authenticated";
GRANT ALL ON TABLE "public"."all_events_view" TO "service_role";



GRANT ALL ON TABLE "public"."babies" TO "anon";
GRANT ALL ON TABLE "public"."babies" TO "authenticated";
GRANT ALL ON TABLE "public"."babies" TO "service_role";



GRANT ALL ON TABLE "public"."baby_guardians" TO "anon";
GRANT ALL ON TABLE "public"."baby_guardians" TO "authenticated";
GRANT ALL ON TABLE "public"."baby_guardians" TO "service_role";



GRANT ALL ON TABLE "public"."baby_measurements" TO "anon";
GRANT ALL ON TABLE "public"."baby_measurements" TO "authenticated";
GRANT ALL ON TABLE "public"."baby_measurements" TO "service_role";



GRANT ALL ON SEQUENCE "public"."baby_measurements_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."baby_measurements_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."baby_measurements_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."baby_profile_history" TO "anon";
GRANT ALL ON TABLE "public"."baby_profile_history" TO "authenticated";
GRANT ALL ON TABLE "public"."baby_profile_history" TO "service_role";



GRANT ALL ON SEQUENCE "public"."diapers_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."diapers_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."diapers_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."feeding_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."feeding_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."feeding_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."naps_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."naps_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."naps_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."reminders" TO "anon";
GRANT ALL ON TABLE "public"."reminders" TO "authenticated";
GRANT ALL ON TABLE "public"."reminders" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";






























RESET ALL;
