interface Address {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface Lead {
  leadId: string;
  name: string;
  customerId: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  source?: string;
  ownerId?: string;
  contactId?: string;
  primaryEmail?: string;
  primaryPhone?: string;
  jobTitle?: string;
  primaryAddress?: Address;
  emails?: string[];
  phones?: string[];
  addresses?: Address[];
  lastActivityTime?: Date;
  uri?: string;
  createdById?: string;
  updatedById?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadsResponse {
  leads: Lead[];
} 