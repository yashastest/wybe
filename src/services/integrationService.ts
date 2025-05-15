import { supabase } from "@/integrations/supabase/client";

export interface SecurityReport {
  id: string;
  contract_address: string;
  contract_name: string;
  project_id: string;
  report_url: string;
  status: string;
  created_at: string;
  updated_at: string;
  project_name: string;
}

export interface ChecklistItem {
  id: string;
  security_report_id: string;
  item_text: string;
  is_complete: boolean;
  created_at: string;
  updated_at: string;
}

export interface IntegrationService {
  getSecurityReports: () => Promise<SecurityReport[]>;
  getSecurityReport: (id: string) => Promise<SecurityReport | null>;
  getChecklistItems: (security_report_id: string) => Promise<ChecklistItem[]>;
  updateChecklistItem: (id: string, isComplete: boolean) => Promise<{success: boolean, error?: any}>;
}

const getSecurityReports = async (): Promise<SecurityReport[]> => {
  try {
    const { data, error } = await supabase
      .from('security_reports')
      .select('*');

    if (error) {
      console.error("Error fetching security reports:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Unexpected error fetching security reports:", error);
    return [];
  }
};

const getSecurityReport = async (id: string): Promise<SecurityReport | null> => {
  try {
    const { data, error } = await supabase
      .from('security_reports')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error("Error fetching security report:", error);
      return null;
    }

    return data || null;
  } catch (error) {
    console.error("Unexpected error fetching security report:", error);
    return null;
  }
};

const getChecklistItems = async (security_report_id: string): Promise<ChecklistItem[]> => {
  try {
    const { data, error } = await supabase
      .from('checklist_items')
      .select('*')
      .eq('security_report_id', security_report_id);

    if (error) {
      console.error("Error fetching checklist items:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Unexpected error fetching checklist items:", error);
    return [];
  }
};

const updateChecklistItem = async (id: string, isComplete: boolean) => {
  try {
    // In a real application, this would update a database record
    // For now, we'll just log and return success
    console.log(`Updating checklist item ${id} to ${isComplete ? 'complete' : 'incomplete'}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update checklist item:", error);
    return { success: false, error };
  }
};

export const integrationService: IntegrationService = {
  getSecurityReports,
  getSecurityReport,
  getChecklistItems,
  updateChecklistItem,
};
