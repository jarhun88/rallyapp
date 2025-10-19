import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If user is already authenticated, redirect to home
  if (user) {
    return redirect("/home");
  }

  return <>{children}</>;
}
