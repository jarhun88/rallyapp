import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function logout() {
  const supabase = await createClient();
  
  try {
    // Sign out from Supabase
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Server logout error:', error);
      // Still redirect even if there's an error
    }
    
    // Redirect to login page
    redirect("/auth/login");
  } catch (error) {
    console.error('Server logout error:', error);
    // Still redirect even if there's an error
    redirect("/auth/login");
  }
}
