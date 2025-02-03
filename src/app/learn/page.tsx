"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Page() {
  const { data: session, status } = useSession();
  const [plans, setPlans] = useState<{ _id: string; planName: string }[]>([]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/learn/")
        .then((res) => res.json())
        .then((data) => setPlans(data.plans))
        .catch((err) => console.error("Error fetching plans:", err));
    }
  }, [status]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return <p>Please log in to view your plans.</p>;
  }

  return (
    <div>
      <h1>My Plans</h1>
      <p>(Rendered on client)</p>
      <Link href="/learn/new">Create a new plan</Link>
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
