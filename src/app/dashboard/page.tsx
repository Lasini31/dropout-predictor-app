"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      if (session.user?.role === "admin") {
        router.push("/dashboard/admin");
      } else if (session.user?.role === "student") {
        router.push("/dashboard/student");
      } else if (session.user?.role === "parent") {
        router.push("/dashboard/parent");
      }
    }
  }, [session, status, router]);

  return <p>Redirecting...</p>;
}
