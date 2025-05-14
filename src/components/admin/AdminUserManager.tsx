
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { 
  Shield, 
  UserPlus, 
  Edit2, 
  Trash2, 
  CheckCircle2,
  Mail,
  Lock,
  RefreshCcw
} from "lucide-react";
import { integrationService, AdminUserAccess } from '@/services/integrationService';
import useWallet from '@/hooks/useWallet';

// Available permissions
const availablePermissions = [
  { id: 'user_management', label: 'User Management' },
  { id: 'contract_deployment', label: 'Contract Deployment' },
  { id: 'token_creation', label: 'Token Creation' },
  { id: 'treasury_update', label: 'Treasury Management' },
  { id: 'analytics_view', label: 'View Analytics' },
  { id: 'settings_change', label: 'Change Settings' },
];

const AdminUserManager = () => {
  const [users, setUsers] = useState<AdminUserAccess[]>([]);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUserAccess | null>(null);
  const { walletAddress } = useWallet();
  
  const [newUser, setNewUser] = useState<AdminUserAccess>({
    email: '',
    role: 'viewer',
    permissions: ['analytics_view'],
    walletAddress: '',
    twoFactorEnabled: false
  });
  
  const [loading, setLoading] = useState(false);

  // Load existing admin users
  useEffect(() => {
    if (walletAddress) {
      const adminUsers = integrationService.getAdminUsers(walletAddress);
      if (adminUsers) {
        setUsers(adminUsers);
      }
    }
  }, [walletAddress]);

  // Handle input change for new user form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle role change
  const handleRoleChange = (role: string) => {
    setNewUser(prev => {
      // Automatically assign permissions based on role
      let permissions: string[] = [];
      
      if (role === 'superadmin') {
        permissions = ['all'];
      } else if (role === 'admin') {
        permissions = availablePermissions.map(p => p.id).filter(p => p !== 'treasury_update');
      } else if (role === 'manager') {
        permissions = ['analytics_view', 'token_creation'];
      } else {
        permissions = ['analytics_view'];
      }
      
      return {
        ...prev,
        role: role as 'superadmin' | 'admin' | 'manager' | 'viewer',
        permissions
      };
    });
  };

  // Toggle permission selection
  const handlePermissionToggle = (permissionId: string) => {
    setNewUser(prev => {
      // If user already has 'all' permission and is toggling a specific one, remove 'all'
      if (prev.permissions.includes('all') && permissionId !== 'all') {
        const allPermissions = availablePermissions.map(p => p.id);
        return {
          ...prev,
          permissions: allPermissions.filter(p => p !== permissionId)
        };
      }
      
      // If user is selecting 'all', return only ['all']
      if (permissionId === 'all') {
        return {
          ...prev,
          permissions: ['all']
        };
      }
      
      // Otherwise toggle the specific permission
      const newPermissions = prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId];
        
      return {
        ...prev,
        permissions: newPermissions
      };
    });
  };

  // Add new user
  const handleAddUser = () => {
    if (!newUser.email || !newUser.role || !walletAddress) {
      toast.error("Email and role are required");
      return;
    }
    
    if (!newUser.email.includes('@')) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const success = integrationService.addAdminUser(newUser, walletAddress);
      
      if (success) {
        setUsers(prev => [...prev, newUser]);
        toast.success(`Added new ${newUser.role}: ${newUser.email}`);
        setNewUser({
          email: '',
          role: 'viewer',
          permissions: ['analytics_view'],
          walletAddress: '',
          twoFactorEnabled: false
        });
        setIsAddingUser(false);
      } else {
        toast.error("Failed to add user. Email may already exist.");
      }
      
      setLoading(false);
    }, 1000);
  };

  // Edit existing user
  const handleEditUser = (user: AdminUserAccess) => {
    setSelectedUser(user);
    setNewUser({ ...user });
    setIsEditingUser(true);
  };

  // Update user
  const handleUpdateUser = () => {
    if (!selectedUser || !newUser.email || !newUser.role || !walletAddress) {
      toast.error("Invalid user data");
      return;
    }
    
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const success = integrationService.updateAdminUserPermissions(
        selectedUser.email,
        newUser.role,
        newUser.permissions,
        walletAddress
      );
      
      if (success) {
        setUsers(prev => 
          prev.map(user => 
            user.email === selectedUser.email ? { ...user, role: newUser.role, permissions: newUser.permissions } : user
          )
        );
        toast.success(`Updated user: ${selectedUser.email}`);
        setIsEditingUser(false);
      } else {
        toast.error("Failed to update user");
      }
      
      setLoading(false);
    }, 1000);
  };

  // Delete user confirmation
  const handleDeleteUser = (email: string) => {
    if (!walletAddress) {
      toast.error("Wallet connection required");
      return;
    }
    
    const success = integrationService.removeAdminUser(email, walletAddress);
    
    if (success) {
      setUsers(prev => prev.filter(user => user.email !== email));
      toast.success(`Removed user: ${email}`);
    }
  };

  // Check if a permission is selected
  const isPermissionSelected = (permissionId: string) => {
    return newUser.permissions.includes(permissionId) || newUser.permissions.includes('all');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Shield className="text-orange-500" size={22} />
            Admin User Management
          </h2>
          <p className="text-gray-400 text-sm">Manage access controls for admin users</p>
        </div>
        
        <Dialog open={isAddingUser} onOpenChange={setIsAddingUser}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <UserPlus size={18} className="mr-2" />
              Add Admin User
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-wybe-background-light sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Admin User</DialogTitle>
              <DialogDescription>
                Create a new administrator with specific permissions
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  name="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={newUser.email}
                  onChange={handleInputChange}
                  className="bg-black/30"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Wallet Address (Optional)</label>
                <Input
                  name="walletAddress"
                  placeholder="Solana wallet address"
                  value={newUser.walletAddress}
                  onChange={handleInputChange}
                  className="bg-black/30 font-mono text-xs"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <Select 
                  value={newUser.role} 
                  onValueChange={handleRoleChange}
                >
                  <SelectTrigger className="bg-black/30">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-wybe-background-light">
                    <SelectItem value="superadmin">Super Admin (Full Access)</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="viewer">Viewer (Read Only)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-medium">Permissions</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="all-permissions"
                      checked={newUser.permissions.includes('all')}
                      onCheckedChange={() => handlePermissionToggle('all')}
                    />
                    <label 
                      htmlFor="all-permissions"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      All Permissions
                    </label>
                  </div>
                  
                  {availablePermissions.map((permission) => (
                    <div className="flex items-center space-x-2" key={permission.id}>
                      <Checkbox 
                        id={permission.id}
                        checked={isPermissionSelected(permission.id)}
                        onCheckedChange={() => handlePermissionToggle(permission.id)}
                        disabled={newUser.permissions.includes('all')}
                      />
                      <label 
                        htmlFor={permission.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {permission.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline"
                onClick={() => setIsAddingUser(false)}
                className="border-white/20"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddUser}
                className="bg-orange-500 hover:bg-orange-600"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <RefreshCcw className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add User
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Edit User Dialog */}
        <Dialog open={isEditingUser} onOpenChange={setIsEditingUser}>
          <DialogContent className="bg-wybe-background-light sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Admin User</DialogTitle>
              <DialogDescription>
                Update permissions for {selectedUser?.email}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  value={newUser.email}
                  className="bg-black/30"
                  disabled
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <Select 
                  value={newUser.role} 
                  onValueChange={handleRoleChange}
                >
                  <SelectTrigger className="bg-black/30">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-wybe-background-light">
                    <SelectItem value="superadmin">Super Admin (Full Access)</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="viewer">Viewer (Read Only)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-medium">Permissions</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="edit-all-permissions"
                      checked={newUser.permissions.includes('all')}
                      onCheckedChange={() => handlePermissionToggle('all')}
                    />
                    <label 
                      htmlFor="edit-all-permissions"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      All Permissions
                    </label>
                  </div>
                  
                  {availablePermissions.map((permission) => (
                    <div className="flex items-center space-x-2" key={`edit-${permission.id}`}>
                      <Checkbox 
                        id={`edit-${permission.id}`}
                        checked={isPermissionSelected(permission.id)}
                        onCheckedChange={() => handlePermissionToggle(permission.id)}
                        disabled={newUser.permissions.includes('all')}
                      />
                      <label 
                        htmlFor={`edit-${permission.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {permission.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline"
                onClick={() => setIsEditingUser(false)}
                className="border-white/20"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleUpdateUser}
                className="bg-orange-500 hover:bg-orange-600"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <RefreshCcw className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="glass-card border-orange-500/20">
        <div className="p-4 border-b border-white/10 flex items-center space-x-2">
          <Lock className="text-orange-500" size={18} />
          <h3 className="font-poppins font-bold">Access Control List</h3>
        </div>
        
        <div className="p-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Wallet</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.email} className="border-white/5">
                  <TableCell className="flex items-center gap-2">
                    <Mail size={14} className="text-gray-400" />
                    <span>{user.email}</span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      user.role === 'superadmin' 
                        ? 'bg-purple-500/30 text-purple-300' 
                        : user.role === 'admin'
                          ? 'bg-orange-500/30 text-orange-300'
                          : user.role === 'manager'
                            ? 'bg-blue-500/30 text-blue-300'
                            : 'bg-gray-500/30 text-gray-300'
                    }`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-xs text-gray-400 truncate block max-w-[100px]">
                      {user.walletAddress || '-'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.permissions.includes('all') ? (
                        <span className="px-2 py-0.5 bg-green-500/20 text-green-300 rounded-full text-xs">All</span>
                      ) : (
                        user.permissions.map(permission => {
                          const permLabel = availablePermissions.find(p => p.id === permission)?.label || permission;
                          return (
                            <span 
                              key={permission} 
                              className="px-2 py-0.5 bg-wybe-background/50 border border-white/10 rounded-full text-xs"
                            >
                              {permLabel}
                            </span>
                          );
                        })
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                        disabled={user.role === 'superadmin' && users.filter(u => u.role === 'superadmin').length === 1}
                        className="h-8 w-8 p-0"
                      >
                        <Edit2 size={14} />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteUser(user.email)}
                        disabled={user.role === 'superadmin' && users.filter(u => u.role === 'superadmin').length === 1}
                        className="h-8 w-8 p-0 hover:text-red-500"
                      >
                        <Trash2 size={14} />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-400">
                    No admin users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      <div className="glass-card border-orange-500/20 p-6">
        <h3 className="font-poppins font-bold mb-4 flex items-center gap-2">
          <Shield className="text-orange-500" size={18} />
          Permission Hierarchy
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-black/20 p-4 rounded-lg border border-purple-500/20">
            <h4 className="font-bold text-purple-400 mb-2">Super Admin</h4>
            <p className="text-sm text-gray-300 mb-2">Complete access to all system functions</p>
            <ul className="text-xs space-y-1 text-gray-400">
              <li>• All permissions</li>
              <li>• Treasury management</li>
              <li>• User management</li>
              <li>• System configuration</li>
            </ul>
          </div>
          
          <div className="bg-black/20 p-4 rounded-lg border border-orange-500/20">
            <h4 className="font-bold text-orange-400 mb-2">Admin</h4>
            <p className="text-sm text-gray-300 mb-2">Broad access with some limitations</p>
            <ul className="text-xs space-y-1 text-gray-400">
              <li>• User management</li>
              <li>• Token creation</li>
              <li>• Analytics access</li>
              <li>• Settings management</li>
            </ul>
          </div>
          
          <div className="bg-black/20 p-4 rounded-lg border border-blue-500/20">
            <h4 className="font-bold text-blue-400 mb-2">Manager</h4>
            <p className="text-sm text-gray-300 mb-2">Operational level access</p>
            <ul className="text-xs space-y-1 text-gray-400">
              <li>• Token creation</li>
              <li>• Analytics access</li>
              <li>• Cannot manage users</li>
              <li>• Limited settings access</li>
            </ul>
          </div>
          
          <div className="bg-black/20 p-4 rounded-lg border border-gray-500/20">
            <h4 className="font-bold text-gray-400 mb-2">Viewer</h4>
            <p className="text-sm text-gray-300 mb-2">Read-only access</p>
            <ul className="text-xs space-y-1 text-gray-400">
              <li>• View analytics</li>
              <li>• No write access</li>
              <li>• No configuration access</li>
              <li>• Monitoring only</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminUserManager;
