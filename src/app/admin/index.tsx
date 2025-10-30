import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminIndexPage() {
  const router = useRouter();
  useEffect(() => {
    const tk = typeof window !== "undefined" && localStorage.getItem("admin_token");
    if (tk) router.replace("/admin/dashboard");
    else router.replace("/admin/login");
  }, [router]);
  return null;
}
