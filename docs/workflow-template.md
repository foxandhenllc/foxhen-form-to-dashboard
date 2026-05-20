# Form To Dashboard Workflow Template

Use this template to fork the starter into a non-public implementation while keeping this public repo fictional and credential-free.

## Audience

Operators who collect requests through forms and need a reusable path from raw responses to dashboard rows.

## Operating Promise

The workflow turns a schema into:

- a sample form,
- mapped CSV-style submissions,
- KPI cards,
- a searchable submissions table,
- a status pipeline,
- and exportable rows for another tool.

## Intake-to-dashboard Loop

| Stage | Starter surface | What to customize |
| --- | --- | --- |
| 1 | Form schema designer | Rename fields, choose field types, mark required fields, and write help text. |
| 2 | Sample form | Submit fictional rows that mirror the client’s intake pattern. |
| 3 | Field mapping | Map form columns to title, contact, category, value, urgency, status, and notes. |
| 4 | Dashboard review | Verify KPI cards, pipeline counts, and table filters from imported rows. |
| 5 | CSV handoff | Export a clean CSV for Sheets, Airtable, Supabase seed data, or non-public app work. |

## Demo Metrics To Adapt

- Total submissions
- High-urgency submissions
- Qualified pipeline count
- Required field coverage
- Top service need

## Fork Checklist

- Replace all fixture names, notes, and `.test` inboxes with public-safe fictional data.
- Keep the app static until a non-public implementation needs a real adapter.
- Freeze CSV headers before asking non-technical users to import data.
- Document which dashboard role each field owns.
- Run `npm run test:smoke`, `npm run typecheck`, and `npm run build` before handoff.
