import { Link } from 'react-router-dom';

import PlaceholderPage from './PlaceholderPage.jsx';

export default function NewSessionPage() {
  return (
    <>
      <PlaceholderPage />
      <Link className="sr-only" to="/sessions">
        Sessions
      </Link>
    </>
  );
}
