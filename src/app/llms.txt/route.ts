import { buildLlmsTxt } from "@/lib/seo/llms";

/** /llms.txt : résumé du site pour les moteurs de réponse IA. */
export async function GET() {
  return new Response(await buildLlmsTxt(false), { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
