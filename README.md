# Thushan portfolio

Requires Node.js 22 or newer. No dependency installation is needed.

```sh
npm start
```

Open http://localhost:3000. Set `PORT` to use another port. Development serves source files directly; refresh the browser after editing.

```sh
npm run check
npm run build
npm run preview
```

Deploy the contents of `dist/` to a static host.

## Structure

- `src/pages/`: portfolio and project HTML pages, preserving existing URLs.
- `src/styles/`: shared CSS and extracted page styles.
- `src/scripts/`: application JavaScript.
- `public/`: images, vendor libraries, and other static files.
- `scripts/`: development server, production build, and validation.
- `server/forms/`: original PHP contact handler, requiring a separately configured PHP server and email library. The Node development server does not execute PHP or send email.

The homepage contact form opens a draft in the visitor's email application. Sending requires the visitor to send that draft. Missing template images display an explicit placeholder until real assets are supplied.

Keep vendor attribution and licensing notices when editing. Inline page styles were extracted in their original order to preserve the design. The root workspace copy remains available; this folder contains the reorganized application.
