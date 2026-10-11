# Photo Portfolio

A photography portfolio built with **Next.js** and the **Sanity** CMS.
You manage photos and text at `yoursite.com/studio`. Changes go live
automatically, with no redeploy.

Until Sanity is connected, the site shows placeholder demo content, so you can
run it straight away.

---

## What's in it

| Page | What it does |
|---|---|
| **Home** `/` | Full-screen slideshow. Click the left or right half of the screen, scroll, swipe or use the arrow keys. Each photo wipes in from the direction you're going. The cursor turns into a label like `NEXT → 03 / 12`. |
| **Archive** `/work` | Switch between **Grid** and **Index** views, and filter by category. In the grid, the other covers fade to grey while you hover one, and the grid leans slightly with your scroll speed. In the index, a preview of each project follows your cursor. |
| **Project** `/work/[slug]` | Scrolling down moves the photos sideways (on desktop), with a progress line along the bottom. Click a photo to open it full-screen. A "Next project" link sits at the end. |
| **About** `/about` | Your text, a portrait, selected clients and contact links. |
| **Studio** `/studio` | The CMS. |

**Site-wide details:** custom cursor (an inverting dot that turns into a label
pill and tilts with mouse speed), smooth inertia scrolling, navigation letters
that scramble on hover, blur-up image loading, and soft page transitions.
Animations are switched off for visitors who have "reduce motion" enabled.

---

## 1. Run it locally

You need [Node.js](https://nodejs.org) version 20 or newer.

```bash
cd meineklas          # this folder
npm install
npm run dev
```

Open http://localhost:3000. You'll see the demo content.

## 2. Connect the CMS (Sanity, free plan)

1. Create a free account at https://www.sanity.io and create a project. You can
   do this in the browser, or run `npx sanity@latest init --env` here and follow
   the prompts. Pick the dataset **production**.
2. Copy `.env.local.example` to `.env.local` and paste in your **Project ID**
   (from https://www.sanity.io/manage):
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=abc123xy
   NEXT_PUBLIC_SANITY_DATASET=production
   ```
3. In sanity.io/manage → your project → **API → CORS origins**, add
   `http://localhost:3000` and tick **Allow credentials**.
4. Restart `npm run dev`, then open http://localhost:3000/studio and log in.

### Adding content
- **Projects → Create:** add a title, click *Generate* for the slug, set a date,
  and drag a batch of photos into **Gallery**. Then click **Publish**.
- **Site settings & homepage:** set your name, choose the homepage slideshow
  photos (each one can link to a project), and fill in your about text and
  contact details.

To change the highlight color or the spacing, edit the `--accent` and `--pad`
variables at the top of `src/app/globals.css`.

## 3. Put it online (Vercel, free plan)

1. Push this folder to a GitHub repository.
2. At https://vercel.com, click **Add New → Project** and import the repo.
3. Under **Environment Variables**, add `NEXT_PUBLIC_SANITY_PROJECT_ID` and
   `NEXT_PUBLIC_SANITY_DATASET`, then deploy.
4. Back in Sanity → **CORS origins**, add your live address (for example
   `https://yourname.vercel.app` or your own domain), with **Allow credentials**
   ticked.

The CMS is now at `https://your-domain/studio`.

### How updates go live without a redeploy
Pages are cached and refreshed from Sanity **every 60 seconds** by default.

**Optional: make updates instant.**
1. Make up a long random string and add it to Vercel as
   `SANITY_REVALIDATE_SECRET`, then redeploy once.
2. In sanity.io/manage → **API → Webhooks → Create webhook**, set:
   - URL: `https://your-domain/api/revalidate`
   - Dataset: `production`
   - Trigger on: Create, Update, Delete
   - Filter: `_type in ["project", "settings"]`
   - Secret: the same string
3. Now every **Publish** updates the site within a couple of seconds.

---

## Where things are

```
src/
  app/(site)/            pages (home, work, work/[slug], about)
  app/studio/            the embedded CMS
  app/api/revalidate/    webhook for instant updates
  app/globals.css        all styling (colors and spacing at the top)
  components/            Slideshow, Archive, Gallery, Cursor, SmoothScroll, …
  sanity/schemaTypes/    CMS fields (add a field here and it appears in the Studio)
  sanity/queries.ts      what the site fetches from the CMS
  lib/demo.ts            placeholder content shown before Sanity is connected
```
# meineklas
