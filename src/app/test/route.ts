import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import searchEngine from "@/Agents/tools/SearchWeb";
import { summarizeSearchResults } from "@/Agents/SearchSummarize";

export async function POST(request: NextRequest) {
  const { query } = await request.json();
  const results = await searchEngine.search(query, { limit: 10 });
  // return NextResponse.json({ results });
  const summary = await summarizeSearchResults(results);
  return NextResponse.json({ results, summary });
}
