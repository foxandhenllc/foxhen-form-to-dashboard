# Customization Guide

## 1. Rename the Workflow

Update the workflow name and description in the form schema designer. Keep the description focused on the intake outcome, not an internal implementation detail.

## 2. Shape the Form Schema

For each field, decide:

- label shown to users,
- field type,
- required status,
- help text,
- and select options when applicable.

Use stable labels because CSV import/export and field mapping depend on those headers.

## 3. Map Dashboard Roles

Map at least these roles before reviewing KPIs:

- `submittedAt`
- `title`
- `category`
- `urgency`
- `status`
- `notes`

The dashboard still renders with missing mappings, but summaries become more useful when the core roles are set.

## 4. Validate CSV Rows

Paste a fictional CSV sample into the CSV panel, import it, and confirm:

- row count matches the CSV,
- statuses land in the expected pipeline stage,
- urgency scores update KPI cards,
- required field coverage matches expectations,
- and export can round-trip back into the importer.

## 5. Prepare Adapter Handoff

- Google Sheets: freeze headers and keep formulas outside the import tab.
- Airtable: mirror labels exactly and create views by status and urgency.
- Supabase: treat this repo as the prototype; add tables, policies, auth, and credentials only in a non-public build.
