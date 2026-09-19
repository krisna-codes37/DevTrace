import { ArrowUpRight, Construction } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const pageCopy = {
  '/dashboard': ['Dashboard', 'Your debugging signal will live here.'],
  '/sessions': ['Sessions', 'Your debugging sessions will live here.'],
  '/profile': ['Profile', 'Your developer profile will live here.'],
  '/settings': ['Settings', 'Workspace preferences will live here.'],
};

export default function PlaceholderPage() {
  const location = useLocation();
  const [title, description] = pageCopy[location.pathname] ?? [
    'Session workspace',
    'This session view will be available in the next phase.',
  ];

  return (
    <section className="placeholder-page">
      <div className="placeholder-icon">
        <Construction size={22} aria-hidden="true" />
      </div>
      <p className="eyebrow">Authenticated area</p>
      <h1>{title}</h1>
      <p>{description}</p>
      <Link className="quiet-link" to="/dashboard">
        Return to dashboard <ArrowUpRight size={16} aria-hidden="true" />
      </Link>
    </section>
  );
}
