# GradInvitation

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.2.6.

## Routes

| URL | Purpose |
| --- | --- |
| `/` | Admin login (front-end only check) |
| `/console` | List / create invitations, export RSVP CSV |
| `/console/edit/:key` | Edit one invitation |
| `/invitations/:key` | Public invitation (envelope intro, RSVP) |

## Data & running

All data lives in one file, `../grad-invitation-data/data.json` (next to the project folder, so `ng serve` does not reload on every save), read and written by `server/index.mjs`. Override with the `DATA_FILE` env var.

```bash
npm run api    # API on :3000
npm run dev    # Angular dev server on :4200, proxies /api to :3000
npm run serve  # production: build + serve app and API on :3000
```

## Deploy on Vercel

The API runs as a serverless function (`api/handler.mjs`) and keeps the same single `data.json`
in a Vercel Blob store (public by default; set env `BLOB_ACCESS=private` if the store is private, the type must match).

1. Import the repo in Vercel (build command and output dir come from `package.json` / `vercel.json`).
2. Project → **Storage** → create a **Blob** store and connect it to the project.
   This adds the `BLOB_READ_WRITE_TOKEN` env var.
3. Redeploy. Open `/` and log in.

Locally, `BLOB_READ_WRITE_TOKEN` is not set, so the file in `../grad-invitation-data/` is used.
Writes use the blob ETag, so two simultaneous RSVPs do not overwrite each other.

> The admin login is checked in the browser only and the API has no auth, so anyone who knows the
> URLs can call it. Treat this as a hobby setup, not a secured one.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
