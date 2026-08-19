import { getReaderState, saveReaderState } from "../../../../db";
import { ensureDatabase, errorResponse, validState } from "../../../../lib/http";

const validClientId = /^[a-zA-Z0-9_-]{16,64}$/;
export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  const { clientId } = await params;
  if (!validClientId.test(clientId)) return errorResponse("Not found", 404);
  try { await ensureDatabase(); return Response.json({ state: await getReaderState(clientId) }); }
  catch (error) { console.error("Reader state request failed:", error); return errorResponse("Unable to persist reader state"); }
}

export async function PUT(request, { params }) {
  const { clientId } = await params;
  if (!validClientId.test(clientId)) return errorResponse("Not found", 404);
  try {
    await ensureDatabase();
    const state = await request.json();
    if (!validState(state)) return errorResponse("Invalid reader state", 400);
    return Response.json({ state: await saveReaderState(clientId, state) });
  } catch (error) {
    console.error("Reader state request failed:", error);
    return errorResponse(error instanceof SyntaxError ? "Invalid JSON" : "Unable to persist reader state", error instanceof SyntaxError ? 400 : 500);
  }
}
