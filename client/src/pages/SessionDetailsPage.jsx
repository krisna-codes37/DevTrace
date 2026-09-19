import { ArrowLeft, CalendarDays, Pencil, Trash2 } from 'lucide-react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';

import { getApiErrorMessage } from '../api/client.js';
import HypothesisSection from '../components/HypothesisSection.jsx';
import Timeline from '../components/Timeline.jsx';
import { useDeleteSession, useSession } from '../hooks/useSessions.js';
import { useJourneyTimeline } from '../hooks/useJourneyTimeline.js';
import SessionSkeleton from '../components/SessionSkeleton.jsx';

const statusLabels = {
  OPEN: 'Open',
  IN_PROGRESS: 'In progress',
  SOLVED: 'Solved',
  ARCHIVED: 'Archived',
};
const severityLabels = { LOW: 'Low', MEDIUM: 'Medium', HIGH: 'High', CRITICAL: 'Critical' };

export default function SessionDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { data: session, isLoading, error } = useSession(id);
  const deleteMutation = useDeleteSession();
  const journey = useJourneyTimeline(session);

  if (isLoading)
    return (
      <section className="page-container">
        <SessionSkeleton rows={1} />
      </section>
    );
  if (error)
    return (
      <section className="page-container">
        <div className="empty-state error-state">
          <h2>Session could not load</h2>
          <p>{getApiErrorMessage(error)}</p>
          <Link className="quiet-link" to="/sessions">
            Back to sessions
          </Link>
        </div>
      </section>
    );

  async function handleDelete() {
    await deleteMutation.mutateAsync(id);
    navigate('/sessions', { replace: true, state: { message: 'Session deleted.' } });
  }

  return (
    <section className="page-container detail-page">
      {location.state?.message && <p className="success-message">{location.state.message}</p>}
      <Link
        className="back-link"
        to={{
          pathname: '/sessions',
          search: location.state?.returnSearch ? `?${location.state.returnSearch}` : '',
        }}
      >
        <ArrowLeft size={16} /> All sessions
      </Link>
      <div className="detail-heading">
        <div>
          <div className="detail-badges">
            <span className={`severity-badge severity-${session.severity?.toLowerCase()}`}>
              {severityLabels[session.severity] ?? 'Unrated'}
            </span>
            <span className="status-label">{statusLabels[session.status] ?? session.status}</span>
          </div>
          <h1 className="page-title">{session.title}</h1>
          <p className="detail-meta">
            <CalendarDays size={15} /> Updated {formatDate(session.updatedAt)}
            {session.technology && (
              <>
                {' '}
                <span>/</span> {session.technology}
              </>
            )}
          </p>
        </div>
        <div className="detail-actions">
          <Link className="secondary-button" to={`/sessions/${id}/edit`}>
            <Pencil size={16} /> Edit
          </Link>
          <button className="danger-button" type="button" onClick={() => setShowDeleteDialog(true)}>
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>
      <div className="detail-grid">
        <DetailBlock title="Description" value={session.description} />
        <DetailBlock className="code-block" title="Error message" value={session.errorMessage} />
        <div className="detail-facts">
          <Fact label="Project" value={session.projectName} />
          <Fact label="Environment" value={session.environment} />
          <div>
            <span className="detail-label">Tags</span>
            <div className="detail-tags">
              {session.tags?.length ? (
                session.tags.map((tag) => (
                  <span className="tag-chip" key={tag}>
                    {tag}
                  </span>
                ))
              ) : (
                <span className="muted-value">None</span>
              )}
            </div>
          </div>
        </div>
        <DetailBlock title="Root cause" value={session.rootCause} />
        <DetailBlock className="code-block" title="Solution" value={session.solution} />
        <DetailBlock title="Lesson learned" value={session.lessonLearned} />
      </div>
      <Timeline events={journey.events} isLoading={journey.isLoading} />
      <HypothesisSection sessionId={id} />
      {showDeleteDialog && (
        <div className="dialog-backdrop" role="presentation">
          <div
            className="confirm-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-title"
          >
            <p className="eyebrow">Permanent action</p>
            <h2 id="delete-title">Delete this session?</h2>
            <p>This debugging record and its context will be removed permanently.</p>
            <div className="dialog-actions">
              <button
                className="secondary-button"
                type="button"
                onClick={() => setShowDeleteDialog(false)}
              >
                Cancel
              </button>
              <button
                className="danger-button"
                type="button"
                disabled={deleteMutation.isPending}
                onClick={handleDelete}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete session'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function DetailBlock({ className = '', title, value }) {
  return (
    <section className={`detail-block ${className}`}>
      <h2>{title}</h2>
      <p>{value || <span className="muted-value">Not recorded yet.</span>}</p>
    </section>
  );
}

function Fact({ label, value }) {
  return (
    <div>
      <span className="detail-label">{label}</span>
      <span className="fact-value">{value || 'Not specified'}</span>
    </div>
  );
}

function formatDate(value) {
  return value
    ? new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(value))
    : 'Not dated';
}
