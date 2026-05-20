import type { AdapterNote, FieldMapping, FormSchema, SubmissionRow } from "../lib/types.js";

export const sampleFormSchema: FormSchema = {
  id: "flagship-intake",
  name: "Flagship Intake Starter",
  description: "A public-safe sample form that turns fictional service inquiries into dashboard-ready rows.",
  fields: [
    {
      id: "company",
      label: "Company",
      type: "shortText",
      required: true,
      helpText: "Use a company, project, or request name that can become the dashboard title.",
      placeholder: "Example Studio",
    },
    {
      id: "contactEmail",
      label: "Contact Email",
      type: "email",
      required: true,
      helpText: "Use masked or fictional inboxes in public demos.",
      placeholder: "hello@example.test",
    },
    {
      id: "serviceNeed",
      label: "Service Need",
      type: "select",
      required: true,
      helpText: "Groups rows into dashboard categories and owner queues.",
      options: ["Dashboard repair", "Lead intake", "CRM cleanup", "Automation map"],
    },
    {
      id: "budgetRange",
      label: "Budget Range",
      type: "select",
      required: false,
      helpText: "A safe sizing band for KPI cards and prioritization.",
      options: ["Under $2k", "$2k-$5k", "$5k-$10k", "$10k+"],
    },
    {
      id: "urgency",
      label: "Urgency",
      type: "number",
      required: true,
      helpText: "1-5 urgency score used by the dashboard summary.",
      placeholder: "4",
    },
    {
      id: "notes",
      label: "Notes",
      type: "longText",
      required: false,
      helpText: "Short context for review, proposal, or archive notes.",
      placeholder: "Needs a weekly owner queue and KPI summary.",
    },
  ],
};

export const sampleFieldMapping: FieldMapping = {
  submittedAt: "Submitted At",
  title: "Company",
  contact: "Contact Email",
  category: "Service Need",
  value: "Budget Range",
  urgency: "Urgency",
  status: "Status",
  notes: "Notes",
};

export const sampleSubmissions: SubmissionRow[] = [
  {
    "Submitted At": "2026-05-01T14:00:00.000Z",
    Company: "Acorn Atelier",
    "Contact Email": "ops@example.test",
    "Service Need": "Dashboard repair",
    "Budget Range": "$2k-$5k",
    Urgency: "5",
    Status: "review",
    Notes: "Needs a weekly owner queue and KPI summary.",
  },
  {
    "Submitted At": "2026-05-02T16:30:00.000Z",
    Company: "Bramble Books",
    "Contact Email": "hello@example.test",
    "Service Need": "Lead intake",
    "Budget Range": "$5k-$10k",
    Urgency: "4",
    Status: "qualified",
    Notes: "Ready for proposal once intake fields are mapped.",
  },
  {
    "Submitted At": "2026-05-03T10:15:00.000Z",
    Company: "Clover Clinic",
    "Contact Email": "team@example.test",
    "Service Need": "CRM cleanup",
    "Budget Range": "Under $2k",
    Urgency: "2",
    Status: "new",
    Notes: "Wants a lightweight spreadsheet adapter first.",
  },
  {
    "Submitted At": "2026-05-04T13:45:00.000Z",
    Company: "Dandelion Digital",
    "Contact Email": "forms@example.test",
    "Service Need": "Automation map",
    "Budget Range": "$10k+",
    Urgency: "3",
    Status: "proposal",
    Notes: "Needs dashboard roles approved before import.",
  },
];

export const adapterNotes: AdapterNote[] = [
  {
    name: "Google Sheets",
    bestFor: "Fast client handoff, spreadsheet review, and teams that already collect form responses in a sheet.",
    readPattern: "Export the form response sheet as CSV, then import it here to validate mapping and dashboard fields.",
    writePattern: "Use the CSV export as a clean dashboard seed or paste the normalized rows into a reporting tab.",
    starterSteps: ["Freeze header names before import.", "Add Status and Submitted At columns.", "Keep formulas in a separate dashboard tab."],
  },
  {
    name: "Airtable",
    bestFor: "Lightweight CRM-style queues with views for sales, operations, or support handoff.",
    readPattern: "Export an Airtable view to CSV with only public-safe fields selected.",
    writePattern: "Import this starter CSV into a base, then create views by Status, Service Need, and Urgency.",
    starterSteps: ["Mirror field labels exactly.", "Use single-select Status options.", "Create a saved view for high-urgency rows."],
  },
  {
    name: "Supabase",
    bestFor: "Future production apps that need a real database after the static starter proves the workflow.",
    readPattern: "Start with CSV fixtures or generated seed rows before writing any database integration.",
    writePattern: "Map each form field to a typed column and keep this starter as the public-safe UI prototype.",
    starterSteps: ["Create a submissions table only after approval.", "Keep credentials outside this repo.", "Add auth and row policies in a separate non-public implementation."],
  },
];
