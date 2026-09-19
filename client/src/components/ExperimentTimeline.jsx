import { Check, Pencil, Plus, Trash2, X } from 'lucide-react';
import { forwardRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { getApiErrorMessage } from '../api/client.js';
import {
  useCreateExperiment,
  useDeleteExperiment,
  useExperiments,
  useUpdateExperiment,
} from '../hooks/useExperiments.js';

const experimentSchema = z.object({
  testDescription: z.string().trim().min(1, 'Describe the test').max(10000),
  expectedResult: z.string().max(10000, 'Expected result is too long'),
  actualResult: z.string().max(10000, 'Actual result is too long'),
  evidence: z.string().max(10000, 'Evidence is too long'),
  conclusion: z.string().max(10000, 'Conclusion is too long'),
});

const emptyExperiment = {
  testDescription: '',
  expectedResult: '',
  actualResult: '',
  evidence: '',
  conclusion: '',
};

export default function ExperimentTimeline({ hypothesisId }) {
  const { data: experiments = [], isLoading, error } = useExperiments(hypothesisId);
  const [editingExperiment, setEditingExperiment] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const createMutation = useCreateExperiment();
  const updateMutation = useUpdateExperiment();
  const deleteMutation = useDeleteExperiment();

  async function handleSubmit(payload) {
    if (editingExperiment) {
      await updateMutation.mutateAsync({ id: editingExperiment._id, payload });
    } else {
      await createMutation.mutateAsync({ hypothesisId, payload });
    }
    setShowForm(false);
    setEditingExperiment(null);
  }

  async function handleDelete(id) {
    if (window.confirm('Delete this experiment?')) {
      await deleteMutation.mutateAsync({ id, hypothesisId });
    }
  }

  const mutationError = createMutation.error || updateMutation.error || deleteMutation.error;
  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="experiment-section">
      <div className="experiment-section-heading">
        <span className="experiment-section-title">Experiments</span>
        <button
          className="quiet-link-button"
          type="button"
          onClick={() => {
            setEditingExperiment(null);
            setShowForm(true);
          }}
        >
          <Plus size={14} aria-hidden="true" /> Add experiment
        </button>
      </div>
      {mutationError && <p className="form-error">{getApiErrorMessage(mutationError)}</p>}
      {showForm && (
        <ExperimentForm
          defaultValues={editingExperiment ?? emptyExperiment}
          isSubmitting={isSaving}
          onCancel={() => setShowForm(false)}
          onSubmit={handleSubmit}
        />
      )}
      {isLoading ? (
        <ExperimentSkeleton />
      ) : error ? (
        <p className="form-error">{getApiErrorMessage(error)}</p>
      ) : experiments.length === 0 && !showForm ? (
        <p className="experiment-empty">No experiments recorded yet.</p>
      ) : (
        <div className="experiment-timeline">
          {experiments.map((experiment) => (
            <ExperimentItem
              key={experiment._id}
              experiment={experiment}
              onDelete={handleDelete}
              onEdit={(value) => {
                setEditingExperiment(value);
                setShowForm(true);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ExperimentForm({ defaultValues, isSubmitting, onCancel, onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues, resolver: zodResolver(experimentSchema) });

  return (
    <form className="experiment-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="experiment-form-header">
        <strong>{defaultValues._id ? 'Edit experiment' : 'New experiment'}</strong>
        <button className="plain-icon-button" type="button" onClick={onCancel} title="Close">
          <X size={15} />
          <span className="sr-only">Close experiment form</span>
        </button>
      </div>
      <ExperimentField
        label="Test description"
        error={errors.testDescription?.message}
        {...register('testDescription')}
      />
      <ExperimentField
        label="Expected result"
        error={errors.expectedResult?.message}
        {...register('expectedResult')}
      />
      <ExperimentField
        label="Actual result"
        error={errors.actualResult?.message}
        {...register('actualResult')}
      />
      <ExperimentField
        label="Evidence"
        error={errors.evidence?.message}
        {...register('evidence')}
      />
      <ExperimentField
        label="Conclusion"
        error={errors.conclusion?.message}
        {...register('conclusion')}
      />
      <div className="experiment-form-actions">
        <button className="secondary-button" type="button" onClick={onCancel}>
          Cancel
        </button>
        <button className="primary-button compact-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save experiment'}
        </button>
      </div>
    </form>
  );
}

const ExperimentField = forwardRef(function ExperimentField({ error, label, ...props }, ref) {
  return (
    <label className="form-field">
      <span className="field-label">{label}</span>
      <textarea ref={ref} rows={2} {...props} />
      {error && <span className="form-error">{error}</span>}
    </label>
  );
});

function ExperimentItem({ experiment, onDelete, onEdit }) {
  return (
    <article className="experiment-item">
      <span className="experiment-node" aria-hidden="true" />
      <div className="experiment-item-content">
        <div className="experiment-item-heading">
          <span>{formatDate(experiment.createdAt)}</span>
          <div>
            <button
              className="plain-icon-button"
              type="button"
              onClick={() => onEdit(experiment)}
              title="Edit experiment"
            >
              <Pencil size={14} />
              <span className="sr-only">Edit experiment</span>
            </button>
            <button
              className="plain-icon-button danger-icon"
              type="button"
              onClick={() => onDelete(experiment._id)}
              title="Delete experiment"
            >
              <Trash2 size={14} />
              <span className="sr-only">Delete experiment</span>
            </button>
          </div>
        </div>
        <h4>{experiment.testDescription}</h4>
        <div className="experiment-observations">
          <Observation
            icon={<Check size={13} />}
            label="Expected"
            value={experiment.expectedResult}
          />
          <Observation icon={<X size={13} />} label="Actual" value={experiment.actualResult} />
          <Observation icon={<span>↗</span>} label="Evidence" value={experiment.evidence} />
          <Observation
            icon={<Check size={13} />}
            label="Conclusion"
            value={experiment.conclusion}
          />
        </div>
      </div>
    </article>
  );
}

function Observation({ icon, label, value }) {
  return (
    <div className="experiment-observation">
      <span className="observation-icon">{icon}</span>
      <div>
        <span className="observation-label">{label}</span>
        <p>{value || 'Not recorded.'}</p>
      </div>
    </div>
  );
}
function ExperimentSkeleton() {
  return (
    <div className="experiment-skeleton" aria-busy="true">
      <span />
      <span />
      <span />
    </div>
  );
}
function formatDate(value) {
  return value
    ? new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(
        new Date(value),
      )
    : 'Not dated';
}
