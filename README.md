# Inside Mantra Website

Marketing website for **Inside Mantra**, an interior design studio (modular interiors, full home interiors, luxury interiors, renovations) serving Vijayawada, Visakhapatnam and Hyderabad.

The site is built with Next.js and exported as plain static files, so it can be hosted anywhere that serves HTML: Netlify, Vercel, GitHub Pages, S3 or a regular web host.

> **Status:** work in progress. These pages are built: the home page, The Works (`/the-works/`), individual project pages, and the photo upload panel (`/admin/`). These pages from the nav don't exist yet: `/services`, `/magazine`, `/about`, `/contact` and `/offerings/<slug>`.

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
  admin/        Photo upload panel (Decap CMS): index.html + config.yml
  images/       Fixed photo spots on the pages (exact file names)
  projects/     One folder per project, managed through /admin
netlify.toml    Netlify build settings
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

> Images are found **at build time**. After you add or remove an image, restart `npm run dev` or run `npm run build` again.

## Uploading project photos

Project photos are added through an upload panel at **`/admin/`** on the live site (for example `https://insidemantra.com/admin/`). The team doesn't need to touch any code or folders.

### For the team: adding photos

1. Go to `<site>/admin/` and click **Login with GitHub**.
2. You'll see the list of projects already on the website.
   - **Project already on the website:** click its name.
   - **New project:** click **New Project** and type the **Project name**, for example "Reddy Residence, Banjara Hills".
3. Every project has three photo sections: **Kitchen photos**, **Bedroom photos** and **Living Room photos**. In the section the photos belong to, click **Add photo**, then upload the photo. Repeat for each photo.
4. For any other room (Pooja Room, Kids Room, Balcony and so on), use **Other rooms**: click **Add room**, type the room name, then add its photos.
5. Optionally choose a **City**, a **Cover photo** and a **Short description**.
6. Click **Publish**, then **Publish now**. The website updates by itself in about 1–2 minutes.

Things to know:

- **Empty sections are hidden.** A section with no photos doesn't appear on the website, so it's fine to fill in only the rooms you have.
- **Newest projects first.** The website shows projects by their **Date**, and the home page shows the 3 newest.
- **Resize photos first.** Shrink large camera photos to about 2000px wide before uploading.

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

When someone clicks **Publish**, the panel saves the changes to the GitHub repo. Netlify sees the new commit, rebuilds the site and puts it live.

The project folder name comes from the project name when the project is first saved, and it becomes the project's web address. Check the spelling before the first save.

The three default rooms are set in two places, and the keys must match in both:

- `DEFAULT_ROOMS` in `lib/projects.ts`
- `public/admin/config.yml`

### One-time setup

The panel logs people in with GitHub, so each person who uploads needs a free GitHub account with access to the repo.

1. **GitHub:** create a repo, for example `insidemantra-website`, and push this project to its `main` branch. Then edit `public/admin/config.yml` and change `repo:` to `<your-github-username>/insidemantra-website`.
2. **Netlify:** choose **Add new site → Import from Git**, then pick the repo. The build settings are read from `netlify.toml` (`npm run build`, publish `out`).
3. **Login:**
   - In GitHub, go to **Settings → Developer settings → OAuth Apps → New OAuth App**. Set the callback URL to `https://api.netlify.com/auth/done`.
   - In Netlify, go to **Site configuration → Access & security → OAuth**, choose **Install provider → GitHub**, and paste the Client ID and Client Secret from the OAuth app.
4. **Team access:** in GitHub, go to the repo's **Settings → Collaborators** and invite each person who should be able to upload.

### Trying the panel on this computer

```bash
npm run dev    # terminal 1
npm run cms    # terminal 2: local upload server (no login needed)
```

Then open http://localhost:3000/admin/index.html. Changes are written straight into `public/projects/` on this computer, and you see them after refreshing the site. Locally, `/admin/` without `index.html` returns a 404. On Netlify, `/admin/` works.

## Deployment

```bash
npm run build
```

This writes a fully static site to `out/`. Upload the contents of that folder to any static host.

The export has two settings to be aware of:

- `trailingSlash: true` builds each page as `<route>/index.html`, which works on hosts without rewrite rules.
- `images.unoptimized: true` serves images as they are, because static export can't run the Next.js image optimizer. Compress and resize photos before adding them (WebP at about 1600–2000px wide works well).

Static export doesn't support server-only features: API routes, server actions, middleware, or `next/image` optimization. A contact form, for example, needs a third-party form service or a WhatsApp or email link.
