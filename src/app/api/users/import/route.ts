import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { User } from '@/models/user';
import { getAuthFromRequest } from '@/lib/server-auth';
import { getIntegrationClient } from '@/lib/integration-app-client';

interface ExternalLead {
  id: string;
  name: string;
  // Add any other lead fields you want to store
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
    await User.deleteMany({ customerId: auth.customerId });

    // 5. Create new leads from the imported data
    const leads = await User.create(
      externalLeads.map((lead) => ({
        userId: lead.id, // Keeping the same schema but storing lead data
        userName: lead.name,
        customerId: auth.customerId,
      }))
    );

    return NextResponse.json({ users: leads }, { status: 200 });
  } catch (error) {
    console.error('Error importing leads:', error);
    return NextResponse.json(
      { error: 'Failed to import leads' },
      { status: 500 }
    );
  }
} 