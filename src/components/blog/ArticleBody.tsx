"use client";

import { MDXContent } from "@content-collections/mdx/react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import NextLink from "next/link";
import { Icon } from "@/components/ui/icons";

/** Encadré dans un guide : `<Callout title="Sécurité">…</Callout>`. */
function Callout({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <aside className="lh-notice lh-notice--warning lh-prose__callout">
      <span className="lh-notice__icon"><Icon name="shield" /></span>
      <div>{title && <strong className="lh-notice__title">{title}</strong>}{children}</div>
    </aside>
  );
}

const components = {
  Callout,
  a: ({ href = "", ...props }: ComponentPropsWithoutRef<"a">) =>
    href.startsWith("/") || href.startsWith("#") ? (
      <NextLink href={href} {...props} />
    ) : (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props} />
    ),
  // Une liste numérotée peut reprendre plus loin (« 6. ») : le compteur CSS part de `start`.
  ol: ({ start, style, ...props }: ComponentPropsWithoutRef<"ol">) => (
    <ol start={start} style={start ? { ...style, counterReset: `lh-ol ${start - 1}` } : style} {...props} />
  ),
  table: (props: ComponentPropsWithoutRef<"table">) => (
    <div className="lh-prose__table" role="region" tabIndex={0}><table {...props} /></div>
  ),
};

/** Corps d'un guide (MDX compilé par content-collections), mis en forme par .lh-prose. */
export function ArticleBody({ code }: { code: string }) {
  return (
    <div className="lh-prose">
      <MDXContent code={code} components={components} />
    </div>
  );
}
