import { BookOpen, FlaskConical, Lightbulb, ListChecks } from 'lucide-react';
import { Link } from 'react-router-dom';

const steps = [
  ['1', 'Create a session', 'Start with the bug, its error message, project, technology, severity, and current status.'],
  ['2', 'Record hypotheses', 'Add the possible causes you want to investigate, together with the reasoning behind each one.'],
  ['3', 'Run experiments', 'For every hypothesis, note the test, expected result, actual result, and any evidence.'],
  ['4', 'Capture the resolution', 'Once solved, document the root cause, fix, and lesson so the next investigation starts ahead.'],
];

export default function GuidePage() {
  return (
    <section className="page-container guide-page">
      <div className="guide-hero">
        <p className="eyebrow"><BookOpen size={13} /> How DevTrace works</p>
        <h1 className="page-title">Turn debugging into reusable knowledge.</h1>
        <p className="page-subtitle">
          DevTrace is your private debugging journal. It keeps the thinking behind a fix—not just
          the final answer—so you can revisit, search, and learn from every investigation.
        </p>
        <Link className="primary-button compact-button" to="/sessions/new">Start a session</Link>
      </div>

      <section className="guide-section" aria-labelledby="guide-steps">
        <p className="eyebrow">A simple workflow</p>
        <h2 id="guide-steps">From problem to lesson</h2>
        <ol className="guide-steps">
          {steps.map(([number, title, description]) => (
            <li key={number}>
              <span>{number}</span>
              <div><h3>{title}</h3><p>{description}</p></div>
            </li>
          ))}
        </ol>
      </section>

      <section className="guide-section" aria-labelledby="guide-terms">
        <p className="eyebrow">Key terms</p>
        <h2 id="guide-terms">The building blocks of an investigation</h2>
        <div className="guide-terms">
          <article><Lightbulb size={19} /><h3>Debug session</h3><p>The complete record for one problem, from the first observed failure through the final fix.</p></article>
          <article><ListChecks size={19} /><h3>Hypothesis</h3><p>A possible explanation for the problem. For example: “The API token has expired.”</p></article>
          <article><FlaskConical size={19} /><h3>Experiment</h3><p>A test used to check a hypothesis. Record what you expected, what actually happened, and the evidence.</p></article>
        </div>
      </section>
      <footer className="product-footer guide-footer">Developed by Krishna Mandal</footer>
    </section>
  );
}
