import { useMemo, useState } from "react";
import type { FieldMapping, SubmissionRow, SubmissionStatus } from "../lib/types";
import { getMappedColumn, normalizeStatus, statusLabels, submissionStatuses } from "../lib/workflow";

type SubmissionsTableProps = {
  rows: SubmissionRow[];
  mapping: FieldMapping;
  onStatusChange: (rowIndex: number, status: SubmissionStatus) => void;
};

export function SubmissionsTable({ rows, mapping, onStatusChange }: SubmissionsTableProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | "all">("all");
  const columns = [
    getMappedColumn(mapping, "submittedAt", "Submitted At"),
    getMappedColumn(mapping, "title", "Company"),
    getMappedColumn(mapping, "contact", "Contact Email"),
    getMappedColumn(mapping, "category", "Service Need"),
    getMappedColumn(mapping, "value", "Budget Range"),
    getMappedColumn(mapping, "urgency", "Urgency"),
    getMappedColumn(mapping, "notes", "Notes"),
  ];
  const statusColumn = getMappedColumn(mapping, "status", "Status");
  const visibleRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return rows
      .map((row, rowIndex) => ({ row, rowIndex }))
      .filter(({ row }) => statusFilter === "all" || normalizeStatus(row[statusColumn]) === statusFilter)
      .filter(({ row }) => !normalizedQuery || Object.values(row).join(" ").toLowerCase().includes(normalizedQuery));
  }, [query, rows, statusColumn, statusFilter]);

  return (
    <section className="table-panel">
      <div className="table-toolbar">
        <input aria-label="Search submissions" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search submissions..." />
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as SubmissionStatus | "all")}>
          <option value="all">All statuses</option>
          {submissionStatuses.map((status) => (
            <option key={status} value={status}>
              {statusLabels[status]}
            </option>
          ))}
        </select>
      </div>
      <div className="responsive-table">
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
              <th>{statusColumn}</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="empty-table-cell">
                  No submissions match the current search and status filters.
                </td>
              </tr>
            ) : null}
            {visibleRows.map(({ row, rowIndex }) => {
              const status = normalizeStatus(row[statusColumn]);
              return (
                <tr key={`${rowIndex}-${row[getMappedColumn(mapping, "title", "Company")] ?? "submission"}`}>
                  {columns.map((column) => (
                    <td key={column} className={column === getMappedColumn(mapping, "notes", "Notes") ? "notes-cell" : undefined}>
                      {row[column] || "—"}
                    </td>
                  ))}
                  <td>
                    <select value={status} onChange={(event) => onStatusChange(rowIndex, event.target.value as SubmissionStatus)}>
                      {submissionStatuses.map((option) => (
                        <option key={option} value={option}>
                          {statusLabels[option]}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
