import { useEffect, useState } from "react";
import { hasAdminAccess } from "@/lib/admin";

export function useAdminAccess() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminStatus = hasAdminAccess();
    setIsAdmin(adminStatus);
    setLoading(false);
  }, []);

  return { isAdmin, loading };
}
