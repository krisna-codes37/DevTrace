import { Check, Pencil, Plus, RotateCcw, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { getApiErrorMessage } from '../api/client.js';
import ExperimentTimeline from './ExperimentTimeline.jsx';
import {
  useCreateHypothesis,
  useDeleteHypothesis,
  useHypotheses,
  useUpdateHypothesis,
} from '../hooks/useHypotheses.js';

const statuses = ['UNTESTED', 'TESTING', 'CONFIRMED', 'REJECTED', 'INCONCLUSIVE'];
const statusLabels = {
  UNTESTED: 'Untested',
  TESTING: 'Testing',
  CONFIRMED: 'Confirmed',
  REJECTED: 'Rejected',
  INCONCLUSIVE: 'Inconclusive',
};
const hypothesisSchema = z.object({
  description: z.string().trim().min(1, 'Describe the hypothesis').max(10000),
  reasoning: z.string().max(10000, 'Reasoning is too long'),
  confidence: z.coerce.number().min(0).max(100),
  status: z.enum(statuses),
});
const defaultValues = { description: '', reasoning: '', confidence: 50, status: 'UNTESTED' };

export default function HypothesisSection({ sessionId }) {
  const { data: hypotheses = [], isLoading, error } = useHypotheses(sessionId);
  const [editingHypothesis, setEditingHypothesis] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const createMutation = useCreateHypothesis();
  const updateMutation = useUpdateHypothesis();
  const deleteMutation = useDeleteHypothesis();

  async function handleSubmit(values) {
    try {
      if (editingHypothesis) {
        await updateMutation.mutateAsync({ id: editingHypothesis._id, sessionId, payload: values });
      } else {
        await createMutation.mutateAsync({ sessionId, payload: values });
      }
      setShowForm(false);
      setEditingHypothesis(null);
    } catch {
      // The mutation error is rendered below without creating an unhandled rejection.
    }
  }

  async function handleDelete(id) {
    if (window.confirm('Delete this hypothesis?')) {
      try {
        await deleteMutation.mutateAsync({ id, sessionId });
      } catch {
        // The mutation error is rendered below without creating an unhandled rejection.
      }
    }
  }

  const mutationError = createMutation.error || updateMutation.error || deleteMutation.error;
  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <section className="hypothesis-section">
      <div className="hypothesis-heading">
        <div>
          <p className="eyebrow">Reasoning log</p>
          <h2>
            Hypotheses <span>{hypotheses.length}</span>
          </h2>
          <p>Possible explanations to test against the evidence.</p>
        </div>
        <button
          className="secondary-button"
          type="button"
          onClick={() => {
            setEditingHypothesis(null);
            setShowForm(true);
          }}
        >
          <Plus size={16} aria-hidden="true" /> Add hypothesis
        </button>
      </div>
      {mutationError && (
        <p className="form-error form-error-summary">{getApiErrorMessage(mutationError)}</p>
      )}
      {showForm && (
        <HypothesisForm
          defaultValues={editingHypothesis ?? defaultValues}
          isSubmitting={isSaving}
          onCancel={() => setShowForm(false)}
          onSubmit={handleSubmit}
        />
      )}
      {isLoading ? (
        <HypothesisSkeleton />
      ) : error ? (
        <div className="hypothesis-empty error-state">
          <p>{getApiErrorMessage(error)}</p>
        </div>
      ) : hypotheses.length === 0 && !showForm ? (
        <div className="hypothesis-empty">
          <div className="hypothesis-empty-mark">?</div>
          <h3>No hypotheses yet</h3>
          <p>Capture a possible explanation before you start testing.</p>
          <button className="quiet-link-button" type="button" onClick={() => setShowForm(true)}>
            Add the first hypothesis <Plus size={15} />
          </button>
        </div>
      ) : (
        <div className="hypothesis-list">
          {hypotheses.map((hypothesis) => (
            <HypothesisCard
              key={hypothesis._id}
              hypothesis={hypothesis}
              onDelete={handleDelete}
              onEdit={(value) => {
                setEditingHypothesis(value);
                setShowForm(true);
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function HypothesisForm({ defaultValues: initialValues, isSubmitting, onCancel, onSubmit }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues,
    resolver: zodResolver(hypothesisSchema),
  });
  const confidence = watch('confidence');

  return (
    <form className="hypothesis-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="hypothesis-form-header">
        <h3>{initialValues._id ? 'Edit hypothesis' : 'New hypothesis'}</h3>
        <button className="plain-icon-button" type="button" onClick={onCancel} title="Close">
          <X size={17} aria-hidden="true" />
          <span className="sr-only">Close hypothesis form</span>
        </button>
      </div>
      <label className="form-field">
        <span className="field-label">Description</span>
        <textarea rows={3} {...register('description')} />
        {errors.description && <span className="form-error">{errors.description.message}</span>}
      </label>
      <label className="form-field">
        <span className="field-label">Reasoning</span>
        <textarea rows={3} {...register('reasoning')} />
        {errors.reasoning && <span className="form-error">{errors.reasoning.message}</span>}
      </label>
      <div className="hypothesis-form-controls">
        <label className="form-field">
          <span className="field-label">
            Confidence <strong>{confidence}%</strong>
          </span>
          <div className="confidence-input">
            <input type="range" min="0" max="100" {...register('confidence')} />
          </div>
          {errors.confidence && <span className="form-error">{errors.confidence.message}</span>}
        </label>
        <label className="form-field">
          <span className="field-label">Status</span>
          <select {...register('status')}>
            {statuses.map((status) => (
              <option value={status} key={status}>
                {statusLabels[status]}
              </option>
            ))}
          </select>
          {errors.status && <span className="form-error">{errors.status.message}</span>}
        </label>
      </div>
      <div className="hypothesis-form-actions">
        <button className="secondary-button" type="button" onClick={onCancel}>
          Cancel
        </button>
        <button className="primary-button compact-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save hypothesis'}
        </button>
      </div>
    </form>
  );
}

function HypothesisCard({ hypothesis, onDelete, onEdit }) {
  const confidence = Math.min(100, Math.max(0, Number(hypothesis.confidence ?? 0)));
  const statusIcon =
    hypothesis.status === 'CONFIRMED' ? (
      <Check size={14} />
    ) : hypothesis.status === 'REJECTED' ? (
      <X size={14} />
    ) : hypothesis.status === 'TESTING' ? (
      <RotateCcw size={14} />
    ) : null;

  return (
    <article className="hypothesis-card">
      <div className="hypothesis-card-top">
        <div className="hypothesis-status">
          <span className={`hypothesis-status-icon hypothesis-${hypothesis.status?.toLowerCase()}`}>
            {statusIcon}
          </span>
          <span>{statusLabels[hypothesis.status] ?? hypothesis.status}</span>
        </div>
        <div className="hypothesis-card-actions">
          <button
            className="plain-icon-button"
            type="button"
            onClick={() => onEdit(hypothesis)}
            title="Edit hypothesis"
          >
            <Pencil size={15} aria-hidden="true" />
            <span className="sr-only">Edit hypothesis</span>
          </button>
          <button
            className="plain-icon-button danger-icon"
            type="button"
            onClick={() => onDelete(hypothesis._id)}
            title="Delete hypothesis"
          >
            <Trash2 size={15} aria-hidden="true" />
            <span className="sr-only">Delete hypothesis</span>
          </button>
        </div>
      </div>
      <h3>{hypothesis.description}</h3>
      {hypothesis.reasoning && <p className="hypothesis-reasoning">{hypothesis.reasoning}</p>}
      <div className="confidence-row">
        <div className="confidence-label">
          <span>Confidence</span>
          <strong>{confidence}%</strong>
        </div>
        <div className="confidence-track">
          <span style={{ width: `${confidence}%` }} />
        </div>
      </div>
      <div className="hypothesis-card-footer">
        <span>Created {formatDate(hypothesis.createdAt)}</span>
      </div>
      <ExperimentTimeline hypothesisId={hypothesis._id} />
    </article>
  );
}

function HypothesisSkeleton() {
  return (
    <div className="hypothesis-skeleton-list" aria-busy="true" aria-label="Loading hypotheses">
      {[1, 2].map((item) => (
        <div className="hypothesis-skeleton" key={item}>
          <span />
          <span />
          <span />
        </div>
      ))}
    </div>
  );
}

function formatDate(value) {
  return value
    ? new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(value))
    : 'Not dated';
}
