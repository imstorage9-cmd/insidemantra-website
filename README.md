# Inside Mantra Website

Marketing website for **Inside Mantra**, an interior design studio (modular interiors, full home interiors, luxury interiors, renovations) serving Vijayawada, Visakhapatnam and Hyderabad.

The site is built with Next.js and exported as plain static files, so it can be hosted anywhere that serves HTML: Netlify, Vercel, GitHub Pages, S3 or a regular web host.

## Quick links (this computer)

Start both with `npm run dev` and `npm run admin`, each in its own terminal.

| What | Address |
|---|---|
| Website preview | http://localhost:3000 |
| **Photo admin** (add or edit projects) | **http://localhost:3000/admin/** |
| Photo admin, if the preview isn't running | http://localhost:3001/admin/ |

The admin password is in the `.env.local` file in the project folder. Details are under [Uploading project photos](#uploading-project-photos).

> **Status:** work in progress. These are built: the home page, The Works (`/the-works/`), individual project pages, and a password-protected photo admin that runs on this computer (`npm run admin`). These pages show a "This page is being built" placeholder, with phone, WhatsApp and email links, until they're built: `/services`, `/magazine`, `/about`, `/contact` and `/offerings/<slug>` (see `components/coming-soon.tsx`). To build one, replace the `<ComingSoon />` in its `page.tsx`.

## Tech stack

| | |
|---|---|
| Framework | [Next.js](https://nextjs.org) 16 (App Router, `output: "export"`) |
| UI | React 19, [Tailwind CSS](https://tailwindcss.com) 4, [lucide-react](https://lucide.dev) icons |
| Language | TypeScript |
| Linting | ESLint 9 with `eslint-config-next` |

> Next.js 16 differs from older versions in a number of ways. Before changing framework-level code, read the bundled docs in `node_modules/next/dist/docs/` (see [AGENTS.md](AGENTS.md)).

## Getting started

Requirements: Node.js 20 or newer, and npm.

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Starts the dev server with hot reload |
| `npm run build` | Builds the static site into `out/` |
| `npm run start` | Runs `next start`. This isn't needed for a static export: serve `out/` instead |
| `npm run lint` | Runs ESLint |
| `npm run admin` | Starts the photo admin, opened at http://localhost:3000/admin/ (see "Uploading project photos") |

## Project structure

```
app/            Routes, root layout and global styles (App Router)
components/     Shared React components
config/
  site.ts       All site copy and settings (see below)
content/        Long-form content (e.g. magazine articles)
lib/
  images.ts     Finds optional image "slots" in public/images/
  projects.ts   Reads project folders in public/projects/
public/
  images/       Fixed photo spots on the pages (exact file names)
  projects/     One folder per project, managed through the photo admin
scripts/admin/  Photo admin: server.mjs (Node, no extra packages), login.html, app.html
.env.local      Admin password (ADMIN_PASSWORD). Not committed.
```

## Editing content

### Text and settings: `config/site.ts`

Most copy lives in one file, `config/site.ts`, so you can change text without touching components. It includes:

- Brand name, tagline, mission and founding year
- Contact details (phone, WhatsApp, email, hours) and social links
- Navigation and footer links
- Hero section, offerings, process steps and "why choose us"
- Trophies, stats and the company timeline (`journey`)
- Service tiles, crafting steps and office locations

**Before launch:** several entries are still placeholders and need real information: `stats`, two of the three `trophies`, the `journey` milestones for 2019 and 2020, and every `locations[].address`. Don't publish made-up figures or awards.

### Images: drop-in slots

`lib/images.ts` provides `resolveImage(slot)`. It looks for `public/images/<slot>` with any of the extensions `.jpg`, `.jpeg`, `.png`, `.webp` or `.avif`. If it finds a file it returns the URL. If not, it returns `null`, so the page can show a placeholder instead.

The slot names come from `config/site.ts`:

| Slot | Used for |
|---|---|
| `hero/slide-1` … `hero/slide-N` | Hero slideshow (N = `hero.slideCount`) |
| `offerings/<slug>` | Offering cards, e.g. `offerings/modular-interiors` |
| `services/kitchen`, `services/wardrobe`, `services/storage` | Service tiles |
| `crafting/<step>` | Crafting steps, e.g. `crafting/quality-checks` |

Example: to add the first hero image, save it as `public/images/hero/slide-1.jpg`.

**Placeholder photo:** any spot without its own photo shows `public/images/placeholder.jpg` instead. In the local preview (`npm run dev`), each of those spots has a small label naming the file it's waiting for. Visitors to the published site don't see these labels. When you add a real photo with that file name, it replaces the placeholder in that spot.

> Images are found **at build time**. After you add or remove an image, restart `npm run dev` or run `npm run build` again.

## Uploading project photos

Project photos are added through a password-protected **photo admin** that runs on this computer. You don't need to touch any code or folders, and you don't need a GitHub or Netlify account.

### Starting the admin

The first time only, create a file named `.env.local` in the project folder containing:

```
ADMIN_PASSWORD=choose-a-strong-password
```

This file is ignored by git, so the password never goes to GitHub.

Then start the website preview and the admin, each in its own terminal:

```bash
npm run dev      # website preview → http://localhost:3000
npm run admin    # photo admin (runs in the background on port 3001)
```

Open **http://localhost:3000/admin/** and log in with the password. The site has no link to the admin, so bookmark this address.

The preview forwards `/admin/` to the admin server. This is set up in `next.config.ts` and only happens in `npm run dev`; the published build has no admin. If the preview isn't running, you can also open the admin directly at http://localhost:3001/admin/.

The admin only accepts connections from this computer. A login lasts 12 hours, or until the admin is restarted.

### Adding photos

**Step 1: choose the project.**
- **Project already on the website:** click it under **Existing project**.
- **New project:** fill in **New project**: the project name (for example "Reddy Residence, Banjara Hills"), the city, and optionally a short description. Then click **Create project**. Kitchen, Bedroom and Living Room sections are created automatically.

**Step 2: add photos.**
- Drag photos onto the room they belong to, or click the room's box to choose them.
- You can select many photos at once.
- For another room, type its name next to **+ Add room** (for example "Pooja Room"), then drop its photos in.
- Hover over a photo to **Set as cover** (the photo shown on the project card) or **Remove** it.
- Click **Edit name** next to the project title to rename the project, for example to fix a typo.
- To delete a whole project, use **Delete this project** at the bottom of its page. You have to type the project name to confirm. This removes the folder and all its photos, and it can't be undone, unless the project was already pushed to GitHub.

Photos show up on the preview at http://localhost:3000 straight away. To put them on the live website, see [Publishing](#publishing).

Things to know:

- **Empty rooms are hidden.** A room with no photos doesn't appear on the website, so it's fine to fill in only the rooms you have.
- **Newest projects first.** The home page shows the 3 newest projects.
- **Photos are resized automatically.** Large photos are scaled to 2000px wide and saved as JPG before upload.
- **iPhone HEIC photos aren't supported.** Export them as JPG, or set the iPhone to **Settings → Camera → Formats → Most Compatible**.

### What happens behind the scenes

Each project is one folder:

```
public/projects/reddy-residence-banjara-hills/
  index.json     name, city, date, description, and which photo belongs to which room
  IMG_1023.jpg   the photos
  IMG_1024.jpg
```

- `lib/projects.ts` reads these folders at build time.
- **The Works** (`/the-works/`) shows every project that has at least one photo.
- Each project gets its own page (`/the-works/<project-folder>/`), with photos grouped by room.

The admin (`scripts/admin/server.mjs`) writes these files directly, and the website preview reads them on every page load.

The project folder name comes from the project name, and it becomes the project's web address. Renaming a project with **Edit name** also renames its folder, so the web address changes too. Any links already shared to the old address stop working.

The three default rooms are set in two places, and the keys must match in both:

- `DEFAULT_ROOMS` in `lib/projects.ts`
- `DEFAULT_ROOMS` in `scripts/admin/server.mjs`

## Publishing

Uploads only change files on this computer. Two separate steps get them out:

**1. Back up to GitHub.** This saves the photos and code, but doesn't change the live site:

```bash
git add public/projects
git commit -m "Add photos: <project name>"
git push
```

**2. Update the live website:**

```bash
npm run build
```

This writes a fully static site to `out/`. Upload the contents of that folder to your web host.

The export has two settings to be aware of:

- `trailingSlash: true` builds each page as `<route>/index.html`, which works on hosts without rewrite rules.
- `images.unoptimized: true` serves images as they are, because static export can't run the Next.js image optimizer. Compress and resize photos before adding them (WebP at about 1600–2000px wide works well).

Static export doesn't support server-only features: API routes, server actions, middleware, or `next/image` optimization. A contact form, for example, needs a third-party form service or a WhatsApp or email link.
