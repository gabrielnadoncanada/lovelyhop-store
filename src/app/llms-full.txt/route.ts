import { buildLlmsTxt } from "@/lib/seo/llms";

/** /llms-full.txt : la même chose, avec le détail des fiches et le texte complet des guides. */
export async function GET() {
  return new Response(await buildLlmsTxt(true), { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
