import type { DashboardSummary } from "../lib/types";

type KpiCardsProps = {
  summary: DashboardSummary;
};

export function KpiCards({ summary }: KpiCardsProps) {
  const cards = [
    { label: "Submissions", value: summary.totalSubmissions.toString(), detail: "dashboard rows" },
    { label: "High urgency", value: summary.highUrgency.toString(), detail: "scores of 4+" },
    { label: "Qualified", value: summary.qualifiedPipeline.toString(), detail: "qualified, proposal, won" },
    { label: "Coverage", value: `${summary.requiredFieldCoverage}%`, detail: "required fields filled" },
  ];

  return (
    <aside className="kpi-console" aria-label="Dashboard KPI summary">
      <div className="console-topline">
        <span>Live dashboard summary</span>
        <strong>{summary.topServiceNeed}</strong>
      </div>
      <div className="kpi-grid">
        {cards.map((card) => (
          <article key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
            <small>{card.detail}</small>
          </article>
        ))}
      </div>
      <p className="console-note">Newest submission: {summary.newestSubmittedAt}</p>
    </aside>
  );
}
