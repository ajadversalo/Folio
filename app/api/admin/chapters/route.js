import { createChapter, deleteChapter } from "../../../../db";
import { adminGuard, ensureDatabase, errorResponse, validLabel } from "../../../../lib/http";

export async function POST(request) {
  const denied = adminGuard(request);
  if (denied) return denied;
  try {
    await ensureDatabase();
    const input = await request.json();
    if (!validLabel(input.number) || !validLabel(input.title)) return errorResponse("Number and title are required", 400);
    const chapter = await createChapter({ number: input.number.trim(), title: input.title.trim() });
    return Response.json({ chapter }, { status: 201 });
  } catch (error) {
    console.error("Management request failed:", error);
    return errorResponse(error.message === "Book not found" ? error.message : "Unable to save content", error.message === "Book not found" ? 404 : 500);
  }
}

export async function DELETE(request) {
  const denied = adminGuard(request);
  if (denied) return denied;
  try {
    await ensureDatabase();
    const input = await request.json();
    if (!validLabel(input.id)) return errorResponse("Chapter is required", 400);
    return Response.json({ chapter: await deleteChapter(input.id) });
  } catch (error) {
    console.error("Management request failed:", error);
    return errorResponse(error.message === "Chapter not found" ? error.message : "Unable to delete content", error.message === "Chapter not found" ? 404 : 500);
  }
}
