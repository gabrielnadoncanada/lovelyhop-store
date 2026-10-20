# Lovelyhop — boutique

Boutique Lovelyhop : meubles de jeu en contreplaqué conçus au Québec.
Next.js 16 (App Router, Cache Components) · next-intl (français / anglais) · Shopify headless (API Storefront `2026-10`) · design system LovelyHop.

## Démarrer

```bash
pnpm install
cp .env.example .env.local   # facultatif : sans jeton Shopify, le site utilise le catalogue de démo
pnpm dev                     # http://localhost:3000
```

Sans `SHOPIFY_STORE_DOMAIN` et `SHOPIFY_STOREFRONT_ACCESS_TOKEN`, tout fonctionne avec un **catalogue de démonstration** (pastille « Catalogue de démonstration » en haut à gauche) : navigation, fiches, panier, recherche, formulaire CPE. Seule la caisse est désactivée.

## Adresses

| Page | Français | Anglais |
|---|---|---|
| Accueil | `/` | `/en` |
| Fiche produit | `/table-sensorielle-evolutive` | `/en/expandable-sensory-table` |
| Univers | `/univers/creer-et-decouvrir` | `/en/collections/create-and-discover` |
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

## Design system

`src/styles/lovelyhop.css` est une **copie** de `components/bundle.css` du design system LovelyHop (artefact Claude). Ne pas la modifier ici : changer le design system, puis recopier le fichier.

- Les composants React reproduisent exactement le balisage des fiches du design system (classes `lh-*`).
- Les dessins de meubles (`src/components/art/index.tsx`) sont générés depuis le design system ; les photos Shopify les remplacent dès qu'elles existent.
- Tailwind est chargé **sans preflight et avec le préfixe `tw:`** (`tw:flex`) : les dessins utilisent des classes comme `ring`, `outline` ou `shadow`.
- Polices auto-hébergées (`@fontsource`) : aucune requête vers Google.

## Structure

```
src/
  app/[locale]/            pages (accueil, [handle] = fiche, collections, daycares, search)
  app/actions.ts           actions serveur : panier, recherche instantanée, soumission CPE, infolettre
  app/api/revalidate/      webhook Shopify
  components/              en-tête (méga menu, menu mobile, recherche), panier, fiche, formulaires
  i18n/                    routage next-intl (proxy.ts), adresses traduites
  lib/catalog.ts           accès au catalogue (« use cache » + étiquettes), Shopify ou démo
  lib/cart.ts              panier : Cart API (cookie) ou démo
  lib/shopify/             client Storefront, requêtes GraphQL, conversion des données
  messages/fr.json, en.json  textes de l'interface
```

## À brancher ensuite

- **Infolettre** : `subscribeNewsletter` (dans `src/app/actions.ts`) valide le courriel mais ne l'envoie nulle part ; à relier à Shopify Email, Klaviyo ou autre.
- **Mesure d'audience** : le bandeau de témoins (Loi 25) émet l'événement `lh:consent` ; charger PostHog ou les pixels seulement quand `analytics` / `marketing` est vrai.
- **Valeurs entre crochets** (`[prix]`, `[L] cm`, `[politique de retour]`…) : à remplacer dans Shopify, jamais à inventer.
- Pages légales (confidentialité, conditions, livraison et retours) et guides.
