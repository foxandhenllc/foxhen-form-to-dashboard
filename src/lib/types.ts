export type FieldType = "shortText" | "longText" | "email" | "select" | "number" | "date" | "checkbox";

export type DashboardRole = "submittedAt" | "title" | "contact" | "category" | "value" | "urgency" | "status" | "notes";

export type SubmissionStatus = "new" | "review" | "qualified" | "proposal" | "won" | "archived";

export type FormField = {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  helpText: string;
  options?: string[];
  placeholder?: string;
};

export type FormSchema = {
  id: string;
  name: string;
  description: string;
  fields: FormField[];
};

export type FieldMapping = Partial<Record<DashboardRole, string>>;

export type SubmissionRow = Record<string, string>;

export type DashboardSummary = {
  totalSubmissions: number;
  byStatus: Record<SubmissionStatus, number>;
  highUrgency: number;
  averageUrgency: number;
  topServiceNeed: string;
  requiredFieldCoverage: number;
  missingRequiredCells: number;
  qualifiedPipeline: number;
  newestSubmittedAt: string;
};

export type AdapterNote = {
  name: string;
  bestFor: string;
  readPattern: string;
  writePattern: string;
  starterSteps: string[];
};
