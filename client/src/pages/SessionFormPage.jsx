import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { getApiErrorMessage } from '../api/client.js';
import SessionForm from '../components/SessionForm.jsx';
import { useCreateSession, useSession, useUpdateSession } from '../hooks/useSessions.js';
import SessionSkeleton from '../components/SessionSkeleton.jsx';

export default function SessionFormPage({ mode }) {
  const isEdit = mode === 'edit';
  const { id } = useParams();
  const navigate = useNavigate();
  const detailQuery = useSession(id);
  const createMutation = useCreateSession();
  const updateMutation = useUpdateSession();
  const mutation = isEdit ? updateMutation : createMutation;

  if (isEdit && detailQuery.isLoading) {
    return (
      <section className="page-container">
        <SessionSkeleton rows={1} />
      </section>
    );
  }

  if (isEdit && detailQuery.error) {
    return (
      <section className="page-container">
        <div className="empty-state error-state">
          <h2>Session could not load</h2>
          <p>{getApiErrorMessage(detailQuery.error)}</p>
          <Link className="quiet-link" to="/sessions">
            Back to sessions
          </Link>
        </div>
      </section>
    );
  }

  async function handleSubmit(values) {
    const session = isEdit
      ? await updateMutation.mutateAsync({ id, payload: values })
      : await createMutation.mutateAsync(values);
    navigate(`/sessions/${session._id}`, {
      replace: true,
      state: { message: isEdit ? 'Session updated.' : 'Session created.' },
    });
  }

  return (
    <section className="page-container form-page">
      <Link className="back-link" to={isEdit ? `/sessions/${id}` : '/sessions'}>
        <ArrowLeft size={16} /> Back to sessions
      </Link>
      <div className="page-heading-row form-page-heading">
        <div>
          <p className="eyebrow">{isEdit ? 'Refine the record' : 'New debug trail'}</p>
          <h1 className="page-title">{isEdit ? 'Edit session' : 'Create a session'}</h1>
          <p className="page-subtitle">
            Write down what you know now. You can sharpen it as the evidence changes.
          </p>
        </div>
      </div>
      <SessionForm
        defaultValues={isEdit ? detailQuery.data : undefined}
        onSubmit={handleSubmit}
        isSubmitting={mutation.isPending}
        apiError={mutation.error ? getApiErrorMessage(mutation.error) : null}
      />
    </section>
  );
}
