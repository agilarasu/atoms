"use server";
import { getPlan } from "./actions";

export default async function Page({ params }: { params: Promise<{ plan_id: string }> }) {
  const { plan_id } = await params;
  const plan = await getPlan(plan_id);

  if (!plan) {
      return <div>Plan not found {plan_id}</div>;
  }

  return (
      <div>
        <a>rendered on server</a>
        <p>Detailed information about the plan</p>
          <p>{plan.overallGoal}</p>
          <p>{plan.learningPhylosophy}</p>     
          <p>{JSON.stringify(plan.learnerProfile)}</p>     
      </div>
  );
}