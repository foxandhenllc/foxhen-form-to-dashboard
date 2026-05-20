import { useEffect, useState, type FormEvent } from "react";
import { createSampleFormValues } from "../lib/workflow";
import type { FormField, FormSchema } from "../lib/types";

type SampleFormProps = {
  schema: FormSchema;
  onSubmit: (values: Record<string, string>) => void;
};

function renderField(field: FormField, value: string, onChange: (value: string) => void) {
  if (field.type === "longText") {
    return <textarea value={value} placeholder={field.placeholder} onChange={(event) => onChange(event.target.value)} />;
  }

  if (field.type === "select") {
    return (
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {(field.options ?? []).map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === "checkbox") {
    return (
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    );
  }

  const inputType = field.type === "email" ? "email" : field.type === "date" ? "date" : field.type === "number" ? "number" : "text";
  return <input type={inputType} min={field.type === "number" ? "1" : undefined} max={field.type === "number" ? "5" : undefined} value={value} placeholder={field.placeholder} onChange={(event) => onChange(event.target.value)} />;
}

export function SampleForm({ schema, onSubmit }: SampleFormProps) {
  const [values, setValues] = useState(() => createSampleFormValues(schema));

  useEffect(() => {
    setValues((current) => {
      const nextValues = createSampleFormValues(schema);
      Object.keys(nextValues).forEach((fieldId) => {
        nextValues[fieldId] = current[fieldId] ?? nextValues[fieldId];
      });
      return nextValues;
    });
  }, [schema]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(values);
  }

  return (
    <section className="panel sample-form-panel">
      <div className="panel-heading">
        <p>Sample form</p>
        <h2>Preview and submit a fictional response.</h2>
        <span>No backend</span>
      </div>
      <p className="muted">{schema.description}</p>
      <form className="sample-form" onSubmit={handleSubmit}>
        {schema.fields.map((field) => (
          <label key={field.id} className="stacked-control">
            {field.label}
            {renderField(field, values[field.id] ?? "", (value) => setValues((current) => ({ ...current, [field.id]: value })))}
            <small>{field.helpText}{field.required ? " Required." : ""}</small>
          </label>
        ))}
        <button type="submit" className="primary-action full-width">
          Add sample submission
        </button>
      </form>
    </section>
  );
}
