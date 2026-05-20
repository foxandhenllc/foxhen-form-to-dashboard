import type { FieldType, FormField, FormSchema } from "../lib/types";

type SchemaDesignerProps = {
  schema: FormSchema;
  onSchemaChange: (schema: FormSchema) => void;
};

const fieldTypeOptions: Array<{ type: FieldType; label: string }> = [
  { type: "shortText", label: "Short text" },
  { type: "longText", label: "Long text" },
  { type: "email", label: "Email" },
  { type: "select", label: "Select" },
  { type: "number", label: "Number" },
  { type: "date", label: "Date" },
  { type: "checkbox", label: "Checkbox" },
];

function updateField(fields: FormField[], fieldId: string, patch: Partial<FormField>) {
  return fields.map((field) => (field.id === fieldId ? { ...field, ...patch } : field));
}

export function SchemaDesigner({ schema, onSchemaChange }: SchemaDesignerProps) {
  function addField() {
    const field: FormField = {
      id: `field-${Date.now()}`,
      label: "New Intake Field",
      type: "shortText",
      required: false,
      helpText: "Describe how this field should appear in the dashboard.",
      placeholder: "Sample answer",
    };
    onSchemaChange({ ...schema, fields: [...schema.fields, field] });
  }

  function removeField(fieldId: string) {
    onSchemaChange({ ...schema, fields: schema.fields.filter((field) => field.id !== fieldId) });
  }

  return (
    <section className="panel">
      <div className="panel-heading">
        <p>Form schema designer</p>
        <h2>{schema.name}</h2>
        <span>{schema.fields.length} fields</span>
      </div>
      <label className="stacked-control">
        Workflow name
        <input value={schema.name} onChange={(event) => onSchemaChange({ ...schema, name: event.target.value })} />
      </label>
      <label className="stacked-control">
        Workflow description
        <textarea value={schema.description} onChange={(event) => onSchemaChange({ ...schema, description: event.target.value })} />
      </label>
      <div className="schema-list">
        {schema.fields.map((field) => (
          <article key={field.id} className="field-card">
            <div className="field-card-top">
              <label>
                Label
                <input
                  value={field.label}
                  onChange={(event) => onSchemaChange({ ...schema, fields: updateField(schema.fields, field.id, { label: event.target.value }) })}
                />
              </label>
              <label>
                Type
                <select
                  value={field.type}
                  onChange={(event) => {
                    const type = event.target.value as FieldType;
                    onSchemaChange({
                      ...schema,
                      fields: updateField(schema.fields, field.id, {
                        type,
                        options: type === "select" ? field.options ?? ["Option A", "Option B"] : field.options,
                      }),
                    });
                  }}
                >
                  {fieldTypeOptions.map((option) => (
                    <option key={option.type} value={option.type}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="stacked-control">
              Help text
              <input
                value={field.helpText}
                onChange={(event) => onSchemaChange({ ...schema, fields: updateField(schema.fields, field.id, { helpText: event.target.value }) })}
              />
            </label>
            {field.type === "select" && (
              <label className="stacked-control">
                Select options
                <textarea
                  value={(field.options ?? []).join("\n")}
                  onChange={(event) =>
                    onSchemaChange({
                      ...schema,
                      fields: updateField(schema.fields, field.id, {
                        options: event.target.value.split("\n").map((option) => option.trim()).filter(Boolean),
                      }),
                    })
                  }
                />
              </label>
            )}
            <div className="field-actions">
              <label className="toggle-control">
                <input
                  type="checkbox"
                  checked={field.required}
                  onChange={(event) => onSchemaChange({ ...schema, fields: updateField(schema.fields, field.id, { required: event.target.checked }) })}
                />
                Required
              </label>
              <button type="button" className="text-action" onClick={() => removeField(field.id)}>
                Remove
              </button>
            </div>
          </article>
        ))}
      </div>
      <button type="button" className="primary-action full-width" onClick={addField}>
        Add field
      </button>
    </section>
  );
}
