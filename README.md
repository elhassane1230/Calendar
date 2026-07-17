# Dynamic Calendar

A monthly **calendar web app** to create, edit, delete and track events, built with
**Next.js** and **React**. Each event has a status, *To Do*, *Done* or *Canceled*,
shown by colour and icon, and events are **persisted in the browser** so they
survive a refresh.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![React](https://img.shields.io/badge/React-18-61dafb)
![date-fns](https://img.shields.io/badge/date--fns-4-blue)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

---

## Features

- **Month navigation**: move between months with the arrow buttons.
- **Create events**: click any day to add an event.
- **Per-day event preview**: each cell shows the first events; “Voir plus…” opens
  the full list for that day.
- **Edit & delete**: open an event to rename it, change its status, or remove it.
- **Status cycle**: events are *To Do* (orange), *Done* (green) or *Canceled* (red).
- **Persistence**: events are saved to `localStorage` and restored on reload.
- **Today highlight** and **keyboard `Esc`** to close any modal.

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 14 (Pages Router) |
| UI | React 18, CSS Modules |
| Dates | date-fns |
| Icons | react-icons |

## Getting started

Requires [Node.js](https://nodejs.org/) 18+.

```bash
# install dependencies
npm install

# development server (hot reload) -> http://localhost:3000
npm run dev

# production build + run
npm run build
npm start
```

> Note: `npm start` runs `next start`, which serves the output of `npm run build`,
> so build first. For day-to-day development use `npm run dev`.

## Project structure

```
.
├── components/
│   ├── Calendar.js         # month grid, state, persistence, event handlers
│   ├── Modal.js            # "add event" dialog
│   ├── EventModal.js       # list of a day's events
│   └── EditEventModal.js   # edit / delete an event
├── pages/
│   ├── index.js            # home page (renders the calendar)
│   ├── _app.js, _document.js
│   └── api/hello.js
├── styles/                 # CSS modules
└── public/
```

## How it works

Events are kept in a single React state object keyed by day
(`"yyyy-MM-dd" -> [{ id, name, type }]`). Every event carries a **unique id**, so
edits, status changes and deletions target exactly one event, even when two
events on the same day share a name. Changes are written to `localStorage` and
reloaded on startup.

## Screenshots

Add screenshots under `public/` and reference them here, for example:

```
![Calendar view](public/screenshot-calendar.png)
![Add event](public/screenshot-add.png)
![Edit event](public/screenshot-edit.png)
```

## License

Released under the MIT License.
