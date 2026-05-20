import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseCsv, serializeCsv } from "../.smoke/src/exporters/csv.js";
import { sampleFieldMapping, sampleFormSchema } from "../.smoke/src/data/sampleWorkflow.js";
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
console.log("smoke: CSV import/export/dashboard summary passed");
