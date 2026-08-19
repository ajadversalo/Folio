import { createTopic, deleteTopic } from "../../../../db";
import { adminGuard, ensureDatabase, errorResponse, validLabel } from "../../../../lib/http";

export async function POST(request) {
  const denied = adminGuard(request);
  if (denied) return denied;
  try {
    await ensureDatabase();
    const input = await request.json();
    if (!validLabel(input.number) || !validLabel(input.title)) return errorResponse("Number and title are required", 400);
    if (!validLabel(input.chapterId)) return errorResponse("Chapter is required", 400);
    const topic = await createTopic({ chapterId: input.chapterId, number: input.number.trim(), title: input.title.trim() });
    return Response.json({ topic }, { status: 201 });
  } catch (error) {
    console.error("Management request failed:", error);
    return errorResponse(error.message === "Chapter not found" ? error.message : "Unable to save content", error.message === "Chapter not found" ? 404 : 500);
  }
}

export async function DELETE(request) {
  const denied = adminGuard(request);
  if (denied) return denied;
  try {
    await ensureDatabase();
    const input = await request.json();
    if (!validLabel(input.id)) return errorResponse("Topic is required", 400);
    return Response.json({ topic: await deleteTopic(input.id) });
  } catch (error) {
    console.error("Management request failed:", error);
    return errorResponse(error.message === "Topic not found" ? error.message : "Unable to delete content", error.message === "Topic not found" ? 404 : 500);
  }
}
