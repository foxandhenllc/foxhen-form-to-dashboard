# Public-safe Data Rules

This starter is safe to publish because it contains only fictional, local data.

## Allowed

- Invented company names and project notes.
- `.test` email addresses such as `hello@example.test`.
- Budget bands, urgency scores, and generic service categories.
- CSV fixtures created only for testing this starter.

## Not Allowed

- Real client names, contacts, exports, screenshots, restricted URLs, or internal notes.
- Production credentials, database URLs, OAuth credentials, or webhook URLs.
- Production form responses copied from Google Sheets, Airtable, Supabase, or a CRM.

## Safe Adaptation Pattern

1. Model the workflow with fictional rows first.
2. Confirm schema, field mapping, and dashboard expectations with the client.
3. Move any real adapter, credential, backend, auth, or customer data into a non-public implementation.
4. Keep this repo as the public starter and reference pattern.
