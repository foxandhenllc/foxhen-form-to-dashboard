import { dashboardRoleOptions } from "../lib/workflow";
import type { FieldMapping, FormSchema } from "../lib/types";

type FieldMappingPanelProps = {
  schema: FormSchema;
  mapping: FieldMapping;
  onMappingChange: (mapping: FieldMapping) => void;
};

export function FieldMappingPanel({ schema, mapping, onMappingChange }: FieldMappingPanelProps) {
  const columns = Array.from(new Set(["Submitted At", "Status", ...schema.fields.map((field) => field.label)]));

  return (
    <section className="panel">
      <div className="panel-heading">
        <p>Field mapping</p>
        <h2>Tell the dashboard what each form column means.</h2>
        <span>{dashboardRoleOptions.length} roles</span>
      </div>
      <div className="mapping-list">
        {dashboardRoleOptions.map((option) => (
          <label key={option.role} className="mapping-row">
            <span>
              <strong>{option.label}</strong>
              <small>{option.description}</small>
            </span>
            <select
              value={mapping[option.role] ?? ""}
              onChange={(event) => onMappingChange({ ...mapping, [option.role]: event.target.value || undefined })}
            >
              <option value="">Not mapped</option>
              {columns.map((column) => (
                <option key={column} value={column}>
                  {column}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
    </section>
  );
}
