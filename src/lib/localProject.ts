import type { DashboardRole, FieldMapping, FieldType, FormField, FormSchema, SubmissionRow } from "./types.js";

export type StorageAdapter = Pick<Storage, "getItem" | "removeItem" | "setItem">;

export type DashboardProject = {
  schema: FormSchema;
  mapping: FieldMapping;
  submissions: SubmissionRow[];
  csvText: string;
};

export const dashboardProjectStorageKey = "foxhen-form-to-dashboard.project.v1";

const dashboardProjectApp = "foxhen-form-to-dashboard";
const dashboardProjectSchemaVersion = "foxhen-form-to-dashboard.project.v1";
const fieldTypes: FieldType[] = ["shortText", "longText", "email", "select", "number", "date", "checkbox"];
const dashboardRoles: DashboardRole[] = ["submittedAt", "title", "contact", "category", "value", "urgency", "status", "notes"];

type DashboardProjectFile = {
  app: typeof dashboardProjectApp;
  schemaVersion: typeof dashboardProjectSchemaVersion;
  exportedAt: string;
  project: DashboardProject;
};

function cloneProject(project: DashboardProject): DashboardProject {
  return JSON.parse(JSON.stringify(project)) as DashboardProject;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isFormField(value: unknown): value is FormField {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.label === "string" &&
    fieldTypes.includes(value.type as FieldType) &&
    typeof value.required === "boolean" &&
    typeof value.helpText === "string" &&
    (value.options === undefined || isStringArray(value.options)) &&
    (value.placeholder === undefined || typeof value.placeholder === "string")
  );
}

function isFormSchema(value: unknown): value is FormSchema {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.description === "string" &&
    Array.isArray(value.fields) &&
    value.fields.every(isFormField)
  );
}

function isFieldMapping(value: unknown): value is FieldMapping {
  return (
    isRecord(value) &&
    Object.entries(value).every(([role, column]) => dashboardRoles.includes(role as DashboardRole) && typeof column === "string")
  );
}

function isSubmissionRow(value: unknown): value is SubmissionRow {
  return isRecord(value) && Object.values(value).every((cell) => typeof cell === "string");
}

function isDashboardProject(value: unknown): value is DashboardProject {
  return (
    isRecord(value) &&
    isFormSchema(value.schema) &&
    isFieldMapping(value.mapping) &&
    Array.isArray(value.submissions) &&
    value.submissions.every(isSubmissionRow) &&
    typeof value.csvText === "string"
  );
}

function extractProject(value: unknown): DashboardProject | null {
  if (isDashboardProject(value)) {
    return value;
  }

  if (isRecord(value) && isDashboardProject(value.project)) {
    return value.project;
  }

  return null;
}

export function cloneDashboardProject(project: DashboardProject): DashboardProject {
  return cloneProject(project);
}

export function exportDashboardProjectJson(project: DashboardProject) {
  const projectFile: DashboardProjectFile = {
    app: dashboardProjectApp,
    schemaVersion: dashboardProjectSchemaVersion,
    exportedAt: new Date().toISOString(),
    project: cloneProject(project),
  };

  return JSON.stringify(projectFile, null, 2);
}

export function parseDashboardProjectJson(jsonText: string): DashboardProject {
  let parsed: unknown;

  try {
    parsed = JSON.parse(jsonText);
  } catch {
    throw new Error("Dashboard project JSON could not be parsed.");
  }

  const project = extractProject(parsed);
  if (!project) {
    throw new Error("Dashboard project JSON must include a valid dashboard project.");
  }

  return cloneProject(project);
}

export function getBrowserStorage(): StorageAdapter | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function readStoredDashboardProject(storage: StorageAdapter): DashboardProject | null {
  const savedProject = storage.getItem(dashboardProjectStorageKey);
  return savedProject ? parseDashboardProjectJson(savedProject) : null;
}

export function writeStoredDashboardProject(storage: StorageAdapter, project: DashboardProject) {
  storage.setItem(dashboardProjectStorageKey, exportDashboardProjectJson(project));
}

export function clearStoredDashboardProject(storage: StorageAdapter) {
  storage.removeItem(dashboardProjectStorageKey);
}
