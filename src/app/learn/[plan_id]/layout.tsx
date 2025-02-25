// sidebar with module links
"use server";
import Link from "next/link";
import { getLayout } from "./actions";

export default async function Layout({ params, children }: { params: Promise<{ plan_id: string }>, children: any }) {
    const { plan_id } = await params;
    const layout = await getLayout(plan_id);

    return (
        <div>
            <div className="flex">
                <aside className="w-64 border-r border-gray-200 py-4">
                    <div className="px-4">
                        <Link href='/learn/' className="text-blue-500 hover:underline block mb-2">Back to Plans</Link>
                        <h2 className="text-lg font-semibold mb-2">Modules</h2>
                    </div>
                    <ul className="mt-2">
                        <li key="overview">
                            <Link href={`/learn/${plan_id}`} className="block px-4 py-2 hover:bg-gray-100">
                                Overview
                            </Link>
                        </li>
                        {layout.modules.map((module) => (
                            <li key={module.moduleId}>
                                <Link href={`/learn/${plan_id}/${module.moduleId}`} className="block px-4 py-2 hover:bg-gray-100">
                                    {module.moduleName}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </aside>
                <main className="flex-1 p-4">
                    <h1 className="text-2xl font-bold mb-4">{layout.planName}</h1>
                    {children}
                </main>
            </div>
        </div>
    );
}