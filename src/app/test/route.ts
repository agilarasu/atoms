import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { generatePlan } from "@/Agents/Planner";
import LearnerProfile from "@/lib/types/LearnerProfile";
import LearnerPlan from "@/lib/types/LearnerPlan";

export async function POST(request: NextRequest) {
  const learnerProfile: LearnerProfile = await request.json();
  const plan: LearnerPlan = await generatePlan(learnerProfile);
  return NextResponse.json({ plan });
}
