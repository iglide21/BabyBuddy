import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";

const HomeRoute = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  redirect("/babies");
};

export default HomeRoute;
