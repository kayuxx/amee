"use client";
import { logout } from "@/app/actions/session";
import { useRouter } from "next/navigation";

export function Logout() {
  const router = useRouter();
  async function handleClick() {
    await logout();
    // This will refresh the current page (e.g., /protected-route) to trigger the middleware.
    // Alternatively, you can set it manually.
    // router.refresh does not update the url
    // Note that if you use the push method instead of replace, the user can access the protected route.
    router.replace(window.location.pathname);
  }
  return <button onClick={handleClick}>Logout</button>;
}
