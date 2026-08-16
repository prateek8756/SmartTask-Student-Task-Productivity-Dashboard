# SmartTask — Student Task & Productivity Dashboard

A responsive, vanilla HTML/CSS/JavaScript web app for managing assignments, exams, projects and personal to-dos from one dashboard. Built as a final internship project (frontend development track).

## Live demo
_Add your deployed URL here after publishing to GitHub Pages / Netlify / Vercel._

## Problem it solves
Students often track deadlines across scattered notes and apps. SmartTask gives them one place to see what's due, add and update tasks, and follow their overall progress.

## Features
- **Dashboard** — total/pending/in-progress/completed counts, today's tasks, a category breakdown, and an upcoming list.
- **Task Management** — card view (ticket-stub style) or table view, with add / edit / delete / mark-complete actions.
- **Add / Edit Task form** — validates required fields (title, category, priority, due date, status), shows inline errors, and a live character counter for the description.
- **Task Details** — full task view with quick actions (complete, edit, delete).
- **Profile / Settings** — editable display name/role, simulated preference toggles, and a "reset data" option.
- **Search, filter & sort** — by keyword, status, category, priority, and due date/priority/creation order.
- **Empty states** for no matching tasks and for tasks due today.
- **Delete confirmation modal** and **toast notifications** for feedback on actions.
- **Data persistence** via `localStorage` — tasks and profile settings survive a page refresh.
- **Responsive layout** — sidebar nav on desktop/tablet, bottom tab bar on mobile.
- **Bonus:** dark/light mode toggle, toast notifications, responsive sidebar navigation.

## Tech stack
- HTML5, CSS3 (custom properties, Flexbox/Grid, responsive media queries)
- Vanilla JavaScript (ES6+, no frameworks, no build step)
- `localStorage` for persistence — no backend required

## Project structure
```
smarttask/
├── index.html            # Landing / welcome page
├── dashboard.html         # Dashboard
├── tasks.html              # Task management (list/table, filters, search, sort)
├── task-form.html         # Add / edit task form
├── task-details.html      # Task details view
├── profile.html            # Profile / settings
├── css/
│   └── style.css          # Design system + all component styles
├── js/
│   ├── app.js               # Shared shell: nav, theme toggle, toast, confirm modal
│   ├── tasks.js             # Data layer: storage, CRUD, sample data, filter/sort/stats
│   ├── validation.js        # Task form validation
│   ├── dashboard.js         # Dashboard rendering
│   ├── task-list.js         # Task management page logic
│   ├── task-form.js         # Add/edit form logic
│   ├── task-details.js      # Task details rendering
│   └── profile.js           # Profile/settings logic
├── assets/                # Icons/images (inline SVGs are used directly in markup)
└── screenshots/           # Add screenshots here for submission
```

## Setup instructions
No build tools or dependencies are required.

1. Download or clone this repository.
2. Open `index.html` directly in a browser, **or** serve the folder locally for the cleanest experience:
   ```bash
   npx serve smarttask
   # or
   python3 -m http.server --directory smarttask 8000
   ```
3. The app seeds 10 sample tasks into `localStorage` on first load. Use **Reset all task data** on the Profile page at any time to restore that sample set.

## Data model
Each task is stored as:
```json
{
  "id": "t_...",
  "title": "string",
  "description": "string",
  "category": "Assignment | Exam | Project | Reading | Personal | Other",
  "priority": "low | medium | high",
  "dueDate": "YYYY-MM-DD",
  "status": "pending | in-progress | completed",
  "createdAt": "YYYY-MM-DD"
}
```

## Design notes
The task card is styled as a due-date "ticket stub" — a perforated divider separates the task details from a stub showing the due date and priority flag — to reinforce the idea of a deadline you tear off once it's handled. Completed tasks get a rotated "DONE" stamp. The palette pairs an ink-navy surface with an amber "highlighter" accent, a display serif (Fraunces) for headings, Manrope for UI text, and IBM Plex Mono for dates and stats.

## Testing checklist
- [x] App loads without console errors
- [x] All navigation links/buttons work
- [x] New tasks can be created
- [x] Tasks can be edited and deleted
- [x] Status changes work correctly
- [x] Search, filter and sort produce correct results
- [x] Data remains available after refreshing the page
- [x] Forms show validation messages
- [x] Works on desktop and mobile widths
- [x] No overlapping layout, broken images, or unreadable text

## Challenges & possible improvements
- Currently single-user/simulated (no real backend or auth) — a future version could sync tasks to a real API.
- Category and priority lists are fixed in `tasks.js`; a future version could let users manage custom categories.
- Drag-and-drop status changes and a productivity chart are natural next bonus features to add.
