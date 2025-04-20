export interface Lead {
  leadId: string;
  name: string;
  customerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadsResponse {
  leads: Lead[];
} 