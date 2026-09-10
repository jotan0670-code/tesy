# NotiCampus

**A campus hub where offices and teachers post announcements, answer student tickets privately, and run their classes.**

> Stay Informed. Stay Engaged.

Announcements from school offices reach students either school-wide or targeted at a single
department. Students who need to reach an office open a ticket; messaging unlocks once the office
approves it. Teachers run digital classrooms with join codes, assignments and rosters, and can
message offices directly without a ticket.

## Roles

Every role signs in to its own account and gets its own navigation and pages.

| Role | Pages |
| --- | --- |
| **Student** | Home, Inbox, Announce, Calendar, Classes (Enrolled / Finished / Failed / Dropped) |
| **Teacher** | Inbox, Announce, Calendar, My Classes |
| **Office** | Announcements, Tickets |
| **Admin** | All Accounts, Pending Approval, Activity Log |

- **Student** — reads announcements for their department, opens one ticket per office, joins classes
  by code, and submits activities. Cannot message an office until that ticket is approved.
- **Teacher** — creates classrooms (each gets a join code to share), assigns activities, sees the
  roster of every class they own, sets deadlines on the calendar, and messages offices directly.
- **Office** — composes announcements as **General** (every student) or **Individual** (one
  department), and works the ticket queue: approve, reply, close.
- **Admin** — manages teacher and office accounts: approve on registration, suspend, activate, edit,
  delete. Every action is written to the activity log.

## Stack

React 19 · TypeScript · Vite · Tailwind CSS 4 · Framer Motion · lucide-react

Frontend only for now — all data is seeded in `src/lib/campus-data.ts` and held in component state,
so changes reset on reload and do not cross between roles. The planned backend is PHP + MySQL on
Hostinger, at **NotiCampus.online**.

## Development

```bash
npm install
npm run dev      # http://localhost:5190
npm run build    # typecheck + production build
npm run lint
```

## Deployment

`npm run build` writes a fully static site to `dist/`. `vite.config.ts` sets `base: './'`, so
that one build runs unchanged from a domain root (`noticampus.online`), a subfolder
(`example.com/noticampus/`), or a GitHub Pages project path (`user.github.io/tesy/`) — no
per-target rebuild.

Because of that, public files referenced from code rather than markup must go through
`assetUrl()` in `src/lib/campus-data.ts`. Vite rewrites paths it can see in markup and CSS; a
string like `/ph/logo.jpg` inside a `.ts` file it cannot, and that path 404s under a subpath.

**GitHub Pages** — `.github/workflows/deploy.yml` builds and publishes on every push to `main`.
It needs Pages enabled once: *Settings → Pages → Build and deployment → Source: **GitHub Actions***.

**Hostinger** — upload the contents of `dist/` (not the folder itself) to `public_html`. It is
plain static files, so no Node runtime is required on the host. Once the PHP/MySQL API lands it
will sit beside the build under `public_html/api`.

## Layout

```
src/
  lib/
    campus-data.ts        departments, offices, seeded classes and accounts
    roles.ts              per-role navigation trees and landing pages
  components/ui/
    login-page.tsx        role picker, then account picker
    dashboard-sidebar.tsx app shell + Student and Teacher pages
    teacher-classes.tsx   My Classes: create classroom, assignments, roster
    office-announce.tsx   announcement composer (General / Individual)
    office-tickets.tsx    ticket queue: approve, reply, close
    admin-users.tsx       account management and activity log
    calendar-page.tsx     calendar (teachers can create events, students cannot)
```
