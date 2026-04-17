# ByFabian Portfolio — Project Instructions

Project: AI campaign imagery portfolio (Next.js 15, App Router, TS, Tailwind).
Domain of the site: ByFabian. Booking conversion is the business goal.

## When Fabian says "new campaign"

Fabian will drop a new folder under `Images/<Model>/<CampaignName>/` (and optionally a new `<Model>/` folder for a new muse). He will **not** write any code or JSON. That's your job.

### What you must do

1. **Verify the drop**
   - `ls Images/` — look for any new model folder or any new campaign folder under an existing model.
   - Peek at 1-2 images (`Read` one per new folder) so your metadata reflects what's actually there.

2. **Run the sync pipeline**
   ```bash
   cd /Users/fabianarndt/Projekte/Claude/Web/AI-Portfolio
   npm run sync
   ```
   This optimises every image into `public/images/<model>/<campaign>/` (AVIF/WebP/JPG × 3 sizes), writes `manifest.json`, and regenerates `src/data/campaigns.generated.ts`.

   On first run for a new folder, `sync` creates **stub** `campaign.json` and `model.json` files with placeholder text. You must fill them in.

3. **Fill in the real metadata**
   Edit `public/images/<model>/<campaign>/campaign.json`:
   ```json
   {
     "title": "Leather",
     "number": "04",
     "category": "Streetwear Editorial",
     "year": 2026,
     "tagline": "One sentence. Present tense. No verbs that sound like a brief.",
     "description": "Two or three sentences. What the campaign is about, what the feel is, what problem it solves for a brand. Write like a print-mag capsule not a marketing page.",
     "tools": ["Flux 1.1", "ComfyUI", "Magnific"],
     "featureIds": ["01", "05"],
     "order": 4
   }
   ```
   - `order` controls position on the home page (ascending). Renumber others only if needed.
   - `featureIds` are frame IDs (`"01"`, `"02"`, …) that get the "feature" flag — reserved for future use (e.g. lightbox spotlight).
   - Infer `category` and `tools` from the images; use Fabian's existing campaigns as tonal reference — do not invent numbers he hasn't set.

   For a new model, edit `public/images/<model>/model.json`:
   ```json
   {
     "name": "Yamada",
     "bio": "One sentence that earns its keep. Who she is, why she's the muse for this body of work."
   }
   ```

4. **Re-run sync** (to re-read the filled-in JSON into the generated TS file):
   ```bash
   npm run sync
   ```

5. **Verify**
   ```bash
   npm run build
   ```
   You should see the new campaign listed under `● /work/[slug]` as a prerendered page. If it's not there, the metadata edits didn't stick — re-check the JSON is valid.

6. **Ship it**
   ```bash
   git add -A
   git commit -m "campaign: <model> — <campaign-title>"
   git push
   ```
   Vercel auto-deploys from `main` on push. The preview URL will be in the GitHub PR or Vercel dashboard.

## Do not

- Do not edit `src/data/campaigns.generated.ts` by hand — it is rewritten by `npm run sync`.
- Do not commit from `Images/` — that folder is gitignored on purpose (raw source lives locally, optimised output ships).
- Do not add a CMS, database, or headless provider. The filesystem *is* the CMS.
- Do not add new pages, components, or design changes unless Fabian asks for them.

## Voice & copy

Campaign taglines and descriptions are in Fabian's voice — quiet, print-editorial, zero marketing cliché. Look at the existing three for calibration. Never say "elevate", "empower", "unleash", "journey", "transform". Em dashes are fine **in the website copy** (house style of this site), even though Fabian bans them in his book manuscripts.

## Tech shape

- `src/app/` — App Router pages (`/`, `/work/[slug]`, `/about`, `/contact`, `/api/contact`)
- `src/components/` — layout, nav, footer, hero, card, editorial grid, contact form
- `src/data/` — `campaigns.ts` (public API) + `campaigns.generated.ts` (auto) + `types.ts`
- `scripts/sync-campaigns.ts` — the single pipeline script
- `public/images/<model>/<campaign>/` — optimised frames + `manifest.json` + `campaign.json`
- `public/images/<model>/model.json` — model metadata
- `Images/` — raw source, gitignored, local-only

## Environment variables

Set in Vercel (Production + Preview):
- `RESEND_API_KEY` — contact form email delivery
- `CONTACT_TO_EMAIL` — where briefs land (default: `fabian.arndt.info@gmail.com`)
- `NEXT_PUBLIC_CALENDLY_URL` — embedded on `/contact` below the form

Without `RESEND_API_KEY` the form logs to the server and returns ok (dev-safe).

## Deployment

- GitHub: `fabiancreation/byfabian-portfolio` (PAT at `~/.claude/github-token`)
- Vercel: auto-deploys `main` → production. PRs get preview URLs.
- First deploy checklist: set the three env vars in Vercel, re-deploy, verify contact form end-to-end.
