/** Surligne les valeurs encore entre crochets (« [délai] ») dans un texte simple. */
export function WithTodos({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]\n]{2,140}\])/g);
  return <>{parts.map((p, i) => (i % 2 ? <mark key={i} className="lh-todo">{p}</mark> : p))}</>;
}
