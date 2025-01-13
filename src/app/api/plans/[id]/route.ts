import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Plan from '@/lib/models/plan';

interface Params {
  id: string;
}

export async function GET(req: NextRequest) {
  // get the id from the request parameters, fix this later
  const id = req.nextUrl.pathname.split('/').pop();

  try {
      await dbConnect();
    const plan = await Plan.findById(id);

    if (!plan) {
      return NextResponse.json({ message: 'Plan not found' }, { status: 404 });
    }

    return NextResponse.json(plan, { status: 200 });
  } catch (error) {
    console.error('Error fetching plan:', error);
    return NextResponse.json({ message: 'Error fetching plan' }, { status: 500 });
  }
}