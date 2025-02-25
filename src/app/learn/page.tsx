"use client";
import Link from "next/link";

import { useEffect, useState } from "react";

export default function Page() {
  interface Plan {
    _id: string;
    planName: string;
  }

  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    async function fetchPlans() {
      const response = await fetch("/api/learn");
      const data = await response.json();
      setPlans(Array.isArray(data) ? data : []);
    }
    fetchPlans();
  }, []);

  return (
    <div>
      <h1>My Plans</h1>
      <p>(Rendered on client)</p>
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