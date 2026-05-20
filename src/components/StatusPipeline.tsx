import type { DashboardSummary } from "../lib/types";
import { statusLabels, submissionStatuses } from "../lib/workflow";

type StatusPipelineProps = {
  summary: DashboardSummary;
};

const stageDescriptions = {
  new: "Fresh submissions from the sample form or CSV import.",
  review: "Rows that need a human pass before routing.",
  qualified: "Mapped rows ready for a next action.",
  proposal: "Prepared for quote, scope, or handoff.",
  won: "Converted examples kept for reporting.",
  archived: "Closed rows hidden from active work.",
};

export function StatusPipeline({ summary }: StatusPipelineProps) {
  return (
    <div className="pipeline-grid" aria-label="Submission status pipeline">
      {submissionStatuses.map((status) => (
        <article key={status}>
          <span className={`status-pill ${status}`}>{statusLabels[status]}</span>
          <strong>{summary.byStatus[status]}</strong>
          <p>{stageDescriptions[status]}</p>
        </article>
      ))}
    </div>
  );
}
