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
