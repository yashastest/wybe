
import React from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';

type AdminLayoutProps = {
  children: React.ReactNode;
};

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-wybe-background">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
