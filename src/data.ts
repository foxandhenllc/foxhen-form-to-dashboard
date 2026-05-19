export const sample = {
  "repoName": "foxhen-form-to-dashboard",
  "title": "Form To Dashboard",
  "subtitle": "Response intake turned into decisions",
  "serviceLine": "Form and dashboard automation",
  "heroTitle": "Turn noisy form responses into an operator dashboard.",
  "heroCopy": "A sample intake-to-dashboard flow with response quality, KPI summaries, issue routing, and handoff notes for a fictional services team.",
  "primaryAction": "Route responses",
  "secondaryAction": "Inspect KPIs",
  "repositoryUrl": "https://github.com/foxandhenllc/foxhen-form-to-dashboard",
  "liveDemoUrl": "https://foxhen-form-to-dashboard.vercel.app",
  "theme": {
    "accent": "#496238",
    "accent2": "#f2b45c",
    "ink": "#101708",
    "soft": "#eff7e9",
    "warm": "#fff2dc",
    "surface": "#fffaf4",
    "muted": "#5c667a",
    "border": "rgba(7, 18, 31, 0.12)"
  },
  "metrics": [
    {
      "label": "Responses parsed",
      "value": "128",
      "note": "sample rows"
    },
    {
      "label": "Routing accuracy",
      "value": "91%",
      "note": "+22 pts"
    },
    {
      "label": "Open issues",
      "value": "11",
      "note": "triaged"
    }
  ],
  "stages": [
    {
      "label": "Collect",
      "detail": "Capture form rows and identify missing contact, service type, and urgency fields.",
      "status": "ready",
      "owner": "Form",
      "index": 1
    },
    {
      "label": "Normalize",
      "detail": "Convert raw answers into consistent categories and scored urgency.",
      "status": "active",
      "owner": "Automation",
      "index": 2
    },
    {
      "label": "Route",
      "detail": "Send each response to the right owner queue with clear next action.",
      "status": "waiting",
      "owner": "Team",
      "index": 3
    },
    {
      "label": "Report",
      "detail": "Summarize weekly KPIs and unresolved intake problems.",
      "status": "queued",
      "owner": "Ops",
      "index": 4
    }
  ],
  "workItems": [
    {
      "title": "Service type",
      "detail": "Normalize inconsistent category labels",
      "status": "ready"
    },
    {
      "title": "Urgency score",
      "detail": "Rank high-risk submissions",
      "status": "active"
    },
    {
      "title": "Missing contact",
      "detail": "Waiting on validation rule",
      "status": "waiting"
    },
    {
      "title": "Weekly memo",
      "detail": "Queued for export",
      "status": "queued"
    }
  ],
  "deliverables": [
    {
      "title": "Dashboard view",
      "detail": "Operator-friendly KPIs, filters, and response queues."
    },
    {
      "title": "Data rules",
      "detail": "Readable normalization rules for future maintenance."
    },
    {
      "title": "Handoff memo",
      "detail": "Exact unresolved issues and next automation candidates."
    }
  ],
  "timeline": [
    {
      "time": "0-2 hrs",
      "detail": "Map form fields and reporting goal"
    },
    {
      "time": "2-12 hrs",
      "detail": "Build dashboard and routing logic"
    },
    {
      "time": "12-24 hrs",
      "detail": "QA edge cases and prepare handoff"
    }
  ],
  "proof": [
    "Matches fast workflow automation work.",
    "Demonstrates a clear before-after path from form chaos to action.",
    "Static sample data only; no live form connection."
  ]
} as const;

export type StageStatus = "ready" | "active" | "waiting" | "queued";
export type DemoStage = (typeof sample.stages)[number];
export type WorkItem = (typeof sample.workItems)[number];
