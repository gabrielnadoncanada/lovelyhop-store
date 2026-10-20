import type { ArtKey, Collection, Locale, Product, ProductDetails, UniversKey, Variant } from "@/lib/types";

/**
 * Catalogue de démonstration : sert tant que SHOPIFY_STORE_DOMAIN et SHOPIFY_STOREFRONT_ACCESS_TOKEN
 * ne sont pas définis. Mêmes formes de données que Shopify ; les prix inconnus restent à null (« [prix] »).
 */

type L<T> = Record<Locale, T>;
type DemoProduct = {
  id: string;
  handles: L<string>;
  univers: UniversKey;
  art: ArtKey;
  badge: Product["badge"];
  title: L<string>;
  description: L<string>;
  age: L<string>;
  material: L<string>;
  variants: { id: string; title: L<string>; description?: L<string> }[];
  details?: L<ProductDetails>;
};

const tableDetails: L<ProductDetails> = {
  fr: {
    plateaux: true,
    lead: "Un châssis en contreplaqué, deux bacs encastrés et des couvercles réversibles. Elle passe de la table sensorielle à la table de jeu, puis à la petite table, sans racheter de meuble.",
    shipping: "Livraison partout au Canada · [conditions de livraison]",
    addons: ["entonnoirs-chemins", "tamis-bois", "paire-bacs"],
    extras: ["plateau-art", "plateau-lumineux", "entonnoirs-chemins", "tamis-bois"],
    uses: [
      { how: "Bacs ouverts", title: "Table sensorielle", text: "Sable, eau, riz ou neige : deux bacs encastrés pour transvaser, trier et explorer à hauteur d'enfant." },
      { how: "Couvercles retournés", title: "Table de jeu", text: "Les couvercles ferment les bacs et forment une surface plane pour les blocs, les voitures et les casse-têtes." },
      { how: "Hauteur la plus basse", title: "Petite table", text: "Pour dessiner, faire un casse-tête ou prendre la collation assis, avec deux petits bancs." },
    ],
    steps: [
      { age: "1 à 2 ans", title: "Transvaser et explorer", text: "La hauteur la plus basse, les bacs de sable ou d'eau et de grandes cuillères. On découvre les matières avec les mains.", kit: "Bacs sensoriels · entonnoirs" },
      { age: "2 à 4 ans", title: "Créer et observer", text: "Le plateau d'art pour peindre debout, le plateau lumineux pour les formes et les couleurs. Le tamis pour trier.", kit: "Plateau d'art · plateau lumineux · tamis" },
      { age: "4 à 6 ans", title: "Construire et inventer", text: "Les couvercles fermés, la table devient un atelier de projets : blocs, circuits de billes, casse-têtes à plusieurs.", kit: "Couvercles réversibles · chemins" },
    ],
    dimensions: { width: "[L] cm", height: "[H] cm", caption: "Profondeur [P] cm · hauteurs de travail [h1], [h2] et [h3] cm" },
    sections: [
      { title: "Description", paragraphs: ["La table sensorielle évolutive repose sur un châssis compact en contreplaqué. Deux bacs standards s'encastrent dans le plateau ; les couvercles se retournent pour former une surface de jeu, et une tablette basse garde les accessoires à portée de main."], list: ["Un châssis, trois usages : table sensorielle, table de jeu, petite table", "Plateaux interchangeables : bacs, art, lumière", "Hauteur réglable sur trois crans, de 1 à 6 ans", "Version maison et version CPE"] },
      { title: "Dimensions et matériaux", specs: [{ label: "Dimensions", value: "[L] × [P] × [H] cm" }, { label: "Hauteurs de travail", value: "Trois crans : [h1], [h2] et [h3] cm" }, { label: "Bacs", value: "Deux bacs standards de [contenance] L, remplaçables" }, { label: "Matériau", value: "Contreplaqué de 15 à 18 mm, [essence]" }, { label: "Finition", value: "[finition], lavable" }, { label: "Poids", value: "[poids] kg" }] },
      { title: "Sécurité", list: ["Rayons généreux sur tous les chants", "Aucun espace où coincer un doigt", "Stabilité latérale et résistance à la charge : [résultats des tests]", "Toujours utiliser sous la supervision d'un adulte"] },
      { title: "Entretien", paragraphs: ["Essuyer le bois avec un linge humide et un savon doux, puis sécher. Vider et rincer les bacs après chaque activité avec de l'eau."] },
      { title: "Livraison et montage", paragraphs: ["Expédiée à plat partout au Canada, en une seule boîte. Les tenons captifs limitent la quincaillerie : comptez [temps de montage] pour l'assembler.", "Retours : [politique de retour]."] },
      { title: "Garantie et pièces", paragraphs: ["Une patte, une traverse, un couvercle ou un bac se commande seul : le meuble reste, la pièce change. Garantie : [durée]."] },
    ],
    faq: [
      { q: "À partir de quel âge utiliser une table sensorielle ?", a: "Elle est pensée pour les enfants de 1 à 6 ans. À la hauteur la plus basse, elle convient dès que l'enfant se tient debout de façon stable. Le jeu sensoriel se fait toujours sous la supervision d'un adulte." },
      { q: "Que mettre dans une table sensorielle ?", a: "Du sable, de l'eau, du riz, des pâtes sèches, de l'avoine, de la neige ou des glaçons, avec des cuillères, des entonnoirs et des petits contenants. Pour les moins de 3 ans, évitez tout objet assez petit pour passer dans un rouleau de papier de toilette." },
      { q: "Comment limiter les dégâts ?", a: "Remplissez les bacs au tiers, posez un tapis lavable sous la table et refermez les couvercles quand l'activité est finie. Les bacs se retirent pour être vidés au-dessus de l'évier." },
      { q: "Est-ce qu'elle convient à un CPE ?", a: "Oui. Elle est conçue pour l'usage quotidien en groupe, et ses pièces se remplacent une à une. Pour plusieurs locaux, demandez une soumission : on prépare un prix par lot." },
      { q: "Combien de temps pour la monter ?", a: "Environ [temps de montage]. Les panneaux s'emboîtent et se bloquent avec des tenons captifs ; il y a très peu de quincaillerie." },
      { q: "Peut-on l'utiliser dehors ?", a: "Elle est conçue pour l'intérieur. On peut la sortir sur la terrasse le temps d'une activité, mais elle ne doit pas rester dehors : [précision selon la finition]." },
    ],
  },
  en: {
    plateaux: true,
    lead: "A plywood frame, two built-in bins and reversible lids. It goes from sensory table to play table to low table, without buying new furniture.",
    shipping: "Shipping across Canada · [shipping terms]",
    addons: ["entonnoirs-chemins", "tamis-bois", "paire-bacs"],
    extras: ["plateau-art", "plateau-lumineux", "entonnoirs-chemins", "tamis-bois"],
    uses: [
      { how: "Bins open", title: "Sensory table", text: "Sand, water, rice or snow: two built-in bins to pour, sort and explore at child height." },
      { how: "Lids flipped", title: "Play table", text: "The lids close the bins and make a flat surface for blocks, cars and puzzles." },
      { how: "Lowest height", title: "Low table", text: "For drawing, puzzles or snack time, seated, with two small benches." },
    ],
    steps: [
      { age: "1 to 2 years", title: "Pour and explore", text: "The lowest height, sand or water bins and big spoons. Little hands discover textures.", kit: "Sensory bins · funnels" },
      { age: "2 to 4 years", title: "Create and observe", text: "The art tray for painting standing up, the light tray for shapes and colours. The sieve for sorting.", kit: "Art tray · light tray · sieve" },
      { age: "4 to 6 years", title: "Build and invent", text: "Lids closed, the table becomes a project workshop: blocks, marble runs, puzzles together.", kit: "Reversible lids · chutes" },
    ],
    dimensions: { width: "[W] cm", height: "[H] cm", caption: "Depth [D] cm · working heights [h1], [h2] and [h3] cm" },
    sections: [
      { title: "Description", paragraphs: ["The expandable sensory table stands on a compact plywood frame. Two standard bins sit flush in the top; the lids flip over to form a play surface, and a low shelf keeps accessories within reach."], list: ["One frame, three uses: sensory table, play table, low table", "Interchangeable trays: bins, art, light", "Height adjustable in three notches, from 1 to 6 years", "Home and daycare versions"] },
      { title: "Dimensions and materials", specs: [{ label: "Dimensions", value: "[W] × [D] × [H] cm" }, { label: "Working heights", value: "Three notches: [h1], [h2] and [h3] cm" }, { label: "Bins", value: "Two standard [capacity] L bins, replaceable" }, { label: "Material", value: "15 to 18 mm plywood, [species]" }, { label: "Finish", value: "[finish], washable" }, { label: "Weight", value: "[weight] kg" }] },
      { title: "Safety", list: ["Generous radius on every edge", "No gaps that could pinch a finger", "Lateral stability and load tests: [test results]", "Always use under adult supervision"] },
      { title: "Care", paragraphs: ["Wipe the wood with a damp cloth and mild soap, then dry. Empty and rinse the bins with water after each activity."] },
      { title: "Shipping and assembly", paragraphs: ["Ships flat across Canada, in a single box. Captive tenons keep hardware to a minimum: allow [assembly time] to put it together.", "Returns: [return policy]."] },
      { title: "Warranty and parts", paragraphs: ["A leg, a rail, a lid or a bin can be ordered on its own: the furniture stays, the part changes. Warranty: [length]."] },
    ],
    faq: [
      { q: "From what age can a child use a sensory table?", a: "It is designed for children from 1 to 6. At the lowest height, it works as soon as a child stands steadily. Sensory play is always supervised by an adult." },
      { q: "What do you put in a sensory table?", a: "Sand, water, rice, dry pasta, oats, snow or ice, with spoons, funnels and small containers. For children under 3, avoid anything small enough to fit through a toilet paper roll." },
      { q: "How do you keep the mess down?", a: "Fill the bins a third of the way, put a washable mat under the table and close the lids when play is over. The bins lift out to be emptied over the sink." },
      { q: "Does it work for a daycare?", a: "Yes. It is built for daily group use, and every part can be replaced. For several rooms, ask for a quote: we prepare volume pricing." },
      { q: "How long does assembly take?", a: "About [assembly time]. The panels slot together and lock with captive tenons; there is very little hardware." },
      { q: "Can it be used outdoors?", a: "It is designed for indoor use. You can take it out on the deck for an activity, but it should not stay outside: [note depending on the finish]." },
    ],
  },
};

const D: DemoProduct[] = [
  {
    id: "demo-table-sensorielle", handles: { fr: "table-sensorielle-evolutive", en: "expandable-sensory-table" }, univers: "creer", art: "table-sensorielle", badge: "phare",
    title: { fr: "Table sensorielle évolutive", en: "Expandable sensory table" },
    description: { fr: "Table sensorielle évolutive conçue au Québec pour les enfants de 1 à 6 ans. Un châssis, trois plateaux : bacs sensoriels, art et lumière.", en: "Expandable sensory table designed in Quebec for children ages 1 to 6. One frame, three trays: sensory bins, art and light." },
    age: { fr: "Sensoriel · 1 à 6 ans", en: "Sensory · 1 to 6 years" }, material: { fr: "Contreplaqué · 3 plateaux", en: "Plywood · 3 trays" },
    variants: [
      { id: "demo-table-depart", title: { fr: "Ensemble de départ", en: "Starter set" }, description: { fr: "Châssis, 2 bacs sensoriels et couvercles réversibles", en: "Frame, 2 sensory bins and reversible lids" } },
      { id: "demo-table-complet", title: { fr: "Ensemble complet", en: "Complete set" }, description: { fr: "Le départ, plus le plateau d'art et le plateau lumineux", en: "The starter set, plus the art tray and the light tray" } },
    ],
    details: tableDetails,
  },
  {
    id: "demo-table-lumineuse", handles: { fr: "table-lumineuse-enfant", en: "light-table-for-kids" }, univers: "creer", art: "table-lumineuse", badge: "nouveau",
    title: { fr: "Table lumineuse", en: "Light table" },
    description: { fr: "Table lumineuse pour enfant conçue au Québec pour les 1 à 6 ans.", en: "Light table for kids designed in Quebec for ages 1 to 6." },
    age: { fr: "Lumière · 1 à 6 ans", en: "Light · 1 to 6 years" }, material: { fr: "Contreplaqué · plateau lumineux", en: "Plywood · light tray" },
    variants: [{ id: "demo-lumineuse", title: { fr: "Naturel", en: "Natural" } }],
  },
  {
    id: "demo-panneau", handles: { fr: "panneau-activites-modulable", en: "modular-activity-board" }, univers: "creer", art: "panneau-activites", badge: null,
    title: { fr: "Panneau d'activités modulable", en: "Modular activity board" },
    description: { fr: "Panneau d'activités modulable conçu au Québec pour les 1 à 4 ans.", en: "Modular activity board designed in Quebec for ages 1 to 4." },
    age: { fr: "Motricité fine · 1 à 4 ans", en: "Fine motor · 1 to 4 years" }, material: { fr: "Modules interchangeables", en: "Interchangeable modules" },
    variants: [{ id: "demo-panneau-v", title: { fr: "Naturel", en: "Natural" } }],
  },
  {
    id: "demo-table-art", handles: { fr: "table-art-enfant-rangement", en: "kids-art-table-storage" }, univers: "creer", art: "table-art", badge: "nouveau",
    title: { fr: "Table d'art avec rangement", en: "Art table with storage" },
    description: { fr: "Table d'art avec rangement conçue au Québec pour les 2 à 6 ans.", en: "Art table with storage designed in Quebec for ages 2 to 6." },
    age: { fr: "Art · 2 à 6 ans", en: "Art · 2 to 6 years" }, material: { fr: "Rouleau de papier et bacs", en: "Paper roll and bins" },
    variants: [{ id: "demo-art-v", title: { fr: "Naturel", en: "Natural" } }],
  },
  // accessoires
  ...([
    ["plateau-art", "art-tray", "plateau-art", "Plateau d'art", "Art tray", "Une surface lisse pour peindre et dessiner debout, qui se nettoie d'un coup de linge.", "A smooth surface for painting and drawing standing up, cleaned with one wipe."],
    ["plateau-lumineux", "light-tray", "plateau-lumineux", "Plateau lumineux", "Light tray", "Une lumière douce sous les formes translucides pour observer les couleurs.", "Soft light under translucent shapes to observe colours."],
    ["entonnoirs-chemins", "funnels-and-chutes", "entonnoirs", "Entonnoirs et chemins", "Funnels and chutes", "Des pièces découpées pour transvaser, verser et faire rouler d'un bac à l'autre.", "Cut pieces to pour, tip and roll from one bin to the other."],
    ["tamis-bois", "wooden-sieve", "tamis", "Tamis en bois", "Wooden sieve", "Un cadre à mailles fines pour trier le sable, le riz et les petits trésors.", "A fine-mesh frame to sort sand, rice and little treasures."],
    ["paire-bacs", "bin-pair", "bacs", "Paire de bacs supplémentaires", "Extra pair of bins", "Un bac prêt pendant que l'autre sèche.", "One bin ready while the other dries."],
  ] as const).map(([fr, en, art, tfr, ten, dfr, den]): DemoProduct => ({
    id: `demo-${fr}`, handles: { fr, en }, univers: "creer", art: art as ArtKey, badge: null,
    title: { fr: tfr, en: ten }, description: { fr: dfr, en: den },
    age: { fr: "Accessoire · table sensorielle", en: "Accessory · sensory table" }, material: { fr: "Contreplaqué", en: "Plywood" },
    variants: [{ id: `demo-${fr}-v`, title: { fr: "Standard", en: "Standard" } }],
  })),
  // mobilier CPE
  ...([
    ["table-garderie", "daycare-table", "table-garderie", "Table de garderie modulaire", "Modular daycare table", "Des modules qui s'assemblent en îlots.", "Modules that join into islands."],
    ["casier-garderie", "daycare-cubbies", "casier-garderie", "Casier de garderie modulaire", "Modular daycare cubbies", "Un casier par enfant, qu'on agrandit au besoin.", "One cubby per child, expandable as needed."],
    ["rangement-matelas-garderie", "nap-mat-storage", "range-matelas", "Range-matelas ventilé", "Ventilated nap mat storage", "Les matelas de sieste rangés et aérés.", "Nap mats stored and aired."],
    ["panneau-activite-mural-garderie", "daycare-wall-activity-panel", "panneau-mural", "Panneaux muraux CPE", "Daycare wall panels", "Des activités au mur qui libèrent le plancher.", "Wall activities that free up the floor."],
  ] as const).map(([fr, en, art, tfr, ten, dfr, den]): DemoProduct => ({
    id: `demo-${fr}`, handles: { fr, en }, univers: "cpe", art: art as ArtKey, badge: null,
    title: { fr: tfr, en: ten }, description: { fr: dfr, en: den },
    age: { fr: "Garderies et CPE", en: "Daycares" }, material: { fr: "Contreplaqué", en: "Plywood" },
    variants: [{ id: `demo-${fr}-v`, title: { fr: "Standard", en: "Standard" } }],
  })),
];

const COLLECTIONS: { univers: UniversKey; handles: L<string>; title: L<string>; description: L<string> }[] = [
  { univers: "creer", handles: { fr: "creer-et-decouvrir", en: "create-and-discover" }, title: { fr: "Créer et découvrir", en: "Create and discover" }, description: { fr: "Tables sensorielles, meubles d'art et panneaux d'activités en bois pour les enfants de 1 à 6 ans.", en: "Sensory tables, art furniture and wooden activity boards for children ages 1 to 6." } },
  { univers: "imaginer", handles: { fr: "imaginer", en: "imagine" }, title: { fr: "Imaginer", en: "Imagine" }, description: { fr: "Maisons de poupée, cuisines et établis pour le jeu d'imitation.", en: "Dollhouses, kitchens and workbenches for pretend play." } },
  { univers: "ranger", handles: { fr: "ranger-et-lire", en: "organize-and-read" }, title: { fr: "Ranger et lire", en: "Organize and read" }, description: { fr: "Bibliothèques Montessori et rangements à hauteur d'enfant.", en: "Montessori bookshelves and child-height storage." } },
  { univers: "bouger", handles: { fr: "bouger", en: "move" }, title: { fr: "Bouger", en: "Move" }, description: { fr: "Triangles et modules de motricité. Bientôt.", en: "Climbing triangles and movement modules. Coming soon." } },
  { univers: "cpe", handles: { fr: "garderies-cpe", en: "daycare-furniture" }, title: { fr: "Mobilier pour garderies et CPE", en: "Daycare furniture" }, description: { fr: "Mobilier en bois robuste, pièces remplaçables et soumissions par lot.", en: "Sturdy wooden furniture, replaceable parts and volume quotes." } },
];

const toProduct = (p: DemoProduct, locale: Locale): Product => {
  const variants: Variant[] = p.variants.map((v) => ({ id: v.id, title: v.title[locale], price: null, availableForSale: true, description: v.description?.[locale] }));
  return {
    id: p.id, handle: p.handles[locale], title: p.title[locale], description: p.description[locale],
    univers: p.univers, age: p.age[locale], material: p.material[locale], badge: p.badge, art: p.art, images: [],
    minPrice: null, variants, availableForSale: true, seo: { title: null, description: null },
    details: p.details?.[locale] ?? null, handles: p.handles,
  };
};

const findByHandle = (handle: string) => D.find((p) => p.handles.fr === handle || p.handles.en === handle);

export const demo = {
  product(handle: string, locale: Locale) {
    const p = findByHandle(handle);
    return p ? toProduct(p, locale) : null;
  },
  products(handles: string[], locale: Locale) {
    return handles.map((h) => findByHandle(h)).filter((p): p is DemoProduct => !!p).map((p) => toProduct(p, locale));
  },
  allProducts(locale: Locale) {
    return D.map((p) => toProduct(p, locale));
  },
  collection(handle: string, locale: Locale): Collection | null {
    const c = COLLECTIONS.find((x) => x.handles.fr === handle || x.handles.en === handle);
    if (!c) return null;
    const products = D.filter((p) => p.univers === c.univers && !p.age.fr.startsWith("Accessoire")).map((p) => toProduct(p, locale));
    return { handle: c.handles[locale], title: c.title[locale], description: c.description[locale], univers: c.univers, products, handles: c.handles };
  },
  collectionHandles() {
    return COLLECTIONS.map((c) => c.handles);
  },
  search(q: string, locale: Locale) {
    const n = q.trim().toLowerCase();
    if (n.length < 2) return [];
    return D.map((p) => toProduct(p, locale)).filter((p) => (p.title + " " + p.description).toLowerCase().includes(n));
  },
  variant(id: string, locale: Locale) {
    for (const p of D) {
      const v = p.variants.find((x) => x.id === id);
      if (v) return { product: toProduct(p, locale), variant: { id: v.id, title: v.title[locale], price: null, availableForSale: true } as Variant };
    }
    return null;
  },
};
