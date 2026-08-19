import { getBook } from "../../../db";
import { ensureDatabase, errorResponse } from "../../../lib/http";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureDatabase();
    const book = await getBook();
    return book ? Response.json({ book }) : errorResponse("Book content has not been imported", 404);
  } catch (error) {
    console.error("Book request failed:", error);
    return errorResponse("Unable to load book content");
  }
}
