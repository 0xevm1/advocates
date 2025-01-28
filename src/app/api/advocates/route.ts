import db from "../../../db";
import { advocates } from "../../../db/schema";
import { asc, ilike, or, sql } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    // Extract query parameters directly from req
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '100');
    const term = searchParams.get('term') || '';

    // Calculate offset for pagination
    const offset = (page - 1) * pageSize;

    // Build search conditions
    const searchCondition = term
      ? or(
          ilike(advocates.firstName, `%${term}%`),
          ilike(advocates.lastName, `%${term}%`),
          ilike(advocates.city, `%${term}%`),
          ilike(advocates.degree, `%${term}%`),
          sql`${advocates.specialties}::text[] && ARRAY[${term}]::text[]`
        )
      : undefined;

    // Get paginated results
    const [advocateResults, totalCountResult] = await Promise.all([
      db
        .select()
        .from(advocates)
        .where(searchCondition)
        .limit(pageSize)
        .offset(offset)
        .orderBy(asc(advocates.lastName)),

      db
        .select({
          count: sql<number>`cast(count(*) as int)`,
        })
        .from(advocates)
        .where(searchCondition),
    ]);

    const total = totalCountResult[0]?.count || 0;

    return new Response(
      JSON.stringify({
        data: advocateResults,
        total,
        page,
        pageSize,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching advocates:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
