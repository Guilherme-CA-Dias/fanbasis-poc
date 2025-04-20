import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Lead } from '@/models/lead';

interface WebhookPayload {
  type: 'created' | 'updated' | 'deleted';
  externalLeadId: string;
  userId: string;
  data: {
    name?: string;
    websiteUrl?: string;
    primaryPhone?: string;
    // Add other possible fields from CRM
    [key: string]: any;
  };
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const payload = (await request.json()) as WebhookPayload;
    const { type, externalLeadId, userId, data } = payload;

    if (!type || !externalLeadId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case 'created':
        // Create new lead
        result = await Lead.create({
          leadId: externalLeadId,
          name: data.name,
          websiteUrl: data.websiteUrl,
          primaryPhone: data.primaryPhone,
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        break;

      case 'updated':
        // Update existing lead
        result = await Lead.findOneAndUpdate(
          { leadId: externalLeadId },
          {
            $set: {
              name: data.name,
              websiteUrl: data.websiteUrl,
              primaryPhone: data.primaryPhone,
              ...data,
              updatedAt: new Date(),
            },
          },
          { new: true }
        );
        break;

      case 'deleted':
        // Delete the lead
        result = await Lead.findOneAndDelete({ leadId: externalLeadId });
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid operation type' },
          { status: 400 }
        );
    }

    if (!result && type !== 'deleted') {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true,
      type,
      lead: result 
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 