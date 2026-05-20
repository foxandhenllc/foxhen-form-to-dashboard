import type { DashboardRole, DashboardSummary, FieldMapping, FormSchema, SubmissionRow, SubmissionStatus } from "./types.js";

export const submissionStatuses: SubmissionStatus[] = ["new", "review", "qualified", "proposal", "won", "archived"];

export const statusLabels: Record<SubmissionStatus, string> = {
  new: "New",
  review: "Review",
  qualified: "Qualified",
  proposal: "Proposal",
  won: "Won",
  archived: "Archived",
};

export const dashboardRoleOptions: Array<{ role: DashboardRole; label: string; description: string }> = [
  { role: "submittedAt", label: "Submitted at", description: "Timestamp column used for recency and export order." },
  { role: "title", label: "Record title", description: "Company, request name, or primary record identifier." },
  { role: "contact", label: "Contact", description: "Safe contact label or masked inbox for follow-up queues." },
  { role: "category", label: "Category", description: "Service need, issue type, segment, or dashboard grouping." },
  { role: "value", label: "Value", description: "Budget band, revenue tier, impact level, or sizing field." },
  { role: "urgency", label: "Urgency", description: "Numeric or text urgency signal that powers KPI cards." },
  { role: "status", label: "Status", description: "Pipeline stage for routing, review, proposal, and archive." },
  { role: "notes", label: "Notes", description: "Freeform context shown in the submissions table." },
];

export function normalizeStatus(value: string | undefined): SubmissionStatus {
  const normalized = (value ?? "").trim().toLowerCase();
  if (normalized === "triage" || normalized === "needs review") {
    return "review";
  }
  if (normalized === "ready" || normalized === "approved") {
    return "qualified";
  }
  if (normalized === "closed" || normalized === "converted") {
    return "won";
  }
  return submissionStatuses.includes(normalized as SubmissionStatus) ? (normalized as SubmissionStatus) : "new";
}

export function nextStatus(status: SubmissionStatus): SubmissionStatus {
  const nextIndex = Math.min(submissionStatuses.length - 1, submissionStatuses.indexOf(status) + 1);
  return submissionStatuses[nextIndex];
}

export function getMappedColumn(mapping: FieldMapping, role: DashboardRole, fallback: string): string {
  return mapping[role] ?? fallback;
}

function parseUrgency(value: string | undefined): number {
  const numeric = Number.parseFloat(value ?? "");
  if (Number.isFinite(numeric)) {
    return Math.max(0, numeric);
  }

  const normalized = (value ?? "").toLowerCase();
  if (normalized.includes("high") || normalized.includes("urgent")) return 5;
  if (normalized.includes("medium")) return 3;
  if (normalized.includes("low")) return 1;
  return 0;
}

function findMode(values: string[]): string {
  const counts = new Map<string, number>();
  let mode = "None yet";
  let modeCount = 0;

  values.filter(Boolean).forEach((value) => {
    const nextCount = (counts.get(value) ?? 0) + 1;
    counts.set(value, nextCount);
    if (nextCount > modeCount) {
      mode = value;
      modeCount = nextCount;
    }
  });

  return mode;
}

export function summarizeDashboard(rows: SubmissionRow[], schema: FormSchema, mapping: FieldMapping): DashboardSummary {
  const statusColumn = getMappedColumn(mapping, "status", "Status");
  const urgencyColumn = getMappedColumn(mapping, "urgency", "Urgency");
  const categoryColumn = getMappedColumn(mapping, "category", "Service Need");
  const submittedAtColumn = getMappedColumn(mapping, "submittedAt", "Submitted At");
  const requiredColumns = schema.fields.filter((field) => field.required).map((field) => field.label);
  const byStatus = submissionStatuses.reduce<Record<SubmissionStatus, number>>((counts, status) => {
    counts[status] = 0;
    return counts;
  }, {} as Record<SubmissionStatus, number>);
  let urgencyTotal = 0;
  let highUrgency = 0;
  let missingRequiredCells = 0;

  rows.forEach((row) => {
    const status = normalizeStatus(row[statusColumn]);
    const urgency = parseUrgency(row[urgencyColumn]);
    byStatus[status] += 1;
    urgencyTotal += urgency;
    if (urgency >= 4) {
      highUrgency += 1;
    }
    requiredColumns.forEach((column) => {
      if (!(row[column] ?? "").trim()) {
        missingRequiredCells += 1;
      }
    });
  });

  const submittedAtValues = rows
    .map((row) => row[submittedAtColumn])
    .filter(Boolean)
    .sort();
  const newestSubmittedAt = submittedAtValues[submittedAtValues.length - 1] ?? "No submissions yet";
  const requiredCellCount = rows.length * requiredColumns.length;
  const requiredFieldCoverage = requiredCellCount === 0 ? 100 : Math.round(((requiredCellCount - missingRequiredCells) / requiredCellCount) * 100);

  return {
    totalSubmissions: rows.length,
    byStatus,
    highUrgency,
    averageUrgency: rows.length === 0 ? 0 : Number((urgencyTotal / rows.length).toFixed(1)),
    topServiceNeed: findMode(rows.map((row) => row[categoryColumn] ?? "")),
    requiredFieldCoverage,
    missingRequiredCells,
    qualifiedPipeline: byStatus.qualified + byStatus.proposal + byStatus.won,
    newestSubmittedAt,
  };
}

export function createSubmissionFromValues(schema: FormSchema, values: Record<string, string>, mapping: FieldMapping, status: SubmissionStatus = "new"): SubmissionRow {
  const row = schema.fields.reduce<SubmissionRow>((submission, field) => {
    submission[field.label] = values[field.id] ?? "";
    return submission;
  }, {});

  row[getMappedColumn(mapping, "submittedAt", "Submitted At")] = new Date().toISOString();
  row[getMappedColumn(mapping, "status", "Status")] = status;
  return row;
}

export function createSampleFormValues(schema: FormSchema): Record<string, string> {
  return schema.fields.reduce<Record<string, string>>((values, field) => {
    if (field.type === "select") {
      values[field.id] = field.options?.[0] ?? "";
    } else if (field.type === "number") {
      values[field.id] = "3";
    } else if (field.type === "checkbox") {
      values[field.id] = "Yes";
    } else if (field.type === "email") {
      values[field.id] = "hello@example.test";
    } else {
      values[field.id] = field.placeholder ?? "";
    }
    return values;
  }, {});
}

export function deriveExportColumns(schema: FormSchema, mapping: FieldMapping): string[] {
  return Array.from(
    new Set([
      getMappedColumn(mapping, "submittedAt", "Submitted At"),
      ...schema.fields.map((field) => field.label),
      getMappedColumn(mapping, "status", "Status"),
    ]),
  );
}
