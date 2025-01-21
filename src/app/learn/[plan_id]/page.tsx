"use server";
// show info of the plan

export default async function Page({ params }: { params: Promise<{ plan_id: string }> }) {
    const { plan_id } = await params;
    const planId = parseInt(plan_id, 10);
    return (
        <div>
            <h1>Inside Plan {planId}</h1>
            <p>(Rendered on client)</p>
        </div>
    );
}