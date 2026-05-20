import { useEffect, useMemo, useState, type ChangeEvent } from "react";
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
import {
  clearStoredDashboardProject,
  cloneDashboardProject,
  type DashboardProject,
  exportDashboardProjectJson,
  getBrowserStorage,
  parseDashboardProjectJson,
  readStoredDashboardProject,
  writeStoredDashboardProject,
} from "./lib/localProject";
import { createSubmissionFromValues, deriveExportColumns, summarizeDashboard } from "./lib/workflow";
import type { FieldMapping, FormSchema, SubmissionStatus } from "./lib/types";
import "./styles.css";

type DashboardProjectState = {
  project: DashboardProject;
  status: string;
};

function createSampleProject(): DashboardProject {
  const sampleProject = cloneDashboardProject({
    schema: sampleFormSchema,
    mapping: sampleFieldMapping,
    submissions: sampleSubmissions,
    csvText: "",
  });

  return {
    ...sampleProject,
    csvText: serializeCsv(sampleProject.submissions, deriveExportColumns(sampleProject.schema, sampleProject.mapping)),
  };
}

function loadInitialDashboardProject(): DashboardProjectState {
  const sampleProject = createSampleProject();
  const storage = getBrowserStorage();

  if (!storage) {
    return {
      project: sampleProject,
      status: "Local storage is unavailable here. Download project JSON to keep a backup.",
    };
  }

  try {
    const storedProject = readStoredDashboardProject(storage);
    if (storedProject) {
      return {
        project: storedProject,
        status: "Loaded your saved browser workflow.",
      };
    }
  } catch {
    return {
      project: sampleProject,
      status: "Saved workflow JSON could not be read, so the sample dashboard loaded.",
    };
  }

  return {
    project: sampleProject,
    status: "Ready. Schema, mapping, rows, and CSV text autosave in this browser.",
  };
}

function downloadTextFile(fileName: string, contents: string, type: string) {
  const url = URL.createObjectURL(new Blob([contents], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

function App() {
  const [projectState, setProjectState] = useState<DashboardProjectState>(loadInitialDashboardProject);
  const [csvMessage, setCsvMessage] = useState("Ready with fictional sample submissions.");
  const { project } = projectState;
  const { csvText, mapping, schema, submissions } = project;

  const exportColumns = useMemo(() => deriveExportColumns(schema, mapping), [mapping, schema]);
  const summary = useMemo(() => summarizeDashboard(submissions, schema, mapping), [mapping, schema, submissions]);

  useEffect(() => {
    const storage = getBrowserStorage();

    if (!storage) return;

    try {
      writeStoredDashboardProject(storage, project);
    } catch {
      setProjectState((current) => ({
        ...current,
        status: "Could not save locally. Download project JSON to keep a backup.",
      }));
    }
  }, [project]);

  function updateProject(patch: Partial<DashboardProject>) {
    setProjectState((current) => ({
      ...current,
      project: {
        ...current.project,
        ...patch,
      },
      status: getBrowserStorage() ? "Saved locally in this browser." : "Local storage is unavailable here. Download project JSON to keep a backup.",
    }));
  }

  function replaceProject(project: DashboardProject, status: string) {
    setProjectState({
      project,
      status,
    });
  }

  function handleSampleSubmit(values: Record<string, string>) {
    const nextSubmission = createSubmissionFromValues(schema, values, mapping, "new");
    updateProject({ submissions: [nextSubmission, ...submissions] });
    setCsvMessage("Sample form submission added to the dashboard queue.");
  }

  function handleStatusChange(rowIndex: number, status: SubmissionStatus) {
    const statusColumn = mapping.status ?? "Status";
    updateProject({ submissions: submissions.map((row, index) => (index === rowIndex ? { ...row, [statusColumn]: status } : row)) });
  }

  function handleImportCsv() {
    try {
      const rows = parseCsv(csvText);
      updateProject({ submissions: rows });
      setCsvMessage(`Imported ${rows.length} CSV rows into the dashboard.`);
    } catch (error) {
      setCsvMessage(error instanceof Error ? error.message : "CSV import failed.");
    }
  }

  function handleExportCsv() {
    const exported = serializeCsv(submissions, exportColumns);
    updateProject({ csvText: exported });
    setCsvMessage(`Exported ${submissions.length} dashboard rows to CSV.`);
    return exported;
  }

  function handleDownloadCsv() {
    const exported = handleExportCsv();
    downloadTextFile("foxhen-form-to-dashboard-submissions.csv", exported, "text/csv");
  }

  function handleDownloadProject() {
    downloadTextFile("foxhen-dashboard-project.json", exportDashboardProjectJson(project), "application/json");
    setProjectState((current) => ({
      ...current,
      status: "Downloaded a project JSON backup for this editable workflow.",
    }));
  }

  async function handleImportProject(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    try {
      const importedProject = parseDashboardProjectJson(await file.text());
      replaceProject(
        importedProject,
        getBrowserStorage()
          ? `Imported ${file.name} and saved it to this browser.`
          : `Imported ${file.name}. Local storage is unavailable here, so download project JSON to keep a backup.`,
      );
      setCsvMessage(`Project import restored ${importedProject.submissions.length} dashboard rows.`);
    } catch (error) {
      setProjectState((current) => ({
        ...current,
        status: error instanceof Error ? error.message : "Project import failed.",
      }));
    }
  }

  function handleResetSample() {
    const storage = getBrowserStorage();
    if (storage) {
      clearStoredDashboardProject(storage);
    }
    const sampleProject = createSampleProject();
    replaceProject(
      sampleProject,
      storage
        ? "Reset to the sample workflow. Future edits will autosave locally."
        : "Reset to the sample workflow. Local storage is unavailable here, so download project JSON to keep a backup.",
    );
    setCsvMessage("Ready with fictional sample submissions.");
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
          <a href="#project">Project</a>
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
              <a className="secondary-action" href="#project">Save or load project</a>
            </div>
          </div>
          <KpiCards summary={summary} />
        </section>

        <section id="project" className="panel project-panel">
          <div className="panel-heading project-heading">
            <div>
              <p>Browser project</p>
              <h2>Save real workflow edits with localStorage plus portable JSON backups.</h2>
              <span>No backend</span>
            </div>
            <div className="project-actions">
              <button type="button" className="secondary-action" onClick={handleResetSample}>
                Reset to sample
              </button>
              <label className="secondary-action file-control">
                Import project JSON
                <input type="file" accept="application/json,.json" onChange={handleImportProject} />
              </label>
              <button type="button" className="primary-action" onClick={handleDownloadProject}>
                Download project JSON
              </button>
            </div>
          </div>
          <p className="status-message" role="status">
            {projectState.status}
          </p>
        </section>

        <section id="designer" className="two-column">
          <SchemaDesigner schema={schema} onSchemaChange={(schema: FormSchema) => updateProject({ schema })} />
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
          <FieldMappingPanel schema={schema} mapping={mapping} onMappingChange={(mapping: FieldMapping) => updateProject({ mapping })} />
          <CsvPanel
            csvText={csvText}
            message={csvMessage}
            onCsvTextChange={(csvText: string) => updateProject({ csvText })}
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
