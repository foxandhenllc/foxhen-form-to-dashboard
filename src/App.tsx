import { useMemo, useState } from "react";
import { AdapterDocs } from "./components/AdapterDocs";
import { CsvPanel } from "./components/CsvPanel";
import { FieldMappingPanel } from "./components/FieldMappingPanel";
import { KpiCards } from "./components/KpiCards";
import { SampleForm } from "./components/SampleForm";
import { SchemaDesigner } from "./components/SchemaDesigner";
import { StatusPipeline } from "./components/StatusPipeline";
import { SubmissionsTable } from "./components/SubmissionsTable";
import { adapterNotes, sampleFieldMapping, sampleFormSchema, sampleSubmissions } from "./data/sampleWorkflow";
import { parseCsv, serializeCsv } from "./exporters/csv";
import { createSubmissionFromValues, deriveExportColumns, summarizeDashboard } from "./lib/workflow";
import type { FieldMapping, FormSchema, SubmissionRow, SubmissionStatus } from "./lib/types";
import "./styles.css";

function App() {
  const [schema, setSchema] = useState<FormSchema>(sampleFormSchema);
  const [mapping, setMapping] = useState<FieldMapping>(sampleFieldMapping);
  const [submissions, setSubmissions] = useState<SubmissionRow[]>(sampleSubmissions);
  const [csvText, setCsvText] = useState(() => serializeCsv(sampleSubmissions, deriveExportColumns(sampleFormSchema, sampleFieldMapping)));
  const [csvMessage, setCsvMessage] = useState("Ready with fictional sample submissions.");

  const exportColumns = useMemo(() => deriveExportColumns(schema, mapping), [mapping, schema]);
  const summary = useMemo(() => summarizeDashboard(submissions, schema, mapping), [mapping, schema, submissions]);

  function handleSampleSubmit(values: Record<string, string>) {
    const nextSubmission = createSubmissionFromValues(schema, values, mapping, "new");
    setSubmissions((current) => [nextSubmission, ...current]);
    setCsvMessage("Sample form submission added to the dashboard queue.");
  }

  function handleStatusChange(rowIndex: number, status: SubmissionStatus) {
    const statusColumn = mapping.status ?? "Status";
    setSubmissions((current) => current.map((row, index) => (index === rowIndex ? { ...row, [statusColumn]: status } : row)));
  }

  function handleImportCsv() {
    try {
      const rows = parseCsv(csvText);
      setSubmissions(rows);
      setCsvMessage(`Imported ${rows.length} CSV rows into the dashboard.`);
    } catch (error) {
      setCsvMessage(error instanceof Error ? error.message : "CSV import failed.");
    }
  }

  function handleExportCsv() {
    const exported = serializeCsv(submissions, exportColumns);
    setCsvText(exported);
    setCsvMessage(`Exported ${submissions.length} dashboard rows to CSV.`);
    return exported;
  }

  function handleDownloadCsv() {
    const exported = handleExportCsv();
    const url = URL.createObjectURL(new Blob([exported], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "foxhen-form-to-dashboard-submissions.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="https://foxandhenllc.com">
          <span className="brand-mark">F&amp;H</span>
          <span>
            <strong>Fox &amp; Hen</strong>
            <small>Form-to-dashboard starter</small>
          </span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#designer">Designer</a>
          <a href="#dashboard">Dashboard</a>
          <a href="#csv">CSV</a>
          <a href="#adapters">Adapters</a>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">Reusable React + TypeScript + Vite workflow starter</p>
            <h1>Turn a form schema into a mapped intake dashboard.</h1>
            <p className="lede">
              Design public-safe intake fields, preview a sample form, route fictional submissions through a status pipeline,
              and export clean CSV rows for Google Sheets, Airtable, Supabase, or a non-public production build.
            </p>
            <div className="hero-actions">
              <a className="primary-action" href="#designer">Customize schema</a>
              <a className="secondary-action" href="#csv">Import or export CSV</a>
            </div>
          </div>
          <KpiCards summary={summary} />
        </section>

        <section id="designer" className="two-column">
          <SchemaDesigner schema={schema} onSchemaChange={setSchema} />
          <SampleForm schema={schema} onSubmit={handleSampleSubmit} />
        </section>

        <section id="dashboard" className="dashboard-section">
          <div className="section-heading">
            <p>Mapped dashboard</p>
            <h2>Pipeline, KPI cards, and rows all read from the same field mapping.</h2>
          </div>
          <StatusPipeline summary={summary} />
          <SubmissionsTable rows={submissions} mapping={mapping} onStatusChange={handleStatusChange} />
        </section>

        <section id="csv" className="two-column">
          <FieldMappingPanel schema={schema} mapping={mapping} onMappingChange={setMapping} />
          <CsvPanel
            csvText={csvText}
            message={csvMessage}
            onCsvTextChange={setCsvText}
            onDownloadCsv={handleDownloadCsv}
            onExportCsv={handleExportCsv}
            onImportCsv={handleImportCsv}
          />
        </section>

        <AdapterDocs notes={adapterNotes} />
      </main>
    </div>
  );
}

export default App;
