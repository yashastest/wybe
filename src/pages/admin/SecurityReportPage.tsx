
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SecurityAuditReport from '@/components/admin/SecurityAuditReport';
import { Badge } from '@/components/ui/badge';

interface LocationState {
  programId: string;
}

const SecurityReportPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { programId } = (location.state as LocationState) || { programId: '' };
  
  useEffect(() => {
    if (!programId) {
      navigate('/admin');
    }
  }, [programId, navigate]);
  
  const handleBack = () => {
    navigate(-1);
  };
  
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={handleBack} className="flex items-center">
          <ArrowLeft className="mr-2" size={18} />
          Back to Admin
        </Button>
        
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-green-400 border-green-500">Audit Complete</Badge>
          <Badge variant="outline" className="text-gray-400">#{programId.substring(0, 6)}</Badge>
        </div>
      </div>
      
      <h1 className="text-2xl font-bold">Smart Contract Security Report</h1>
      
      {programId && <SecurityAuditReport programId={programId} />}
    </div>
  );
};

export default SecurityReportPage;
