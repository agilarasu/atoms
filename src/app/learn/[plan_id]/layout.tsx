// sidebar with chat links
"use server";
import Link from "next/link";

export default async function Layout({ params, children }: { params: Promise<{ plan_id: string }>, children: any }) {
    const { plan_id } = await params;
    const planId = parseInt(plan_id, 10);
    return (
        <div>
            <div style={{ display: 'flex' }}>
                <div style={{ width: '200px', borderRight: '1px solid #ccc' }}>
                    <Link href='/learn/'>Back to Plans</Link>
                    <br/>
                    Sidebar with Chat Links (rendered on server)
                    <ul>
                        <li>
                            <Link href={`/learn/${planId}/1`}>Module 1</Link>
                        </li>
                        <li>
                            <Link href={`/learn/${planId}/2`}>Module 2</Link>
                        </li>
                    </ul>
                </div>
                <div style={{ flex: 1, padding: '10px' }}>
                    {children}
                </div>
            </div>
        </div>
    );
}
