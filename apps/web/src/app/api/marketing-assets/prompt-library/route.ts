import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

function getPromptLibraryPath() {
  return resolve(
    process.cwd(),
    "../../docs/ai/generated/marketing-prompt-library.json",
  );
}

export async function GET() {
  try {
    const raw = await readFile(getPromptLibraryPath(), "utf8");
    const data = JSON.parse(raw) as unknown;
    return Response.json({ ok: true, ...((data as object) ?? {}) });
  } catch {
    return Response.json(
      {
        ok: false,
        error: "prompt_library_not_found",
      },
      { status: 404 },
    );
  }
}
