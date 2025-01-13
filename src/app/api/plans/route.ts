import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Plan from '@/lib/models/plan';

export async function GET() {
  try {
    await dbConnect();
    const plans = await Plan.find({}, 'courseName courseDescription createdAt');
    return NextResponse.json(plans, { status: 200 });
  } catch (error) {
    console.error('Error fetching plans:', error);
    return NextResponse.json({ message: 'Error fetching plans' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { whatToLearn, whyToLearn, contentPreferences } = await req.json();

    if (!whatToLearn || !whyToLearn || !contentPreferences) {
      return NextResponse.json(
        { message: 'All form fields are required.' },
        { status: 400 },
      );
    }

    // Create a new Plan document with user inputs and placeholder for the rest
    const plan = new Plan({
      whatToLearn,
      whyToLearn,
      contentPreferences,
    });

    await plan.save();

    return NextResponse.json(plan, { status: 201 });
  } catch (error) {
    console.error('Error creating plan:', error);
    return NextResponse.json({ message: 'Error creating plan' }, { status: 500 });
  }
}