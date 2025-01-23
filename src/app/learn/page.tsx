"use server";

import Link from "next/link";

// return user's plans
// import and use client component for profiler

// placeholder for user's plans
const plans = [
  {
    id: 1,
    title: "Plan 1",
  },
  {
    id: 2,
    title: "Plan 2",
  },
];

export default async function Page() {

  return (
    <div>
      <h1>My Plans</h1>
      <p>(Rendered on server)</p>
      <Link href="/learn/new"> Create a new plan</Link>
      <ul>
        {plans.map((plan) => (
            <li key={plan.id}>
                <a href={`/learn/${plan.id}`}>{plan.title}</a>
            </li>
        ))}
      </ul>
    </div>
  );
}