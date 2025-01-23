import Link from "next/link";
import dbConnect  from "@/lib/mongodb";
import {LearnerPlan} from "@/lib/models/LearnerPlan";

// return user's plans
export default async function Page() {
  await dbConnect();
  const plans = await LearnerPlan.find({}).exec();

  return (
    <div>
      <h1>My Plans</h1>
      <p>(Rendered on server)</p>
      <Link href="/learn/new"> Create a new plan</Link>
      <ul>
        {plans.map((plan) => (
          <li key={plan._id}>
            <Link href={`/learn/${plan._id}`}>{plan.planName}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}