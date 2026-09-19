import { Plus, X } from 'lucide-react';
import { forwardRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { emptySession, sessionSchema } from './session-schema.js';

export default function SessionForm({
  defaultValues = emptySession,
  onSubmit,
  isSubmitting,
  apiError,
}) {
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { ...emptySession, ...defaultValues },
    resolver: zodResolver(sessionSchema),
  });
  const tags = watch('tags');
  const [tagInput, setTagInput] = useState('');

  function addTags(value) {
    const nextTags = value
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
    const uniqueTags = [...new Set([...tags, ...nextTags])].slice(0, 50);

    setValue('tags', uniqueTags, { shouldDirty: true, shouldValidate: true });
    setTagInput('');
  }

  function removeTag(tagToRemove) {
    setValue(
      'tags',
      tags.filter((tag) => tag !== tagToRemove),
      { shouldDirty: true },
    );
  }

  async function submit(values) {
    try {
      await onSubmit(values);
    } catch (error) {
      setError('root', { message: error.message });
    }
  }

  return (
    <form className="session-form" onSubmit={handleSubmit(submit)} noValidate>
      <div className="session-form-grid">
        <div className="session-form-main">
          <TextField error={errors.title?.message} label="Title" required {...register('title')} />
          <TextAreaField
            error={errors.description?.message}
            label="Description"
            rows={5}
            {...register('description')}
          />
          <TextAreaField
            className="code-textarea"
            error={errors.errorMessage?.message}
            label="Error message"
            rows={7}
            {...register('errorMessage')}
          />
          <div className="form-field-row">
            <TextField
              error={errors.technology?.message}
              label="Technology"
              {...register('technology')}
            />
            <TextField
              error={errors.projectName?.message}
              label="Project name"
              {...register('projectName')}
            />
          </div>
          <TextField
            error={errors.environment?.message}
            label="Environment"
            {...register('environment')}
          />
        </div>
        <aside className="session-form-side">
          <SelectField error={errors.severity?.message} label="Severity" {...register('severity')}>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </SelectField>
          <SelectField error={errors.status?.message} label="Status" {...register('status')}>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In progress</option>
            <option value="SOLVED">Solved</option>
            <option value="ARCHIVED">Archived</option>
          </SelectField>
          <div className="form-field">
            <span className="field-label">Tags</span>
            <input type="hidden" {...register('tags')} />
            <div className="tag-editor">
              <div className="tag-list">
                {tags.map((tag) => (
                  <span className="tag-chip" key={tag}>
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      aria-label={`Remove ${tag}`}
                    >
                      <X size={13} aria-hidden="true" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="tag-input-row">
                <input
                  value={tagInput}
                  onChange={(event) => setTagInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ',') {
                      event.preventDefault();
                      addTags(tagInput);
                    }
                  }}
                  placeholder="Add a tag"
                />
                <button
                  type="button"
                  className="small-icon-button"
                  onClick={() => addTags(tagInput)}
                >
                  <Plus size={15} aria-hidden="true" />
                  <span className="sr-only">Add tag</span>
                </button>
              </div>
            </div>
            {errors.tags && <span className="form-error">{errors.tags.message}</span>}
          </div>
        </aside>
      </div>
      <div className="session-form-lower">
        <TextAreaField
          error={errors.rootCause?.message}
          label="Root cause"
          rows={5}
          {...register('rootCause')}
        />
        <TextAreaField
          className="code-textarea"
          error={errors.solution?.message}
          label="Solution"
          rows={7}
          {...register('solution')}
        />
        <TextAreaField
          error={errors.lessonLearned?.message}
          label="Lesson learned"
          rows={5}
          {...register('lessonLearned')}
        />
      </div>
      {apiError && <p className="form-error form-error-summary">{apiError}</p>}
      {errors.root && <p className="form-error form-error-summary">{errors.root.message}</p>}
      <div className="session-form-actions">
        <button className="primary-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save session'}
        </button>
      </div>
    </form>
  );
}

const TextField = forwardRef(function TextField({ error, label, required, ...inputProps }, ref) {
  return (
    <label className="form-field">
      <span className="field-label">
        {label} {required && <span className="required-mark">*</span>}
      </span>
      <input ref={ref} className={error ? 'has-error' : ''} {...inputProps} />
      {error && <span className="form-error">{error}</span>}
    </label>
  );
});

const TextAreaField = forwardRef(function TextAreaField(
  { className = '', error, label, ...inputProps },
  ref,
) {
  return (
    <label className="form-field">
      <span className="field-label">{label}</span>
      <textarea ref={ref} className={`${className}${error ? ' has-error' : ''}`} {...inputProps} />
      {error && <span className="form-error">{error}</span>}
    </label>
  );
});

const SelectField = forwardRef(function SelectField(
  { children, error, label, ...inputProps },
  ref,
) {
  return (
    <label className="form-field">
      <span className="field-label">{label}</span>
      <select ref={ref} className={error ? 'has-error' : ''} {...inputProps}>
        {children}
      </select>
      {error && <span className="form-error">{error}</span>}
    </label>
  );
});
