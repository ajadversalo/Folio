import crypto from "node:crypto";
import { migrate } from "../db";

let migration;
export function ensureDatabase() {
  migration ||= migrate();
  return migration;
}

export function errorResponse(message, status = 500) {
  return Response.json({ error: message }, { status, headers: { "Cache-Control": "no-store" } });
}

export function isAdmin(request) {
  const expected = process.env.FOLIO_ADMIN_KEY || "";
  const supplied = request.headers.get("x-folio-admin-key") || "";
  if (!expected) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(supplied);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function adminGuard(request) {
  if (!process.env.FOLIO_ADMIN_KEY) return errorResponse("Management access is not configured", 503);
  if (!isAdmin(request)) return errorResponse("Invalid admin key", 401);
  return null;
}

export function validLabel(value) {
  return typeof value === "string" && value.trim().length > 0 && value.trim().length <= 120;
}

export function validState(value) {
  return value && Number.isInteger(value.currentPage) && value.currentPage >= 0 &&
    ["paper", "night", "mist"].includes(value.theme) &&
    Number.isInteger(value.fontSize) && value.fontSize >= 14 && value.fontSize <= 22 &&
    typeof value.pageSound === "boolean" && Array.isArray(value.expandedGroups) &&
    value.expandedGroups.every(item => typeof item === "string") &&
    Array.isArray(value.bookmarks) && value.bookmarks.every(Number.isInteger);
}
