# ByFabian — Portfolio

An editorial portfolio for AI-generated fashion, beauty, and activewear campaigns. Built with Next.js 15, Tailwind, and a filesystem-driven data layer.

## Add a new campaign — the short version

1. Drop your raw images into a new folder:
   ```
   Images/<Model>/<Campaign Name>/frame-01.png
   Images/<Model>/<Campaign Name>/frame-02.png
   ...
   ```
2. Tell Claude: **"new campaign added"**. Claude runs the pipeline, fills in the metadata, commits, and pushes.

That's it. You never touch code.

## What happens under the hood

`npm run sync` walks `Images/`, optimises every image (AVIF + WebP + JPG at three widths), writes a manifest per campaign, and regenerates `src/data/campaigns.generated.ts` — which the site reads at build time.

On a push to `main`, Vercel rebuilds and deploys. The sync script runs automatically as a `prebuild` step, so production always sees the latest state.

## Local development

```bash
npm install
npm run sync      # optimise images + generate data
npm run dev       # http://localhost:3000
```

## Environment

Copy `.env.local.example` → `.env.local` and fill in:
- `RESEND_API_KEY` — for the contact form
- `CONTACT_TO_EMAIL` — where briefs arrive
- `NEXT_PUBLIC_CALENDLY_URL` — embedded on `/contact`

## Structure

```
Images/                     # raw source — gitignored
public/images/<model>/      # optimised output + metadata JSON
src/app/                    # routes
src/components/             # layout + editorial components
src/data/                   # typed data layer (generated)
scripts/sync-campaigns.ts   # the one pipeline script
```

See [CLAUDE.md](./CLAUDE.md) for the full workflow Claude follows when adding a campaign.
