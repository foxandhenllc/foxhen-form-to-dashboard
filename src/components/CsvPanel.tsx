type CsvPanelProps = {
  csvText: string;
  message: string;
  onCsvTextChange: (value: string) => void;
  onDownloadCsv: () => void;
  onExportCsv: () => void;
  onImportCsv: () => void;
};

export function CsvPanel({ csvText, message, onCsvTextChange, onDownloadCsv, onExportCsv, onImportCsv }: CsvPanelProps) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <p>CSV import/export</p>
        <h2>Round-trip fixture data without any service connection.</h2>
        <span>Local only</span>
      </div>
      <div className="csv-actions">
        <label className="file-control">
          Upload CSV
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (file) {
                onCsvTextChange(await file.text());
              }
            }}
          />
        </label>
        <button type="button" className="secondary-action" onClick={onImportCsv}>
          Import CSV text
        </button>
        <button type="button" className="secondary-action" onClick={onExportCsv}>
          Refresh export text
        </button>
        <button type="button" className="primary-action" onClick={onDownloadCsv}>
          Download CSV
        </button>
      </div>
      <p className="status-message">{message}</p>
      <textarea className="csv-textarea" value={csvText} onChange={(event) => onCsvTextChange(event.target.value)} />
    </section>
  );
}
