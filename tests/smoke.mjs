import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseCsv, serializeCsv } from "../.smoke/src/exporters/csv.js";
import { sampleFieldMapping, sampleFormSchema, sampleSubmissions } from "../.smoke/src/data/sampleWorkflow.js";
import {
  clearStoredDashboardProject,
  dashboardProjectStorageKey,
  exportDashboardProjectJson,
  parseDashboardProjectJson,
  readStoredDashboardProject,
  writeStoredDashboardProject,
} from "../.smoke/src/lib/localProject.js";
import { summarizeDashboard } from "../.smoke/src/lib/workflow.js";

const fixture = readFileSync(new URL("./fixtures/submissions.csv", import.meta.url), "utf8");
const rows = parseCsv(fixture);

assert.equal(rows.length, 3, "imports all fixture submissions");
assert.equal(rows[0]["Company"], "Acorn Atelier");
assert.equal(rows[0]["Notes"], "Needs a weekly owner queue and KPI summary.");

const summary = summarizeDashboard(rows, sampleFormSchema, sampleFieldMapping);

assert.equal(summary.totalSubmissions, 3);
assert.equal(summary.byStatus.review, 1);
assert.equal(summary.byStatus.qualified, 1);
assert.equal(summary.highUrgency, 2);
assert.equal(summary.topServiceNeed, "Dashboard repair");
assert.equal(summary.requiredFieldCoverage, 100);

const exported = serializeCsv(rows);
const roundTripRows = parseCsv(exported);

assert.deepEqual(roundTripRows, rows, "CSV export round-trips imported fixture rows");

function createMemoryStorage() {
  const items = new Map();

  return {
    getItem: (key) => items.get(key) ?? null,
    removeItem: (key) => {
      items.delete(key);
    },
    setItem: (key, value) => {
      items.set(key, value);
    },
  };
}

const project = {
  schema: {
    ...sampleFormSchema,
    name: "Local Dashboard Workflow",
  },
  mapping: sampleFieldMapping,
  submissions: rows,
  csvText: fixture,
};
const projectJson = exportDashboardProjectJson(project);
const importedProject = parseDashboardProjectJson(projectJson);

assert.equal(importedProject.schema.name, "Local Dashboard Workflow", "project JSON restores schema edits");
assert.deepEqual(importedProject.submissions, rows, "project JSON restores imported rows");
assert.match(projectJson, /foxhen-form-to-dashboard/, "project JSON includes an app marker");
assert.equal(parseDashboardProjectJson(JSON.stringify({ ...project, submissions: sampleSubmissions })).submissions.length, 4, "raw project JSON imports");

const storage = createMemoryStorage();
writeStoredDashboardProject(storage, project);
assert.match(storage.getItem(dashboardProjectStorageKey), /Local Dashboard Workflow/, "local storage keeps workflow edits");
assert.equal(readStoredDashboardProject(storage)?.schema.name, "Local Dashboard Workflow", "local storage reloads workflow edits");
clearStoredDashboardProject(storage);
assert.equal(readStoredDashboardProject(storage), null, "local storage reset removes saved workflow");

assert.throws(() => parseDashboardProjectJson('{"not":"a dashboard"}'), /dashboard project/i, "invalid project JSON is rejected");

console.log("smoke: CSV import/export/dashboard summary passed");
