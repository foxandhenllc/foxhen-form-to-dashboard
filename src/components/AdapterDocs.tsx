import type { AdapterNote } from "../lib/types";

type AdapterDocsProps = {
  notes: AdapterNote[];
};

export function AdapterDocs({ notes }: AdapterDocsProps) {
  return (
    <section id="adapters" className="adapter-section">
      <div className="section-heading">
        <p>Adapter notes</p>
        <h2>Keep this starter static, then connect real tools in a separate non-public implementation.</h2>
      </div>
      <div className="adapter-grid">
        {notes.map((note) => (
          <article key={note.name} className="adapter-card">
            <h3>{note.name}</h3>
            <p>{note.bestFor}</p>
            <dl>
              <div>
                <dt>Read pattern</dt>
                <dd>{note.readPattern}</dd>
              </div>
              <div>
                <dt>Write pattern</dt>
                <dd>{note.writePattern}</dd>
              </div>
            </dl>
            <ul>
              {note.starterSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
