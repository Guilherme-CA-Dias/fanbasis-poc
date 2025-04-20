import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Lead } from '@/models/lead';
import { getAuthFromRequest } from '@/lib/server-auth';
import { getIntegrationClient } from '@/lib/integration-app-client';

interface LeadFields {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  companyName: string;
  source: string;
  ownerId: string;
  contactId: string | null;
  primaryEmail: string;
  primaryPhone: string;
  phones: string[];
  primaryAddress: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  jobTitle: string;
  emails: string[];
  addresses: Array<{
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  }>;
  lastActivityTime: string | null;
}

interface ExternalLead {
  id: string;
  name: string;
  uri: string;
  createdTime: string;
  updatedTime: string;
  createdById: string;
  updatedById: string;
  fields: LeadFields;
}

export async function POST(request: NextRequest) {
  try {
    const auth = getAuthFromRequest(request);
    if (!auth.customerId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    // 1. Get Integration.app client
    const client = await getIntegrationClient(auth);

    // 2. Find the first available connection
    const connectionsResponse = await client.connections.find();
    const firstConnection = connectionsResponse.items?.[0];

    if (!firstConnection) {
      return NextResponse.json(
        { error: 'No apps connected to import leads from' },
        { status: 400 }
      );
    }

    // 3. Get leads from the CRM via Integration.app
    const result = await client
      .connection(firstConnection.id)
      .action('get-leads')
      .run();

    // Type assertion since we know the shape of the response
    const externalLeads = (result.output.records as unknown as ExternalLead[]);

    // 4. Delete existing leads for this customer
    await Lead.deleteMany({ customerId: auth.customerId });

    // 5. Create new leads with all available data
    const leads = await Lead.create(
      externalLeads.map((lead) => ({
        leadId: lead.id,
        name: lead.fields.fullName || `${lead.fields.firstName || ''} ${lead.fields.lastName || ''}`.trim() || 'Unnamed Lead',
        customerId: auth.customerId,
        firstName: lead.fields.firstName,
        lastName: lead.fields.lastName,
        companyName: lead.fields.companyName,
        source: lead.fields.source,
        ownerId: lead.fields.ownerId,
        contactId: lead.fields.contactId,
        primaryEmail: lead.fields.primaryEmail,
        primaryPhone: lead.fields.primaryPhone,
        jobTitle: lead.fields.jobTitle,
        primaryAddress: lead.fields.primaryAddress,
        emails: lead.fields.emails,
        phones: lead.fields.phones,
        addresses: lead.fields.addresses,
        lastActivityTime: lead.fields.lastActivityTime,
        uri: lead.uri,
        createdById: lead.createdById,
        updatedById: lead.updatedById,
        createdAt: new Date(lead.createdTime),
        updatedAt: new Date(lead.updatedTime),
      }))
    );

    return NextResponse.json({ leads }, { status: 200 });
  } catch (error) {
    console.error('Error importing leads:', error);
    return NextResponse.json(
      { error: 'Failed to import leads' },
      { status: 500 }
    );
  }
} 