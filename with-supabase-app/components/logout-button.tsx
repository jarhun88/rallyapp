"use client";

import { LogOut, Loader2 } from "lucide-react";
import { useLogout } from "@/hooks/use-logout";

export function LogoutButton() {
  const { logout, isLoggingOut } = useLogout();

  return (
    <button
      onClick={logout}
      disabled={isLoggingOut}
      className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full text-left disabled:opacity-50"
    >
      {isLoggingOut ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="mr-2 h-4 w-4" />
      )}
      <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
    </button>
  );
}
