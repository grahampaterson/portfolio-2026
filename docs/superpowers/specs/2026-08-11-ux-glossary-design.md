# UX Glossary — Design

Date: 2026-08-11
Status: Approved

## Purpose

A new public route presenting UX terms as cards, each with a short description.
The vocabulary skews conceptual and cross-disciplinary — terms borrowed from
economics, psychology, and information science — rather than pure UI naming.

## Route

`src/pages/glossary.astro`, served at `/glossary`.

- `export const prerender = true`, matching `index.astro`. The page has no
  server-side needs.
- Public. `middleware.ts` gates only `/work/[slug]`, so no change is required
  there.
- No navigation link. `Nav.astro` is currently commented out of `BaseLayout`,
  so the route is reachable by URL only — the same situation as `/snippets`.
  Restoring the nav is out of scope.

## Content

A new `glossary` collection in `content.config.ts`, mirroring the existing
`projects` collection's use of the `glob` loader.

```ts
const glossary = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/glossary' }),
  schema: z.object({
    term: z.string(),
  }),
});
```

Each term is one markdown file at `src/content/glossary/<kebab-term>.md`. The
frontmatter carries only `term`; the description lives in the markdown body so
that emphasis, links, and the occasional second paragraph work without YAML
quoting problems.

```markdown
---
term: Path dependence
---

A decision becomes "sticky" not because it's optimal, but because of the
accumulated history of choices built on top of it.
```

Cards render in alphabetical order by `term`, sorted at build time.

### Fields

Term and description only. No origin field, no category tags, no related-term
links. Where a term is borrowed from another field, that is stated inline in the
prose rather than in a separate label.

### Seed content

Two entries:

1. **Path dependence** — borrowed from economics. A decision becomes sticky not
   because it's optimal but because of the accumulated history of choices built
   on top of it. The QWERTY effect (or lock-in effect) is covered inside this
   entry as a named case of path dependence: a suboptimal design persisting
   because too many people have already learned it. It is not a separate card.
2. **Information scent** — when deciding which links to click, users choose
   those with the highest information scent: a mix of cues from the link label,
   the context the link appears in, and the user's prior experiences.

## Components

`src/components/GlossaryCard.astro` with a sibling
`GlossaryCard.module.css`, following the `ProjectCard` convention of a scoped
CSS module per component.

- Props: `term: string`. The description is passed as the default slot.
- `glossary.astro` calls `render(entry)` from `astro:content` for each entry and
  places the resulting `<Content />` inside the card's slot. Rendering markdown
  is the page's job; the card only handles layout.
- The term renders as a heading; the description renders below it.
- The card is not a link — there are no per-term pages.

The grid lives in `glossary.astro`:
`grid-template-columns: repeat(auto-fill, minmax(320px, 1fr))`.

## Search

A text input above the grid, filtering client-side.

- A small inline `<script>` in `glossary.astro`. No React island, no framework.
- On `input`, lowercase the query and match it against each card's term and
  description text. Non-matching cards get the `hidden` attribute.
- When the visible count reaches zero, show a "No terms match" message.
- With an empty query, all cards are visible.
- Search is a progressive enhancement: with JS disabled the full grid still
  renders and reads correctly.

## Global CSS refactor

`global.css:88` currently sets `html { overflow: hidden }`. This is a
page-specific concern living in the reset, and it prevents the glossary grid
from scrolling.

Remove the declaration from `global.css` and push it into the three routes that
actually depend on it, as `:global(html) { overflow: hidden }` within each
page's scoped `<style>` block:

- `pages/index.astro` — `.container` is 100vw/100vh with its own
  `overflow-y: scroll`; without the rule the page gets a double scrollbar.
- `pages/snippets/calgary-tower.astro` — full-viewport layout with `scale: 1.2`
  that overflows horizontally.
- `pages/snippets/suprecot-v1.astro` — `.container` is `width: 700vw`.

### Known behaviour change

Every other page — `about`, `work`, `work/[slug]`, `work/beacon`, `login`, and
`snippets` — is currently clipped at the viewport and cannot scroll. Removing
the global rule makes them scrollable. This is a fix for a latent bug, but it is
a visible change beyond the glossary feature and should be checked when
reviewing.

While editing `suprecot-v1.astro`, remove the duplicated `overflow: hidden`
declaration on lines 82–83.

## Testing

The project has no test framework, so verification is manual:

1. `pnpm build` completes without errors, including content collection schema
   validation.
2. `/glossary` renders both seed terms alphabetically and scrolls.
3. Typing in the search box narrows the cards; a nonsense query shows the empty
   state; clearing the box restores all cards.
4. `/`, `/snippets/calgary-tower`, and `/snippets/suprecot-v1` show no
   scrollbars and are visually unchanged.
5. `/about`, `/work`, and `/work/beacon` now scroll to their full content.

## Out of scope

- Per-term detail pages.
- Category tags, filtering by tag, and related-term cross-links.
- Restoring the commented-out `Nav`.
- Any redesign of existing pages beyond the overflow refactor.
