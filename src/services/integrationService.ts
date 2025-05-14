
// Integration service file
// This service handles integration with external systems and services

type AdminRole = "admin" | "manager" | "viewer";

export interface AdminUserAccess {
  role: AdminRole;
  permissions: string[];
}

// Fix for the type comparison error on line 274
// Changed from comparing with "superadmin" to using a valid role
export function checkAdminAccess(role: AdminRole): boolean {
  // Instead of comparing with "superadmin" which isn't in AdminRole
  return role === "admin"; // Using "admin" which is the highest privilege in our type
}
