import { NextResponse } from "next/server";
import { LearnerPlan } from "@/lib/models/LearnerPlan";
import dbConnect from "@/lib/mongodb";

export async function GET() {
  await dbConnect();
  try {
    const plans = await LearnerPlan.find().select("_id planName").lean();
    return NextResponse.json(plans);
  } catch (error) {
    console.error("Error fetching learner plans:", error);
    return NextResponse.json({ error: "Failed to fetch learner plans" }, { status: 500 });
  }
}
