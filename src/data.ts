export type ItemStatus = "backlog" | "active" | "blocked" | "ready" | "done";

export type WorkItem = {
  id: string;
  title: string;
  category: string;
  owner: string;
  status: ItemStatus;
  priority: number;
  effort: number;
  friction: number;
  value: number;
  due: string;
  notes: string;
};

export type QualityCheck = {
  id: string;
  label: string;
  passed: boolean;
  weight: number;
};

export const sample: {
  repoName: string;
  title: string;
  subtitle: string;
  serviceLine: string;
  description: string;
  repositoryUrl: string;
  liveDemoUrl: string;
  theme: { accent: string; accent2: string; ink: string; soft: string; warm: string };
  items: WorkItem[];
  checks: QualityCheck[];
  deliverables: string[];
} = {
  "repoName": "foxhen-form-to-dashboard",
  "title": "Form To Dashboard",
  "subtitle": "intake dashboard",
  "serviceLine": "Form and dashboard automation",
  "description": "Normalize fictional form responses into KPIs, owner queues, urgency flags, and exportable notes.",
  "repositoryUrl": "https://github.com/foxandhenllc/foxhen-form-to-dashboard",
  "liveDemoUrl": "https://foxhen-form-to-dashboard.vercel.app",
  "theme": {
    "accent": "#496238",
    "accent2": "#f2b45c",
    "ink": "#101708",
    "soft": "#eff7e9",
    "warm": "#fff2dc"
  },
  "items": [
    {
      "id": "for-1",
      "title": "Service type",
      "category": "Intake",
      "owner": "Chris",
      "status": "active",
      "priority": 5,
      "effort": 2,
      "friction": 1,
      "value": 5,
      "due": "Today",
      "notes": "Sample intake dashboard work item for form and dashboard automation."
    },
    {
      "id": "for-2",
      "title": "Urgency score",
      "category": "Build",
      "owner": "Fox & Hen",
      "status": "backlog",
      "priority": 4,
      "effort": 4,
      "friction": 2,
      "value": 4,
      "due": "24h",
      "notes": "Sample intake dashboard work item for form and dashboard automation."
    },
    {
      "id": "for-3",
      "title": "Missing contact",
      "category": "Review",
      "owner": "Buyer",
      "status": "blocked",
      "priority": 3,
      "effort": 3,
      "friction": 4,
      "value": 4,
      "due": "48h",
      "notes": "Sample intake dashboard work item for form and dashboard automation."
    },
    {
      "id": "for-4",
      "title": "Issue queue",
      "category": "Export",
      "owner": "Automation",
      "status": "ready",
      "priority": 4,
      "effort": 2,
      "friction": 2,
      "value": 3,
      "due": "This week",
      "notes": "Sample intake dashboard work item for form and dashboard automation."
    },
    {
      "id": "for-5",
      "title": "KPI summary",
      "category": "Intake",
      "owner": "QA",
      "status": "backlog",
      "priority": 2,
      "effort": 1,
      "friction": 1,
      "value": 3,
      "due": "Waiting",
      "notes": "Sample intake dashboard work item for form and dashboard automation."
    },
    {
      "id": "for-6",
      "title": "Weekly memo",
      "category": "Build",
      "owner": "Chris",
      "status": "done",
      "priority": 5,
      "effort": 5,
      "friction": 3,
      "value": 5,
      "due": "Next pass",
      "notes": "Sample intake dashboard work item for form and dashboard automation."
    }
  ],
  "checks": [
    {
      "id": "payer",
      "label": "Payer or owner is clear",
      "passed": true,
      "weight": 18
    },
    {
      "id": "deliverable",
      "label": "Deliverable has acceptance criteria",
      "passed": true,
      "weight": 18
    },
    {
      "id": "friction",
      "label": "Account/access friction is documented",
      "passed": false,
      "weight": 14
    },
    {
      "id": "handoff",
      "label": "Handoff package is generated",
      "passed": false,
      "weight": 16
    },
    {
      "id": "reuse",
      "label": "Repeatable pipeline note exists",
      "passed": true,
      "weight": 12
    }
  ],
  "deliverables": [
    "Ranked board",
    "Editable item inspector",
    "Readiness checklist",
    "Exportable handoff report"
  ]
};
