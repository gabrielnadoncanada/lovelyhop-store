import type { Node } from "@/lib/seo/schema";

/** Bloc JSON-LD. `<` est échappé pour qu'un texte de produit ne puisse jamais fermer la balise script. */
export function JsonLd({ data }: { data: Node }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
