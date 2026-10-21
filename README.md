# Lovelyhop — boutique

Boutique Lovelyhop : meubles de jeu en contreplaqué conçus au Québec.
Next.js 16 (App Router, Cache Components) · next-intl (français / anglais) · Shopify headless (API Storefront `2026-10`) · design system LovelyHop.

## Démarrer

```bash
pnpm install
cp .env.example .env.local   # facultatif : sans jeton Shopify, le site utilise le catalogue de démo
pnpm dev                     # http://localhost:3000
```

Sans `SHOPIFY_STORE_DOMAIN` et `SHOPIFY_STOREFRONT_ACCESS_TOKEN`, tout fonctionne avec un **catalogue de démonstration** (pastille « Catalogue de démonstration » en bas à gauche) : navigation, fiches, panier, recherche, formulaire CPE. Seule la caisse est désactivée.

## Adresses

| Page | Français | Anglais |
|---|---|---|
| Accueil | `/` | `/en` |
| Fiche produit | `/table-sensorielle-evolutive` | `/en/expandable-sensory-table` |
| Tous les univers | `/univers` | `/en/collections` |
| Univers | `/univers/creer-et-decouvrir` | `/en/collections/create-and-discover` |
| Guides | `/guides` | `/en/guides` |
| Un guide | `/guides/preparer-un-bac-sensoriel-sans-degat` | `/en/guides/mess-free-sensory-bin` |
| Garderies et CPE | `/garderies-cpe` | `/en/daycares` |
| Recherche | `/recherche?q=…` | `/en/search?q=…` |

Les fiches sont à la racine, comme dans l'arborescence SEO. Le handle anglais vient de la traduction du produit dans Shopify (Translate & Adapt) ; le lien FR/EN et les balises hreflang l'utilisent.

## Brancher Shopify

1. **Canal Headless** : Shopify admin › Applications et canaux de vente › installer *Headless*, créer un storefront, copier le jeton public de l'API Storefront dans `SHOPIFY_STOREFRONT_ACCESS_TOKEN`.
2. **Langues et marché** : Paramètres › Langues : français (par défaut) et anglais ; marché Canada. Traduire produits, collections et métachamps avec l'app *Translate & Adapt*, y compris les **handles** anglais.
3. **Collections** (handles français) : `creer-et-decouvrir`, `imaginer`, `ranger-et-lire`, `bouger`, `garderies-cpe` (voir `src/lib/constants.ts`).
4. **Produits** : la table sensorielle a deux variantes (« Ensemble de départ », « Ensemble complet ») ; les accessoires sont des produits séparés.
5. **Métachamps** (Paramètres › Données personnalisées), espace de noms `lovelyhop`, accès Storefront activé :

   | Clé | Type | Exemple |
   |---|---|---|
   | `univers` | Texte | `creer` · `imaginer` · `ranger` · `bouger` · `cpe` |
   | `age` | Texte | `Sensoriel · 1 à 6 ans` |
   | `materiau` | Texte | `Contreplaqué · 3 plateaux` |
   | `badge` | Texte | `phare` · `nouveau` · `bientot` |
   | `dessin` | Texte | `table-sensorielle` (dessin affiché tant qu'il n'y a pas de photo) |
   | `details` | JSON | contenu riche de la fiche, forme `ProductDetails` dans `src/lib/types.ts` (exemple complet dans `src/lib/demo/catalog.ts`) |
   | `description` (variante) | Texte | `Châssis, 2 bacs sensoriels et couvercles réversibles` |

6. **Webhooks** : Paramètres › Notifications › Webhooks › *Mise à jour de produit*, *Mise à jour de collection*, *Mise à jour du niveau de stock* → `https://<domaine>/api/revalidate` (JSON). La clé de signature va dans `SHOPIFY_WEBHOOK_SECRET`. Le cache du catalogue (étiquette `catalog`) se rafraîchit sans redéployer.
7. **Caisse** : le bouton « Passer à la caisse » envoie vers le checkout Shopify (`cart.checkoutUrl`) ; taxes du Québec, paiements, livraison et courriels de commande restent dans Shopify.

## Guides (blogue)

Les guides sont des fichiers MDX compilés par **content-collections** : `content/blog/fr/<slug>.mdx` et `content/blog/en/<slug>.mdx`. Le nom du fichier est l'adresse.

- `translationKey` relie les deux versions d'un même guide (hreflang, lien FR/EN, sitemap).
- `pnpm check:articles` (lancé aussi par `pnpm build`) refuse un guide qui n'existe que dans une langue, un `translationKey` en double ou un lien `/guides/…` vers un guide inexistant.
- En-tête : `title`, `excerpt`, `theme` (filtre), `age`, `publishedAt`, `updatedAt`, `author` (« Lovelyhop » = l'équipe ; un nom seulement avec l'accord de la personne), `art` + `tone` (dessin de couverture tant qu'il n'y a pas de photo), `image`, `products` (handles dans la langue du guide : bloc « Le mobilier de ce guide » et guides affichés sur ces fiches), `faq`, `seoTitle`, `seoDescription`, `pin`, `draft`.
- Encadré dans le texte : `<Callout title="Sécurité">…</Callout>`.
- Les quatre guides fournis sont un **premier jet à relire** avant la mise en ligne.

## SEO

Tout passe par `src/lib/seo/` pour qu'aucune page n'oublie un morceau :

- `metadata.ts` → `pageMetadata()` : titre, description, canonique, hreflang réciproques (`fr-CA`, `en-CA`, `x-default` → français), Open Graph et Twitter.
- `schema.ts` → JSON-LD en un seul `@graph` par page, nœuds reliés par `@id` : `Organization` et `WebSite` (accueil), `WebPage`/`CollectionPage`/`ItemPage`, `BreadcrumbList`, `Product` (offres seulement si le prix existe), `ItemList`, `Blog`, `BlogPosting`, `FAQPage`.
- `components/seo/Crumbs.tsx` : le fil d'Ariane visible et son JSON-LD viennent de la même liste.
- `site.ts` : identité de la marque. **À compléter** : `NEXT_PUBLIC_CONTACT_EMAIL` et `sameAs` (Instagram, Facebook, Pinterest) quand ils existent. Rien n'y est inventé (pas d'adresse, de téléphone ni d'avis).
- Images de partage : `opengraph-image.tsx` (accueil par défaut, fiches, univers, guides), aux couleurs du design system ; la photo Shopify apparaît dès qu'elle existe.
- `/sitemap.xml` (hreflang + images produits, dates réelles seulement), `/robots.txt` (ouvert aux moteurs IA), `/llms.txt` et `/llms-full.txt` (résumé Markdown pour les moteurs de réponse IA, généré depuis le catalogue et les guides).
- La recherche interne est en `noindex`.

## Design system

`src/styles/lovelyhop.css` est une **copie** de `components/bundle.css` du design system LovelyHop (artefact Claude). Ne pas la modifier ici : changer le design system, puis recopier le fichier.

- Les composants React reproduisent exactement le balisage des fiches du design system (classes `lh-*`).
- Les dessins de meubles (`src/components/art/index.tsx`) sont générés depuis le design system ; les photos Shopify les remplacent dès qu'elles existent.
- Tailwind est chargé **sans preflight et avec le préfixe `tw:`** (`tw:flex`) : les dessins utilisent des classes comme `ring`, `outline` ou `shadow`.
- Polices auto-hébergées (`@fontsource`) : aucune requête vers Google.
- `src/styles/blog.css` (guides : carte vedette, en-tête d'article, texte, table des matières) est construit avec les jetons du design system ; **à reporter dans le design system** pour garder une seule source.

## Structure

```
src/
  app/[locale]/            pages (accueil, [handle] = fiche, collections (+ index), blog (guides), daycares, search)
  app/llms.txt, llms-full.txt, sitemap.ts, robots.ts
  content/blog/            guides MDX (fr, en) — à la racine du projet
  app/actions.ts           actions serveur : panier, recherche instantanée, soumission CPE, infolettre
  app/api/revalidate/      webhook Shopify
  components/              en-tête (méga menu, menu mobile, recherche), panier, fiche, formulaires
  i18n/                    routage next-intl (proxy.ts), adresses traduites
  lib/catalog.ts           accès au catalogue (« use cache » + étiquettes), Shopify ou démo
  lib/cart.ts              panier : Cart API (cookie) ou démo
  lib/shopify/             client Storefront, requêtes GraphQL, conversion des données
  lib/blog.ts              accès aux guides (content-collections)
  lib/seo/                 métadonnées, JSON-LD, URL localisées, images de partage, llms.txt
  messages/fr.json, en.json  textes de l'interface
```

## À brancher ensuite

- **Infolettre** : `subscribeNewsletter` (dans `src/app/actions.ts`) valide le courriel mais ne l'envoie nulle part ; à relier à Shopify Email, Klaviyo ou autre.
- **Mesure d'audience** : le bandeau de témoins (Loi 25) émet l'événement `lh:consent` ; charger PostHog ou les pixels seulement quand `analytics` / `marketing` est vrai.
- **Valeurs entre crochets** (`[prix]`, `[L] cm`, `[politique de retour]`…) : à remplacer dans Shopify, jamais à inventer.
- **Pages légales** (politique de confidentialité, conditions, livraison et retours) : obligatoires avant la mise en ligne (la Loi 25 exige une politique de confidentialité). Les liens du pied de page pointent encore vers `#`.
- Courriel public et réseaux sociaux de la marque (`src/lib/seo/site.ts`) pour compléter le JSON-LD `Organization`.
