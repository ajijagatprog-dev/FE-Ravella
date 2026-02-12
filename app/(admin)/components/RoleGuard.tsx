import { ReactNode } from "react";
import { redirect } from "next/navigation";

interface RoleGuardProps {
  children: ReactNode;
  requiredRoles?: string[];
}

export async function RoleGuard({
  children,
  requiredRoles = [],
}: RoleGuardProps) {
  
  const userRole = localStorage.getItem("userRole");

  if (requiredRoles.length > 0 && !userRole) {
    redirect("/login");
  }

  if (requiredRoles.length > 0 && !requiredRoles.includes(userRole || "")) {
    redirect("/unauthorized");
  }

  return <>{children}</>;
}

// Hook untuk cek role di client side
export function useRoleCheck(requiredRoles: string[]): boolean {
  if (typeof window === "undefined") return false;

  const userRole = localStorage.getItem("userRole");
  return requiredRoles.includes(userRole || "");
}

export function withRoleProtection(
  Component: React.ComponentType<any>,
  requiredRoles: string[],
) {
  return function ProtectedComponent(props: any) {
    const hasAccess = useRoleCheck(requiredRoles);

    if (!hasAccess) {
      return <div>Anda tidak memiliki akses ke halaman ini</div>;
    }

    return <Component {...props} />;
  };
}
