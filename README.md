# Form To Dashboard

Reusable Fox & Hen starter for turning a form schema into a lightweight intake dashboard.

This repo stays intentionally static: React + TypeScript + Vite, fictional fixtures, no backend, no auth, no credentials, and no real client data.

## What It Includes

- Form schema designer for field labels, field types, required flags, help text, and select options.
- Sample form that creates local fictional submissions from the active schema.
- Field mapping panel that connects form columns to dashboard roles such as title, contact, category, value, urgency, status, and notes.
- KPI cards, status pipeline, and searchable submissions table powered by the mapped CSV-style rows.
- CSV import, CSV export text, CSV download, and fixture-based smoke coverage for import/export/dashboard summaries.
- Browser localStorage persistence for schema, mapping, rows, and CSV text, plus reset-to-sample and project JSON import/export.
- Adapter guidance for Google Sheets, Airtable, and Supabase without adding service credentials.

## Local Workflow

```bash
npm install
npm run dev
npm test
npm run typecheck
npm run build
```

A copy-ready CI workflow lives at `docs/github-actions/build.yml.example`; move it to `.github/workflows/build.yml` after GitHub auth has the `workflow` scope.

## Starter Usage

1. Open the app and update the schema in the **Form schema designer**.
2. Preview the **Sample form** and submit fictional rows to verify field behavior.
3. Use **Field mapping** to align columns with dashboard roles.
4. Review KPI cards, the status pipeline, and the submissions table.
5. Use **Browser project** controls to download or import a JSON backup.
6. Paste or upload CSV text, import it, then export a clean CSV for the next tool.

## Adapter Notes

- **Google Sheets:** export a responses sheet as CSV, validate field mapping here, then paste normalized rows into a dashboard tab.
- **Airtable:** keep field labels aligned, import the starter CSV, and create views by Status, Service Need, and Urgency.
- **Supabase:** use this as the public-safe prototype first; add tables, credentials, auth, and policies only in a non-public implementation.

## Client Customization

- Replace labels, select options, and sample rows with fictional equivalents from the client workflow.
- Keep public examples masked with `.test` emails, invented company names, and safe budget bands.
- Add live integrations in a separate non-public repo after the schema and mapping are approved.

## Docs

- [Public-safe data rules](docs/public-safe-data.md)
- [Customization guide](docs/customization-guide.md)
- [Client brief template](docs/client-brief-template.md)
- [Workflow template](docs/workflow-template.md)

## Live Demo

- Demo: [https://foxhen-form-to-dashboard.vercel.app](https://foxhen-form-to-dashboard.vercel.app)
- Repository: [https://github.com/foxandhenllc/foxhen-form-to-dashboard](https://github.com/foxandhenllc/foxhen-form-to-dashboard)

## SEO / AIO Discoverability

**Plain-language answer:** Use this repo to design a form schema, map fields, view submissions, track KPIs, and import/export CSV data.

**Who it helps:** small teams turning intake forms into visible work queues.

**Search intents covered:**

- form to dashboard starter
- intake dashboard template
- CSV form dashboard
- small business form workflow

**Why this repo is useful:** It shows how form responses become an operational dashboard without requiring a backend in the public version.

## License

MIT — see [LICENSE](LICENSE).
