// Integration service file
// This service handles integration with external systems and services

type AdminRole = "admin" | "manager" | "viewer" | "superadmin";

export interface AdminUserAccess {
  email: string;
  role: AdminRole;
  permissions: string[];
  walletAddress?: string;
  twoFactorEnabled?: boolean;
}

// Fix for the type comparison error on line 274
export function checkAdminAccess(role: AdminRole): boolean {
  return role === "admin" || role === "superadmin"; 
}

// Mock admin user data
const mockAdminUsers: AdminUserAccess[] = [
  {
    email: "admin@wybe.io",
    role: "superadmin",
    permissions: ["all"],
    walletAddress: "WYBE123456789abcdef",
    twoFactorEnabled: true
  },
  {
    email: "manager@wybe.io",
    role: "manager",
    permissions: ["analytics_view", "token_creation"],
    walletAddress: "",
    twoFactorEnabled: false
  },
  {
    email: "viewer@wybe.io",
    role: "viewer",
    permissions: ["analytics_view"],
    walletAddress: "",
    twoFactorEnabled: false
  }
];

// Integration service implementation
export const integrationService = {
  // Admin user methods
  getAdminUsers: (walletAddress: string): AdminUserAccess[] => {
    console.log(`Getting admin users with wallet: ${walletAddress}`);
    return mockAdminUsers;
  },
  
  addAdminUser: (user: AdminUserAccess, walletAddress: string): boolean => {
    console.log(`Adding admin user: ${user.email} with role: ${user.role}`);
    if (mockAdminUsers.find(u => u.email === user.email)) {
      return false; // User already exists
    }
    mockAdminUsers.push(user);
    return true;
  },
  
  updateAdminUserPermissions: (
    email: string, 
    role: AdminRole, 
    permissions: string[], 
    walletAddress: string
  ): boolean => {
    console.log(`Updating permissions for user: ${email}`);
    const userIndex = mockAdminUsers.findIndex(u => u.email === email);
    if (userIndex === -1) return false;
    
    mockAdminUsers[userIndex].role = role;
    mockAdminUsers[userIndex].permissions = permissions;
    return true;
  },
  
  removeAdminUser: (email: string, walletAddress: string): boolean => {
    console.log(`Removing admin user: ${email}`);
    const initialLength = mockAdminUsers.length;
    const filtered = mockAdminUsers.filter(u => u.email !== email);
    
    if (filtered.length === initialLength) {
      return false; // User not found
    }
    
    // Update the reference keeping the same array
    mockAdminUsers.length = 0;
    mockAdminUsers.push(...filtered);
    return true;
  },

  // Anchor CLI mock status methods
  setMockAnchorStatus: (enabled: boolean, version?: string): void => {
    console.log(`Setting mock anchor status: ${enabled}, version: ${version || 'N/A'}`);
    localStorage.setItem("mockAnchorEnabled", String(enabled));
    if (version) {
      localStorage.setItem("mockAnchorVersion", version);
    }
  },
  
  getMockAnchorStatus: (): { enabled: boolean; version?: string } => {
    const enabled = localStorage.getItem("mockAnchorEnabled") === "true";
    const version = localStorage.getItem("mockAnchorVersion") || undefined;
    return { enabled, version };
  },

  // Other integration methods can be added here
};
