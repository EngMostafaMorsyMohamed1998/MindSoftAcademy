import { LogOut } from "lucide-react";
import { signOutStudent } from "@/app/actions/session";

export function LogoutButton({
  className,
  label = "Log out",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <form action={signOutStudent}>
      <button type="submit" className={className}>
        <LogOut className="size-3.5" aria-hidden="true" />
        {label}
      </button>
    </form>
  );
}
