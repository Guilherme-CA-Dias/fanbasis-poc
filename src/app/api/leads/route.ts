import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Lead } from '@/models/lead';
import { getAuthFromRequest } from '@/lib/server-auth';

export async function GET(request: NextRequest) {
  try {
    const auth = getAuthFromRequest(request);
    if (!auth.customerId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const leads = await Lead.find({ customerId: auth.customerId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ leads });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
} 