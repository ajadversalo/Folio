import { getManagementStructure } from "../../../../db";
import { adminGuard, ensureDatabase, errorResponse } from "../../../../lib/http";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const denied = adminGuard(request);
  if (denied) return denied;
  try { await ensureDatabase(); return Response.json(await getManagementStructure()); }
  catch (error) { console.error("Management request failed:", error); return errorResponse("Unable to load content"); }
}
