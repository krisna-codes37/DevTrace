import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { getApiErrorMessage } from '../api/client.js';
import { useSessions } from '../hooks/useSessions.js';
import SessionSkeleton from '../components/SessionSkeleton.jsx';

const defaultQuery = {
  page: 1,
  limit: 10,
  search: '',
  status: '',
  technology: '',
  severity: '',
  sort: '-createdAt',
};

const statusLabels = {
  OPEN: 'Open',
  IN_PROGRESS: 'In progress',
  SOLVED: 'Solved',
  ARCHIVED: 'Archived',
};

const severityLabels = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical',
};

export default function SessionsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const query = readQuery(searchParams);
  const [searchInput, setSearchInput] = useState(query.search);
  const searchRef = useRef(null);
  const { data, error, isLoading, isFetching } = useSessions(query);
  const sessions = data?.data ?? [];
  const pagination = data?.pagination ?? { page: 1, limit: 10, total: 0, totalPages: 0 };

  useEffect(() => {
    setSearchInput(query.search);
  }, [query.search]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (searchInput !== query.search) {
        setSearchParams((current) => {
          const next = new URLSearchParams(current);
          if (searchInput) next.set('search', searchInput);
          else next.delete('search');
          next.set('page', '1');
          return next;
        });
      }
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [searchInput, query.search, setSearchParams]);

  useEffect(() => {
    function focusSearch(event) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchRef.current?.focus();
      }
    }

    window.addEventListener('keydown', focusSearch);
    return () => window.removeEventListener('keydown', focusSearch);
  }, []);

  function updateQuery(key, value) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== 'page') next.set('page', '1');
    setSearchParams(next);
  }

  return (
    <section className="page-container sessions-page">
      <div className="page-heading-row">
        <div>
          <p className="eyebrow">Debug journal</p>
          <h1 className="page-title">Sessions</h1>
          <p className="page-subtitle">A working record of the problems you are untangling.</p>
        </div>
        <Link className="primary-button compact-button" to="/sessions/new">
          <Plus size={17} aria-hidden="true" />
          New session
        </Link>
      </div>

      <div className="session-toolbar">
        <label className="search-box">
          <Search size={17} aria-hidden="true" />
          <span className="sr-only">Search sessions</span>
          <input
            ref={searchRef}
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search title, description, tags, root cause..."
          />
          <kbd>Ctrl/Cmd K</kbd>
        </label>
        <button
          className="secondary-button filter-toggle"
          type="button"
          onClick={() => setFiltersOpen(!filtersOpen)}
        >
          <SlidersHorizontal size={16} aria-hidden="true" />
          Filters
        </button>
        <select
          value={query.sort}
          onChange={(event) => updateQuery('sort', event.target.value)}
          aria-label="Sort sessions"
        >
          <option value="-createdAt">Newest first</option>
          <option value="createdAt">Oldest first</option>
          <option value="-updatedAt">Recently updated</option>
          <option value="updatedAt">Least recently updated</option>
        </select>
      </div>

      <div className={`session-filters${filtersOpen ? ' is-open' : ''}`}>
        <select
          value={query.status}
          onChange={(event) => updateQuery('status', event.target.value)}
          aria-label="Filter by status"
        >
          <option value="">All statuses</option>
          {Object.entries(statusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          value={query.severity}
          onChange={(event) => updateQuery('severity', event.target.value)}
          aria-label="Filter by severity"
        >
          <option value="">All severities</option>
          {Object.entries(severityLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <input
          value={query.technology}
          onChange={(event) => updateQuery('technology', event.target.value)}
          placeholder="Technology"
          aria-label="Filter by technology"
        />
      </div>

      {isLoading ? (
        <SessionSkeleton />
      ) : error ? (
        <ErrorState message={getApiErrorMessage(error)} />
      ) : sessions.length === 0 ? (
        <EmptyState
          hasFilters={Boolean(query.search || query.status || query.severity || query.technology)}
        />
      ) : (
        <>
          <div className="session-list" aria-live="polite">
            {sessions.map((session) => (
              <SessionRow
                key={session._id}
                session={session}
                returnSearch={searchParams.toString()}
              />
            ))}
          </div>
          <div className="pagination-bar">
            <span>
              {pagination.total} {pagination.total === 1 ? 'session' : 'sessions'}
            </span>
            <div className="pagination-controls">
              <button
                className="icon-button"
                type="button"
                disabled={pagination.page <= 1 || isFetching}
                onClick={() => updateQuery('page', String(pagination.page - 1))}
                title="Previous page"
              >
                <ChevronLeft size={16} />
                <span className="sr-only">Previous page</span>
              </button>
              <span>
                Page {pagination.page} of {Math.max(pagination.totalPages, 1)}
              </span>
              <button
                className="icon-button"
                type="button"
                disabled={pagination.page >= pagination.totalPages || isFetching}
                onClick={() => updateQuery('page', String(pagination.page + 1))}
                title="Next page"
              >
                <ChevronRight size={16} />
                <span className="sr-only">Next page</span>
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

function readQuery(params) {
  return Object.fromEntries(
    Object.keys(defaultQuery).map((key) => [key, params.get(key) ?? defaultQuery[key]]),
  );
}

function SessionRow({ session, returnSearch }) {
  return (
    <Link className="session-row" to={`/sessions/${session._id}`} state={{ returnSearch }}>
      <div className="session-row-main">
        <div className="session-row-title">
          <span className={`status-dot status-${session.status?.toLowerCase()}`} />
          {session.title}
        </div>
        <p>{session.description || session.errorMessage || 'No context added yet.'}</p>
        <div className="session-row-meta">
          <span>{session.technology || 'Unspecified technology'}</span>
          <span>{formatDate(session.updatedAt)}</span>
        </div>
      </div>
      <div className="session-row-side">
        <span className={`severity-badge severity-${session.severity?.toLowerCase()}`}>
          {severityLabels[session.severity] ?? 'Unrated'}
        </span>
        <span className="status-label">{statusLabels[session.status] ?? session.status}</span>
      </div>
    </Link>
  );
}

function EmptyState({ hasFilters }) {
  return (
    <div className="empty-state">
      <div className="empty-state-mark">/</div>
      <h2>{hasFilters ? 'No matching sessions' : 'Your journal starts here'}</h2>
      <p>
        {hasFilters
          ? 'Try changing your filters or search terms.'
          : 'Capture the first problem before the details disappear.'}
      </p>
      {!hasFilters && (
        <Link className="primary-button compact-button" to="/sessions/new">
          <Plus size={16} /> Create a session
        </Link>
      )}
    </div>
  );
}

function ErrorState({ message }) {
  return (
    <div className="empty-state error-state">
      <AlertCircle size={24} />
      <h2>Sessions could not load</h2>
      <p>{message}</p>
    </div>
  );
}

function formatDate(value) {
  if (!value) return 'No date';
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(
    new Date(value),
  );
}
